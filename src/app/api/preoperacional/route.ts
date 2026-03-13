import { NextRequest, NextResponse } from 'next/server';
import { getInspeccionesConfig, getConductoresConfig, TABLES, INSPECCION_PREOP_FIELDS, CONDUCTOR_FIELDS } from '@/lib/airtable-config';
import { generatePreoperacionalPDF } from '@/lib/pdf-generator';
import { uploadPDFToCloudinary } from '@/lib/cloudinary';
import { encrypt } from '@/lib/encryption';
import { verifyToken } from '@/lib/jwt';
import cookie from 'cookie';

// ===========================================
// FUNCIONES AUXILIARES PARA AIRTABLE
// ===========================================

async function fetchAirtable(baseId: string, tableName: string, apiKey: string, params?: Record<string, string>) {
  let url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Airtable error: ${response.status} - ${errorData?.error?.message || 'Unknown'}`);
  }

  return response.json();
}

async function createAirtableRecord(baseId: string, tableName: string, apiKey: string, fields: Record<string, any>) {
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields, typecast: true }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Airtable error: ${response.status} - ${errorData?.error?.message || 'Unknown'}`);
  }

  return response.json();
}

async function updateAirtableRecord(baseId: string, tableName: string, apiKey: string, recordId: string, fields: Record<string, any>) {
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}/${recordId}`;
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
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

async function upsertConductor(conductorData: any) {
  const config = getConductoresConfig();
  
  // Buscar conductor por cédula
  // Sanitize: cedula must be digits only
  const safeCedula = String(conductorData.cedula).replace(/[^0-9]/g, '');
  const filterFormula = `{${CONDUCTOR_FIELDS.CEDULA}} = '${safeCedula}'`;
  const searchUrl = `https://api.airtable.com/v0/${config.BASE_ID}/${TABLES.CONDUCTORES.NAME}?filterByFormula=${encodeURIComponent(filterFormula)}`;
  
  const searchResponse = await fetch(searchUrl, {
    headers: {
      'Authorization': `Bearer ${config.API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!searchResponse.ok) {
    throw new Error('Error buscando conductor');
  }

  const searchData = await searchResponse.json();
  
  const conductorFields = {
    [CONDUCTOR_FIELDS.NOMBRE_COMPLETO]: conductorData.nombreCompleto,
    [CONDUCTOR_FIELDS.CEDULA]: conductorData.cedula,
    [CONDUCTOR_FIELDS.TELEFONO]: conductorData.telefono,
    [CONDUCTOR_FIELDS.EMAIL]: conductorData.email,
    [CONDUCTOR_FIELDS.EDAD]: conductorData.edad ? parseInt(conductorData.edad) : undefined,
    [CONDUCTOR_FIELDS.RH]: conductorData.rh || undefined,
    [CONDUCTOR_FIELDS.EPS]: conductorData.eps || undefined,
    [CONDUCTOR_FIELDS.ARL]: conductorData.arl || undefined,
    [CONDUCTOR_FIELDS.FONDO_PENSION]: conductorData.fondoPension || undefined,
    [CONDUCTOR_FIELDS.ACEPTO_POLITICAS]: conductorData.aceptoPoliticas || false,
    [CONDUCTOR_FIELDS.ACEPTO_COOKIES]: conductorData.aceptoCookies || false,
    [CONDUCTOR_FIELDS.ESTADO]: 'Activo',
    // Campos de GPS (usuario y contraseña encriptados)
    [CONDUCTOR_FIELDS.GPS_NOMBRE]: conductorData.gpsNombre || undefined,
    [CONDUCTOR_FIELDS.GPS_USUARIO]: conductorData.gpsUsuario ? encrypt(conductorData.gpsUsuario) : undefined,
    [CONDUCTOR_FIELDS.GPS_PASSWORD]: conductorData.gpsPassword ? encrypt(conductorData.gpsPassword) : undefined,
    [CONDUCTOR_FIELDS.GPS_AUTORIZACION_MONITOREO]: conductorData.gpsAutorizacion || false,
  } as Record<string, unknown>;

  // Limpiar campos undefined
  Object.keys(conductorFields).forEach(key => {
    if (conductorFields[key] === undefined) {
      delete conductorFields[key];
    }
  });

  if (searchData.records && searchData.records.length > 0) {
    // Actualizar conductor existente
    const recordId = searchData.records[0].id;
    const codigoConductor = searchData.records[0].fields?.['Codigo Conductor'] || '';
    const updateUrl = `https://api.airtable.com/v0/${config.BASE_ID}/${TABLES.CONDUCTORES.NAME}/${recordId}`;
    
    await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${config.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: conductorFields, typecast: true }),
    });
    
    return { action: 'updated', recordId, codigoConductor };
  } else {
    // Crear nuevo conductor
    const createResponse = await createAirtableRecord(
      config.BASE_ID,
      TABLES.CONDUCTORES.NAME,
      config.API_KEY,
      conductorFields
    );
    
    return { action: 'created', recordId: createResponse.id, codigoConductor: createResponse.fields?.['Codigo Conductor'] || '' };
  }
}

// ===========================================
// POST - Crear nueva inspección preoperacional
// ===========================================

export async function POST(request: NextRequest) {
  // Authentication required – form is behind /preoperacional/formato (protected)
  const headerCookie = request.headers.get('cookie') || '';
  const parsedCookie = cookie.parse(headerCookie);
  const authUser = parsedCookie.token ? verifyToken(parsedCookie.token) : null;
  if (!authUser) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Validación básica
    if (!body.conductor?.cedula || !body.conductor?.nombreCompleto) {
      return NextResponse.json(
        { error: 'Cédula y nombre del conductor son requeridos' },
        { status: 400 }
      );
    }

    if (!body.vehiculo?.placa) {
      return NextResponse.json(
        { error: 'Placa del vehículo es requerida' },
        { status: 400 }
      );
    }

    if (!body.aceptoPoliticas || !body.aceptoCookies) {
      return NextResponse.json(
        { error: 'Debe aceptar las políticas de privacidad y el uso de cookies' },
        { status: 400 }
      );
    }

    // 1. Upsert del conductor en la base de conductores (incluye datos GPS)
    const conductorResult = await upsertConductor({
      ...body.conductor,
      aceptoPoliticas: body.aceptoPoliticas,
      aceptoCookies: body.aceptoCookies,
      gpsNombre: body.datosGPS?.nombreGPS || '',
      gpsUsuario: body.datosGPS?.usuario || '',
      gpsPassword: body.datosGPS?.contrasena || '',
      gpsAutorizacion: body.datosGPS?.autorizacionMonitoreo || false,
    });

    // 2. Obtener información de auditoría
    const forwarded = request.headers.get('x-forwarded-for');
    const ipOrigen = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // 3. Contar items que no cumplen
    const itemsNoCumplen = Object.values(body.itemsVerificacion || {}).filter(
      (item: any) => item.cumple === false
    ).length;

    // 4. Crear registro de inspección
    const inspeccionConfig = getInspeccionesConfig();
    
    const inspeccionFields: Record<string, any> = {
      // Formato
      [INSPECCION_PREOP_FIELDS.FECHA_INSPECCION]: new Date().toISOString().split('T')[0],
      [INSPECCION_PREOP_FIELDS.CODIGO_FORMATO]: body.infoFormato?.codigo || 'HSEQ-FOR-065',
      [INSPECCION_PREOP_FIELDS.VERSION_FORMATO]: body.infoFormato?.version || '002',
      
      // Conductor (datos adicionales se guardan en tabla Conductores)
      [INSPECCION_PREOP_FIELDS.CONDUCTOR_CEDULA]: body.conductor.cedula,
      [INSPECCION_PREOP_FIELDS.CONDUCTOR_NOMBRE]: body.conductor.nombreCompleto,
      [INSPECCION_PREOP_FIELDS.CONDUCTOR_TELEFONO]: body.conductor.telefono || '',
      [INSPECCION_PREOP_FIELDS.CONDUCTOR_EMAIL]: body.conductor.email || '',
      
      // GPS (encriptado para proteger datos sensibles)
      [INSPECCION_PREOP_FIELDS.GPS_NOMBRE]: body.datosGPS?.nombreGPS || '',
      [INSPECCION_PREOP_FIELDS.GPS_USUARIO]: body.datosGPS?.usuario ? encrypt(body.datosGPS.usuario) : '',
      [INSPECCION_PREOP_FIELDS.GPS_PASSWORD]: body.datosGPS?.contrasena ? encrypt(body.datosGPS.contrasena) : '',
      [INSPECCION_PREOP_FIELDS.GPS_AUTORIZACION_MONITOREO]: body.datosGPS?.autorizacionMonitoreo || false,
      
      // Vehículo
      [INSPECCION_PREOP_FIELDS.VEHICULO_PLACA]: body.vehiculo.placa,
      [INSPECCION_PREOP_FIELDS.VEHICULO_MARCA]: body.vehiculo.marca || '',
      [INSPECCION_PREOP_FIELDS.VEHICULO_LINEA]: body.vehiculo.linea || '',
      [INSPECCION_PREOP_FIELDS.VEHICULO_MODELO]: body.vehiculo.modelo || '',
      [INSPECCION_PREOP_FIELDS.VEHICULO_COLOR]: body.vehiculo.color || '',
      [INSPECCION_PREOP_FIELDS.TARJETA_PROPIEDAD]: body.vehiculo.tarjetaPropiedad || '',
      
      // Remolque
      [INSPECCION_PREOP_FIELDS.REMOLQUE_PLACA]: body.remolque?.placa || '',
      [INSPECCION_PREOP_FIELDS.REMOLQUE_MARCA]: body.remolque?.marca || '',
      [INSPECCION_PREOP_FIELDS.REMOLQUE_CLASE]: body.remolque?.clase || '',
      [INSPECCION_PREOP_FIELDS.REMOLQUE_MODELO]: body.remolque?.modelo || '',
      
      // Documentos
      [INSPECCION_PREOP_FIELDS.SOAT_CUMPLE]: body.documentos?.soatCumple || false,
      [INSPECCION_PREOP_FIELDS.SOAT_VENCIMIENTO]: body.documentos?.soatVencimiento || undefined,
      [INSPECCION_PREOP_FIELDS.RTM_CUMPLE]: body.documentos?.revisionCumple || false,
      [INSPECCION_PREOP_FIELDS.RTM_VENCIMIENTO]: body.documentos?.revisionVencimiento || undefined,
      [INSPECCION_PREOP_FIELDS.POLIZA_CUMPLE]: body.documentos?.polizaCumple || false,
      [INSPECCION_PREOP_FIELDS.POLIZA_VENCIMIENTO]: body.documentos?.polizaVencimiento || undefined,
      [INSPECCION_PREOP_FIELDS.LICENCIA_CUMPLE]: body.documentos?.licenciaCumple || false,
      [INSPECCION_PREOP_FIELDS.CATEGORIAS_LICENCIA]: JSON.stringify(body.documentos?.categoriasLicencia || []),
      [INSPECCION_PREOP_FIELDS.VIGENCIAS_LICENCIA]: JSON.stringify(body.documentos?.vigenciasLicencia || {}),
      
      // Condiciones
      [INSPECCION_PREOP_FIELDS.HORAS_DORMIR]: body.horasDormir ? parseFloat(body.horasDormir) : undefined,
      [INSPECCION_PREOP_FIELDS.KILOMETRAJE_INICIAL]: body.kilometrajeInicial ? parseFloat(body.kilometrajeInicial) : undefined,
      [INSPECCION_PREOP_FIELDS.ITEMS_VERIFICACION]: JSON.stringify(body.itemsVerificacion || {}),
      [INSPECCION_PREOP_FIELDS.ITEMS_NO_CUMPLEN]: itemsNoCumplen,
      
      // Consentimiento
      [INSPECCION_PREOP_FIELDS.ACEPTO_POLITICAS]: body.aceptoPoliticas || false,
      [INSPECCION_PREOP_FIELDS.ACEPTO_COOKIES]: body.aceptoCookies || false,
      
      // Referencia al conductor en base Conductores Core (Codigo Conductor: EQX-CON-XXXX)
      [INSPECCION_PREOP_FIELDS.ID_CONDUCTOR]: conductorResult.codigoConductor,
      
      // Auditoría
      [INSPECCION_PREOP_FIELDS.IP_ORIGEN]: ipOrigen,
      [INSPECCION_PREOP_FIELDS.USER_AGENT]: userAgent,
    };

    // Limpiar campos undefined
    Object.keys(inspeccionFields).forEach(key => {
      if (inspeccionFields[key] === undefined) {
        delete inspeccionFields[key];
      }
    });

    const inspeccionResult = await createAirtableRecord(
      inspeccionConfig.BASE_ID,
      TABLES.INSPECCIONES_PREOPERACIONALES.NAME,
      inspeccionConfig.API_KEY,
      inspeccionFields
    );

    const codigoInspeccion = inspeccionResult.fields?.['Codigo Inspeccion'] || 'INSPEC-XXXX';

    // 5. Generar PDF de la inspección
    let pdfUrl = '';
    try {
      const pdfData = {
        codigoInspeccion,
        fecha: new Date().toISOString().split('T')[0],
        codigoFormato: body.infoFormato?.codigo || 'HSEQ-FOR-065',
        versionFormato: body.infoFormato?.version || '002',
        conductor: body.conductor,
        vehiculo: body.vehiculo,
        remolque: body.remolque || {},
        documentos: {
          soatCumple: body.documentos?.soatCumple || false,
          soatVencimiento: body.documentos?.soatVencimiento || '',
          revisionCumple: body.documentos?.revisionCumple || false,
          revisionVencimiento: body.documentos?.revisionVencimiento || '',
          polizaCumple: body.documentos?.polizaCumple || false,
          polizaVencimiento: body.documentos?.polizaVencimiento || '',
          licenciaCumple: body.documentos?.licenciaCumple || false,
          categoriasLicencia: body.documentos?.categoriasLicencia || [],
          vigenciasLicencia: body.documentos?.vigenciasLicencia || {},
        },
        datosGPS: {
          nombreGPS: body.datosGPS?.nombreGPS || '',
          usuario: body.datosGPS?.usuario || '',
          autorizacionMonitoreo: body.datosGPS?.autorizacionMonitoreo || false,
        },
        horasDormir: body.horasDormir || '0',
        kilometrajeInicial: body.kilometrajeInicial || '0',
        itemsVerificacion: body.itemsVerificacion || {},
        itemsNoCumplen,
        firmaConductor: body.firmaConductor || '',
        idConductor: conductorResult.codigoConductor,
        ipOrigen,
      };

      const pdfBuffer = await generatePreoperacionalPDF(pdfData);

      // 6. Subir PDF a Cloudinary
      const fileName = `${codigoInspeccion}_${body.conductor.cedula}_${new Date().toISOString().split('T')[0]}`;
      const cloudinaryResult = await uploadPDFToCloudinary(pdfBuffer, fileName);
      pdfUrl = cloudinaryResult.secure_url;

      // 7. Actualizar registro de inspección con el PDF y estado
      console.log(`📎 Adjuntando PDF a Airtable record ${inspeccionResult.id}...`);
      console.log(`   URL: ${pdfUrl}`);
      console.log(`   Campo: ${INSPECCION_PREOP_FIELDS.DOC_PREOPERACIONAL}`);
      
      const updateResult = await updateAirtableRecord(
        inspeccionConfig.BASE_ID,
        TABLES.INSPECCIONES_PREOPERACIONALES.NAME,
        inspeccionConfig.API_KEY,
        inspeccionResult.id,
        {
          [INSPECCION_PREOP_FIELDS.DOC_PREOPERACIONAL]: [{ url: pdfUrl, filename: `${fileName}.pdf` }],
          [INSPECCION_PREOP_FIELDS.ESTADO_PREOPERACIONAL]: 'Solicitado',
        }
      );

      console.log(`✅ PDF generado y subido: ${pdfUrl}`);
      console.log(`✅ Airtable actualizado:`, JSON.stringify(updateResult?.fields?.['Doc Preoperacional'] || updateResult?.fields?.['Estado Preoperacional'] || 'OK'));
    } catch (pdfError) {
      console.error('⚠️ Error generando/subiendo PDF (la inspección se registró correctamente):', pdfError);
      // No fallar la inspección si el PDF falla - se puede regenerar después
    }

    return NextResponse.json({
      success: true,
      message: 'Inspección preoperacional registrada correctamente',
      data: {
        inspeccionId: inspeccionResult.id,
        codigoInspeccion,
        conductorAction: conductorResult.action,
        pdfUrl: pdfUrl || undefined,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear inspección preoperacional:', error);
    return NextResponse.json(
      { error: 'Error al registrar la inspección. Intente nuevamente.' },
      { status: 500 }
    );
  }
}

// ===========================================
// GET - Listar inspecciones (requiere auth)
// ===========================================

export async function GET(request: NextRequest) {
  try {
    const config = getInspeccionesConfig();
    
    const data = await fetchAirtable(
      config.BASE_ID,
      TABLES.INSPECCIONES_PREOPERACIONALES.NAME,
      config.API_KEY,
      { maxRecords: '100', 'sort[0][field]': 'Fecha Creacion', 'sort[0][direction]': 'desc' }
    );

    const inspecciones = data.records.map((record: any) => ({
      id: record.id,
      createdAt: record.createdTime,
      ...record.fields,
    }));

    return NextResponse.json(inspecciones);
  } catch (error) {
    console.error('Error al obtener inspecciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener inspecciones' },
      { status: 500 }
    );
  }
}
