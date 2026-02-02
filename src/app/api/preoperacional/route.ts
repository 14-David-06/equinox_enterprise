import { NextRequest, NextResponse } from 'next/server';
import { getInspeccionesConfig, getConductoresConfig, TABLES, INSPECCION_PREOP_FIELDS, CONDUCTOR_FIELDS } from '@/lib/airtable-config';

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

async function upsertConductor(conductorData: any) {
  const config = getConductoresConfig();
  
  // Buscar conductor por cédula
  const filterFormula = `{${CONDUCTOR_FIELDS.CEDULA}} = '${conductorData.cedula}'`;
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
    const updateUrl = `https://api.airtable.com/v0/${config.BASE_ID}/${TABLES.CONDUCTORES.NAME}/${recordId}`;
    
    await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${config.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: conductorFields, typecast: true }),
    });
    
    return { action: 'updated', recordId };
  } else {
    // Crear nuevo conductor
    const createResponse = await createAirtableRecord(
      config.BASE_ID,
      TABLES.CONDUCTORES.NAME,
      config.API_KEY,
      conductorFields
    );
    
    return { action: 'created', recordId: createResponse.id };
  }
}

// ===========================================
// POST - Crear nueva inspección preoperacional
// ===========================================

export async function POST(request: NextRequest) {
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

    // 1. Upsert del conductor en la base de conductores
    const conductorResult = await upsertConductor({
      ...body.conductor,
      aceptoPoliticas: body.aceptoPoliticas,
      aceptoCookies: body.aceptoCookies,
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
      
      // Conductor
      [INSPECCION_PREOP_FIELDS.CONDUCTOR_CEDULA]: body.conductor.cedula,
      [INSPECCION_PREOP_FIELDS.CONDUCTOR_NOMBRE]: body.conductor.nombreCompleto,
      [INSPECCION_PREOP_FIELDS.CONDUCTOR_TELEFONO]: body.conductor.telefono || '',
      [INSPECCION_PREOP_FIELDS.CONDUCTOR_EMAIL]: body.conductor.email || '',
      
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
      
      // GPS
      [INSPECCION_PREOP_FIELDS.GPS_NOMBRE]: body.datosGPS?.nombreGPS || '',
      [INSPECCION_PREOP_FIELDS.GPS_USUARIO]: body.datosGPS?.usuario || '',
      [INSPECCION_PREOP_FIELDS.GPS_AUTORIZACION]: body.datosGPS?.autorizacionMonitoreo || false,
      
      // Condiciones
      [INSPECCION_PREOP_FIELDS.HORAS_DORMIR]: body.horasDormir ? parseFloat(body.horasDormir) : undefined,
      [INSPECCION_PREOP_FIELDS.KILOMETRAJE_INICIAL]: body.kilometrajeInicial ? parseFloat(body.kilometrajeInicial) : undefined,
      [INSPECCION_PREOP_FIELDS.ITEMS_VERIFICACION]: JSON.stringify(body.itemsVerificacion || {}),
      [INSPECCION_PREOP_FIELDS.ITEMS_NO_CUMPLEN]: itemsNoCumplen,
      
      // Firma y consentimiento
      [INSPECCION_PREOP_FIELDS.FIRMA_CONDUCTOR]: body.firmaConductor || '',
      [INSPECCION_PREOP_FIELDS.ACEPTO_POLITICAS]: body.aceptoPoliticas || false,
      [INSPECCION_PREOP_FIELDS.ACEPTO_COOKIES]: body.aceptoCookies || false,
      
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

    return NextResponse.json({
      success: true,
      message: 'Inspección preoperacional registrada correctamente',
      data: {
        inspeccionId: inspeccionResult.id,
        codigoInspeccion: inspeccionResult.fields?.['Codigo Inspeccion'],
        conductorAction: conductorResult.action,
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
