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

// Mapeo de IDs de items a nombres de campos en Airtable (inspección preoperacional)
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

// Mapeo de IDs de Kit de Derrame a campos en Airtable
const KIT_DERRAME_FIELD_MAP: Record<number, { estado: string; obs: string }> = {
  1: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_01_PANOS_ABSORBENTES, obs: INSPECCION_VEHICULAR_FIELDS.KIT_01_OBS },
  2: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_02_BARRERA_ABSORBENTE, obs: INSPECCION_VEHICULAR_FIELDS.KIT_02_OBS },
  3: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_03_TRAJE_DESECHABLE, obs: INSPECCION_VEHICULAR_FIELDS.KIT_03_OBS },
  4: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_04_BOLSA_ROJA, obs: INSPECCION_VEHICULAR_FIELDS.KIT_04_OBS },
  5: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_05_PALA_PLASTICA, obs: INSPECCION_VEHICULAR_FIELDS.KIT_05_OBS },
  6: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_06_ESPATULA, obs: INSPECCION_VEHICULAR_FIELDS.KIT_06_OBS },
  7: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_07_GUANTES_NITRILO, obs: INSPECCION_VEHICULAR_FIELDS.KIT_07_OBS },
  8: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_08_GAFAS_SEGURIDAD, obs: INSPECCION_VEHICULAR_FIELDS.KIT_08_OBS },
  9: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_09_CINTA_PELIGRO, obs: INSPECCION_VEHICULAR_FIELDS.KIT_09_OBS },
  10: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_10_MARTILLO_GOMA, obs: INSPECCION_VEHICULAR_FIELDS.KIT_10_OBS },
  11: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_11_RECOGEDOR, obs: INSPECCION_VEHICULAR_FIELDS.KIT_11_OBS },
  12: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_12_RESPIRADOR, obs: INSPECCION_VEHICULAR_FIELDS.KIT_12_OBS },
  13: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_13_LINTERNA, obs: INSPECCION_VEHICULAR_FIELDS.KIT_13_OBS },
  14: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_14_GRANULADO, obs: INSPECCION_VEHICULAR_FIELDS.KIT_14_OBS },
  15: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_15_MASILLA, obs: INSPECCION_VEHICULAR_FIELDS.KIT_15_OBS },
  16: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_16_DESENGRASANTE, obs: INSPECCION_VEHICULAR_FIELDS.KIT_16_OBS },
  17: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_17_CHALECO, obs: INSPECCION_VEHICULAR_FIELDS.KIT_17_OBS },
  18: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_18_CONOS, obs: INSPECCION_VEHICULAR_FIELDS.KIT_18_OBS },
  19: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_19_PROCEDIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.KIT_19_OBS },
  20: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_20_ALMACENAMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.KIT_20_OBS },
  21: { estado: INSPECCION_VEHICULAR_FIELDS.KIT_21_ROTULADO, obs: INSPECCION_VEHICULAR_FIELDS.KIT_21_OBS },
};

// Mapeo de IDs de Botiquín a campos en Airtable
const BOTIQUIN_FIELD_MAP: Record<number, { estado: string; cantidad: string; vencimiento?: string; obs: string }> = {
  22: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_22_GASAS, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_22_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_22_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_22_OBS },
  23: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_23_ESPARADRAPO, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_23_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_23_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_23_OBS },
  24: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_24_BAJALENGUAS, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_24_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_24_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_24_OBS },
  25: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_25_GUANTES_LATEX, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_25_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_25_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_25_OBS },
  26: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_26_APLICADORES, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_26_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_26_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_26_OBS },
  27: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_27_VENDA_2X5, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_27_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_27_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_27_OBS },
  28: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_28_VENDA_3X5, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_28_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_28_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_28_OBS },
  29: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_29_VENDA_5X5, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_29_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_29_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_29_OBS },
  30: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_30_VENDA_ALG_3X5, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_30_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_30_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_30_OBS },
  31: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_31_VENDA_ALG_5X5, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_31_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_31_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_31_OBS },
  32: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_32_YODOPOVIDONA, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_32_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_32_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_32_OBS },
  33: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_33_SOLUCION_SALINA, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_33_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_33_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_33_OBS },
  34: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_34_TAPABOCAS, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_34_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_34_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_34_OBS },
  35: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_35_ALCOHOL, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_35_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_35_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_35_OBS },
  36: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_36_CURAS, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_36_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_36_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_36_OBS },
  37: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_37_JERINGA, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_37_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_37_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_37_OBS },
  38: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_38_TIJERAS, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_38_CANTIDAD, obs: INSPECCION_VEHICULAR_FIELDS.BOT_38_OBS },
  39: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_39_PARCHE_OCULAR, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_39_CANTIDAD, vencimiento: INSPECCION_VEHICULAR_FIELDS.BOT_39_VENCIMIENTO, obs: INSPECCION_VEHICULAR_FIELDS.BOT_39_OBS },
  40: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_40_TERMOMETRO, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_40_CANTIDAD, obs: INSPECCION_VEHICULAR_FIELDS.BOT_40_OBS },
  41: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_41_LIBRETA, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_41_CANTIDAD, obs: INSPECCION_VEHICULAR_FIELDS.BOT_41_OBS },
  42: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_42_LAPICERO, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_42_CANTIDAD, obs: INSPECCION_VEHICULAR_FIELDS.BOT_42_OBS },
  43: { estado: INSPECCION_VEHICULAR_FIELDS.BOT_43_MANUAL, cantidad: INSPECCION_VEHICULAR_FIELDS.BOT_43_CANTIDAD, obs: INSPECCION_VEHICULAR_FIELDS.BOT_43_OBS },
};

// Mapeo de IDs de Extintor a campos en Airtable
const EXTINTOR_FIELD_MAP: Record<number, { estado: string; obs: string }> = {
  44: { estado: INSPECCION_VEHICULAR_FIELDS.EXT_44_PRESION, obs: INSPECCION_VEHICULAR_FIELDS.EXT_44_OBS },
  45: { estado: INSPECCION_VEHICULAR_FIELDS.EXT_45_SELLO, obs: INSPECCION_VEHICULAR_FIELDS.EXT_45_OBS },
  46: { estado: INSPECCION_VEHICULAR_FIELDS.EXT_46_MANOMETRO, obs: INSPECCION_VEHICULAR_FIELDS.EXT_46_OBS },
  47: { estado: INSPECCION_VEHICULAR_FIELDS.EXT_47_CILINDRO, obs: INSPECCION_VEHICULAR_FIELDS.EXT_47_OBS },
  48: { estado: INSPECCION_VEHICULAR_FIELDS.EXT_48_MANIJA, obs: INSPECCION_VEHICULAR_FIELDS.EXT_48_OBS },
  49: { estado: INSPECCION_VEHICULAR_FIELDS.EXT_49_BOQUILLA, obs: INSPECCION_VEHICULAR_FIELDS.EXT_49_OBS },
  50: { estado: INSPECCION_VEHICULAR_FIELDS.EXT_50_ANILLO, obs: INSPECCION_VEHICULAR_FIELDS.EXT_50_OBS },
  51: { estado: INSPECCION_VEHICULAR_FIELDS.EXT_51_PIN, obs: INSPECCION_VEHICULAR_FIELDS.EXT_51_OBS },
  52: { estado: INSPECCION_VEHICULAR_FIELDS.EXT_52_PINTURA, obs: INSPECCION_VEHICULAR_FIELDS.EXT_52_OBS },
  53: { estado: INSPECCION_VEHICULAR_FIELDS.EXT_53_TARJETA, obs: INSPECCION_VEHICULAR_FIELDS.EXT_53_OBS },
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

    // Detectar tipo de inspección
    const isKitInspection = body.kitDerrame || body.botiquin || body.extintor;

    // Extraer datos comunes del body
    const {
      conductor,
      vehiculo,
      firma,
      observacionesGenerales
    } = body;

    // Calcular totales
    let totalBueno = 0;
    let totalRegular = 0;
    let totalMalo = 0;
    let totalNoTiene = 0;
    
    // Preparar campos de inspección
    const fields: Record<string, unknown> = {
      // Metadatos del formato
      [INSPECCION_VEHICULAR_FIELDS.FECHA_INSPECCION]: new Date().toISOString().split('T')[0],
      [INSPECCION_VEHICULAR_FIELDS.CODIGO_FORMATO]: isKitInspection ? 'HSEQ-FOR-066' : 'HSEQ-FOR-065',
      [INSPECCION_VEHICULAR_FIELDS.VERSION_FORMATO]: '001',
      
      // Conductor
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_CEDULA]: conductor?.cedula || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_NOMBRE]: conductor?.nombre || '',
      
      // Vehículo
      [INSPECCION_VEHICULAR_FIELDS.VEHICULO_PLACA]: vehiculo?.placa || '',
      [INSPECCION_VEHICULAR_FIELDS.VEHICULO_MARCA]: vehiculo?.marca || '',
      [INSPECCION_VEHICULAR_FIELDS.VEHICULO_LINEA]: vehiculo?.linea || '',
      [INSPECCION_VEHICULAR_FIELDS.VEHICULO_MODELO]: vehiculo?.modelo || '',
      
      // Estado
      [INSPECCION_VEHICULAR_FIELDS.ESTADO_INSPECCION]: 'Pendiente',
      [INSPECCION_VEHICULAR_FIELDS.OBSERVACIONES_GENERALES]: observacionesGenerales || '',
      
      // Firma (base64 o URL)
      [INSPECCION_VEHICULAR_FIELDS.FIRMA_CONDUCTOR]: firma || '',
    };

    // Si es inspección de Kit de Derrame, Botiquín y Extintor
    if (isKitInspection) {
      const { kitDerrame, botiquin, extintor } = body;

      // Procesar Kit de Derrame
      if (kitDerrame && typeof kitDerrame === 'object') {
        Object.entries(kitDerrame).forEach(([itemId, data]) => {
          const id = parseInt(itemId);
          const itemData = data as { estado?: string | null; observacion?: string };
          const fieldMap = KIT_DERRAME_FIELD_MAP[id];
          
          if (fieldMap && itemData.estado) {
            fields[fieldMap.estado] = itemData.estado;
            if (itemData.observacion) {
              fields[fieldMap.obs] = itemData.observacion;
            }
            // Contar estados
            if (itemData.estado === 'B') totalBueno++;
            else if (itemData.estado === 'R') totalRegular++;
            else if (itemData.estado === 'M') totalMalo++;
            else if (itemData.estado === 'NT') totalNoTiene++;
          }
        });
      }

      // Procesar Botiquín
      if (botiquin && typeof botiquin === 'object') {
        Object.entries(botiquin).forEach(([itemId, data]) => {
          const id = parseInt(itemId);
          const itemData = data as { estado?: string | null; cantidad?: string; fechaVencimiento?: string; observacion?: string };
          const fieldMap = BOTIQUIN_FIELD_MAP[id];
          
          if (fieldMap) {
            if (itemData.estado) {
              fields[fieldMap.estado] = itemData.estado;
              // Contar estados
              if (itemData.estado === 'B') totalBueno++;
              else if (itemData.estado === 'R') totalRegular++;
              else if (itemData.estado === 'M') totalMalo++;
              else if (itemData.estado === 'NT') totalNoTiene++;
            }
            if (itemData.cantidad) {
              fields[fieldMap.cantidad] = itemData.cantidad;
            }
            if (itemData.fechaVencimiento && fieldMap.vencimiento) {
              fields[fieldMap.vencimiento] = itemData.fechaVencimiento;
            }
            if (itemData.observacion) {
              fields[fieldMap.obs] = itemData.observacion;
            }
          }
        });
      }

      // Procesar Extintor
      if (extintor && typeof extintor === 'object') {
        const { items, fechaActual, fechaProximaRecarga } = extintor as {
          items?: Record<string, { estado?: string | null; observacion?: string }>;
          fechaActual?: { dia?: string; mes?: string; ano?: string };
          fechaProximaRecarga?: { dia?: string; mes?: string; ano?: string };
        };

        // Procesar items del extintor
        if (items && typeof items === 'object') {
          Object.entries(items).forEach(([itemId, data]) => {
            const id = parseInt(itemId);
            const itemData = data as { estado?: string | null; observacion?: string };
            const fieldMap = EXTINTOR_FIELD_MAP[id];
            
            if (fieldMap && itemData.estado) {
              fields[fieldMap.estado] = itemData.estado;
              if (itemData.observacion) {
                fields[fieldMap.obs] = itemData.observacion;
              }
              // Contar estados
              if (itemData.estado === 'B') totalBueno++;
              else if (itemData.estado === 'R') totalRegular++;
              else if (itemData.estado === 'M') totalMalo++;
            }
          });
        }

        // Procesar fechas del extintor
        if (fechaActual && (fechaActual.dia || fechaActual.mes || fechaActual.ano)) {
          const fechaStr = `${fechaActual.dia || ''}/${fechaActual.mes || ''}/${fechaActual.ano || ''}`;
          fields[INSPECCION_VEHICULAR_FIELDS.EXT_FECHA_ACTUAL] = fechaStr;
        }

        if (fechaProximaRecarga && (fechaProximaRecarga.dia || fechaProximaRecarga.mes || fechaProximaRecarga.ano)) {
          const fechaStr = `${fechaProximaRecarga.dia || ''}/${fechaProximaRecarga.mes || ''}/${fechaProximaRecarga.ano || ''}`;
          fields[INSPECCION_VEHICULAR_FIELDS.EXT_FECHA_PROXIMA_RECARGA] = fechaStr;
        }
      }

    } else {
      // Inspección preoperacional tradicional
      const { remolque, documentos, condiciones, itemsVerificacion } = body;
      
      // Campos adicionales del conductor
      fields[INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_EDAD] = conductor?.edad?.toString() || '';
      fields[INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_EPS] = conductor?.eps || '';
      fields[INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_ARL] = conductor?.arl || '';
      fields[INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_FONDO_PENSION] = conductor?.fondoPension || '';
      fields[INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_RH] = conductor?.rh || '';
      
      // Remolque
      fields[INSPECCION_VEHICULAR_FIELDS.REMOLQUE_PLACA] = remolque?.placa || '';
      fields[INSPECCION_VEHICULAR_FIELDS.REMOLQUE_MARCA] = remolque?.marca || '';
      fields[INSPECCION_VEHICULAR_FIELDS.REMOLQUE_CLASE] = remolque?.clase || '';
      fields[INSPECCION_VEHICULAR_FIELDS.REMOLQUE_MODELO] = remolque?.modelo || '';
      
      // Documentos
      fields[INSPECCION_VEHICULAR_FIELDS.SOAT_CUMPLE] = documentos?.soat?.cumple ? 'Sí' : 'No';
      fields[INSPECCION_VEHICULAR_FIELDS.SOAT_VENCIMIENTO] = documentos?.soat?.vencimiento || '';
      fields[INSPECCION_VEHICULAR_FIELDS.RTM_CUMPLE] = documentos?.rtm?.cumple ? 'Sí' : 'No';
      fields[INSPECCION_VEHICULAR_FIELDS.RTM_VENCIMIENTO] = documentos?.rtm?.vencimiento || '';
      fields[INSPECCION_VEHICULAR_FIELDS.POLIZA_CUMPLE] = documentos?.poliza?.cumple ? 'Sí' : 'No';
      fields[INSPECCION_VEHICULAR_FIELDS.POLIZA_VENCIMIENTO] = documentos?.poliza?.vencimiento || '';
      fields[INSPECCION_VEHICULAR_FIELDS.LICENCIA_CUMPLE] = documentos?.licencia?.cumple ? 'Sí' : 'No';
      fields[INSPECCION_VEHICULAR_FIELDS.CATEGORIAS_LICENCIA] = documentos?.licencia?.categorias?.join(', ') || '';
      fields[INSPECCION_VEHICULAR_FIELDS.VIGENCIAS_LICENCIA] = JSON.stringify(documentos?.licencia?.vigencias || {});
      
      // Condiciones operativas
      fields[INSPECCION_VEHICULAR_FIELDS.HORAS_DORMIR] = condiciones?.horasDormir?.toString() || '';
      fields[INSPECCION_VEHICULAR_FIELDS.KILOMETRAJE_INICIAL] = condiciones?.kilometrajeInicial?.toString() || '';

      // Procesar items de verificación preoperacional
      if (itemsVerificacion && typeof itemsVerificacion === 'object') {
        let totalCumple = 0;
        let totalNoCumple = 0;
        
        Object.entries(itemsVerificacion).forEach(([itemId, data]) => {
          const id = parseInt(itemId);
          const itemData = data as { cumple?: boolean | null; observacion?: string };
          const fieldMap = ITEM_FIELD_MAP[id];
          
          if (fieldMap) {
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

        // Agregar totales y porcentaje
        const totalItems = totalCumple + totalNoCumple;
        const porcentaje = totalItems > 0 ? ((totalCumple / totalItems) * 100).toFixed(2) : '0';
        
        fields[INSPECCION_VEHICULAR_FIELDS.TOTAL_ITEMS_CUMPLE] = totalCumple.toString();
        fields[INSPECCION_VEHICULAR_FIELDS.TOTAL_ITEMS_NO_CUMPLE] = totalNoCumple.toString();
        fields[INSPECCION_VEHICULAR_FIELDS.PORCENTAJE_CUMPLIMIENTO] = `${porcentaje}%`;
      }
    }

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
        totalBueno,
        totalRegular,
        totalMalo,
        totalNoTiene,
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
