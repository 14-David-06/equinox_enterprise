import { NextRequest, NextResponse } from 'next/server';
import { getInspeccionVehicularConfig, INSPECCION_VEHICULAR_FIELDS } from '@/lib/airtable-config';

// ===========================================
// FUNCIONES AUXILIARES PARA AIRTABLE
// ===========================================

async function createAirtableRecord(baseId: string, tableName: string, apiKey: string, fields: Record<string, unknown>) {
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
    console.error('Airtable error details:', errorData);
    throw new Error(`Airtable error: ${response.status} - ${errorData?.error?.message || 'Unknown'}`);
  }

  return response.json();
}

// Mapeo de IDs de items a nombres de campos en Airtable
const ITEM_FIELD_MAP: Record<number, { cumple: string; obs: string }> = {
  1: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_01_EXTINTOR, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_01_OBS },
  2: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_02_EQUIPO_CARRETERA, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_02_OBS },
  3: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_03_BOTIQUIN, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_03_OBS },
  4: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_04_CINTURONES, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_04_OBS },
  5: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_05_BOCINA, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_05_OBS },
  6: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_06_LUCES, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_06_OBS },
  7: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_07_ESPEJOS, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_07_OBS },
  8: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_08_RETROVISORES, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_08_OBS },
  9: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_09_SENALIZACION, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_09_OBS },
  10: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_10_TANQUE, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_10_OBS },
  11: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_11_TAPA_TANQUE, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_11_OBS },
  12: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_12_CABINA, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_12_OBS },
  13: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_13_LLANTAS, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_13_OBS },
  14: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_14_LLANTA_REPUESTO, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_14_OBS },
  15: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_15_RINES, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_15_OBS },
  16: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_16_FRENOS, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_16_OBS },
  17: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_17_FRENO_MANO, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_17_OBS },
  18: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_18_DIRECCION, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_18_OBS },
  19: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_19_MOTOR, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_19_OBS },
  20: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_20_FLUIDOS, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_20_OBS },
  21: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_21_SUSPENSION, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_21_OBS },
  22: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_22_LUCES_FUNC, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_22_OBS },
  23: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_23_FUGAS, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_23_OBS },
  24: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_24_HERRAMIENTAS, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_24_OBS },
  25: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_25_ANCLAJE, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_25_OBS },
  26: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_26_CABLE_ACERO, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_26_OBS },
  27: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_27_ESPEJOS_EST, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_27_OBS },
  28: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_28_TORQUE, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_28_OBS },
  29: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_29_CAJA_CAMBIOS, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_29_OBS },
  30: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_30_AMORTIGUADORES, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_30_OBS },
  31: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_31_COMP_SUSPENSION, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_31_OBS },
  32: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_32_REFRIGERANTE, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_32_OBS },
  33: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_33_MANGUERAS, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_33_OBS },
  34: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_34_FRENOS_EMERG, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_34_OBS },
  35: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_35_BATERIA, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_35_OBS },
  36: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_36_LUBRICACION, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_36_OBS },
  37: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_37_ESCAPE, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_37_OBS },
  38: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_38_CORREAS, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_38_OBS },
  39: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_39_LIMPIEZA, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_39_OBS },
  40: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_40_DESCANSO, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_40_OBS },
  41: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_41_TRATAMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_41_OBS },
  42: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_42_ANSIEDAD, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_42_OBS },
  43: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_43_NEUROLOGICO, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_43_OBS },
  44: { cumple: INSPECCION_VEHICULAR_FIELDS.ITEM_44_CONDICIONES_SALUD, obs: INSPECCION_VEHICULAR_FIELDS.ITEM_44_OBS },
};

// ===========================================
// POST - Crear nueva inspección vehicular
// ===========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config = getInspeccionVehicularConfig();

    if (!config.API_KEY || !config.BASE_ID) {
      return NextResponse.json(
        { error: 'Configuración de Airtable no encontrada' },
        { status: 500 }
      );
    }

    // Extraer datos del body
    const {
      conductor,
      vehiculo,
      remolque,
      documentos,
      condiciones,
      itemsVerificacion,
      firma,
      observacionesGenerales
    } = body;

    // Calcular totales
    let totalCumple = 0;
    let totalNoCumple = 0;
    
    // Preparar campos de inspección
    const fields: Record<string, unknown> = {
      // Metadatos del formato
      [INSPECCION_VEHICULAR_FIELDS.FECHA_INSPECCION]: new Date().toISOString().split('T')[0],
      [INSPECCION_VEHICULAR_FIELDS.CODIGO_FORMATO]: 'HSEQ-FOR-065',
      [INSPECCION_VEHICULAR_FIELDS.VERSION_FORMATO]: '001',
      
      // Conductor
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_CEDULA]: conductor?.cedula || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_NOMBRE]: conductor?.nombre || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_EDAD]: conductor?.edad?.toString() || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_EPS]: conductor?.eps || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_ARL]: conductor?.arl || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_FONDO_PENSION]: conductor?.fondoPension || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_RH]: conductor?.rh || '',
      
      // Vehículo
      [INSPECCION_VEHICULAR_FIELDS.VEHICULO_PLACA]: vehiculo?.placa || '',
      [INSPECCION_VEHICULAR_FIELDS.VEHICULO_MARCA]: vehiculo?.marca || '',
      [INSPECCION_VEHICULAR_FIELDS.VEHICULO_LINEA]: vehiculo?.linea || '',
      [INSPECCION_VEHICULAR_FIELDS.VEHICULO_MODELO]: vehiculo?.modelo || '',
      
      // Remolque
      [INSPECCION_VEHICULAR_FIELDS.REMOLQUE_PLACA]: remolque?.placa || '',
      [INSPECCION_VEHICULAR_FIELDS.REMOLQUE_MARCA]: remolque?.marca || '',
      [INSPECCION_VEHICULAR_FIELDS.REMOLQUE_CLASE]: remolque?.clase || '',
      [INSPECCION_VEHICULAR_FIELDS.REMOLQUE_MODELO]: remolque?.modelo || '',
      
      // Documentos
      [INSPECCION_VEHICULAR_FIELDS.SOAT_CUMPLE]: documentos?.soat?.cumple ? 'Sí' : 'No',
      [INSPECCION_VEHICULAR_FIELDS.SOAT_VENCIMIENTO]: documentos?.soat?.vencimiento || '',
      [INSPECCION_VEHICULAR_FIELDS.RTM_CUMPLE]: documentos?.rtm?.cumple ? 'Sí' : 'No',
      [INSPECCION_VEHICULAR_FIELDS.RTM_VENCIMIENTO]: documentos?.rtm?.vencimiento || '',
      [INSPECCION_VEHICULAR_FIELDS.POLIZA_CUMPLE]: documentos?.poliza?.cumple ? 'Sí' : 'No',
      [INSPECCION_VEHICULAR_FIELDS.POLIZA_VENCIMIENTO]: documentos?.poliza?.vencimiento || '',
      [INSPECCION_VEHICULAR_FIELDS.LICENCIA_CUMPLE]: documentos?.licencia?.cumple ? 'Sí' : 'No',
      [INSPECCION_VEHICULAR_FIELDS.CATEGORIAS_LICENCIA]: documentos?.licencia?.categorias?.join(', ') || '',
      [INSPECCION_VEHICULAR_FIELDS.VIGENCIAS_LICENCIA]: JSON.stringify(documentos?.licencia?.vigencias || {}),
      
      // Condiciones operativas
      [INSPECCION_VEHICULAR_FIELDS.HORAS_DORMIR]: condiciones?.horasDormir?.toString() || '',
      [INSPECCION_VEHICULAR_FIELDS.KILOMETRAJE_INICIAL]: condiciones?.kilometrajeInicial?.toString() || '',
      
      // Estado
      [INSPECCION_VEHICULAR_FIELDS.ESTADO_INSPECCION]: 'Pendiente',
      [INSPECCION_VEHICULAR_FIELDS.OBSERVACIONES_GENERALES]: observacionesGenerales || '',
      
      // Firma (base64 o URL)
      [INSPECCION_VEHICULAR_FIELDS.FIRMA_CONDUCTOR]: firma || '',
    };

    // Procesar items de verificación
    if (itemsVerificacion && typeof itemsVerificacion === 'object') {
      Object.entries(itemsVerificacion).forEach(([itemId, data]) => {
        const id = parseInt(itemId);
        const itemData = data as { cumple?: boolean | null; observacion?: string };
        const fieldMap = ITEM_FIELD_MAP[id];
        
        if (fieldMap) {
          // Determinar el valor de cumplimiento
          let cumpleValue: string;
          if (itemData.cumple === true) {
            cumpleValue = 'Cumple';
            totalCumple++;
          } else if (itemData.cumple === false) {
            cumpleValue = 'No Cumple';
            totalNoCumple++;
          } else {
            cumpleValue = 'N/A';
          }
          
          fields[fieldMap.cumple] = cumpleValue;
          fields[fieldMap.obs] = itemData.observacion || '';
        }
      });
    }

    // Agregar totales y porcentaje
    const totalItems = totalCumple + totalNoCumple;
    const porcentaje = totalItems > 0 ? ((totalCumple / totalItems) * 100).toFixed(2) : '0';
    
    fields[INSPECCION_VEHICULAR_FIELDS.TOTAL_ITEMS_CUMPLE] = totalCumple.toString();
    fields[INSPECCION_VEHICULAR_FIELDS.TOTAL_ITEMS_NO_CUMPLE] = totalNoCumple.toString();
    fields[INSPECCION_VEHICULAR_FIELDS.PORCENTAJE_CUMPLIMIENTO] = `${porcentaje}%`;

    // Limpiar campos vacíos para evitar errores en Airtable
    Object.keys(fields).forEach(key => {
      if (fields[key] === '' || fields[key] === undefined || fields[key] === null) {
        delete fields[key];
      }
    });

    console.log('Creating inspection record with fields:', Object.keys(fields).length);
    
    // Crear registro en Airtable
    const result = await createAirtableRecord(
      config.BASE_ID,
      config.TABLE_NAME,
      config.API_KEY,
      fields
    );

    return NextResponse.json({
      success: true,
      message: 'Inspección vehicular registrada correctamente',
      data: {
        recordId: result.id,
        codigoInspeccion: result.fields?.['Codigo Inspeccion'] || result.id,
        totalCumple,
        totalNoCumple,
        porcentajeCumplimiento: porcentaje,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando inspección vehicular:', error);
    return NextResponse.json(
      { 
        error: 'Error al registrar la inspección',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ===========================================
// GET - Obtener inspecciones (opcional, para consultas)
// ===========================================

export async function GET(request: NextRequest) {
  try {
    const config = getInspeccionVehicularConfig();
    const { searchParams } = new URL(request.url);
    const cedula = searchParams.get('cedula');
    const placa = searchParams.get('placa');

    if (!config.API_KEY || !config.BASE_ID) {
      return NextResponse.json(
        { error: 'Configuración de Airtable no encontrada' },
        { status: 500 }
      );
    }

    let filterFormula = '';
    if (cedula) {
      filterFormula = `{${INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_CEDULA}} = '${cedula}'`;
    } else if (placa) {
      filterFormula = `{${INSPECCION_VEHICULAR_FIELDS.VEHICULO_PLACA}} = '${placa}'`;
    }

    const params: Record<string, string> = {
      maxRecords: '100',
    };
    
    if (filterFormula) {
      params.filterByFormula = filterFormula;
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.airtable.com/v0/${config.BASE_ID}/${encodeURIComponent(config.TABLE_NAME)}?${queryString}`;

    console.log('Fetching vehicular inspections from:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Airtable error response:', errorBody);
      throw new Error(`Airtable error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    
    console.log(`Found ${data.records?.length || 0} vehicular inspections`);
    
    return NextResponse.json({
      success: true,
      records: data.records || [],
    });

  } catch (error) {
    console.error('Error obteniendo inspecciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener inspecciones' },
      { status: 500 }
    );
  }
}
