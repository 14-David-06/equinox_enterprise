/**
 * Generador de PDF para Inspección Vehicular Integral
 * Formato: HSEQ-FOR-065 v001
 * Usa pdf-lib (100% JS puro, compatible con serverless)
 *
 * Secciones:
 *  1. Datos generales (conductor, vehículo, remolque, documentos)
 *  2. Ítems preoperacionales (44 ítems Sí/No + obs)
 *  3. Kit Control de Derrame (21 ítems B/R/M/NT + obs)
 *  4. Botiquín (22 ítems B/R/M/NT + cantidad + vencimiento + obs)
 *  5. Extintor (10 ítems B/R/M + obs) + Observaciones generales + Firma
 */

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';

// ─── Colores ──────────────────────────────────────────────
const C = {
  primary:   rgb(0.10, 0.10, 0.18),
  accent:    rgb(0.96, 0.62, 0.04),
  green:     rgb(0.13, 0.77, 0.37),
  red:       rgb(0.94, 0.27, 0.27),
  yellow:    rgb(0.96, 0.74, 0.04),
  gray:      rgb(0.42, 0.45, 0.50),
  lightGray: rgb(0.95, 0.96, 0.96),
  white:     rgb(1, 1, 1),
  dark:      rgb(0.07, 0.09, 0.15),
  headerBg:  rgb(0.16, 0.16, 0.31),
  warmBg:    rgb(1, 0.98, 0.92),
  greenBg:   rgb(0.86, 0.99, 0.91),
  redBg:     rgb(1, 0.95, 0.95),
  blueBg:    rgb(0.93, 0.96, 1),
};

// ─── Interfaces ───────────────────────────────────────────
export interface VehicularPDFData {
  codigoInspeccion: string;
  fecha: string;
  conductor: {
    id?: string;
    nombre: string;
    cedula: string;
    edad?: string;
    rh?: string;
    eps?: string;
    arl?: string;
    fondoPension?: string;
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
  itemsPreoperacional: Record<number, { cumple: boolean | null; observacion: string }>;
  kitDerrame:          Record<number, { estado: string | null; observacion: string }>;
  botiquin:            Record<number, { estado: string | null; cantidad: string; fechaVencimiento: string; observacion: string }>;
  extintor: {
    items: Record<number, { estado: string | null; observacion: string }>;
    fechaActual?: { dia: string; mes: string; ano: string };
    fechaProximaRecarga?: { dia: string; mes: string; ano: string };
  };
  observacionesGenerales: string;
  firmaConductor: string;   // base64 PNG
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

// ─── Catálogos (idénticos al formulario) ──────────────────
interface CatPreop   { id: number; nombre: string; categoria: string }
interface CatKit     { id: number; nombre: string; tipo: string; cantidad?: number }
interface CatBotiq   { id: number; nombre: string; cantidad: number; tieneVencimiento: boolean }
interface CatExtin   { id: number; nombre: string }

const CAT_PREOP: CatPreop[] = [
  { id: 1,  nombre: 'Extintor de Incendios (20 libras 2 unidades)', categoria: 'Seguridad' },
  { id: 2,  nombre: 'Equipo de Carretera (Triángulos, Conos, Chaleco, Linterna, Manila, Gato, Cruceta)', categoria: 'Seguridad' },
  { id: 3,  nombre: 'Botiquín de primeros auxilios', categoria: 'Seguridad' },
  { id: 4,  nombre: 'Cinturones de seguridad operativos', categoria: 'Seguridad' },
  { id: 5,  nombre: 'Bocina (claxon) funcionando correctamente', categoria: 'Seguridad' },
  { id: 6,  nombre: 'Luces (altas, bajas, direccionales)', categoria: 'Seguridad' },
  { id: 7,  nombre: 'Espejos (laterales) y lente angular en buen estado', categoria: 'Seguridad' },
  { id: 8,  nombre: 'Papeles retrovisores sin daños y bien ajustados', categoria: 'Seguridad' },
  { id: 9,  nombre: 'Señalización adecuada (reflectivos, calcomanías)', categoria: 'Generales' },
  { id: 10, nombre: 'Estado general del Tanque (Sin fugas)', categoria: 'Generales' },
  { id: 11, nombre: 'Tanque con tapa en buen estado', categoria: 'Generales' },
  { id: 12, nombre: 'Estado y limpieza de la cabina', categoria: 'Generales' },
  { id: 13, nombre: 'Estado general de las llantas', categoria: 'Generales' },
  { id: 14, nombre: 'Llanta de repuesto', categoria: 'Generales' },
  { id: 15, nombre: 'Estado de los rines y contrapesos', categoria: 'Generales' },
  { id: 16, nombre: 'Sistema de frenos', categoria: 'Generales' },
  { id: 17, nombre: 'Freno de estacionamiento (de mano)', categoria: 'Generales' },
  { id: 18, nombre: 'Sistema de dirección', categoria: 'Generales' },
  { id: 19, nombre: 'Estado y funcionamiento del motor', categoria: 'Generales' },
  { id: 20, nombre: 'Nivel de fluidos', categoria: 'Generales' },
  { id: 21, nombre: 'Medición de suspensión y amortiguadores', categoria: 'Generales' },
  { id: 22, nombre: 'Estado y funcionamiento de luces', categoria: 'Generales' },
  { id: 23, nombre: 'Ausencia de fugas de fluidos en general', categoria: 'Generales' },
  { id: 24, nombre: 'Herramientas básicas y gato hidráulico', categoria: 'Generales' },
  { id: 25, nombre: 'Punto de anclaje fijo', categoria: 'Generales' },
  { id: 26, nombre: 'Cable de acero', categoria: 'Generales' },
  { id: 27, nombre: 'Estado de los espejos', categoria: 'Generales' },
  { id: 28, nombre: 'Listado del torque', categoria: 'Generales' },
  { id: 29, nombre: 'Caja de cambios', categoria: 'Mecánico' },
  { id: 30, nombre: 'Estado de amortiguadores y resortes', categoria: 'Mecánico' },
  { id: 31, nombre: 'Revisión de componentes de suspensión', categoria: 'Mecánico' },
  { id: 32, nombre: 'Nivel y estado del refrigerante', categoria: 'Mecánico' },
  { id: 33, nombre: 'Revisión de fugas en mangueras y sellantes', categoria: 'Mecánico' },
  { id: 34, nombre: 'Funcionamiento frenos de emergencia y servicio', categoria: 'Mecánico' },
  { id: 35, nombre: 'Estado de la batería', categoria: 'Mecánico' },
  { id: 36, nombre: 'Lubricación y engrase general', categoria: 'Mecánico' },
  { id: 37, nombre: 'Fugas en sistema de escape / humo excesivo', categoria: 'Mecánico' },
  { id: 38, nombre: 'Correas (ventilador, alternador, compresor)', categoria: 'Correas' },
  { id: 39, nombre: 'Desinfección y limpieza de la cabina', categoria: 'Higiene' },
  { id: 40, nombre: 'Descanso apropiado antes de la jornada', categoria: 'Salud' },
  { id: 41, nombre: 'Bajo tratamiento médico / medicamento', categoria: 'Salud' },
  { id: 42, nombre: 'Trastorno de ansiedad o depresión', categoria: 'Salud' },
  { id: 43, nombre: 'Trastorno neurológico o visual', categoria: 'Salud' },
  { id: 44, nombre: 'Condiciones de salud apropiadas', categoria: 'Salud' },
];

const CAT_KIT: CatKit[] = [
  { id: 101, nombre: 'Paños Absorbentes', tipo: 'Material', cantidad: 4 },
  { id: 102, nombre: 'Barrera Absorbente', tipo: 'Material', cantidad: 2 },
  { id: 103, nombre: 'Traje Desechable', tipo: 'Material', cantidad: 1 },
  { id: 104, nombre: 'Bolsa Roja Residuos Contaminados', tipo: 'Material', cantidad: 2 },
  { id: 105, nombre: 'Pala Plástica', tipo: 'Material', cantidad: 1 },
  { id: 106, nombre: 'Espátula Plástica', tipo: 'Material', cantidad: 1 },
  { id: 107, nombre: 'Guantes de Nitrilo', tipo: 'Material', cantidad: 1 },
  { id: 108, nombre: 'Gafas de Seguridad', tipo: 'Material', cantidad: 1 },
  { id: 109, nombre: 'Cinta de Peligro', tipo: 'Material', cantidad: 1 },
  { id: 110, nombre: 'Martillo de Goma', tipo: 'Material', cantidad: 1 },
  { id: 111, nombre: 'Recogedor de Mano Plástico', tipo: 'Material', cantidad: 1 },
  { id: 112, nombre: 'Respirador / Tapabocas N-95', tipo: 'Material', cantidad: 1 },
  { id: 113, nombre: 'Linterna Recargable', tipo: 'Material', cantidad: 1 },
  { id: 114, nombre: 'Bolsa Granulado Absorbente', tipo: 'Material', cantidad: 1 },
  { id: 115, nombre: 'Masilla Epóxica', tipo: 'Material', cantidad: 1 },
  { id: 116, nombre: 'Desengrasante Biodegradable', tipo: 'Material', cantidad: 1 },
  { id: 117, nombre: 'Chaleco Antireflectivo', tipo: 'Material', cantidad: 1 },
  { id: 118, nombre: 'Conos', tipo: 'Material', cantidad: 1 },
  { id: 119, nombre: '¿Responsable conoce procedimiento de uso?', tipo: 'Pregunta' },
  { id: 120, nombre: '¿Kit almacenado en lugar seco y protegido?', tipo: 'Pregunta' },
  { id: 121, nombre: '¿Caneca o morral rotulado o señalizado?', tipo: 'Pregunta' },
];

const CAT_BOTIQUIN: CatBotiq[] = [
  { id: 201, nombre: 'Gasas', cantidad: 10, tieneVencimiento: true },
  { id: 202, nombre: 'Esparadrapo', cantidad: 1, tieneVencimiento: true },
  { id: 203, nombre: 'Bajalenguas', cantidad: 10, tieneVencimiento: true },
  { id: 204, nombre: 'Guantes de Latex', cantidad: 5, tieneVencimiento: true },
  { id: 205, nombre: 'Aplicadores / Copitos', cantidad: 1, tieneVencimiento: true },
  { id: 206, nombre: 'Venda Elástica 2X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 207, nombre: 'Venda Elástica 3X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 208, nombre: 'Venda Elástica 5X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 209, nombre: 'Venda de Algodón 3X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 210, nombre: 'Venda de Algodón 5X5 Yardas', cantidad: 1, tieneVencimiento: true },
  { id: 211, nombre: 'Yodopovidona (Jabón Quirúrgico)', cantidad: 1, tieneVencimiento: true },
  { id: 212, nombre: 'Solución Salina 250/500 cc', cantidad: 1, tieneVencimiento: true },
  { id: 213, nombre: 'Tapabocas', cantidad: 3, tieneVencimiento: true },
  { id: 214, nombre: 'Alcohol Antiséptico 275 ml', cantidad: 1, tieneVencimiento: true },
  { id: 215, nombre: 'Curas', cantidad: 5, tieneVencimiento: true },
  { id: 216, nombre: 'Jeringa de 5 ml', cantidad: 1, tieneVencimiento: true },
  { id: 217, nombre: 'Tijeras de Trauma', cantidad: 1, tieneVencimiento: false },
  { id: 218, nombre: 'Parche Ocular', cantidad: 3, tieneVencimiento: true },
  { id: 219, nombre: 'Termómetro', cantidad: 1, tieneVencimiento: false },
  { id: 220, nombre: 'Libreta', cantidad: 1, tieneVencimiento: false },
  { id: 221, nombre: 'Lapicero', cantidad: 1, tieneVencimiento: false },
  { id: 222, nombre: 'Manual de Emergencia', cantidad: 1, tieneVencimiento: false },
];

const CAT_EXTINTOR: CatExtin[] = [
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

// ─── Helpers ──────────────────────────────────────────────
function trunc(t: string, max: number) { return t && t.length > max ? t.substring(0, max) + '…' : t || ''; }
function fmtDate(d: string) {
  if (!d) return 'N/A';
  try { return new Date(d + 'T12:00:00').toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }); }
  catch { return d; }
}

// ─── Context ──────────────────────────────────────────────
interface Ctx {
  doc: PDFDocument; page: PDFPage; y: number;
  fr: PDFFont; fb: PDFFont;
  pw: number; ph: number; m: number;
}
function newPage(c: Ctx): Ctx { const p = c.doc.addPage([c.pw, c.ph]); return { ...c, page: p, y: c.ph - 30 }; }
function need(c: Ctx, h: number): Ctx { return c.y - h < 50 ? newPage(c) : c; }

// ─── Draw helpers ─────────────────────────────────────────

function drawHeader(c: Ctx, data: VehicularPDFData): Ctx {
  const { page, fb, fr, pw, m } = c;
  let y = c.y;
  // Top accent bar
  page.drawRectangle({ x: 0, y: c.ph - 4, width: pw, height: 4, color: C.accent });
  // Header block
  const hH = 60, hY = y - hH;
  page.drawRectangle({ x: m, y: hY, width: pw - m * 2, height: hH, color: C.primary });
  page.drawText('TRANSPORTE Y LOGÍSTICA EQUINOX S.A.S.', { x: m + 12, y: hY + hH - 18, size: 11, font: fb, color: C.accent });
  page.drawText('NIT: 901.870.510-5', { x: m + 12, y: hY + hH - 30, size: 7, font: fr, color: C.white });
  page.drawText('INSPECCIÓN VEHICULAR INTEGRAL', { x: m + 12, y: hY + hH - 43, size: 9, font: fb, color: C.white });
  // Code box
  const bW = 130, bX = pw - m - bW - 5;
  page.drawRectangle({ x: bX, y: hY + 5, width: bW, height: hH - 10, color: C.headerBg });
  page.drawText('CÓDIGO', { x: bX + 8, y: hY + hH - 18, size: 6, font: fb, color: C.accent });
  page.drawText('HSEQ-FOR-065', { x: bX + 8, y: hY + hH - 28, size: 7, font: fr, color: C.white });
  page.drawText('VERSIÓN', { x: bX + 65, y: hY + hH - 18, size: 6, font: fb, color: C.accent });
  page.drawText('001', { x: bX + 65, y: hY + hH - 28, size: 7, font: fr, color: C.white });
  page.drawText('INSPECCIÓN', { x: bX + 8, y: hY + hH - 40, size: 6, font: fb, color: C.accent });
  page.drawText(data.codigoInspeccion || 'PENDIENTE', { x: bX + 8, y: hY + hH - 50, size: 7, font: fr, color: C.white });
  y = hY - 8;
  page.drawText('Fecha: ' + fmtDate(data.fecha), { x: m + 5, y, size: 7, font: fr, color: C.gray });
  page.drawText('Conductor: ' + (data.conductor.nombre || ''), { x: pw / 2, y, size: 7, font: fr, color: C.gray });
  y -= 16;
  return { ...c, y };
}

function section(c: Ctx, title: string): Ctx {
  c = need(c, 30);
  const w = c.pw - c.m * 2;
  c.page.drawRectangle({ x: c.m, y: c.y - 16, width: w, height: 18, color: C.primary });
  c.page.drawText(title, { x: c.m + 10, y: c.y - 12, size: 8, font: c.fb, color: C.accent });
  c.y -= 26;
  return c;
}

function infoGrid(c: Ctx, items: { l: string; v: string }[], cols = 3): Ctx {
  const colW = (c.pw - c.m * 2 - 10) / cols;
  for (let i = 0; i < items.length; i++) {
    const col = i % cols;
    const x = c.m + 5 + col * colW;
    if (col === 0 && i > 0) c.y -= 24;
    c = need(c, 24);
    c.page.drawText(items[i].l, { x, y: c.y, size: 6, font: c.fb, color: C.gray });
    c.page.drawText(items[i].v || 'N/A', { x, y: c.y - 10, size: 8, font: c.fr, color: C.dark });
  }
  c.y -= 28;
  return c;
}

function docRow(c: Ctx, label: string, cumple: boolean | null, venc: string): Ctx {
  c = need(c, 14);
  c.page.drawText(label + ':', { x: c.m + 10, y: c.y, size: 8, font: c.fb, color: C.dark });
  const ok = cumple === true;
  c.page.drawText(ok ? 'VIGENTE' : 'NO VIGENTE', { x: c.m + 100, y: c.y, size: 8, font: c.fb, color: ok ? C.green : C.red });
  c.page.drawText('(Vence: ' + fmtDate(venc) + ')', { x: c.m + 180, y: c.y, size: 7, font: c.fr, color: C.gray });
  c.y -= 14;
  return c;
}

// ─── Tabla preoperacional (Sí/No + Obs) ──────────────────
function drawPreopTable(c: Ctx, catTitle: string, items: CatPreop[], data: Record<number, { cumple: boolean | null; observacion: string }>): Ctx {
  c = section(c, catTitle);
  const tW = c.pw - c.m * 2;
  const colId = 22, colEstado = 50, colObs = 80;
  const colNombre = tW - colId - colEstado - colObs;
  // Header
  c = need(c, 16);
  c.page.drawRectangle({ x: c.m, y: c.y - 12, width: tW, height: 14, color: C.lightGray });
  c.page.drawText('#', { x: c.m + 4, y: c.y - 9, size: 6, font: c.fb, color: C.dark });
  c.page.drawText('Ítem de Verificación', { x: c.m + colId + 4, y: c.y - 9, size: 6, font: c.fb, color: C.dark });
  c.page.drawText('Estado', { x: c.m + colId + colNombre + 4, y: c.y - 9, size: 6, font: c.fb, color: C.dark });
  c.page.drawText('Observación', { x: c.m + colId + colNombre + colEstado + 4, y: c.y - 9, size: 6, font: c.fb, color: C.dark });
  c.y -= 16;
  for (const it of items) {
    c = need(c, 14);
    const d = data[it.id];
    if (it.id % 2 === 0) c.page.drawRectangle({ x: c.m, y: c.y - 10, width: tW, height: 13, color: rgb(0.98, 0.98, 0.99) });
    c.page.drawText(String(it.id), { x: c.m + 4, y: c.y - 8, size: 6, font: c.fr, color: C.dark });
    c.page.drawText(trunc(it.nombre, 55), { x: c.m + colId + 4, y: c.y - 8, size: 5.5, font: c.fr, color: C.dark });
    if (d?.cumple === true) c.page.drawText('Cumple', { x: c.m + colId + colNombre + 4, y: c.y - 8, size: 6, font: c.fb, color: C.green });
    else if (d?.cumple === false) c.page.drawText('No Cumple', { x: c.m + colId + colNombre + 4, y: c.y - 8, size: 6, font: c.fb, color: C.red });
    else c.page.drawText('---', { x: c.m + colId + colNombre + 4, y: c.y - 8, size: 6, font: c.fr, color: C.gray });
    if (d?.observacion) c.page.drawText(trunc(d.observacion, 22), { x: c.m + colId + colNombre + colEstado + 4, y: c.y - 8, size: 5, font: c.fr, color: C.gray });
    c.y -= 13;
  }
  c.y -= 4;
  return c;
}

// ─── Tabla B/R/M/NT (kit, extintor) ─────────────────────
function drawEstadoTable(c: Ctx, title: string, items: { id: number; nombre: string; cantidad?: number }[], data: Record<number, { estado: string | null; observacion: string }>): Ctx {
  c = section(c, title);
  const tW = c.pw - c.m * 2;
  const colId = 22, colEst = 35, colObs = 75;
  const colNombre = tW - colId - colEst - colObs;
  c = need(c, 16);
  c.page.drawRectangle({ x: c.m, y: c.y - 12, width: tW, height: 14, color: C.lightGray });
  c.page.drawText('#', { x: c.m + 4, y: c.y - 9, size: 6, font: c.fb, color: C.dark });
  c.page.drawText('Elemento', { x: c.m + colId + 4, y: c.y - 9, size: 6, font: c.fb, color: C.dark });
  c.page.drawText('Estado', { x: c.m + colId + colNombre + 4, y: c.y - 9, size: 6, font: c.fb, color: C.dark });
  c.page.drawText('Observación', { x: c.m + colId + colNombre + colEst + 4, y: c.y - 9, size: 6, font: c.fb, color: C.dark });
  c.y -= 16;
  for (const it of items) {
    c = need(c, 14);
    const d = data[it.id];
    if (it.id % 2 === 0) c.page.drawRectangle({ x: c.m, y: c.y - 10, width: tW, height: 13, color: rgb(0.98, 0.98, 0.99) });
    c.page.drawText(it.cantidad ? String(it.cantidad) : String(it.id), { x: c.m + 4, y: c.y - 8, size: 6, font: c.fr, color: C.dark });
    c.page.drawText(trunc(it.nombre, 52), { x: c.m + colId + 4, y: c.y - 8, size: 5.5, font: c.fr, color: C.dark });
    const est = d?.estado || 'NT';
    const estColor = est === 'B' ? C.green : est === 'R' ? C.yellow : est === 'M' ? C.red : C.gray;
    const estLabel = est === 'B' ? 'Bueno' : est === 'R' ? 'Regular' : est === 'M' ? 'Malo' : 'No Tiene';
    c.page.drawText(estLabel, { x: c.m + colId + colNombre + 4, y: c.y - 8, size: 6, font: c.fb, color: estColor });
    if (d?.observacion) c.page.drawText(trunc(d.observacion, 20), { x: c.m + colId + colNombre + colEst + 4, y: c.y - 8, size: 5, font: c.fr, color: C.gray });
    c.y -= 13;
  }
  c.y -= 4;
  return c;
}

// ─── Tabla Botiquín (B/R/M/NT + Cant + Venc + Obs) ──────
function drawBotiquinTable(c: Ctx, data: Record<number, { estado: string | null; cantidad: string; fechaVencimiento: string; observacion: string }>): Ctx {
  c = section(c, 'BOTIQUÍN DE PRIMEROS AUXILIOS');
  const tW = c.pw - c.m * 2;
  const colCant = 25, colEst = 32, colVenc = 55, colObs = 60;
  const colNombre = tW - colCant - colEst - colVenc - colObs;
  c = need(c, 16);
  c.page.drawRectangle({ x: c.m, y: c.y - 12, width: tW, height: 14, color: C.lightGray });
  c.page.drawText('Cant', { x: c.m + 4, y: c.y - 9, size: 5, font: c.fb, color: C.dark });
  c.page.drawText('Elemento', { x: c.m + colCant + 4, y: c.y - 9, size: 6, font: c.fb, color: C.dark });
  c.page.drawText('Est.', { x: c.m + colCant + colNombre + 4, y: c.y - 9, size: 5, font: c.fb, color: C.dark });
  c.page.drawText('Vencimiento', { x: c.m + colCant + colNombre + colEst + 4, y: c.y - 9, size: 5, font: c.fb, color: C.dark });
  c.page.drawText('Obs.', { x: c.m + colCant + colNombre + colEst + colVenc + 4, y: c.y - 9, size: 5, font: c.fb, color: C.dark });
  c.y -= 16;
  for (const it of CAT_BOTIQUIN) {
    c = need(c, 14);
    const d = data[it.id];
    if (it.id % 2 === 0) c.page.drawRectangle({ x: c.m, y: c.y - 10, width: tW, height: 13, color: rgb(0.98, 0.98, 0.99) });
    c.page.drawText(String(d?.cantidad || it.cantidad), { x: c.m + 4, y: c.y - 8, size: 6, font: c.fr, color: C.dark });
    c.page.drawText(trunc(it.nombre, 40), { x: c.m + colCant + 4, y: c.y - 8, size: 5.5, font: c.fr, color: C.dark });
    const est = d?.estado || 'NT';
    const estColor = est === 'B' ? C.green : est === 'R' ? C.yellow : est === 'M' ? C.red : C.gray;
    c.page.drawText(est, { x: c.m + colCant + colNombre + 8, y: c.y - 8, size: 6, font: c.fb, color: estColor });
    if (d?.fechaVencimiento && it.tieneVencimiento) c.page.drawText(fmtDate(d.fechaVencimiento), { x: c.m + colCant + colNombre + colEst + 4, y: c.y - 8, size: 5, font: c.fr, color: C.dark });
    if (d?.observacion) c.page.drawText(trunc(d.observacion, 16), { x: c.m + colCant + colNombre + colEst + colVenc + 4, y: c.y - 8, size: 5, font: c.fr, color: C.gray });
    c.y -= 13;
  }
  c.y -= 4;
  return c;
}

// ══════════════════════════════════════════════════════════
// GENERADOR PRINCIPAL
// ══════════════════════════════════════════════════════════

export async function generateVehicularPDF(data: VehicularPDFData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.setTitle('Inspección Vehicular - ' + (data.codigoInspeccion || 'Nueva'));
  doc.setAuthor('TRANSPORTE Y LOGÍSTICA EQUINOX S.A.S.');
  doc.setSubject('Formato de Inspección Vehicular Integral HSEQ-FOR-065');
  doc.setCreator('Equinox Enterprise System');

  const fr = await doc.embedFont(StandardFonts.Helvetica);
  const fb = await doc.embedFont(StandardFonts.HelveticaBold);
  const pw = 612, ph = 792, m = 35;
  const p1 = doc.addPage([pw, ph]);
  let c: Ctx = { doc, page: p1, y: ph - 10, fr, fb, pw, ph, m };

  // ═══════════════════════════════════════════════════════
  // PÁGINA 1 — DATOS GENERALES
  // ═══════════════════════════════════════════════════════
  c = drawHeader(c, data);

  c = section(c, 'DATOS DEL CONDUCTOR');
  c = infoGrid(c, [
    { l: 'Nombre', v: data.conductor.nombre },
    { l: 'Cédula', v: data.conductor.cedula },
    { l: 'Edad', v: data.conductor.edad || 'N/A' },
    { l: 'RH', v: data.conductor.rh || 'N/A' },
    { l: 'EPS', v: data.conductor.eps || 'N/A' },
    { l: 'ARL', v: data.conductor.arl || 'N/A' },
    { l: 'Fondo Pensión', v: data.conductor.fondoPension || 'N/A' },
  ], 4);

  c = section(c, 'DATOS DEL VEHÍCULO');
  c = infoGrid(c, [
    { l: 'Placa', v: data.vehiculo.placa },
    { l: 'Marca', v: data.vehiculo.marca },
    { l: 'Línea', v: data.vehiculo.linea },
    { l: 'Modelo', v: data.vehiculo.modelo },
  ], 4);

  c = section(c, 'DATOS DEL REMOLQUE');
  c = infoGrid(c, [
    { l: 'Placa', v: data.remolque.placa },
    { l: 'Marca', v: data.remolque.marca },
    { l: 'Clase', v: data.remolque.clase },
    { l: 'Modelo', v: data.remolque.modelo },
  ], 4);

  c = section(c, 'DOCUMENTOS Y VIGENCIAS');
  c = docRow(c, 'SOAT', data.documentos.soat.cumple, data.documentos.soat.vencimiento);
  c = docRow(c, 'Revisión TM', data.documentos.rtm.cumple, data.documentos.rtm.vencimiento);
  c = docRow(c, 'Póliza', data.documentos.poliza.cumple, data.documentos.poliza.vencimiento);
  c = need(c, 28);
  const licOk = data.documentos.licencia.cumple === true;
  c.page.drawText('Licencia:', { x: m + 10, y: c.y, size: 8, font: fb, color: C.dark });
  c.page.drawText(licOk ? 'VIGENTE' : 'NO VIGENTE', { x: m + 100, y: c.y, size: 8, font: fb, color: licOk ? C.green : C.red });
  c.y -= 14;
  if (data.documentos.licencia.categorias?.length) {
    const cats = data.documentos.licencia.categorias.map(cat => {
      const v = data.documentos.licencia.vigencias?.[cat];
      return v ? cat + ' (' + fmtDate(v) + ')' : cat;
    }).join(', ');
    c.page.drawText('Categorías: ' + cats, { x: m + 10, y: c.y, size: 7, font: fr, color: C.gray });
    c.y -= 16;
  }

  c = section(c, 'CONDICIONES DE OPERACIÓN');
  c = infoGrid(c, [
    { l: 'Horas de Descanso', v: (data.condiciones.horasDormir || 0) + ' horas' },
    { l: 'Kilometraje Inicial', v: (data.condiciones.kilometrajeInicial || 0) + ' km' },
  ], 2);

  // ═══════════════════════════════════════════════════════
  // PÁGINAS 2+ — ÍTEMS PREOPERACIONALES (44)
  // ═══════════════════════════════════════════════════════
  c = newPage(c);
  c = drawHeader(c, data);

  const byCategoria = new Map<string, CatPreop[]>();
  for (const it of CAT_PREOP) {
    const arr = byCategoria.get(it.categoria) || [];
    arr.push(it);
    byCategoria.set(it.categoria, arr);
  }
  for (const [cat, items] of byCategoria) {
    c = drawPreopTable(c, cat.toUpperCase(), items, data.itemsPreoperacional);
  }

  // Summary box
  c = need(c, 30);
  const noCumple = data.totales.noCumple;
  const summBg = noCumple === 0 ? C.greenBg : C.redBg;
  const summColor = noCumple === 0 ? C.green : C.red;
  const summText = noCumple === 0 ? 'TODOS LOS ÍTEMS CUMPLEN' : noCumple + ' ÍTEM(S) NO CUMPLEN';
  c.page.drawRectangle({ x: m, y: c.y - 22, width: pw - m * 2, height: 24, color: summBg });
  c.page.drawText(summText, { x: m + 20, y: c.y - 16, size: 10, font: fb, color: summColor });
  c.page.drawText('Cumplimiento: ' + data.totales.porcentaje, { x: pw - m - 140, y: c.y - 16, size: 9, font: fb, color: summColor });
  c.y -= 35;

  // ═══════════════════════════════════════════════════════
  // KIT CONTROL DE DERRAME (21)
  // ═══════════════════════════════════════════════════════
  c = newPage(c);
  c = drawHeader(c, data);
  c = drawEstadoTable(c, 'KIT CONTROL DE DERRAME', CAT_KIT, data.kitDerrame);

  // ═══════════════════════════════════════════════════════
  // BOTIQUÍN (22)
  // ═══════════════════════════════════════════════════════
  c = drawBotiquinTable(c, data.botiquin);

  // ═══════════════════════════════════════════════════════
  // EXTINTOR (10)
  // ═══════════════════════════════════════════════════════
  c = drawEstadoTable(c, 'EXTINTOR', CAT_EXTINTOR, data.extintor.items);

  // Fechas del extintor
  if (data.extintor.fechaActual?.dia) {
    c = need(c, 30);
    c.page.drawText('Fecha actual del extintor: ' +
      data.extintor.fechaActual.dia + '/' + data.extintor.fechaActual.mes + '/' + data.extintor.fechaActual.ano,
      { x: m + 10, y: c.y, size: 7, font: fr, color: C.dark });
    c.y -= 14;
  }
  if (data.extintor.fechaProximaRecarga?.dia) {
    c.page.drawText('Próxima recarga: ' +
      data.extintor.fechaProximaRecarga.dia + '/' + data.extintor.fechaProximaRecarga.mes + '/' + data.extintor.fechaProximaRecarga.ano,
      { x: m + 10, y: c.y, size: 7, font: fr, color: C.dark });
    c.y -= 14;
  }

  // ═══════════════════════════════════════════════════════
  // RESUMEN GENERAL DE ESTADO
  // ═══════════════════════════════════════════════════════
  c = need(c, 60);
  c = section(c, 'RESUMEN GENERAL');
  const t = data.totales;
  c.page.drawRectangle({ x: m, y: c.y - 36, width: pw - m * 2, height: 38, color: C.blueBg });
  const cols = [
    { label: 'Buenos', val: t.bueno, color: C.green },
    { label: 'Regulares', val: t.regular, color: C.yellow },
    { label: 'Malos', val: t.malo, color: C.red },
    { label: 'No Tiene', val: t.noTiene, color: C.gray },
    { label: 'Cumplen', val: t.cumple, color: C.green },
    { label: 'No Cumplen', val: t.noCumple, color: C.red },
  ];
  const cW = (pw - m * 2) / cols.length;
  for (let i = 0; i < cols.length; i++) {
    const x = m + i * cW + 10;
    c.page.drawText(cols[i].label, { x, y: c.y - 12, size: 6, font: fb, color: C.gray });
    c.page.drawText(String(cols[i].val), { x, y: c.y - 26, size: 14, font: fb, color: cols[i].color });
  }
  c.y -= 50;

  // ═══════════════════════════════════════════════════════
  // OBSERVACIONES GENERALES
  // ═══════════════════════════════════════════════════════
  if (data.observacionesGenerales) {
    c = need(c, 50);
    c = section(c, 'OBSERVACIONES GENERALES');
    // Wrap text manually for long observations
    const words = data.observacionesGenerales.split(' ');
    let line = '';
    const maxW = pw - m * 2 - 20;
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      const tw = c.fr.widthOfTextAtSize(test, 7);
      if (tw > maxW && line) {
        c = need(c, 12);
        c.page.drawText(line, { x: m + 10, y: c.y, size: 7, font: fr, color: C.dark });
        c.y -= 12;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) {
      c = need(c, 12);
      c.page.drawText(line, { x: m + 10, y: c.y, size: 7, font: fr, color: C.dark });
      c.y -= 16;
    }
  }

  // ═══════════════════════════════════════════════════════
  // FIRMA DEL CONDUCTOR
  // ═══════════════════════════════════════════════════════
  c = need(c, 140);
  c = section(c, 'FIRMAS');
  const sigW = 220, sigH = 60;
  const leftX = m + 5;
  const rightX = pw / 2 + 15;
  const sigTopY = c.y;

  c.page.drawText('CONDUCTOR', { x: leftX, y: sigTopY, size: 7, font: fb, color: C.gray });
  const conductorSigY = sigTopY - 14;

  if (data.firmaConductor?.startsWith('data:image/png;base64,')) {
    try {
      const b64 = data.firmaConductor.replace(/^data:image\/png;base64,/, '');
      const bytes = Uint8Array.from(Buffer.from(b64, 'base64'));
      const img = await doc.embedPng(bytes);
      const sc = img.scaleToFit(sigW - 10, sigH - 5);
      c.page.drawImage(img, {
        x: leftX + (sigW - sc.width) / 2,
        y: conductorSigY - sigH + 3,
        width: sc.width, height: sc.height,
      });
    } catch {
      c.page.drawText('[Firma digital registrada]', { x: leftX + 10, y: conductorSigY - 30, size: 8, font: fr, color: C.gray });
    }
  }

  const uSigY = conductorSigY - sigH - 5;
  c.page.drawLine({ start: { x: leftX, y: uSigY }, end: { x: leftX + sigW, y: uSigY }, thickness: 1, color: C.dark });
  c.page.drawText(data.conductor.nombre, { x: leftX + 5, y: uSigY - 12, size: 8, font: fb, color: C.dark });
  c.page.drawText('C.C. ' + data.conductor.cedula, { x: leftX + 5, y: uSigY - 22, size: 7, font: fr, color: C.gray });
  c.page.drawText('Firma Conductor', { x: leftX + 5, y: uSigY - 32, size: 6, font: fr, color: C.gray });

  // HSEQ placeholder
  c.page.drawText('HSEQ / SST', { x: rightX, y: sigTopY, size: 7, font: fb, color: C.gray });
  c.page.drawLine({ start: { x: rightX, y: uSigY }, end: { x: rightX + sigW, y: uSigY }, thickness: 1, color: C.dark });
  c.page.drawText('________________________', { x: rightX + 5, y: uSigY - 12, size: 8, font: fb, color: C.dark });
  c.page.drawText('Responsable HSEQ / SST', { x: rightX + 5, y: uSigY - 22, size: 7, font: fr, color: C.gray });
  c.page.drawText('Firma HSEQ', { x: rightX + 5, y: uSigY - 32, size: 6, font: fr, color: C.gray });
  c.y = uSigY - 45;

  // ═══════════════════════════════════════════════════════
  // CERTIFICACIÓN
  // ═══════════════════════════════════════════════════════
  c = need(c, 50);
  c.page.drawRectangle({ x: m, y: c.y - 40, width: pw - m * 2, height: 42, color: C.warmBg });
  const certColor = rgb(0.57, 0.25, 0.05);
  c.page.drawText('Al firmar este documento, el conductor certifica que toda la información proporcionada es veraz', { x: m + 10, y: c.y - 14, size: 6, font: fr, color: certColor });
  c.page.drawText('y que ha realizado la inspección vehicular integral antes de iniciar la jornada laboral.', { x: m + 10, y: c.y - 24, size: 6, font: fr, color: certColor });
  c.page.drawText('Este documento fue generado electrónicamente por el sistema Equinox Enterprise.', { x: m + 10, y: c.y - 34, size: 6, font: fr, color: certColor });
  c.y -= 55;

  // Metadata footer
  const now = new Date().toLocaleString('es-CO');
  c.page.drawText('Generado: ' + now + ' | Sistema Equinox Enterprise v1.0', { x: m + 10, y: c.y, size: 5, font: fr, color: C.gray });

  // ═══════════════════════════════════════════════════════
  // Números de página + barras decorativas
  // ═══════════════════════════════════════════════════════
  const pages = doc.getPages();
  const total = pages.length;
  for (let i = 0; i < total; i++) {
    const p = pages[i];
    p.drawRectangle({ x: 0, y: 0, width: pw, height: 4, color: C.accent });
    p.drawText('Página ' + (i + 1) + ' de ' + total, { x: pw / 2 - 30, y: 10, size: 6, font: fr, color: C.gray });
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}
