import { NextRequest, NextResponse } from 'next/server';
import {
  getInspeccionVehicularConfig,
  INSPECCION_VEHICULAR_FIELDS,
  ITEMS_PREOP_FIELDS,
  ITEMS_KIT_FIELDS,
  ITEMS_BOTIQUIN_FIELDS,
  ITEMS_EXTINTOR_FIELDS,
} from '@/lib/airtable-config';

// ===========================================
// CATÁLOGO DE ÍTEMS (single source of truth)
// Replica los arreglos del formulario para que la API
// sea auto-contenida (no depende del cliente).
// ===========================================

type CategoriaPreop = 'Seguridad' | 'Generales' | 'Mecanico' | 'Correas' | 'Higiene' | 'Salud';

interface CatalogoPreop { id: number; nombre: string; categoria: CategoriaPreop; }
interface CatalogoKit   { id: number; nombre: string; tipo: 'Material' | 'Pregunta de Verificacion'; }
interface CatalogoBotiquin { id: number; nombre: string; cantidadEstandar: number; tieneVencimiento: boolean; }
interface CatalogoExtintor { id: number; nombre: string; }

const CATALOGO_PREOP: CatalogoPreop[] = [
  { id: 1,  nombre: 'Extintor de Incendios (20 libras 2 unidades)', categoria: 'Seguridad' },
  { id: 2,  nombre: 'Equipo de Carretera (Triángulos, Conos, Chaleco Reflectante, Linterna, Manila, Gato, Cruceta)', categoria: 'Seguridad' },
  { id: 3,  nombre: 'Botiquín de primeros auxilios', categoria: 'Seguridad' },
  { id: 4,  nombre: 'Cinturones de seguridad operativos', categoria: 'Seguridad' },
  { id: 5,  nombre: 'Bocina (claxon) funcionando correctamente', categoria: 'Seguridad' },
  { id: 6,  nombre: 'Luces (altas, bajas, direccionales)', categoria: 'Seguridad' },
  { id: 7,  nombre: 'Espejos (laterales) y lente angular en buen estado', categoria: 'Seguridad' },
  { id: 8,  nombre: 'Papeles retrovisores sin daños y bien ajustados', categoria: 'Seguridad' },
  { id: 9,  nombre: 'Señalización adecuada en el tractocamión (reflectivos, calcomanías reglamentarias)', categoria: 'Generales' },
  { id: 10, nombre: 'Estado general del Tanque (Sin fugas)', categoria: 'Generales' },
  { id: 11, nombre: 'Tanque con tapa en buen estado', categoria: 'Generales' },
  { id: 12, nombre: 'Estado y limpieza de la cabina', categoria: 'Generales' },
  { id: 13, nombre: 'Estado general de las llantas (desgaste uniforme, presión correcta)', categoria: 'Generales' },
  { id: 14, nombre: 'Llanta de repuesto', categoria: 'Generales' },
  { id: 15, nombre: 'Estado de los rines y contrapesos (sin deformaciones ni faltantes)', categoria: 'Generales' },
  { id: 16, nombre: 'Sistema de frenos (inspección visual: pedal, fugas de aire o hidráulicas)', categoria: 'Generales' },
  { id: 17, nombre: 'Freno de estacionamiento (de mano)', categoria: 'Generales' },
  { id: 18, nombre: 'Sistema de dirección (sin ruidos, sin holguras)', categoria: 'Generales' },
  { id: 19, nombre: 'Estado y funcionamiento del motor (nivel de aceite, fugas de aceite o refrigerante, ruidos anormales)', categoria: 'Generales' },
  { id: 20, nombre: 'Nivel de fluidos (aceite, refrigerante, líquido de frenos)', categoria: 'Generales' },
  { id: 21, nombre: 'Medición de suspensión y amortiguadores', categoria: 'Generales' },
  { id: 22, nombre: 'Estado y funcionamiento de luces (delanteras, traseras, direccionales y de freno)', categoria: 'Generales' },
  { id: 23, nombre: 'Ausencia de fugas de fluidos en general', categoria: 'Generales' },
  { id: 24, nombre: 'Herramientas básicas y gato hidráulico presentes', categoria: 'Generales' },
  { id: 25, nombre: 'Punto de anclaje fijo', categoria: 'Generales' },
  { id: 26, nombre: 'Cable de acero', categoria: 'Generales' },
  { id: 27, nombre: 'Estado de los espejos', categoria: 'Generales' },
  { id: 28, nombre: 'Listado del torque', categoria: 'Generales' },
  { id: 29, nombre: 'Caja de cambios', categoria: 'Mecanico' },
  { id: 30, nombre: 'Estado de amortiguadores y resortes (muelles o ballestas)', categoria: 'Mecanico' },
  { id: 31, nombre: 'Revisión de componentes de suspensión (bujes, pernos, terminales)', categoria: 'Mecanico' },
  { id: 32, nombre: 'Nivel y estado del refrigerante', categoria: 'Mecanico' },
  { id: 33, nombre: 'Revisión de fugas en mangueras y sellantes', categoria: 'Mecanico' },
  { id: 34, nombre: 'Funcionamiento de frenos de emergencia y de servicio', categoria: 'Mecanico' },
  { id: 35, nombre: 'Estado de la batería', categoria: 'Mecanico' },
  { id: 36, nombre: 'Lubricación y engrase general', categoria: 'Mecanico' },
  { id: 37, nombre: 'Fugas en el sistema de escape, humo excesivo o color anormal', categoria: 'Mecanico' },
  { id: 38, nombre: 'Correas (ventilador, alternador, compresor) sin grietas o desgaste excesivo', categoria: 'Correas' },
  { id: 39, nombre: 'Realizar desinfección y limpieza a la cabina del vehículo', categoria: 'Higiene' },
  { id: 40, nombre: 'Antes de la jornada laboral tuvo un descanso apropiado para desarrollar su labor de manera segura', categoria: 'Salud' },
  { id: 41, nombre: 'Se encuentra bajo algún tratamiento médico y/o ha ingerido algún medicamento', categoria: 'Salud' },
  { id: 42, nombre: '¿Presenta algún trastorno de ansiedad o depresión?', categoria: 'Salud' },
  { id: 43, nombre: '¿Presenta algún trastorno neurológico o visual? (mareo, vértigo, visión borrosa)', categoria: 'Salud' },
  { id: 44, nombre: 'Se encuentra en condiciones de salud apropiadas para trabajar', categoria: 'Salud' },
];

const CATALOGO_KIT: CatalogoKit[] = [
  { id: 101, nombre: 'Paños Absorbentes', tipo: 'Material' },
  { id: 102, nombre: 'Barrera Absorbente', tipo: 'Material' },
  { id: 103, nombre: 'Traje Desechable', tipo: 'Material' },
  { id: 104, nombre: 'Bolsa Roja para Recoger Residuos Contaminados', tipo: 'Material' },
  { id: 105, nombre: 'Pala Plástica', tipo: 'Material' },
  { id: 106, nombre: 'Espátula Plástica', tipo: 'Material' },
  { id: 107, nombre: 'Guantes de Nitrilo', tipo: 'Material' },
  { id: 108, nombre: 'Gafas Transparentes de Seguridad', tipo: 'Material' },
  { id: 109, nombre: 'Cinta de Peligro', tipo: 'Material' },
  { id: 110, nombre: 'Martillo de Goma', tipo: 'Material' },
  { id: 111, nombre: 'Recogedor de Mano Plástico', tipo: 'Material' },
  { id: 112, nombre: 'Respirador un Cartucho o Tapabocas N-95', tipo: 'Material' },
  { id: 113, nombre: 'Linterna Recargable', tipo: 'Material' },
  { id: 114, nombre: 'Bolsa Granulado Absorbente', tipo: 'Material' },
  { id: 115, nombre: 'Masilla Epóxica', tipo: 'Material' },
  { id: 116, nombre: 'Desengrasante Biodegradable', tipo: 'Material' },
  { id: 117, nombre: 'Chaleco Antireflectivo', tipo: 'Material' },
  { id: 118, nombre: 'Conos', tipo: 'Material' },
  { id: 119, nombre: '¿El responsable del kit control de derrame conoce el procedimiento para usarlo?', tipo: 'Pregunta de Verificacion' },
  { id: 120, nombre: '¿El kit se encuentra almacenado en un lugar seco y protegido de agentes contaminantes?', tipo: 'Pregunta de Verificacion' },
  { id: 121, nombre: '¿La caneca o morral donde se guarda el kit se encuentra rotulado o señalizado?', tipo: 'Pregunta de Verificacion' },
];

const CATALOGO_BOTIQUIN: CatalogoBotiquin[] = [
  { id: 201, nombre: 'Gasas', cantidadEstandar: 10, tieneVencimiento: true },
  { id: 202, nombre: 'Esparadrapo', cantidadEstandar: 1, tieneVencimiento: true },
  { id: 203, nombre: 'Bajalenguas', cantidadEstandar: 10, tieneVencimiento: true },
  { id: 204, nombre: 'Guantes de Latex', cantidadEstandar: 5, tieneVencimiento: true },
  { id: 205, nombre: 'Aplicadores o Copitos', cantidadEstandar: 1, tieneVencimiento: true },
  { id: 206, nombre: 'Venda Elástica 2X5 Yardas', cantidadEstandar: 1, tieneVencimiento: true },
  { id: 207, nombre: 'Venda Elástica 3X5 Yardas', cantidadEstandar: 1, tieneVencimiento: true },
  { id: 208, nombre: 'Venda Elástica 5X5 Yardas', cantidadEstandar: 1, tieneVencimiento: true },
  { id: 209, nombre: 'Venda de Algodón 3X5 Yardas', cantidadEstandar: 1, tieneVencimiento: true },
  { id: 210, nombre: 'Venda de Algodón 5X5 Yardas', cantidadEstandar: 1, tieneVencimiento: true },
  { id: 211, nombre: 'Yodopovidona (Jabón Quirúrgico)', cantidadEstandar: 1, tieneVencimiento: true },
  { id: 212, nombre: 'Solución Salina 250 cc ó 500 cc', cantidadEstandar: 1, tieneVencimiento: true },
  { id: 213, nombre: 'Tapabocas', cantidadEstandar: 3, tieneVencimiento: true },
  { id: 214, nombre: 'Alcohol Antiséptico Frasco por 275 ml', cantidadEstandar: 1, tieneVencimiento: true },
  { id: 215, nombre: 'Curas', cantidadEstandar: 5, tieneVencimiento: true },
  { id: 216, nombre: 'Jeringa de 5 ml', cantidadEstandar: 1, tieneVencimiento: true },
  { id: 217, nombre: 'Tijeras de Trauma', cantidadEstandar: 1, tieneVencimiento: false },
  { id: 218, nombre: 'Parche Ocular', cantidadEstandar: 3, tieneVencimiento: true },
  { id: 219, nombre: 'Termómetro', cantidadEstandar: 1, tieneVencimiento: false },
  { id: 220, nombre: 'Libreta', cantidadEstandar: 1, tieneVencimiento: false },
  { id: 221, nombre: 'Lapicero', cantidadEstandar: 1, tieneVencimiento: false },
  { id: 222, nombre: 'Manual de Emergencia', cantidadEstandar: 1, tieneVencimiento: false },
];

const CATALOGO_EXTINTOR: CatalogoExtintor[] = [
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

// ===========================================
// UTILIDADES AIRTABLE
// ===========================================

async function airtablePost(
  baseId: string,
  tableId: string,
  apiKey: string,
  fields: Record<string, unknown>
): Promise<{ id: string; fields: Record<string, unknown> }> {
  const url = `https://api.airtable.com/v0/${baseId}/${tableId}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields, typecast: true }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Airtable ${res.status}: ${err?.error?.message || JSON.stringify(err)}`);
  }
  return res.json();
}

/** Crea registros en lotes de 10 (límite de la API de Airtable) */
async function airtableBatchPost(
  baseId: string,
  tableId: string,
  apiKey: string,
  records: Array<Record<string, unknown>>
): Promise<void> {
  const BATCH = 10;
  for (let i = 0; i < records.length; i += BATCH) {
    const chunk = records.slice(i, i + BATCH).map((f) => ({ fields: f }));
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: chunk, typecast: true }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Airtable batch ${res.status}: ${err?.error?.message || JSON.stringify(err)}`);
    }
  }
}

// ===========================================
// POST — Crear inspección vehicular normalizada (4NF)
// Flujo:
//   1. INSERT encabezado → tabla principal  → devuelve recordId
//   2. INSERT 44 filas  → Items Preoperacional  (linked a recordId)
//   3. INSERT 21 filas  → Items Kit Derrame      (linked a recordId)
//   4. INSERT 22 filas  → Items Botiquín         (linked a recordId)
//   5. INSERT 10 filas  → Items Extintor         (linked a recordId)
// ===========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config = getInspeccionVehicularConfig();

    if (!config.API_KEY || !config.BASE_ID) {
      return NextResponse.json({ error: 'Configuración de Airtable no encontrada' }, { status: 500 });
    }

    const { conductor, vehiculo, remolque, documentos, condiciones, firma, observacionesGenerales,
            itemsVerificacion, kitDerrame, botiquin, extintor } = body;

    // ── Calcular agregados ────────────────────────────────────────────────────

    let totalCumple = 0, totalNoCumple = 0;
    let totalBueno = 0, totalRegular = 0, totalMalo = 0, totalNoTiene = 0;

    if (itemsVerificacion) {
      for (const d of Object.values(itemsVerificacion) as Array<{ cumple?: boolean | null }>) {
        if (d.cumple === true) totalCumple++;
        else if (d.cumple === false) totalNoCumple++;
      }
    }
    const contarEstado = (map: Record<string, { estado?: string | null }>) => {
      for (const { estado } of Object.values(map)) {
        if (estado === 'B') totalBueno++;
        else if (estado === 'R') totalRegular++;
        else if (estado === 'M') totalMalo++;
        else if (estado === 'NT') totalNoTiene++;
      }
    };
    if (kitDerrame)      contarEstado(kitDerrame);
    if (botiquin)        contarEstado(botiquin);
    if (extintor?.items) contarEstado(extintor.items);

    const totalPreop = totalCumple + totalNoCumple;
    const porcentaje = totalPreop > 0 ? ((totalCumple / totalPreop) * 100).toFixed(1) : '0';

    // ── 1. ENCABEZADO ─────────────────────────────────────────────────────────

    const headerFields: Record<string, unknown> = {
      [INSPECCION_VEHICULAR_FIELDS.FECHA_INSPECCION]:   new Date().toISOString().split('T')[0],
      [INSPECCION_VEHICULAR_FIELDS.CODIGO_FORMATO]:     'HSEQ-FOR-065',
      [INSPECCION_VEHICULAR_FIELDS.VERSION_FORMATO]:    '001',

      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_ID]:            conductor?.id || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_CEDULA]:        conductor?.cedula || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_NOMBRE]:        conductor?.nombre || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_EDAD]:          conductor?.edad?.toString() || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_EPS]:           conductor?.eps || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_ARL]:           conductor?.arl || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_FONDO_PENSION]: conductor?.fondoPension || '',
      [INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_RH]:            conductor?.rh || '',

      [INSPECCION_VEHICULAR_FIELDS.VEHICULO_PLACA]:  vehiculo?.placa || '',
      [INSPECCION_VEHICULAR_FIELDS.VEHICULO_MARCA]:  vehiculo?.marca || '',
      [INSPECCION_VEHICULAR_FIELDS.VEHICULO_LINEA]:  vehiculo?.linea || '',
      [INSPECCION_VEHICULAR_FIELDS.VEHICULO_MODELO]: vehiculo?.modelo || '',

      [INSPECCION_VEHICULAR_FIELDS.REMOLQUE_PLACA]:  remolque?.placa || '',
      [INSPECCION_VEHICULAR_FIELDS.REMOLQUE_MARCA]:  remolque?.marca || '',
      [INSPECCION_VEHICULAR_FIELDS.REMOLQUE_CLASE]:  remolque?.clase || '',
      [INSPECCION_VEHICULAR_FIELDS.REMOLQUE_MODELO]: remolque?.modelo || '',

      [INSPECCION_VEHICULAR_FIELDS.SOAT_CUMPLE]:        documentos?.soat?.cumple === true  ? 'Sí' : documentos?.soat?.cumple === false  ? 'No' : '',
      [INSPECCION_VEHICULAR_FIELDS.SOAT_VENCIMIENTO]:   documentos?.soat?.vencimiento || '',
      [INSPECCION_VEHICULAR_FIELDS.RTM_CUMPLE]:         documentos?.rtm?.cumple === true   ? 'Sí' : documentos?.rtm?.cumple === false   ? 'No' : '',
      [INSPECCION_VEHICULAR_FIELDS.RTM_VENCIMIENTO]:    documentos?.rtm?.vencimiento || '',
      [INSPECCION_VEHICULAR_FIELDS.POLIZA_CUMPLE]:      documentos?.poliza?.cumple === true ? 'Sí' : documentos?.poliza?.cumple === false ? 'No' : '',
      [INSPECCION_VEHICULAR_FIELDS.POLIZA_VENCIMIENTO]: documentos?.poliza?.vencimiento || '',
      [INSPECCION_VEHICULAR_FIELDS.LICENCIA_CUMPLE]:    documentos?.licencia?.cumple === true ? 'Sí' : documentos?.licencia?.cumple === false ? 'No' : '',
      [INSPECCION_VEHICULAR_FIELDS.CATEGORIAS_LICENCIA]:Array.isArray(documentos?.licencia?.categorias) ? documentos.licencia.categorias.join(', ') : '',
      [INSPECCION_VEHICULAR_FIELDS.VIGENCIAS_LICENCIA]: JSON.stringify(documentos?.licencia?.vigencias || {}),

      [INSPECCION_VEHICULAR_FIELDS.HORAS_DORMIR]:        condiciones?.horasDormir?.toString() || '',
      [INSPECCION_VEHICULAR_FIELDS.KILOMETRAJE_INICIAL]: condiciones?.kilometrajeInicial?.toString() || '',

      // Agregados calculados (evita re-calcular en consultas)
      [INSPECCION_VEHICULAR_FIELDS.TOTAL_ITEMS_CUMPLE]:    totalCumple.toString(),
      [INSPECCION_VEHICULAR_FIELDS.TOTAL_ITEMS_NO_CUMPLE]: totalNoCumple.toString(),
      [INSPECCION_VEHICULAR_FIELDS.PORCENTAJE_CUMPLIMIENTO]:`${porcentaje}%`,
      [INSPECCION_VEHICULAR_FIELDS.TOTAL_BUENO]:    totalBueno,
      [INSPECCION_VEHICULAR_FIELDS.TOTAL_REGULAR]:  totalRegular,
      [INSPECCION_VEHICULAR_FIELDS.TOTAL_MALO]:     totalMalo,
      [INSPECCION_VEHICULAR_FIELDS.TOTAL_NO_TIENE]: totalNoTiene,

      ...(extintor?.fechaActual?.dia && {
        [INSPECCION_VEHICULAR_FIELDS.EXT_FECHA_ACTUAL]: `${extintor.fechaActual.dia}/${extintor.fechaActual.mes}/${extintor.fechaActual.ano}`,
      }),
      ...(extintor?.fechaProximaRecarga?.dia && {
        [INSPECCION_VEHICULAR_FIELDS.EXT_FECHA_PROXIMA_RECARGA]: `${extintor.fechaProximaRecarga.dia}/${extintor.fechaProximaRecarga.mes}/${extintor.fechaProximaRecarga.ano}`,
      }),

      [INSPECCION_VEHICULAR_FIELDS.FIRMA_CONDUCTOR]:         firma || '',
      [INSPECCION_VEHICULAR_FIELDS.ESTADO_INSPECCION]:       'Pendiente',
      [INSPECCION_VEHICULAR_FIELDS.OBSERVACIONES_GENERALES]: observacionesGenerales || '',
    };

    // Limpiar vacíos
    for (const k of Object.keys(headerFields)) {
      if (headerFields[k] === '' || headerFields[k] == null) delete headerFields[k];
    }

    const headerRecord = await airtablePost(config.BASE_ID, config.TABLE_ID, config.API_KEY, headerFields);
    const inspeccionLink = [headerRecord.id]; // linked record field espera array de IDs

    // ── 2. ÍTEMS PREOPERACIONAL ───────────────────────────────────────────────

    if (itemsVerificacion && typeof itemsVerificacion === 'object') {
      const rows = CATALOGO_PREOP.map((cat) => {
        const d = (itemsVerificacion as Record<number, { cumple?: boolean | null; observacion?: string }>)[cat.id];
        const cumpleVal = d?.cumple === true ? 'Cumple' : d?.cumple === false ? 'No Cumple' : 'N/A';
        const row: Record<string, unknown> = {
          [ITEMS_PREOP_FIELDS.INSPECCION]:  inspeccionLink,
          [ITEMS_PREOP_FIELDS.ITEM_NUMERO]: cat.id,
          [ITEMS_PREOP_FIELDS.ITEM_NOMBRE]: cat.nombre,
          [ITEMS_PREOP_FIELDS.CATEGORIA]:   cat.categoria,
          [ITEMS_PREOP_FIELDS.CUMPLE]:      cumpleVal,
        };
        if (d?.observacion) row[ITEMS_PREOP_FIELDS.OBSERVACION] = d.observacion;
        return row;
      });
      await airtableBatchPost(config.BASE_ID, config.TABLE_ITEMS_PREOP, config.API_KEY, rows);
    }

    // ── 3. ÍTEMS KIT DE DERRAME ──────────────────────────────────────────────

    if (kitDerrame && typeof kitDerrame === 'object') {
      const rows = CATALOGO_KIT.map((cat) => {
        const d = (kitDerrame as Record<number, { estado?: string | null; observacion?: string }>)[cat.id];
        const row: Record<string, unknown> = {
          [ITEMS_KIT_FIELDS.INSPECCION]:  inspeccionLink,
          [ITEMS_KIT_FIELDS.ITEM_NUMERO]: cat.id,
          [ITEMS_KIT_FIELDS.ITEM_NOMBRE]: cat.nombre,
          [ITEMS_KIT_FIELDS.TIPO_ITEM]:   cat.tipo,
          [ITEMS_KIT_FIELDS.ESTADO]:      d?.estado || 'NT',
        };
        if (d?.observacion) row[ITEMS_KIT_FIELDS.OBSERVACION] = d.observacion;
        return row;
      });
      await airtableBatchPost(config.BASE_ID, config.TABLE_ITEMS_KIT, config.API_KEY, rows);
    }

    // ── 4. ÍTEMS BOTIQUÍN ────────────────────────────────────────────────────

    if (botiquin && typeof botiquin === 'object') {
      const rows = CATALOGO_BOTIQUIN.map((cat) => {
        const d = (botiquin as Record<number, { estado?: string | null; cantidad?: string; fechaVencimiento?: string; observacion?: string }>)[cat.id];
        const row: Record<string, unknown> = {
          [ITEMS_BOTIQUIN_FIELDS.INSPECCION]:  inspeccionLink,
          [ITEMS_BOTIQUIN_FIELDS.ITEM_NUMERO]: cat.id,
          [ITEMS_BOTIQUIN_FIELDS.ITEM_NOMBRE]: cat.nombre,
          [ITEMS_BOTIQUIN_FIELDS.ESTADO]:      d?.estado || 'NT',
          [ITEMS_BOTIQUIN_FIELDS.CANTIDAD]:    d?.cantidad || cat.cantidadEstandar.toString(),
        };
        if (d?.fechaVencimiento && cat.tieneVencimiento) {
          row[ITEMS_BOTIQUIN_FIELDS.FECHA_VENCIMIENTO] = d.fechaVencimiento;
        }
        if (d?.observacion) row[ITEMS_BOTIQUIN_FIELDS.OBSERVACION] = d.observacion;
        return row;
      });
      await airtableBatchPost(config.BASE_ID, config.TABLE_ITEMS_BOTIQUIN, config.API_KEY, rows);
    }

    // ── 5. ÍTEMS EXTINTOR ────────────────────────────────────────────────────

    if (extintor?.items && typeof extintor.items === 'object') {
      const rows = CATALOGO_EXTINTOR.map((cat) => {
        const d = (extintor.items as Record<number, { estado?: string | null; observacion?: string }>)[cat.id];
        const row: Record<string, unknown> = {
          [ITEMS_EXTINTOR_FIELDS.INSPECCION]:  inspeccionLink,
          [ITEMS_EXTINTOR_FIELDS.ITEM_NUMERO]: cat.id,
          [ITEMS_EXTINTOR_FIELDS.ITEM_NOMBRE]: cat.nombre,
          [ITEMS_EXTINTOR_FIELDS.ESTADO]:      d?.estado || 'NT',
        };
        if (d?.observacion) row[ITEMS_EXTINTOR_FIELDS.OBSERVACION] = d.observacion;
        return row;
      });
      await airtableBatchPost(config.BASE_ID, config.TABLE_ITEMS_EXTINTOR, config.API_KEY, rows);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Inspección vehicular registrada correctamente',
        data: {
          recordId: headerRecord.id,
          codigoInspeccion: headerRecord.fields?.['Codigo Inspeccion'] || headerRecord.id,
          totales: {
            preoperacional: { cumple: totalCumple, noCumple: totalNoCumple, porcentaje: `${porcentaje}%` },
            estadoItems:    { bueno: totalBueno, regular: totalRegular, malo: totalMalo, noTiene: totalNoTiene },
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando inspección vehicular:', error);
    return NextResponse.json(
      { error: 'Error al registrar la inspección', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ===========================================
// GET - Obtener inspecciones
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

    // Sanitize inputs: only allow alphanumeric chars (prevents formula injection)
    const safeCedula = cedula ? cedula.replace(/[^a-zA-Z0-9]/g, '') : null;
    const safePlaca  = placa  ? placa.replace(/[^a-zA-Z0-9]/g, '') : null;

    let filterFormula = '';
    if (safeCedula) {
      filterFormula = `{${INSPECCION_VEHICULAR_FIELDS.CONDUCTOR_CEDULA}} = '${safeCedula}'`;
    } else if (safePlaca) {
      filterFormula = `{${INSPECCION_VEHICULAR_FIELDS.VEHICULO_PLACA}} = '${safePlaca}'`;
    }

    const params: Record<string, string> = { maxRecords: '100' };
    if (filterFormula) params.filterByFormula = filterFormula;

    const queryString = new URLSearchParams(params).toString();
    const url = `https://api.airtable.com/v0/${config.BASE_ID}/${config.TABLE_ID}?${queryString}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${config.API_KEY}` },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Airtable error response:', errorBody);
      throw new Error(`Airtable error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, records: data.records || [] });

  } catch (error) {
    console.error('Error obteniendo inspecciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener inspecciones' },
      { status: 500 }
    );
  }
}
