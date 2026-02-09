/**
 * API para revisión HSEQ de inspecciones preoperacionales
 * PATCH - Aprobar o rechazar una inspección con firma digital
 * 
 * ESTRATEGIA: En lugar de regenerar el PDF completo (lo que perdería la firma
 * del conductor que no se almacena en la BD), descargamos el PDF existente
 * y le agregamos una nueva página con la revisión HSEQ y la firma del HS.
 */

import { NextRequest, NextResponse } from 'next/server';
import { TABLES, INSPECCION_PREOP_FIELDS, getInspeccionesConfig } from '@/lib/airtable-config';
import { verifyToken } from '@/lib/jwt';
import { applyRateLimit } from '@/lib/rate-limit';
import { uploadPDFToCloudinary } from '@/lib/cloudinary';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import cookie from 'cookie';

// Colores consistentes con el PDF original
const C = {
  primary: rgb(0.1, 0.1, 0.18),
  accent: rgb(0.96, 0.62, 0.04),
  green: rgb(0.13, 0.77, 0.37),
  red: rgb(0.94, 0.27, 0.27),
  gray: rgb(0.42, 0.45, 0.5),
  white: rgb(1, 1, 1),
  darkText: rgb(0.07, 0.09, 0.15),
  headerBg: rgb(0.16, 0.16, 0.31),
  greenBg: rgb(0.86, 0.99, 0.91),
  redBg: rgb(1, 0.95, 0.95),
  warmBg: rgb(1, 0.98, 0.92),
};

async function getAirtableRecord(recordId: string) {
  const config = getInspeccionesConfig();
  const url = `${config.BASE_URL}/${config.BASE_ID}/${encodeURIComponent(TABLES.INSPECCIONES_PREOPERACIONALES.NAME)}/${recordId}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${config.API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Airtable error: ${response.status} - ${errorData?.error?.message || 'Unknown'}`);
  }

  return response.json();
}

async function updateAirtableRecord(recordId: string, fields: Record<string, any>) {
  const config = getInspeccionesConfig();
  const url = `${config.BASE_URL}/${config.BASE_ID}/${encodeURIComponent(TABLES.INSPECCIONES_PREOPERACIONALES.NAME)}/${recordId}`;
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${config.API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields, typecast: true }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Airtable update error: ${response.status} - ${errorData?.error?.message || 'Unknown'}`);
  }

  return response.json();
}

/**
 * Descarga el PDF existente de la URL del attachment de Airtable
 */
async function downloadExistingPDF(docField: any): Promise<Uint8Array | null> {
  try {
    if (!docField || !Array.isArray(docField) || docField.length === 0) return null;
    
    const pdfUrl = docField[0].url;
    if (!pdfUrl) return null;

    console.log(`📥 Descargando PDF existente: ${pdfUrl}`);
    const response = await fetch(pdfUrl);
    
    if (!response.ok) {
      console.warn(`⚠️ No se pudo descargar el PDF: ${response.status}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (error) {
    console.warn('⚠️ Error descargando PDF existente:', error);
    return null;
  }
}

function formatDateStr(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Modifica el PDF existente:
 * 1. Dibuja la firma HSEQ en la misma página donde está la firma del conductor
 * 2. Agrega una página de revisión con el resultado (sin duplicar firmas)
 * 
 * Las coordenadas de la firma se leen del metadata del PDF (Keywords) que
 * el generador original guarda como: SIG_PAGE:X, SIG_TOP_Y:Y, SIG_UNDER_Y:Z
 */
async function addHSEQReviewToPDF(
  existingPdfBytes: Uint8Array,
  reviewData: {
    accion: string;
    firmaHSEQ: string;
    nombreHSEQ: string;
    fechaRevision: string;
    observaciones: string;
    codigoInspeccion: string;
    conductorNombre: string;
    conductorCedula: string;
  }
): Promise<Buffer> {
  const doc = await PDFDocument.load(existingPdfBytes);
  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;
  const titleW = pageWidth - margin * 2;

  // ==========================================
  // PASO 1: Dibujar firma HSEQ en la página original de firmas
  // ==========================================
  const sigWidth = 240;
  const sigHeight = 60;
  const rightX = pageWidth / 2 + 15;

  // Leer coordenadas del metadata del PDF
  const keywords = doc.getKeywords();
  let sigPageIndex = -1;
  let sigTopY = -1;
  let sigUnderY = -1;

  if (keywords) {
    const pageMatch = keywords.match(/SIG_PAGE:(\d+)/);
    const topMatch = keywords.match(/SIG_TOP_Y:(\d+)/);
    const underMatch = keywords.match(/SIG_UNDER_Y:(\d+)/);
    if (pageMatch) sigPageIndex = parseInt(pageMatch[1]);
    if (topMatch) sigTopY = parseInt(topMatch[1]);
    if (underMatch) sigUnderY = parseInt(underMatch[1]);
  }

  console.log(`📋 Metadata firma: page=${sigPageIndex}, topY=${sigTopY}, underY=${sigUnderY}`);

  const pages = doc.getPages();
  // Si no hay metadata, usar la última página como fallback
  const sigPage = sigPageIndex >= 0 && sigPageIndex < pages.length 
    ? pages[sigPageIndex] 
    : pages[pages.length - 1];

  // Embeber imagen de firma HSEQ
  let hseqImage: any = null;
  if (reviewData.firmaHSEQ) {
    try {
      const isDataUrl = reviewData.firmaHSEQ.startsWith('data:image/');
      const isPng = !isDataUrl || reviewData.firmaHSEQ.includes('image/png');
      const base64Data = reviewData.firmaHSEQ.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBytes = Buffer.from(base64Data, 'base64');
      
      console.log(`📝 Firma HSEQ: ${imageBytes.length} bytes, isPng=${isPng}`);
      
      hseqImage = isPng 
        ? await doc.embedPng(imageBytes) 
        : await doc.embedJpg(imageBytes);
        
      console.log('✅ Firma HSEQ embebida correctamente');
    } catch (e) {
      console.error('❌ Error embebiendo firma HSEQ:', e);
    }
  }

  // Dibujar firma HSEQ en la página original de firmas
  if (sigTopY > 0) {
    const hseqSigY = sigTopY - 14;

    // Cubrir el placeholder "________________________" con un rectángulo blanco
    sigPage.drawRectangle({
      x: rightX - 2,
      y: sigUnderY > 0 ? sigUnderY - 1 : hseqSigY - sigHeight - 6,
      width: sigWidth + 4,
      height: sigHeight + 20,
      color: C.white,
    });

    // Re-dibujar label "HSEQ / SST"
    sigPage.drawText('HSEQ / SST', { x: rightX, y: sigTopY, size: 7, font: fontBold, color: C.gray });

    // Dibujar la firma digital del HSEQ
    if (hseqImage) {
      const scaledH = hseqImage.scaleToFit(sigWidth - 10, sigHeight - 5);
      sigPage.drawImage(hseqImage, {
        x: rightX + (sigWidth - scaledH.width) / 2,
        y: hseqSigY - sigHeight + 3,
        width: scaledH.width,
        height: scaledH.height,
      });
    } else {
      sigPage.drawText('[Firma digital registrada]', {
        x: rightX + 10, y: hseqSigY - 30, size: 8, font: fontRegular, color: C.darkText,
      });
    }

    // Re-dibujar línea y datos del HSEQ
    const underY = sigUnderY > 0 ? sigUnderY : hseqSigY - sigHeight - 5;
    sigPage.drawLine({ start: { x: rightX, y: underY }, end: { x: rightX + sigWidth, y: underY }, thickness: 1, color: C.darkText });
    sigPage.drawText(reviewData.nombreHSEQ, { x: rightX + 5, y: underY - 12, size: 8, font: fontBold, color: C.darkText });
    sigPage.drawText('Responsable HSEQ / SST', { x: rightX + 5, y: underY - 22, size: 7, font: fontRegular, color: C.gray });
    sigPage.drawText('Firma HSEQ', { x: rightX + 5, y: underY - 32, size: 6, font: fontRegular, color: C.gray });

    console.log('✅ Firma HSEQ dibujada en página original de firmas');
  } else {
    console.warn('⚠️ No se encontraron coordenadas de firma en metadata del PDF');
  }

  // ==========================================
  // PASO 2: Agregar página de revisión HSEQ (solo estado y datos, sin firmas)
  // ==========================================
  const page = doc.addPage([pageWidth, pageHeight]);

  // Top accent bar
  page.drawRectangle({ x: 0, y: pageHeight - 4, width: pageWidth, height: 4, color: C.accent });

  // Header
  const headerH = 60;
  let y = pageHeight - 10 - headerH;
  page.drawRectangle({ x: margin, y, width: titleW, height: headerH, color: C.primary });

  page.drawText('TRANSPORTE Y LOGISTICA EQUINOX S.A.S.', {
    x: margin + 12, y: y + headerH - 18, size: 11, font: fontBold, color: C.accent,
  });
  page.drawText('NIT: 901.870.510-5', {
    x: margin + 12, y: y + headerH - 30, size: 7, font: fontRegular, color: C.white,
  });
  page.drawText('REVISION HSEQ - INSPECCION PREOPERACIONAL', {
    x: margin + 12, y: y + headerH - 43, size: 8, font: fontBold, color: C.white,
  });

  // Code box
  const boxW = 130;
  const boxX = pageWidth - margin - boxW - 5;
  page.drawRectangle({ x: boxX, y: y + 5, width: boxW, height: headerH - 10, color: C.headerBg });
  page.drawText('INSPECCION', { x: boxX + 8, y: y + headerH - 18, size: 6, font: fontBold, color: C.accent });
  page.drawText(reviewData.codigoInspeccion, { x: boxX + 8, y: y + headerH - 28, size: 7, font: fontRegular, color: C.white });
  page.drawText('FECHA REVISION', { x: boxX + 8, y: y + headerH - 40, size: 6, font: fontBold, color: C.accent });
  page.drawText(formatDateStr(reviewData.fechaRevision), { x: boxX + 8, y: y + headerH - 50, size: 7, font: fontRegular, color: C.white });

  y -= 20;

  // ==========================================
  // ESTADO DE LA REVISION
  // ==========================================
  const isAprobado = reviewData.accion === 'Aprobado';
  const statusBg = isAprobado ? C.greenBg : C.redBg;
  const statusColor = isAprobado ? C.green : C.red;

  page.drawRectangle({ x: margin, y: y - 16, width: titleW, height: 18, color: C.primary });
  page.drawText('RESULTADO DE LA REVISION HSEQ', {
    x: margin + 10, y: y - 12, size: 8, font: fontBold, color: C.accent,
  });
  y -= 32;

  page.drawRectangle({ x: margin, y: y - 40, width: titleW, height: 42, color: statusBg });
  page.drawText('ESTADO:', {
    x: margin + 15, y: y - 18, size: 10, font: fontBold, color: C.darkText,
  });
  page.drawText(reviewData.accion.toUpperCase(), {
    x: margin + 80, y: y - 18, size: 14, font: fontBold, color: statusColor,
  });
  page.drawText('Revisado el ' + formatDateStr(reviewData.fechaRevision) + ' por ' + reviewData.nombreHSEQ, {
    x: margin + 15, y: y - 33, size: 7, font: fontRegular, color: C.gray,
  });
  y -= 55;

  // ==========================================
  // DATOS DE LA REVISION
  // ==========================================
  page.drawRectangle({ x: margin, y: y - 16, width: titleW, height: 18, color: C.primary });
  page.drawText('DATOS DE LA REVISION', {
    x: margin + 10, y: y - 12, size: 8, font: fontBold, color: C.accent,
  });
  y -= 30;

  const infoItems = [
    { label: 'Revisado por', value: reviewData.nombreHSEQ },
    { label: 'Fecha de Revision', value: formatDateStr(reviewData.fechaRevision) },
    { label: 'Inspeccion', value: reviewData.codigoInspeccion },
  ];

  const colW = (titleW - 10) / 3;
  for (let i = 0; i < infoItems.length; i++) {
    const x = margin + 5 + i * colW;
    page.drawText(infoItems[i].label, { x, y, size: 6, font: fontBold, color: C.gray });
    page.drawText(infoItems[i].value || 'N/A', { x, y: y - 10, size: 8, font: fontRegular, color: C.darkText });
  }
  y -= 30;

  // Conductor info
  const infoItems2 = [
    { label: 'Conductor', value: reviewData.conductorNombre },
    { label: 'Cedula', value: reviewData.conductorCedula },
  ];
  for (let i = 0; i < infoItems2.length; i++) {
    const x = margin + 5 + i * colW;
    page.drawText(infoItems2[i].label, { x, y, size: 6, font: fontBold, color: C.gray });
    page.drawText(infoItems2[i].value || 'N/A', { x, y: y - 10, size: 8, font: fontRegular, color: C.darkText });
  }
  y -= 30;

  // Observaciones
  if (reviewData.observaciones) {
    page.drawText('Observaciones:', { x: margin + 5, y, size: 7, font: fontBold, color: C.gray });
    y -= 14;
    
    const maxChars = 90;
    const obsLines: string[] = [];
    let remaining = reviewData.observaciones;
    while (remaining.length > 0) {
      if (remaining.length <= maxChars) {
        obsLines.push(remaining);
        break;
      }
      let breakAt = remaining.lastIndexOf(' ', maxChars);
      if (breakAt === -1) breakAt = maxChars;
      obsLines.push(remaining.substring(0, breakAt));
      remaining = remaining.substring(breakAt).trim();
    }
    
    for (const line of obsLines) {
      page.drawText(line, { x: margin + 5, y, size: 8, font: fontRegular, color: C.darkText });
      y -= 12;
    }
    y -= 8;
  }

  // ==========================================
  // NOTA: Las firmas están en la página anterior
  // ==========================================
  y -= 10;
  page.drawRectangle({ x: margin, y: y - 28, width: titleW, height: 30, color: rgb(0.93, 0.95, 1) });
  page.drawText('FIRMAS DIGITALES', {
    x: margin + 10, y: y - 10, size: 7, font: fontBold, color: C.primary,
  });
  page.drawText('La firma del conductor y la firma del responsable HSEQ se encuentran en la pagina de firmas del documento.', {
    x: margin + 10, y: y - 22, size: 6, font: fontRegular, color: C.gray,
  });
  y -= 45;

  // ==========================================
  // CERTIFICACION
  // ==========================================
  page.drawRectangle({ x: margin, y: y - 30, width: titleW, height: 32, color: C.warmBg });
  page.drawText(
    'Esta revision fue realizada electronicamente a traves del sistema Equinox Enterprise.',
    { x: margin + 10, y: y - 10, size: 6, font: fontRegular, color: rgb(0.57, 0.25, 0.05) }
  );
  page.drawText(
    'El responsable HSEQ certifica haber revisado la inspeccion preoperacional y emitido su concepto.',
    { x: margin + 10, y: y - 22, size: 6, font: fontRegular, color: rgb(0.57, 0.25, 0.05) }
  );

  // Metadata
  const now = new Date().toLocaleString('es-CO');
  page.drawText(
    'Generado: ' + now + ' | Sistema Equinox Enterprise v1.0',
    { x: margin + 10, y: y - 45, size: 5, font: fontRegular, color: C.gray }
  );

  // Bottom accent bar on new page
  page.drawRectangle({ x: 0, y: 0, width: pageWidth, height: 4, color: C.accent });

  // Update page numbers on ALL pages
  const allPages = doc.getPages();
  const totalPages = allPages.length;
  for (let i = 0; i < totalPages; i++) {
    const p = allPages[i];
    // Clear old page number with white rect
    p.drawRectangle({ x: pageWidth / 2 - 40, y: 5, width: 80, height: 14, color: C.white });
    p.drawText('Pagina ' + (i + 1) + ' de ' + totalPages, {
      x: pageWidth / 2 - 30, y: 10, size: 6, font: fontRegular, color: C.gray,
    });
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

export async function PATCH(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = applyRateLimit(request, {
      maxRequests: 10,
      windowMs: 60 * 1000,
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: rateLimitResult.status, headers: { 'Retry-After': String(rateLimitResult.retryAfter) } }
      );
    }

    // Verificar autenticación
    const headerCookie = request.headers.get('cookie') || '';
    const parsed = cookie.parse(headerCookie || '');
    const token = parsed.token;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { recordId, accion, firmaHSEQ, observaciones } = body;

    if (!recordId || !accion) {
      return NextResponse.json({ error: 'recordId y accion son requeridos' }, { status: 400 });
    }

    if (!['Aprobado', 'Rechazado'].includes(accion)) {
      return NextResponse.json({ error: 'accion debe ser Aprobado o Rechazado' }, { status: 400 });
    }

    if (!firmaHSEQ) {
      return NextResponse.json({ error: 'La firma HSEQ es requerida' }, { status: 400 });
    }

    // 1. Obtener el registro actual de Airtable
    const record = await getAirtableRecord(recordId);
    const fields = record.fields;

    // 2. Campos críticos
    const coreFields: Record<string, any> = {
      [INSPECCION_PREOP_FIELDS.ESTADO_PREOPERACIONAL]: accion,
    };

    // 3. Descargar PDF existente y AGREGAR página de revisión (no regenerar)
    //    Esto preserva la firma del conductor que está en las páginas originales
    try {
      const existingPdfBytes = await downloadExistingPDF(fields['Doc Preoperacional']);
      
      if (existingPdfBytes) {
        console.log(`📥 PDF existente descargado: ${existingPdfBytes.length} bytes`);
        const codigoInspeccion = fields['Codigo Inspeccion'] || 'INSPEC-0000';
        
        const modifiedPdf = await addHSEQReviewToPDF(existingPdfBytes, {
          accion,
          firmaHSEQ,
          nombreHSEQ: user.nombre || 'HSEQ',
          fechaRevision: new Date().toISOString().split('T')[0],
          observaciones: observaciones || '',
          codigoInspeccion,
          conductorNombre: fields['Conductor Nombre'] || '',
          conductorCedula: fields['Conductor Cedula'] || '',
        });

        console.log(`📄 PDF modificado: ${modifiedPdf.length} bytes`);

        // Usar timestamp para evitar cache de Cloudinary CDN
        const timestamp = Date.now();
        const fileName = `${codigoInspeccion}_${fields['Conductor Cedula'] || 'NA'}_HSEQ_${timestamp}`;
        const cloudinaryResult = await uploadPDFToCloudinary(modifiedPdf, fileName);
        const pdfUrl = cloudinaryResult.secure_url;

        coreFields[INSPECCION_PREOP_FIELDS.DOC_PREOPERACIONAL] = [{ url: pdfUrl, filename: `${fileName}.pdf` }];
        
        console.log(`✅ PDF actualizado con página de revisión HSEQ: ${pdfUrl}`);
      } else {
        console.warn('⚠️ No se encontró PDF existente para modificar');
      }
    } catch (pdfError) {
      console.error('⚠️ Error modificando PDF:', pdfError);
    }

    // 4. Actualizar Airtable - campos críticos
    await updateAirtableRecord(recordId, coreFields);
    console.log('✅ Estado y Doc actualizados en Airtable');

    // 5. Intentar actualizar campos HSEQ opcionales (sin firma base64)
    try {
      await updateAirtableRecord(recordId, {
        [INSPECCION_PREOP_FIELDS.NOMBRE_HSEQ]: user.nombre || 'HSEQ',
        [INSPECCION_PREOP_FIELDS.FECHA_REVISION]: new Date().toISOString().split('T')[0],
        [INSPECCION_PREOP_FIELDS.OBSERVACIONES_REVISION]: observaciones || '',
      });
      console.log('✅ Campos HSEQ actualizados en Airtable');
    } catch {
      console.warn('⚠️ Campos HSEQ opcionales no existen en la base (no crítico)');
    }

    return NextResponse.json({
      success: true,
      message: `Inspección ${accion.toLowerCase()} correctamente`,
      data: {
        recordId,
        estado: accion,
        revisadoPor: user.nombre,
        pdfUrl: coreFields[INSPECCION_PREOP_FIELDS.DOC_PREOPERACIONAL]?.[0]?.url || null,
      }
    });

  } catch (error) {
    console.error('Error en revisión HSEQ:', error);
    return NextResponse.json(
      { error: 'Error al procesar la revisión' },
      { status: 500 }
    );
  }
}
