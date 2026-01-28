import { NextRequest, NextResponse } from 'next/server';
import { TABLES, INSPECCION_FIELDS } from '@/lib/airtable-config';
import { getAirtableConfig } from '@/lib/airtable-config';
import { verifyToken } from '@/lib/jwt';
import { applyRateLimit } from '@/lib/rate-limit';
import cookie from 'cookie';

// Función auxiliar para fetch a Airtable
async function fetchAirtable(tableName: string, params?: Record<string, string>) {
  const config = getAirtableConfig();
  let url = `${config.BASE_URL}/${config.BASE_ID}/${encodeURIComponent(tableName)}`;
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${config.API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Airtable error: ${response.status}`);
  }

  return response.json();
}

// Función para crear registro en Airtable
async function createAirtableRecord(tableName: string, fields: Record<string, any>) {
  const config = getAirtableConfig();
  const url = `${config.BASE_URL}/${config.BASE_ID}/${encodeURIComponent(tableName)}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Airtable error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = applyRateLimit(request, {
      maxRequests: 30,
      windowMs: 60 * 1000, // 30 requests por minuto
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { 
          status: rateLimitResult.status,
          headers: { 'Retry-After': String(rateLimitResult.retryAfter) }
        }
      );
    }

    // Verificar autenticación (token cookie)
    const headerCookie = request.headers.get('cookie') || '';
    const parsed = cookie.parse(headerCookie || '');
    const token = parsed.token;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Consultar desde Airtable
    const data = await fetchAirtable(TABLES.INSPECCIONES.NAME, { maxRecords: '50' });

    // Formatear los datos de Airtable
    const inspeccionesFormateadas = data.records.map((record: any) => ({
      id: record.id,
      ...record.fields,
    }));

    return NextResponse.json(inspeccionesFormateadas);
  } catch (error) {
    console.error('Error fetching inspecciones:', error);
    // ⚠️ SEGURIDAD: No exponer detalles del error en producción
    return NextResponse.json(
      { error: 'Error al obtener inspecciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = applyRateLimit(request, {
      maxRequests: 10,
      windowMs: 60 * 1000, // 10 requests por minuto para POST
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { 
          status: rateLimitResult.status,
          headers: { 'Retry-After': String(rateLimitResult.retryAfter) }
        }
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

    // Validación básica de campos requeridos
    if (!body.placaVehiculo || !body.nombreConductor) {
      return NextResponse.json(
        { error: 'Campos requeridos: placaVehiculo, nombreConductor' },
        { status: 400 }
      );
    }

    // Preparar los campos para Airtable
    const fields: Record<string, any> = {
      // Información del formato
      [INSPECCION_FIELDS.CODIGO_FORMATO]: body.infoFormato?.codigo || 'TR-FOR-009',
      [INSPECCION_FIELDS.VERSION_FORMATO]: body.infoFormato?.version || '004',
      [INSPECCION_FIELDS.FECHA_EDICION_FORMATO]: body.infoFormato?.fechaEdicion || '25 de Abril 2023',
      [INSPECCION_FIELDS.FECHA_INSPECCION]: body.fechaInspeccion || new Date().toISOString(),
      
      // Documentos
      [INSPECCION_FIELDS.SOAT_CUMPLE]: body.soatCumple ?? false,
      [INSPECCION_FIELDS.SOAT_VENCIMIENTO]: body.soatVencimiento || '',
      [INSPECCION_FIELDS.SOAT_OBSERVACION]: body.soatObservacion || '',
      [INSPECCION_FIELDS.REVISION_TECNICA_CUMPLE]: body.revisionTecnicaCumple ?? false,
      [INSPECCION_FIELDS.REVISION_TECNICA_VENCIMIENTO]: body.revisionTecnicaVencimiento || '',
      [INSPECCION_FIELDS.REVISION_TECNICA_OBSERVACION]: body.revisionTecnicaObservacion || '',
      [INSPECCION_FIELDS.POLIZA_CUMPLE]: body.polizaCumple ?? false,
      [INSPECCION_FIELDS.POLIZA_VENCIMIENTO]: body.polizaVencimiento || '',
      [INSPECCION_FIELDS.POLIZA_OBSERVACION]: body.polizaObservacion || '',
      [INSPECCION_FIELDS.LICENCIA_CUMPLE]: body.licenciaCumple ?? false,
      [INSPECCION_FIELDS.LICENCIA_VENCIMIENTO]: body.licenciaVencimiento || '',
      [INSPECCION_FIELDS.LICENCIA_OBSERVACION]: body.licenciaObservacion || '',
      
      // Categorías de licencia (como JSON string)
      [INSPECCION_FIELDS.CATEGORIAS_LICENCIA]: JSON.stringify(body.categoriasLicencia || []),
      [INSPECCION_FIELDS.VIGENCIAS_LICENCIA]: JSON.stringify(body.vigenciasLicencia || {}),
      
      // Conductor
      [INSPECCION_FIELDS.NOMBRE_CONDUCTOR]: body.nombreConductor || '',
      [INSPECCION_FIELDS.CEDULA]: body.cedula || '',
      [INSPECCION_FIELDS.EDAD]: body.edad ? parseInt(body.edad) : null,
      [INSPECCION_FIELDS.ARL]: body.arl || '',
      [INSPECCION_FIELDS.EPS]: body.eps || '',
      [INSPECCION_FIELDS.FONDO_PENSION]: body.fondoPension || '',
      [INSPECCION_FIELDS.RH]: body.rh || '',
      
      // Vehículo
      [INSPECCION_FIELDS.PLACA_VEHICULO]: body.placaVehiculo || '',
      [INSPECCION_FIELDS.MARCA_VEHICULO]: body.marcaVehiculo || '',
      [INSPECCION_FIELDS.LINEA_VEHICULO]: body.lineaVehiculo || '',
      [INSPECCION_FIELDS.MODELO_VEHICULO]: body.modeloVehiculo || '',
      [INSPECCION_FIELDS.COLOR_VEHICULO]: body.colorVehiculo || '',
      [INSPECCION_FIELDS.TARJETA_PROPIEDAD]: body.tarjetaPropiedad || '',
      
      // Remolque
      [INSPECCION_FIELDS.PLACA_REMOLQUE]: body.placaRemolque || '',
      [INSPECCION_FIELDS.MARCA_REMOLQUE]: body.marcaRemolque || '',
      [INSPECCION_FIELDS.CLASE_REMOLQUE]: body.claseRemolque || '',
      [INSPECCION_FIELDS.MODELO_REMOLQUE]: body.modeloRemolque || '',
      
      // Horas dormir
      [INSPECCION_FIELDS.HORAS_DORMIR]: body.horasDormir ? parseInt(body.horasDormir) : 8,
      
      // Items de verificación (como JSON string)
      [INSPECCION_FIELDS.ITEMS_VERIFICACION]: JSON.stringify(body.itemsVerificacion || {}),
      
      // Condiciones adicionales
      [INSPECCION_FIELDS.DESINFECCION]: body.desinfeccion ?? false,
      [INSPECCION_FIELDS.DESCANSO]: body.descanso ?? false,
      
      // Salud del conductor
      [INSPECCION_FIELDS.TOMA_MEDICACION]: body.tomaMedicacion ?? false,
      [INSPECCION_FIELDS.ANSIEDAD_ESTRES]: body.ansiedadEstres ?? false,
      [INSPECCION_FIELDS.PROBLEMAS_VISUALES]: body.problemasVisuales ?? false,
      [INSPECCION_FIELDS.ESTADO_SALUD]: body.estadoSalud ?? false,
      
      // Firmas
      [INSPECCION_FIELDS.CEDULA_FIRMA_CONDUCTOR]: body.cedulaFirmaConductor || '',
      [INSPECCION_FIELDS.CEDULA_FIRMA_HSEQ]: body.cedulaFirmaHSEQ || '',
      
      // Estado
      [INSPECCION_FIELDS.ESTADO_INSPECCION]: 'Completada',
    };

    // Crear el registro en Airtable
    const result = await createAirtableRecord(TABLES.INSPECCIONES.NAME, fields);

    return NextResponse.json({
      success: true,
      message: 'Inspección guardada correctamente',
      id: result.id,
    });
  } catch (error) {
    console.error('Error saving inspeccion:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al guardar la inspección' },
      { status: 500 }
    );
  }
}
