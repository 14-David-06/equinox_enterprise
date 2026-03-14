/**
 * Generador de PDF para Inspecciones Preoperacionales
 * Usa pdf-lib (100% JS puro, compatible con Vercel serverless)
 * Formato: HSEQ-FOR-065 - TRANSPORTE Y LOGISTICA EQUINOX S.A.S.
 */

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';

// ==========================================
// ITEMS DE INSPECCION
// ==========================================

const ITEMS_SEGURIDAD = [
  { id: 1, nombre: 'Extintor de incendios (20 libras 2 unidades)' },
  { id: 2, nombre: 'Equipo de Carretera (Triangulos, Conos, Chaleco, Linterna, Manila, Gato, Cruceta)' },
  { id: 3, nombre: 'Botiquin de primeros auxilios' },
  { id: 4, nombre: 'Cinturones de seguridad operativos' },
  { id: 5, nombre: 'Bocina (claxon) funcionando correctamente' },
  { id: 6, nombre: 'Luces (altas, bajas, direccionales)' },
  { id: 7, nombre: 'Espejos (laterales) y lente angular en buen estado' },
  { id: 8, nombre: 'Kit de derrames' },
];

const ITEMS_GENERALES = [
  { id: 9, nombre: 'Papeles retrovisores ajustados y bien orientados' },
  { id: 10, nombre: 'Senalizacion adecuada en el tractocamion' },
  { id: 11, nombre: 'Estado general del Tanque (Sin fugas)' },
  { id: 12, nombre: 'Tanque con tapa en buen estado' },
  { id: 13, nombre: 'Estado y limpieza de la cabina' },
  { id: 14, nombre: 'Silla del conductor en buen estado' },
  { id: 15, nombre: 'Estado general de las llantas' },
  { id: 16, nombre: 'Llanta de repuesto' },
  { id: 17, nombre: 'Estado de los rines y contrapesos' },
  { id: 18, nombre: 'Sistema de frenos' },
  { id: 19, nombre: 'Freno de estacionamiento (de mano)' },
  { id: 20, nombre: 'Sistema de direccion' },
  { id: 21, nombre: 'Estado y funcionamiento del motor' },
  { id: 22, nombre: 'Nivel de fluidos' },
  { id: 23, nombre: 'Medicion de suspension y amortiguadores' },
  { id: 24, nombre: 'Estado y funcionamiento de luces' },
  { id: 25, nombre: 'Ausencia de fugas de fluidos en general' },
  { id: 26, nombre: 'Herramientas basicas y gato hidraulico' },
  { id: 27, nombre: 'Punto de anclaje fijo' },
  { id: 28, nombre: 'Cable de acero' },
  { id: 29, nombre: 'Estado de los espejos' },
  { id: 30, nombre: 'Listado del torque' },
];

const ITEMS_MECANICOS = [
  { id: 31, nombre: 'Caja de cambios' },
  { id: 32, nombre: 'Estado de amortiguadores y resortes' },
  { id: 33, nombre: 'Revision de componentes de suspension' },
  { id: 34, nombre: 'Nivel y estado del refrigerante' },
  { id: 35, nombre: 'Revision de fugas en mangueras y sellantes' },
  { id: 36, nombre: 'Funcionamiento de frenos de emergencia y de servicio' },
  { id: 37, nombre: 'Estado de la bateria' },
  { id: 38, nombre: 'Lubricacion y engrase general' },
  { id: 39, nombre: 'Fugas en el sistema de escape' },
];

const ITEMS_CORREAS = [
  { id: 40, nombre: 'Correas (ventilador, alternador, compresor) sin grietas' },
];

const ITEMS_HIGIENE = [
  { id: 41, nombre: 'Desinfeccion y limpieza de la cabina' },
];

const ITEMS_SALUD = [
  { id: 42, nombre: 'Descanso apropiado antes de la jornada' },
  { id: 43, nombre: 'Bajo tratamiento medico / medicamento' },
  { id: 44, nombre: 'Trastorno de ansiedad o depresion' },
  { id: 45, nombre: 'Trastorno neurologico o visual' },
  { id: 46, nombre: 'Condiciones de salud apropiadas' },
];

// ==========================================
// COLORES (pdf-lib usa rgb 0-1)
// ==========================================
const C = {
  primary: rgb(0.1, 0.1, 0.18),
  accent: rgb(0.96, 0.62, 0.04),
  green: rgb(0.13, 0.77, 0.37),
  red: rgb(0.94, 0.27, 0.27),
  gray: rgb(0.42, 0.45, 0.5),
  lightGray: rgb(0.95, 0.96, 0.96),
  white: rgb(1, 1, 1),
  darkText: rgb(0.07, 0.09, 0.15),
  headerBg: rgb(0.16, 0.16, 0.31),
  warmBg: rgb(1, 0.98, 0.92),
  greenBg: rgb(0.86, 0.99, 0.91),
  redBg: rgb(1, 0.95, 0.95),
};

// ==========================================
// INTERFAZ DE DATOS
// ==========================================
export interface PreoperacionalPDFData {
  codigoInspeccion: string;
  fecha: string;
  codigoFormato: string;
  versionFormato: string;
  conductor: {
    nombreCompleto: string;
    cedula: string;
    telefono: string;
    email: string;
    edad?: string;
    rh?: string;
    eps?: string;
    arl?: string;
    fondoPension?: string;
  };
  vehiculo: {
    placa: string;
    marca: string;
    linea: string;
    modelo: string;
    color: string;
    tarjetaPropiedad: string;
  };
  remolque: {
    placa: string;
    marca: string;
    clase: string;
    modelo: string;
  };
  documentos: {
    soatCumple: boolean;
    soatVencimiento: string;
    revisionCumple: boolean;
    revisionVencimiento: string;
    polizaCumple: boolean;
    polizaVencimiento: string;
    licenciaCumple: boolean;
    categoriasLicencia: string[];
    vigenciasLicencia: Record<string, string>;
  };
  datosGPS: {
    nombreGPS: string;
    usuario: string;
    autorizacionMonitoreo: boolean;
  };
  horasDormir: string;
  kilometrajeInicial: string;
  itemsVerificacion: Record<string, { cumple: boolean | null; observacion: string }>;
  itemsNoCumplen: number;
  firmaConductor: string;
  idConductor: string;
  ipOrigen: string;
  // Datos HSEQ (opcional, se agregan en la revisión)
  firmaHSEQ?: string;
  nombreHSEQ?: string;
  estadoRevision?: string;
  fechaRevision?: string;
  observacionesRevision?: string;
}

// ==========================================
// HELPERS
// ==========================================

function formatDateStr(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}

function truncate(text: string, max: number): string {
  if (!text) return '';
  return text.length > max ? text.substring(0, max) + '...' : text;
}

// ==========================================
// PAGE MANAGEMENT
// ==========================================

interface PDFContext {
  doc: PDFDocument;
  page: PDFPage;
  y: number;
  fontRegular: PDFFont;
  fontBold: PDFFont;
  pageWidth: number;
  pageHeight: number;
  margin: number;
}

function addNewPage(ctx: PDFContext): PDFContext {
  const page = ctx.doc.addPage([612, 792]);
  return { ...ctx, page, y: ctx.pageHeight - 30 };
}

function ensureSpace(ctx: PDFContext, needed: number): PDFContext {
  if (ctx.y - needed < 50) {
    return addNewPage(ctx);
  }
  return ctx;
}

// ==========================================
// DRAW FUNCTIONS
// ==========================================

function drawHeader(ctx: PDFContext, data: PreoperacionalPDFData): PDFContext {
  const { page, fontBold, fontRegular, pageWidth, margin } = ctx;
  let y = ctx.y;

  // Top accent bar
  page.drawRectangle({ x: 0, y: 792 - 4, width: pageWidth, height: 4, color: C.accent });

  // Header background
  const headerH = 60;
  const headerY = y - headerH;
  page.drawRectangle({ x: margin, y: headerY, width: pageWidth - margin * 2, height: headerH, color: C.primary });

  // Company name
  page.drawText('TRANSPORTE Y LOGISTICA EQUINOX S.A.S.', {
    x: margin + 12, y: headerY + headerH - 18, size: 11, font: fontBold, color: C.accent,
  });
  page.drawText('NIT: 901.870.510-5', {
    x: margin + 12, y: headerY + headerH - 30, size: 7, font: fontRegular, color: C.white,
  });
  page.drawText('FORMATO DE INSPECCION PREOPERACIONAL DE TRACTOCAMION', {
    x: margin + 12, y: headerY + headerH - 43, size: 8, font: fontBold, color: C.white,
  });

  // Code box on the right
  const boxW = 130;
  const boxX = pageWidth - margin - boxW - 5;
  page.drawRectangle({ x: boxX, y: headerY + 5, width: boxW, height: headerH - 10, color: C.headerBg });

  page.drawText('CODIGO', { x: boxX + 8, y: headerY + headerH - 18, size: 6, font: fontBold, color: C.accent });
  page.drawText(data.codigoFormato, { x: boxX + 8, y: headerY + headerH - 28, size: 7, font: fontRegular, color: C.white });

  page.drawText('VERSION', { x: boxX + 65, y: headerY + headerH - 18, size: 6, font: fontBold, color: C.accent });
  page.drawText(data.versionFormato, { x: boxX + 65, y: headerY + headerH - 28, size: 7, font: fontRegular, color: C.white });

  page.drawText('INSPECCION', { x: boxX + 8, y: headerY + headerH - 40, size: 6, font: fontBold, color: C.accent });
  page.drawText(data.codigoInspeccion || 'PENDIENTE', { x: boxX + 8, y: headerY + headerH - 50, size: 7, font: fontRegular, color: C.white });

  y = headerY - 8;

  // Date and conductor ID
  page.drawText('Fecha de Inspeccion: ' + formatDateStr(data.fecha), {
    x: margin + 5, y, size: 7, font: fontRegular, color: C.gray,
  });
  page.drawText('ID Conductor: ' + data.idConductor, {
    x: pageWidth / 2 + 30, y, size: 7, font: fontRegular, color: C.gray,
  });

  y -= 16;
  return { ...ctx, y };
}

function drawSectionTitle(ctx: PDFContext, title: string): PDFContext {
  ctx = ensureSpace(ctx, 30);
  const { page, fontBold, margin, pageWidth } = ctx;
  let y = ctx.y;

  const w = pageWidth - margin * 2;
  page.drawRectangle({ x: margin, y: y - 16, width: w, height: 18, color: C.primary });
  page.drawText(title, {
    x: margin + 10, y: y - 12, size: 8, font: fontBold, color: C.accent,
  });

  y -= 26;
  return { ...ctx, y };
}

function drawInfoGrid(ctx: PDFContext, items: { label: string; value: string }[], cols: number = 3): PDFContext {
  const { fontBold, fontRegular, margin, pageWidth } = ctx;
  let y = ctx.y;
  const colW = (pageWidth - margin * 2 - 10) / cols;

  for (let i = 0; i < items.length; i++) {
    const col = i % cols;
    const x = margin + 5 + col * colW;

    if (col === 0 && i > 0) {
      y -= 24;
    }

    ctx = ensureSpace({ ...ctx, y }, 24);
    y = ctx.y;

    ctx.page.drawText(items[i].label, { x, y, size: 6, font: fontBold, color: C.gray });
    ctx.page.drawText(items[i].value || 'N/A', { x, y: y - 10, size: 8, font: fontRegular, color: C.darkText });
  }

  y -= 28;
  return { ...ctx, y };
}

function drawDocRow(ctx: PDFContext, label: string, cumple: boolean, vencimiento: string): PDFContext {
  ctx = ensureSpace(ctx, 14);
  const { fontBold, fontRegular, margin } = ctx;
  let y = ctx.y;

  ctx.page.drawText(label + ':', { x: margin + 10, y, size: 8, font: fontBold, color: C.darkText });

  const statusText = cumple ? 'VIGENTE' : 'NO VIGENTE';
  const statusColor = cumple ? C.green : C.red;
  ctx.page.drawText(statusText, { x: margin + 90, y, size: 8, font: fontBold, color: statusColor });

  ctx.page.drawText('(Vence: ' + formatDateStr(vencimiento) + ')', {
    x: margin + 170, y, size: 7, font: fontRegular, color: C.gray,
  });

  y -= 14;
  return { ...ctx, y };
}

function drawItemsTable(
  ctx: PDFContext,
  sectionTitle: string,
  items: { id: number; nombre: string }[],
  verificacion: Record<string, { cumple: boolean | null; observacion: string }>
): PDFContext {
  ctx = drawSectionTitle(ctx, sectionTitle);

  const { margin, pageWidth, fontBold, fontRegular } = ctx;
  const tableW = pageWidth - margin * 2;
  const colId = 25;
  const colEstado = 55;
  const colObs = 65;
  const colNombre = tableW - colId - colEstado - colObs;

  // Table header
  ctx = ensureSpace(ctx, 16);
  let y = ctx.y;

  ctx.page.drawRectangle({ x: margin, y: y - 12, width: tableW, height: 14, color: C.lightGray });
  ctx.page.drawText('#', { x: margin + 5, y: y - 9, size: 6, font: fontBold, color: C.darkText });
  ctx.page.drawText('Item de Verificacion', { x: margin + colId + 5, y: y - 9, size: 6, font: fontBold, color: C.darkText });
  ctx.page.drawText('Estado', { x: margin + colId + colNombre + 5, y: y - 9, size: 6, font: fontBold, color: C.darkText });
  ctx.page.drawText('Observacion', { x: margin + colId + colNombre + colEstado + 5, y: y - 9, size: 6, font: fontBold, color: C.darkText });

  y -= 16;

  // Rows
  for (const item of items) {
    ctx = ensureSpace({ ...ctx, y }, 14);
    y = ctx.y;

    const estado = verificacion[item.id.toString()];
    const cumple = estado?.cumple;
    const obs = truncate(estado?.observacion || '', 18);

    // Alternating background
    if (item.id % 2 === 0) {
      ctx.page.drawRectangle({ x: margin, y: y - 10, width: tableW, height: 13, color: rgb(0.98, 0.98, 0.99) });
    }

    ctx.page.drawText(item.id.toString(), { x: margin + 5, y: y - 8, size: 6, font: fontRegular, color: C.darkText });
    ctx.page.drawText(truncate(item.nombre, 55), { x: margin + colId + 5, y: y - 8, size: 6, font: fontRegular, color: C.darkText });

    // Status
    if (cumple === true) {
      ctx.page.drawText('Cumple', { x: margin + colId + colNombre + 5, y: y - 8, size: 6, font: fontBold, color: C.green });
    } else if (cumple === false) {
      ctx.page.drawText('No Cumple', { x: margin + colId + colNombre + 5, y: y - 8, size: 6, font: fontBold, color: C.red });
    } else {
      ctx.page.drawText('---', { x: margin + colId + colNombre + 5, y: y - 8, size: 6, font: fontRegular, color: C.gray });
    }

    ctx.page.drawText(obs, { x: margin + colId + colNombre + colEstado + 5, y: y - 8, size: 5, font: fontRegular, color: C.gray });

    y -= 13;
  }

  return { ...ctx, y: y - 5 };
}

// ==========================================
// GENERADOR PRINCIPAL
// ==========================================

export async function generatePreoperacionalPDF(data: PreoperacionalPDFData): Promise<Buffer> {
  const doc = await PDFDocument.create();

  doc.setTitle('Inspeccion Preoperacional - ' + data.codigoInspeccion);
  doc.setAuthor('TRANSPORTE Y LOGISTICA EQUINOX S.A.S.');
  doc.setSubject('Formato de Inspeccion Preoperacional de Tractocamion');
  doc.setCreator('Equinox Enterprise System');

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 40;

  // First page
  const firstPage = doc.addPage([pageWidth, pageHeight]);
  let ctx: PDFContext = { doc, page: firstPage, y: pageHeight - 10, fontRegular, fontBold, pageWidth, pageHeight, margin };

  // ==========================================
  // PAGE 1 - DATOS GENERALES
  // ==========================================
  ctx = drawHeader(ctx, data);

  // --- CONDUCTOR ---
  ctx = drawSectionTitle(ctx, 'DATOS DEL CONDUCTOR');
  ctx = drawInfoGrid(ctx, [
    { label: 'Nombre Completo', value: data.conductor.nombreCompleto },
    { label: 'Cedula', value: data.conductor.cedula },
    { label: 'Telefono', value: data.conductor.telefono },
    { label: 'Email', value: data.conductor.email },
    { label: 'Edad', value: data.conductor.edad || 'N/A' },
    { label: 'RH', value: data.conductor.rh || 'N/A' },
    { label: 'EPS', value: data.conductor.eps || 'N/A' },
    { label: 'ARL', value: data.conductor.arl || 'N/A' },
    { label: 'Fondo Pension', value: data.conductor.fondoPension || 'N/A' },
  ], 3);

  // --- VEHICULO ---
  ctx = drawSectionTitle(ctx, 'DATOS DEL VEHICULO');
  ctx = drawInfoGrid(ctx, [
    { label: 'Placa', value: data.vehiculo.placa },
    { label: 'Marca', value: data.vehiculo.marca },
    { label: 'Linea', value: data.vehiculo.linea },
    { label: 'Modelo', value: data.vehiculo.modelo },
    { label: 'Color', value: data.vehiculo.color },
    { label: 'Tarjeta Propiedad', value: data.vehiculo.tarjetaPropiedad },
  ], 3);

  // --- REMOLQUE ---
  ctx = drawSectionTitle(ctx, 'DATOS DEL REMOLQUE');
  ctx = drawInfoGrid(ctx, [
    { label: 'Placa', value: data.remolque.placa },
    { label: 'Marca', value: data.remolque.marca },
    { label: 'Clase', value: data.remolque.clase },
    { label: 'Modelo', value: data.remolque.modelo },
  ], 4);

  // --- DOCUMENTOS ---
  ctx = drawSectionTitle(ctx, 'DOCUMENTOS Y VIGENCIAS');
  ctx = drawDocRow(ctx, 'SOAT', data.documentos.soatCumple, data.documentos.soatVencimiento);
  ctx = drawDocRow(ctx, 'RTM', data.documentos.revisionCumple, data.documentos.revisionVencimiento);
  ctx = drawDocRow(ctx, 'Poliza', data.documentos.polizaCumple, data.documentos.polizaVencimiento);

  // Licencia
  ctx = ensureSpace(ctx, 28);
  const licText = data.documentos.licenciaCumple ? 'VIGENTE' : 'NO VIGENTE';
  const licColor = data.documentos.licenciaCumple ? C.green : C.red;
  ctx.page.drawText('Licencia:', { x: margin + 10, y: ctx.y, size: 8, font: fontBold, color: C.darkText });
  ctx.page.drawText(licText, { x: margin + 90, y: ctx.y, size: 8, font: fontBold, color: licColor });
  ctx.y -= 14;

  if (data.documentos.categoriasLicencia && data.documentos.categoriasLicencia.length > 0) {
    const cats = data.documentos.categoriasLicencia.map(function(c) {
      const vig = data.documentos.vigenciasLicencia ? data.documentos.vigenciasLicencia[c] : undefined;
      return vig ? c + ' (' + formatDateStr(vig) + ')' : c;
    }).join(', ');
    ctx.page.drawText('Categorias: ' + cats, { x: margin + 10, y: ctx.y, size: 7, font: fontRegular, color: C.gray });
    ctx.y -= 16;
  }

  // --- CONDICIONES ---
  ctx = drawSectionTitle(ctx, 'CONDICIONES DEL CONDUCTOR');
  ctx = drawInfoGrid(ctx, [
    { label: 'Horas de Descanso', value: data.horasDormir + ' horas' },
    { label: 'Kilometraje Inicial', value: data.kilometrajeInicial + ' km' },
  ], 2);

  // ==========================================
  // PAGE 2+ - ITEMS DE VERIFICACION
  // ==========================================
  ctx = addNewPage(ctx);
  ctx = drawHeader(ctx, data);

  ctx = drawItemsTable(ctx, 'ELEMENTOS DE SEGURIDAD', ITEMS_SEGURIDAD, data.itemsVerificacion);
  ctx = drawItemsTable(ctx, 'VERIFICACION GENERAL DEL VEHICULO', ITEMS_GENERALES, data.itemsVerificacion);
  ctx = drawItemsTable(ctx, 'ESTADO MECANICO', ITEMS_MECANICOS, data.itemsVerificacion);
  ctx = drawItemsTable(ctx, 'ESTADO DE CORREAS', ITEMS_CORREAS, data.itemsVerificacion);
  ctx = drawItemsTable(ctx, 'HIGIENE Y BIOSEGURIDAD', ITEMS_HIGIENE, data.itemsVerificacion);
  ctx = drawItemsTable(ctx, 'CONDICIONES DE SALUD', ITEMS_SALUD, data.itemsVerificacion);

  // Summary box
  ctx = ensureSpace(ctx, 30);
  const summaryColor = data.itemsNoCumplen === 0 ? C.greenBg : C.redBg;
  const summaryTextColor = data.itemsNoCumplen === 0 ? C.green : C.red;
  const summaryText = data.itemsNoCumplen === 0
    ? 'TODOS LOS ITEMS CUMPLEN'
    : data.itemsNoCumplen + ' ITEM(S) NO CUMPLEN';

  ctx.page.drawRectangle({ x: margin, y: ctx.y - 22, width: pageWidth - margin * 2, height: 24, color: summaryColor });
  ctx.page.drawText(summaryText, {
    x: margin + 20, y: ctx.y - 16, size: 10, font: fontBold, color: summaryTextColor,
  });
  ctx.y -= 35;

  // ==========================================
  // REVISION HSEQ (si existe)
  // ==========================================
  if (data.estadoRevision) {
    ctx = ensureSpace(ctx, 50);
    const revBg = data.estadoRevision === 'Aprobado' ? C.greenBg : C.redBg;
    const revColor = data.estadoRevision === 'Aprobado' ? C.green : C.red;
    
    ctx = drawSectionTitle(ctx, 'REVISION HSEQ');
    
    // Status box
    ctx.page.drawRectangle({ x: margin, y: ctx.y - 22, width: pageWidth - margin * 2, height: 24, color: revBg });
    ctx.page.drawText('ESTADO: ' + data.estadoRevision.toUpperCase(), {
      x: margin + 20, y: ctx.y - 16, size: 10, font: fontBold, color: revColor,
    });
    ctx.y -= 32;

    // Review details
    ctx = drawInfoGrid(ctx, [
      { label: 'Revisado por', value: data.nombreHSEQ || 'N/A' },
      { label: 'Fecha de Revision', value: formatDateStr(data.fechaRevision || '') },
    ], 2);

    if (data.observacionesRevision) {
      ctx = ensureSpace(ctx, 20);
      ctx.page.drawText('Observaciones:', { x: margin + 10, y: ctx.y, size: 7, font: fontBold, color: C.gray });
      ctx.y -= 12;
      ctx.page.drawText(data.observacionesRevision, { x: margin + 10, y: ctx.y, size: 7, font: fontRegular, color: C.darkText });
      ctx.y -= 16;
    }
  }

  // ==========================================
  // FIRMAS (Conductor a la izquierda, HSEQ a la derecha)
  // Siempre se muestran ambas columnas con línea para firma física
  // ==========================================
  ctx = ensureSpace(ctx, 140);
  ctx = drawSectionTitle(ctx, 'FIRMAS');

  const sigWidth = 240;
  const sigHeight = 60;
  const leftX = margin + 5;
  const rightX = pageWidth / 2 + 15;
  const sigTopY = ctx.y;

  // === FIRMA CONDUCTOR (izquierda) ===
  ctx.page.drawText('CONDUCTOR', { x: leftX, y: sigTopY, size: 7, font: fontBold, color: C.gray });
  const conductorSigY = sigTopY - 14;

  if (data.firmaConductor && data.firmaConductor.startsWith('data:image/png;base64,')) {
    try {
      const base64Data = data.firmaConductor.replace(/^data:image\/png;base64,/, '');
      const firmaBytes = Uint8Array.from(Buffer.from(base64Data, 'base64'));
      const firmaImage = await doc.embedPng(firmaBytes);

      // Sin fondo - solo la imagen de la firma directamente
      const scaled = firmaImage.scaleToFit(sigWidth - 10, sigHeight - 5);
      ctx.page.drawImage(firmaImage, {
        x: leftX + (sigWidth - scaled.width) / 2,
        y: conductorSigY - sigHeight + 3,
        width: scaled.width,
        height: scaled.height,
      });
    } catch (e) {
      ctx.page.drawText('[Firma digital registrada]', {
        x: leftX + 10, y: conductorSigY - 30, size: 8, font: fontRegular, color: C.gray,
      });
    }
  }

  // Línea para firma física + datos del conductor
  const underSigY = conductorSigY - sigHeight - 5;
  ctx.page.drawLine({ start: { x: leftX, y: underSigY }, end: { x: leftX + sigWidth, y: underSigY }, thickness: 1, color: C.darkText });
  ctx.page.drawText(data.conductor.nombreCompleto, { x: leftX + 5, y: underSigY - 12, size: 8, font: fontBold, color: C.darkText });
  ctx.page.drawText('C.C. ' + data.conductor.cedula, { x: leftX + 5, y: underSigY - 22, size: 7, font: fontRegular, color: C.gray });
  ctx.page.drawText('Firma Conductor', { x: leftX + 5, y: underSigY - 32, size: 6, font: fontRegular, color: C.gray });

  // === FIRMA HSEQ / SST (derecha) - siempre visible ===
  ctx.page.drawText('HSEQ / SST', { x: rightX, y: sigTopY, size: 7, font: fontBold, color: C.gray });
  const hseqSigY = sigTopY - 14;

  if (data.firmaHSEQ && data.firmaHSEQ.startsWith('data:image/png;base64,')) {
    try {
      const base64HSEQ = data.firmaHSEQ.replace(/^data:image\/png;base64,/, '');
      const hseqBytes = Uint8Array.from(Buffer.from(base64HSEQ, 'base64'));
      const hseqImage = await doc.embedPng(hseqBytes);

      // Sin fondo - solo la imagen de la firma directamente
      const scaledH = hseqImage.scaleToFit(sigWidth - 10, sigHeight - 5);
      ctx.page.drawImage(hseqImage, {
        x: rightX + (sigWidth - scaledH.width) / 2,
        y: hseqSigY - sigHeight + 3,
        width: scaledH.width,
        height: scaledH.height,
      });
    } catch (e) {
      // Si falla, no se muestra nada - queda espacio para firma física
    }
  }

  // Línea para firma física + datos del HSEQ
  ctx.page.drawLine({ start: { x: rightX, y: underSigY }, end: { x: rightX + sigWidth, y: underSigY }, thickness: 1, color: C.darkText });
  ctx.page.drawText(data.nombreHSEQ || '________________________', { x: rightX + 5, y: underSigY - 12, size: 8, font: fontBold, color: C.darkText });
  ctx.page.drawText('Responsable HSEQ / SST', { x: rightX + 5, y: underSigY - 22, size: 7, font: fontRegular, color: C.gray });
  ctx.page.drawText('Firma HSEQ', { x: rightX + 5, y: underSigY - 32, size: 6, font: fontRegular, color: C.gray });

  ctx.y = underSigY - 45;

  // Guardar coordenadas de firma HSEQ en metadata del PDF
  // para que la ruta de revisión pueda dibujar la firma en la misma página
  const sigPageIndex = doc.getPages().indexOf(ctx.page);
  doc.setKeywords([`SIG_PAGE:${sigPageIndex}`, `SIG_TOP_Y:${Math.round(sigTopY)}`, `SIG_UNDER_Y:${Math.round(underSigY)}`]);

  // ==========================================
  // CERTIFICACION
  // ==========================================
  ctx = ensureSpace(ctx, 50);
  ctx.page.drawRectangle({ x: margin, y: ctx.y - 40, width: pageWidth - margin * 2, height: 42, color: C.warmBg });
  ctx.page.drawText(
    'Al firmar este documento, el conductor certifica que toda la informacion proporcionada es veraz',
    { x: margin + 10, y: ctx.y - 14, size: 6, font: fontRegular, color: rgb(0.57, 0.25, 0.05) }
  );
  ctx.page.drawText(
    'y que ha realizado la inspeccion pre-operacional del vehiculo antes de iniciar la jornada laboral.',
    { x: margin + 10, y: ctx.y - 24, size: 6, font: fontRegular, color: rgb(0.57, 0.25, 0.05) }
  );
  ctx.page.drawText(
    'Este documento fue generado electronicamente por el sistema Equinox Enterprise.',
    { x: margin + 10, y: ctx.y - 34, size: 6, font: fontRegular, color: rgb(0.57, 0.25, 0.05) }
  );
  ctx.y -= 55;

  // Metadata
  const now = new Date().toLocaleString('es-CO');
  ctx.page.drawText(
    'Generado: ' + now + ' | IP: ' + data.ipOrigen + ' | Sistema Equinox Enterprise v1.0',
    { x: margin + 10, y: ctx.y, size: 5, font: fontRegular, color: C.gray }
  );

  // ==========================================
  // PAGE NUMBERS + Bottom accent bar on all pages
  // ==========================================
  const pages = doc.getPages();
  const totalPages = pages.length;
  for (let i = 0; i < totalPages; i++) {
    const p = pages[i];
    // Bottom accent bar
    p.drawRectangle({ x: 0, y: 0, width: pageWidth, height: 4, color: C.accent });
    // Page number
    p.drawText('Pagina ' + (i + 1) + ' de ' + totalPages, {
      x: pageWidth / 2 - 30, y: 10, size: 6, font: fontRegular, color: C.gray,
    });
  }

  // Serialize
  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}


// ================================================================
// GENERADOR PDF — INSPECCIÓN VEHICULAR (5 secciones, 97 ítems)
// ================================================================

export interface InspeccionVehicularPDFData {
  codigoInspeccion: string;
  fecha: string;
  conductor: {
    id: string;
    nombre: string;
    cedula: string;
    edad?: string;
    eps?: string;
    arl?: string;
    fondoPension?: string;
    rh?: string;
  };
  vehiculo: { placa: string; marca: string; linea: string; modelo: string };
  remolque: { placa: string; marca: string; clase: string; modelo: string };
  documentos: {
    soat:     { cumple: boolean | null; vencimiento: string };
    rtm:      { cumple: boolean | null; vencimiento: string };
    poliza:   { cumple: boolean | null; vencimiento: string };
    licencia: { cumple: boolean | null; categorias: string[]; vigencias: Record<string, string> };
  };
  condiciones: { horasDormir: number; kilometrajeInicial: number };
  itemsVerificacion: Record<number, { cumple: boolean | null; observacion?: string }>;
  kitDerrame:        Record<number, { estado: string | null; observacion?: string }>;
  botiquin:          Record<number, { estado: string | null; cantidad?: string; fechaVencimiento?: string; observacion?: string }>;
  extintor: {
    items: Record<number, { estado: string | null; observacion?: string }>;
    fechaActual?: { dia: string; mes: string; ano: string };
    fechaProximaRecarga?: { dia: string; mes: string; ano: string };
  };
  firma: string;
  observacionesGenerales: string;
  totales: {
    cumple: number;
    noCumple: number;
    porcentaje: string;
    bueno: number;
    regular: number;
    malo: number;
    noTiene: number;
  };
}

// Catálogos ítems vehicular (mismo orden que API route)
const VEH_PREOP = [
  { id: 1,  nombre: 'Extintor de Incendios (20 lb × 2 uds)', cat: 'Seguridad' },
  { id: 2,  nombre: 'Equipo de Carretera', cat: 'Seguridad' },
  { id: 3,  nombre: 'Botiquín de primeros auxilios', cat: 'Seguridad' },
  { id: 4,  nombre: 'Cinturones de seguridad operativos', cat: 'Seguridad' },
  { id: 5,  nombre: 'Bocina (claxon)', cat: 'Seguridad' },
  { id: 6,  nombre: 'Luces (altas, bajas, direccionales)', cat: 'Seguridad' },
  { id: 7,  nombre: 'Espejos (laterales) y lente angular', cat: 'Seguridad' },
  { id: 8,  nombre: 'Papeles retrovisores ajustados', cat: 'Seguridad' },
  { id: 9,  nombre: 'Señalización adecuada', cat: 'Generales' },
  { id: 10, nombre: 'Estado general Tanque (sin fugas)', cat: 'Generales' },
  { id: 11, nombre: 'Tanque con tapa en buen estado', cat: 'Generales' },
  { id: 12, nombre: 'Estado y limpieza de la cabina', cat: 'Generales' },
  { id: 13, nombre: 'Estado general de las llantas', cat: 'Generales' },
  { id: 14, nombre: 'Llanta de repuesto', cat: 'Generales' },
  { id: 15, nombre: 'Rines y contrapesos', cat: 'Generales' },
  { id: 16, nombre: 'Sistema de frenos', cat: 'Generales' },
  { id: 17, nombre: 'Freno de estacionamiento', cat: 'Generales' },
  { id: 18, nombre: 'Sistema de dirección', cat: 'Generales' },
  { id: 19, nombre: 'Estado del motor', cat: 'Generales' },
  { id: 20, nombre: 'Nivel de fluidos', cat: 'Generales' },
  { id: 21, nombre: 'Suspensión y amortiguadores', cat: 'Generales' },
  { id: 22, nombre: 'Luces (delanteras, traseras, dir. y freno)', cat: 'Generales' },
  { id: 23, nombre: 'Ausencia fugas de fluidos', cat: 'Generales' },
  { id: 24, nombre: 'Herramientas básicas y gato hidráulico', cat: 'Generales' },
  { id: 25, nombre: 'Punto de anclaje fijo', cat: 'Generales' },
  { id: 26, nombre: 'Cable de acero', cat: 'Generales' },
  { id: 27, nombre: 'Estado de los espejos', cat: 'Generales' },
  { id: 28, nombre: 'Listado del torque', cat: 'Generales' },
  { id: 29, nombre: 'Caja de cambios', cat: 'Mecánico' },
  { id: 30, nombre: 'Amortiguadores y resortes', cat: 'Mecánico' },
  { id: 31, nombre: 'Componentes de suspensión', cat: 'Mecánico' },
  { id: 32, nombre: 'Nivel y estado del refrigerante', cat: 'Mecánico' },
  { id: 33, nombre: 'Fugas en mangueras y sellantes', cat: 'Mecánico' },
  { id: 34, nombre: 'Frenos de emergencia y servicio', cat: 'Mecánico' },
  { id: 35, nombre: 'Estado de la batería', cat: 'Mecánico' },
  { id: 36, nombre: 'Lubricación y engrase general', cat: 'Mecánico' },
  { id: 37, nombre: 'Sistema de escape', cat: 'Mecánico' },
  { id: 38, nombre: 'Correas (ventilador, alternador, compresor)', cat: 'Correas' },
  { id: 39, nombre: 'Desinfección y limpieza cabina', cat: 'Higiene' },
  { id: 40, nombre: 'Descanso apropiado antes de jornada', cat: 'Salud' },
  { id: 41, nombre: 'Bajo tratamiento médico / medicamento', cat: 'Salud' },
  { id: 42, nombre: 'Trastorno de ansiedad o depresión', cat: 'Salud' },
  { id: 43, nombre: 'Trastorno neurológico o visual', cat: 'Salud' },
  { id: 44, nombre: 'Condiciones de salud apropiadas', cat: 'Salud' },
];
const VEH_KIT = [
  { id: 101, nombre: 'Paños Absorbentes' },
  { id: 102, nombre: 'Barrera Absorbente' },
  { id: 103, nombre: 'Traje Desechable' },
  { id: 104, nombre: 'Bolsa Roja Residuos' },
  { id: 105, nombre: 'Pala Plástica' },
  { id: 106, nombre: 'Espátula Plástica' },
  { id: 107, nombre: 'Guantes de Nitrilo' },
  { id: 108, nombre: 'Gafas de Seguridad' },
  { id: 109, nombre: 'Cinta de Peligro' },
  { id: 110, nombre: 'Martillo de Goma' },
  { id: 111, nombre: 'Recogedor de Mano' },
  { id: 112, nombre: 'Respirador / N-95' },
  { id: 113, nombre: 'Linterna Recargable' },
  { id: 114, nombre: 'Granulado Absorbente' },
  { id: 115, nombre: 'Masilla Epóxica' },
  { id: 116, nombre: 'Desengrasante Biodegradable' },
  { id: 117, nombre: 'Chaleco Antireflectivo' },
  { id: 118, nombre: 'Conos' },
  { id: 119, nombre: '¿Conoce procedimiento de uso?' },
  { id: 120, nombre: '¿Almacenado en lugar seco?' },
  { id: 121, nombre: '¿Caneca rotulada/señalizada?' },
];
const VEH_BOTIQUIN = [
  { id: 201, nombre: 'Gasas', std: 10 },
  { id: 202, nombre: 'Esparadrapo', std: 1 },
  { id: 203, nombre: 'Bajalenguas', std: 10 },
  { id: 204, nombre: 'Guantes de Latex', std: 5 },
  { id: 205, nombre: 'Aplicadores / Copitos', std: 1 },
  { id: 206, nombre: 'Venda Elástica 2X5', std: 1 },
  { id: 207, nombre: 'Venda Elástica 3X5', std: 1 },
  { id: 208, nombre: 'Venda Elástica 5X5', std: 1 },
  { id: 209, nombre: 'Venda de Algodón 3X5', std: 1 },
  { id: 210, nombre: 'Venda de Algodón 5X5', std: 1 },
  { id: 211, nombre: 'Yodopovidona (Jabón)', std: 1 },
  { id: 212, nombre: 'Solución Salina 250-500cc', std: 1 },
  { id: 213, nombre: 'Tapabocas', std: 3 },
  { id: 214, nombre: 'Alcohol Antiséptico 275ml', std: 1 },
  { id: 215, nombre: 'Curas', std: 5 },
  { id: 216, nombre: 'Jeringa de 5 ml', std: 1 },
  { id: 217, nombre: 'Tijeras de Trauma', std: 1 },
  { id: 218, nombre: 'Parche Ocular', std: 3 },
  { id: 219, nombre: 'Termómetro', std: 1 },
  { id: 220, nombre: 'Libreta', std: 1 },
  { id: 221, nombre: 'Lapicero', std: 1 },
  { id: 222, nombre: 'Manual de Emergencia', std: 1 },
];
const VEH_EXTINTOR = [
  { id: 301, nombre: 'Presión' },
  { id: 302, nombre: 'Sello de Garantía' },
  { id: 303, nombre: 'Manómetro' },
  { id: 304, nombre: 'Estado del Cilindro' },
  { id: 305, nombre: 'Manija' },
  { id: 306, nombre: 'Boquilla o Manguera' },
  { id: 307, nombre: 'Anillo de Seguridad' },
  { id: 308, nombre: 'Pin de Seguridad' },
  { id: 309, nombre: 'Pintura' },
  { id: 310, nombre: 'Tarjeta de Inspección' },
];

// –– helpers for estado-based tables (B/R/M/NT) ––
const ESTADO_LABELS: Record<string, { text: string; color: ReturnType<typeof rgb> }> = {
  B:  { text: 'Bueno',    color: rgb(0.13, 0.77, 0.37) },
  R:  { text: 'Regular',  color: rgb(0.96, 0.62, 0.04) },
  M:  { text: 'Malo',     color: rgb(0.94, 0.27, 0.27) },
  NT: { text: 'No Tiene', color: rgb(0.42, 0.45, 0.5)  },
};

function drawEstadoTable(
  ctx: PDFContext,
  title: string,
  items: { id: number; nombre: string }[],
  data: Record<number, { estado?: string | null; observacion?: string }>,
  extraCols?: { label: string; getter: (id: number) => string }[],
): PDFContext {
  ctx = drawSectionTitle(ctx, title);
  const { margin, pageWidth, fontBold, fontRegular } = ctx;
  const tableW = pageWidth - margin * 2;
  const colId = 22;
  const colEstado = 48;
  const colObs = 60;
  const colExtra = extraCols ? extraCols.length * 52 : 0;
  const colNombre = tableW - colId - colEstado - colObs - colExtra;

  // header
  ctx = ensureSpace(ctx, 16);
  let y = ctx.y;
  ctx.page.drawRectangle({ x: margin, y: y - 12, width: tableW, height: 14, color: C.lightGray });
  let hx = margin + 4;
  ctx.page.drawText('#', { x: hx, y: y - 9, size: 5.5, font: fontBold, color: C.darkText }); hx += colId;
  ctx.page.drawText('Ítem', { x: hx, y: y - 9, size: 5.5, font: fontBold, color: C.darkText }); hx += colNombre;
  ctx.page.drawText('Estado', { x: hx, y: y - 9, size: 5.5, font: fontBold, color: C.darkText }); hx += colEstado;
  if (extraCols) {
    for (const ec of extraCols) {
      ctx.page.drawText(ec.label, { x: hx, y: y - 9, size: 5.5, font: fontBold, color: C.darkText }); hx += 52;
    }
  }
  ctx.page.drawText('Obs.', { x: hx, y: y - 9, size: 5.5, font: fontBold, color: C.darkText });
  y -= 16;

  for (const item of items) {
    ctx = ensureSpace({ ...ctx, y }, 13);
    y = ctx.y;
    const d = data[item.id] || {};
    if (item.id % 2 === 0) {
      ctx.page.drawRectangle({ x: margin, y: y - 10, width: tableW, height: 12, color: rgb(0.98, 0.98, 0.99) });
    }
    let rx = margin + 4;
    ctx.page.drawText(String(item.id), { x: rx, y: y - 8, size: 5.5, font: fontRegular, color: C.darkText }); rx += colId;
    ctx.page.drawText(truncate(item.nombre, 48), { x: rx, y: y - 8, size: 5.5, font: fontRegular, color: C.darkText }); rx += colNombre;
    const est = ESTADO_LABELS[d.estado || 'NT'] || ESTADO_LABELS.NT;
    ctx.page.drawText(est.text, { x: rx, y: y - 8, size: 5.5, font: fontBold, color: est.color }); rx += colEstado;
    if (extraCols) {
      for (const ec of extraCols) {
        ctx.page.drawText(truncate(ec.getter(item.id), 10), { x: rx, y: y - 8, size: 5.5, font: fontRegular, color: C.darkText }); rx += 52;
      }
    }
    ctx.page.drawText(truncate(d.observacion || '', 16), { x: rx, y: y - 8, size: 5, font: fontRegular, color: C.gray });
    y -= 12;
  }
  return { ...ctx, y: y - 4 };
}

function drawVehDocRow(ctx: PDFContext, label: string, cumple: boolean | null, vencimiento: string): PDFContext {
  ctx = ensureSpace(ctx, 14);
  const { fontBold, fontRegular, margin } = ctx;
  let y = ctx.y;
  ctx.page.drawText(label + ':', { x: margin + 10, y, size: 7.5, font: fontBold, color: C.darkText });
  if (cumple === true) {
    ctx.page.drawText('VIGENTE', { x: margin + 110, y, size: 7.5, font: fontBold, color: C.green });
  } else if (cumple === false) {
    ctx.page.drawText('NO VIGENTE', { x: margin + 110, y, size: 7.5, font: fontBold, color: C.red });
  } else {
    ctx.page.drawText('N/A', { x: margin + 110, y, size: 7.5, font: fontRegular, color: C.gray });
  }
  if (vencimiento) {
    ctx.page.drawText('Vence: ' + formatDateStr(vencimiento), { x: margin + 200, y, size: 7, font: fontRegular, color: C.gray });
  }
  y -= 14;
  return { ...ctx, y };
}

// –– MAIN GENERATOR ––

export async function generateInspeccionVehicularPDF(data: InspeccionVehicularPDFData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.setTitle('Inspección Vehicular - ' + data.codigoInspeccion);
  doc.setAuthor('TRANSPORTE Y LOGISTICA EQUINOX S.A.S.');
  doc.setSubject('Formato de Inspección Vehicular');
  doc.setCreator('Equinox Enterprise System');

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold    = await doc.embedFont(StandardFonts.HelveticaBold);
  const pw = 612, ph = 792, m = 40;

  const firstPage = doc.addPage([pw, ph]);
  let ctx: PDFContext = { doc, page: firstPage, y: ph - 10, fontRegular, fontBold, pageWidth: pw, pageHeight: ph, margin: m };

  // ── HEADER ────────────────────────────────────────────────────────────────
  const drawVehHeader = (c: PDFContext): PDFContext => {
    const { page, pageWidth: w, margin: mg } = c;
    page.drawRectangle({ x: 0, y: ph - 4, width: w, height: 4, color: C.accent });
    const hH = 58, hY = c.y - hH;
    page.drawRectangle({ x: mg, y: hY, width: w - mg * 2, height: hH, color: C.primary });
    page.drawText('TRANSPORTE Y LOGISTICA EQUINOX S.A.S.', { x: mg + 12, y: hY + hH - 17, size: 11, font: fontBold, color: C.accent });
    page.drawText('NIT: 901.870.510-5', { x: mg + 12, y: hY + hH - 28, size: 7, font: fontRegular, color: C.white });
    page.drawText('FORMATO DE INSPECCIÓN VEHICULAR', { x: mg + 12, y: hY + hH - 41, size: 9, font: fontBold, color: C.white });
    // Code box
    const bW = 130, bX = w - mg - bW - 5;
    page.drawRectangle({ x: bX, y: hY + 5, width: bW, height: hH - 10, color: C.headerBg });
    page.drawText('CODIGO', { x: bX + 8, y: hY + hH - 17, size: 6, font: fontBold, color: C.accent });
    page.drawText('HSEQ-FOR-065', { x: bX + 8, y: hY + hH - 27, size: 7, font: fontRegular, color: C.white });
    page.drawText('INSPECCIÓN', { x: bX + 8, y: hY + hH - 38, size: 6, font: fontBold, color: C.accent });
    page.drawText(data.codigoInspeccion || 'PENDIENTE', { x: bX + 8, y: hY + hH - 48, size: 7, font: fontRegular, color: C.white });
    let ny = hY - 8;
    page.drawText('Fecha: ' + formatDateStr(data.fecha), { x: mg + 5, y: ny, size: 7, font: fontRegular, color: C.gray });
    page.drawText('ID Conductor: ' + (data.conductor.id || data.conductor.cedula), { x: w / 2 + 30, y: ny, size: 7, font: fontRegular, color: C.gray });
    return { ...c, y: ny - 14 };
  };

  ctx = drawVehHeader(ctx);

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — DATOS GENERALES + DOCUMENTOS
  // ══════════════════════════════════════════════════════════════════════════

  ctx = drawSectionTitle(ctx, 'DATOS DEL CONDUCTOR');
  ctx = drawInfoGrid(ctx, [
    { label: 'Nombre', value: data.conductor.nombre },
    { label: 'Cédula', value: data.conductor.cedula },
    { label: 'Edad', value: data.conductor.edad || 'N/A' },
    { label: 'EPS', value: data.conductor.eps || 'N/A' },
    { label: 'ARL', value: data.conductor.arl || 'N/A' },
    { label: 'Fondo Pensión', value: data.conductor.fondoPension || 'N/A' },
    { label: 'RH', value: data.conductor.rh || 'N/A' },
  ], 4);

  ctx = drawSectionTitle(ctx, 'DATOS DEL VEHÍCULO');
  ctx = drawInfoGrid(ctx, [
    { label: 'Placa', value: data.vehiculo.placa },
    { label: 'Marca', value: data.vehiculo.marca },
    { label: 'Línea', value: data.vehiculo.linea },
    { label: 'Modelo', value: data.vehiculo.modelo },
  ], 4);

  ctx = drawSectionTitle(ctx, 'DATOS DEL REMOLQUE');
  ctx = drawInfoGrid(ctx, [
    { label: 'Placa', value: data.remolque.placa },
    { label: 'Marca', value: data.remolque.marca },
    { label: 'Clase', value: data.remolque.clase },
    { label: 'Modelo', value: data.remolque.modelo },
  ], 4);

  ctx = drawSectionTitle(ctx, 'DOCUMENTOS Y VIGENCIAS');
  ctx = drawVehDocRow(ctx, 'SOAT', data.documentos.soat.cumple, data.documentos.soat.vencimiento);
  ctx = drawVehDocRow(ctx, 'Revisión Técnico Mecánica', data.documentos.rtm.cumple, data.documentos.rtm.vencimiento);
  ctx = drawVehDocRow(ctx, 'Póliza de Responsabilidad Civil', data.documentos.poliza.cumple, data.documentos.poliza.vencimiento);
  ctx = drawVehDocRow(ctx, 'Licencia de Conducción', data.documentos.licencia.cumple, '');
  if (data.documentos.licencia.categorias?.length) {
    const cats = data.documentos.licencia.categorias.map(c => {
      const v = data.documentos.licencia.vigencias?.[c];
      return v ? `${c} (${formatDateStr(v)})` : c;
    }).join(', ');
    ctx = ensureSpace(ctx, 14);
    ctx.page.drawText('    Categorías: ' + cats, { x: m + 10, y: ctx.y, size: 7, font: fontRegular, color: C.gray });
    ctx.y -= 14;
  }

  ctx = drawSectionTitle(ctx, 'CONDICIONES DEL CONDUCTOR');
  ctx = drawInfoGrid(ctx, [
    { label: 'Horas de Descanso', value: data.condiciones.horasDormir + ' horas' },
    { label: 'Kilometraje Inicial', value: data.condiciones.kilometrajeInicial + ' km' },
  ], 2);

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 1 — ÍTEMS PREOPERACIONALES (44 ítems Cumple/NoC)
  // ══════════════════════════════════════════════════════════════════════════
  ctx = addNewPage(ctx);
  ctx = drawVehHeader(ctx);

  // Agrupar por categoría
  const categorias: string[] = ['Seguridad', 'Generales', 'Mecánico', 'Correas', 'Higiene', 'Salud'];
  for (const cat of categorias) {
    const items = VEH_PREOP.filter(i => i.cat === cat);
    ctx = drawItemsTable(ctx, cat.toUpperCase(), items, data.itemsVerificacion as any);
  }

  // Resumen cumplimiento preoperacional
  ctx = ensureSpace(ctx, 28);
  const pBg = data.totales.noCumple === 0 ? C.greenBg : C.redBg;
  const pColor = data.totales.noCumple === 0 ? C.green : C.red;
  const pText = data.totales.noCumple === 0
    ? `TODOS LOS ÍTEMS CUMPLEN (${data.totales.porcentaje})`
    : `${data.totales.noCumple} ÍTEM(S) NO CUMPLEN — ${data.totales.porcentaje}`;
  ctx.page.drawRectangle({ x: m, y: ctx.y - 20, width: pw - m * 2, height: 22, color: pBg });
  ctx.page.drawText(pText, { x: m + 16, y: ctx.y - 14, size: 9, font: fontBold, color: pColor });
  ctx.y -= 30;

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 2 — KIT DE DERRAME (21 ítems B/R/M/NT)
  // ══════════════════════════════════════════════════════════════════════════
  ctx = drawEstadoTable(ctx, 'KIT CONTROL DE DERRAMES', VEH_KIT, data.kitDerrame);

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 3 — BOTIQUÍN (22 ítems + cantidad + vencimiento)
  // ══════════════════════════════════════════════════════════════════════════
  ctx = drawEstadoTable(ctx, 'BOTIQUÍN DE PRIMEROS AUXILIOS', VEH_BOTIQUIN, data.botiquin as any, [
    { label: 'Cant.', getter: (id) => (data.botiquin[id]?.cantidad || VEH_BOTIQUIN.find(b => b.id === id)?.std?.toString() || '') },
    { label: 'Vence', getter: (id) => data.botiquin[id]?.fechaVencimiento ? formatDateStr(data.botiquin[id].fechaVencimiento!) : '' },
  ]);

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 4 — EXTINTOR (10 ítems + fechas)
  // ══════════════════════════════════════════════════════════════════════════
  ctx = drawEstadoTable(ctx, 'INSPECCIÓN DEL EXTINTOR', VEH_EXTINTOR, data.extintor.items);
  // Fechas del extintor
  if (data.extintor.fechaActual?.dia || data.extintor.fechaProximaRecarga?.dia) {
    ctx = ensureSpace(ctx, 20);
    const fa = data.extintor.fechaActual;
    const fp = data.extintor.fechaProximaRecarga;
    if (fa?.dia) ctx.page.drawText(`Fecha Actual: ${fa.dia}/${fa.mes}/${fa.ano}`, { x: m + 10, y: ctx.y, size: 7, font: fontRegular, color: C.darkText });
    if (fp?.dia) ctx.page.drawText(`Próxima Recarga: ${fp.dia}/${fp.mes}/${fp.ano}`, { x: pw / 2, y: ctx.y, size: 7, font: fontRegular, color: C.darkText });
    ctx.y -= 16;
  }

  // Resumen estados B/R/M/NT
  ctx = ensureSpace(ctx, 28);
  ctx.page.drawRectangle({ x: m, y: ctx.y - 20, width: pw - m * 2, height: 22, color: C.lightGray });
  ctx.page.drawText(
    `Bueno: ${data.totales.bueno}  |  Regular: ${data.totales.regular}  |  Malo: ${data.totales.malo}  |  No Tiene: ${data.totales.noTiene}`,
    { x: m + 16, y: ctx.y - 14, size: 8, font: fontBold, color: C.darkText }
  );
  ctx.y -= 30;

  // ══════════════════════════════════════════════════════════════════════════
  // OBSERVACIONES GENERALES
  // ══════════════════════════════════════════════════════════════════════════
  if (data.observacionesGenerales) {
    ctx = ensureSpace(ctx, 50);
    ctx = drawSectionTitle(ctx, 'OBSERVACIONES GENERALES');
    const lines = data.observacionesGenerales.match(/.{1,95}/g) || [data.observacionesGenerales];
    for (const line of lines) {
      ctx = ensureSpace(ctx, 12);
      ctx.page.drawText(line, { x: m + 10, y: ctx.y, size: 7, font: fontRegular, color: C.darkText });
      ctx.y -= 12;
    }
    ctx.y -= 6;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FIRMA
  // ══════════════════════════════════════════════════════════════════════════
  ctx = ensureSpace(ctx, 120);
  ctx = drawSectionTitle(ctx, 'FIRMA DEL CONDUCTOR');

  const sigW = 220, sigH = 55;
  const sigX = m + 5;
  const sigTopY = ctx.y;

  if (data.firma && data.firma.startsWith('data:image/png;base64,')) {
    try {
      const b64 = data.firma.replace(/^data:image\/png;base64,/, '');
      const bytes = Uint8Array.from(Buffer.from(b64, 'base64'));
      const img = await doc.embedPng(bytes);
      const scaled = img.scaleToFit(sigW - 10, sigH - 5);
      ctx.page.drawImage(img, {
        x: sigX + (sigW - scaled.width) / 2,
        y: sigTopY - sigH + 3,
        width: scaled.width,
        height: scaled.height,
      });
    } catch {
      ctx.page.drawText('[Firma digital registrada]', { x: sigX + 10, y: sigTopY - 30, size: 8, font: fontRegular, color: C.gray });
    }
  }
  const lineY = sigTopY - sigH - 5;
  ctx.page.drawLine({ start: { x: sigX, y: lineY }, end: { x: sigX + sigW, y: lineY }, thickness: 1, color: C.darkText });
  ctx.page.drawText(data.conductor.nombre, { x: sigX + 5, y: lineY - 12, size: 8, font: fontBold, color: C.darkText });
  ctx.page.drawText('C.C. ' + data.conductor.cedula, { x: sigX + 5, y: lineY - 22, size: 7, font: fontRegular, color: C.gray });
  ctx.y = lineY - 35;

  // ══════════════════════════════════════════════════════════════════════════
  // CERTIFICACIÓN
  // ══════════════════════════════════════════════════════════════════════════
  ctx = ensureSpace(ctx, 50);
  ctx.page.drawRectangle({ x: m, y: ctx.y - 38, width: pw - m * 2, height: 40, color: C.warmBg });
  ctx.page.drawText('Al firmar este documento, el conductor certifica que toda la información proporcionada es veraz', { x: m + 10, y: ctx.y - 12, size: 6, font: fontRegular, color: rgb(0.57, 0.25, 0.05) });
  ctx.page.drawText('y que ha realizado la inspección vehicular antes de iniciar la jornada laboral.', { x: m + 10, y: ctx.y - 22, size: 6, font: fontRegular, color: rgb(0.57, 0.25, 0.05) });
  ctx.page.drawText('Este documento fue generado electrónicamente por el sistema Equinox Enterprise.', { x: m + 10, y: ctx.y - 32, size: 6, font: fontRegular, color: rgb(0.57, 0.25, 0.05) });
  ctx.y -= 50;

  const now = new Date().toLocaleString('es-CO');
  ctx.page.drawText('Generado: ' + now + ' | Sistema Equinox Enterprise v1.0', { x: m + 10, y: ctx.y, size: 5, font: fontRegular, color: C.gray });

  // ── Page numbers + bottom bar ──
  const pages = doc.getPages();
  for (let i = 0; i < pages.length; i++) {
    pages[i].drawRectangle({ x: 0, y: 0, width: pw, height: 4, color: C.accent });
    pages[i].drawText(`Página ${i + 1} de ${pages.length}`, { x: pw / 2 - 30, y: 10, size: 6, font: fontRegular, color: C.gray });
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}
