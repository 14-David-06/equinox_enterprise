/**
 * Script para crear los campos en la tabla de Inspección Vehicular en Airtable
 * 
 * REQUISITOS:
 * 1. Token de Airtable con permisos para Metadata API (schema.bases:write)
 * 2. Variables de entorno configuradas en .env.local
 * 
 * USO:
 * node scripts/create-airtable-fields.js
 */

require('dotenv').config({ path: '.env.local' });

const AIRTABLE_API_KEY = process.env.AIRTABLE_INSPECCION_VEHICULAR_API_KEY;
const BASE_ID = process.env.AIRTABLE_INSPECCION_VEHICULAR_BASE_ID;
const TABLE_ID = process.env.AIRTABLE_INSPECCION_VEHICULAR_TABLE_ID;

if (!AIRTABLE_API_KEY || !BASE_ID || !TABLE_ID) {
  console.error('❌ Error: Faltan variables de entorno');
  console.error('Configura en .env.local:');
  console.error('  - AIRTABLE_INSPECCION_VEHICULAR_API_KEY');
  console.error('  - AIRTABLE_INSPECCION_VEHICULAR_BASE_ID');
  console.error('  - AIRTABLE_INSPECCION_VEHICULAR_TABLE_ID');
  process.exit(1);
}

// Definición de todos los campos necesarios
const FIELDS_TO_CREATE = [
  // ============ METADATOS ============
  { name: 'Codigo Inspeccion', type: 'singleLineText', description: 'Código único de la inspección' },
  { name: 'Fecha Inspeccion', type: 'dateTime', description: 'Fecha y hora de la inspección' },
  { name: 'Codigo Formato', type: 'singleLineText', description: 'Código del formato (ej: HSEQ-FOR-065)' },
  { name: 'Version Formato', type: 'singleLineText', description: 'Versión del formato' },

  // ============ CONDUCTOR ============
  { name: 'Conductor Cedula', type: 'singleLineText', description: 'Número de cédula del conductor' },
  { name: 'Conductor Nombre', type: 'singleLineText', description: 'Nombre completo del conductor' },
  { name: 'Conductor Edad', type: 'singleLineText', description: 'Edad del conductor' },
  { name: 'Conductor EPS', type: 'singleLineText', description: 'EPS del conductor' },
  { name: 'Conductor ARL', type: 'singleLineText', description: 'ARL del conductor' },
  { name: 'Conductor Fondo Pension', type: 'singleLineText', description: 'Fondo de pensión del conductor' },
  { name: 'Conductor RH', type: 'singleLineText', description: 'Tipo de sangre RH del conductor' },

  // ============ VEHÍCULO ============
  { name: 'Vehiculo Placa', type: 'singleLineText', description: 'Placa del vehículo' },
  { name: 'Vehiculo Marca', type: 'singleLineText', description: 'Marca del vehículo' },
  { name: 'Vehiculo Linea', type: 'singleLineText', description: 'Línea del vehículo' },
  { name: 'Vehiculo Modelo', type: 'singleLineText', description: 'Modelo/Año del vehículo' },

  // ============ REMOLQUE ============
  { name: 'Remolque Placa', type: 'singleLineText', description: 'Placa del remolque' },
  { name: 'Remolque Marca', type: 'singleLineText', description: 'Marca del remolque' },
  { name: 'Remolque Clase', type: 'singleLineText', description: 'Clase del remolque' },
  { name: 'Remolque Modelo', type: 'singleLineText', description: 'Modelo del remolque' },

  // ============ DOCUMENTOS ============
  { name: 'SOAT Cumple', type: 'singleLineText', description: 'Estado del SOAT (Sí/No)' },
  { name: 'SOAT Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento del SOAT' },
  { name: 'RTM Cumple', type: 'singleLineText', description: 'Estado del RTM (Sí/No)' },
  { name: 'RTM Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento del RTM' },
  { name: 'Poliza Cumple', type: 'singleLineText', description: 'Estado de la Póliza (Sí/No)' },
  { name: 'Poliza Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento de la Póliza' },
  { name: 'Licencia Cumple', type: 'singleLineText', description: 'Estado de la Licencia (Sí/No)' },
  { name: 'Categorias Licencia', type: 'singleLineText', description: 'Categorías de la licencia' },
  { name: 'Vigencias Licencia', type: 'multilineText', description: 'Vigencias de las categorías (JSON)' },

  // ============ CONDICIONES OPERATIVAS ============
  { name: 'Horas Dormir', type: 'singleLineText', description: 'Horas de sueño' },
  { name: 'Kilometraje Inicial', type: 'singleLineText', description: 'Kilometraje inicial' },

  // ============ ITEMS PREOPERACIONAL (1-44) ============
  { name: 'Item 01 Extintor', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 01 Obs', type: 'multilineText', description: 'Observaciones item 01' },
  { name: 'Item 02 Equipo Carretera', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 02 Obs', type: 'multilineText', description: 'Observaciones item 02' },
  { name: 'Item 03 Botiquin', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 03 Obs', type: 'multilineText', description: 'Observaciones item 03' },
  { name: 'Item 04 Cinturones', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 04 Obs', type: 'multilineText', description: 'Observaciones item 04' },
  { name: 'Item 05 Bocina', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 05 Obs', type: 'multilineText', description: 'Observaciones item 05' },
  { name: 'Item 06 Luces', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 06 Obs', type: 'multilineText', description: 'Observaciones item 06' },
  { name: 'Item 07 Espejos', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 07 Obs', type: 'multilineText', description: 'Observaciones item 07' },
  { name: 'Item 08 Retrovisores', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 08 Obs', type: 'multilineText', description: 'Observaciones item 08' },
  { name: 'Item 09 Senalizacion', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 09 Obs', type: 'multilineText', description: 'Observaciones item 09' },
  { name: 'Item 10 Tanque', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 10 Obs', type: 'multilineText', description: 'Observaciones item 10' },
  { name: 'Item 11 Tapa Tanque', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 11 Obs', type: 'multilineText', description: 'Observaciones item 11' },
  { name: 'Item 12 Cabina', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 12 Obs', type: 'multilineText', description: 'Observaciones item 12' },
  { name: 'Item 13 Llantas', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 13 Obs', type: 'multilineText', description: 'Observaciones item 13' },
  { name: 'Item 14 Llanta Repuesto', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 14 Obs', type: 'multilineText', description: 'Observaciones item 14' },
  { name: 'Item 15 Rines', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 15 Obs', type: 'multilineText', description: 'Observaciones item 15' },
  { name: 'Item 16 Frenos', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 16 Obs', type: 'multilineText', description: 'Observaciones item 16' },
  { name: 'Item 17 Freno Mano', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 17 Obs', type: 'multilineText', description: 'Observaciones item 17' },
  { name: 'Item 18 Direccion', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 18 Obs', type: 'multilineText', description: 'Observaciones item 18' },
  { name: 'Item 19 Motor', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 19 Obs', type: 'multilineText', description: 'Observaciones item 19' },
  { name: 'Item 20 Fluidos', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 20 Obs', type: 'multilineText', description: 'Observaciones item 20' },
  { name: 'Item 21 Suspension', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 21 Obs', type: 'multilineText', description: 'Observaciones item 21' },
  { name: 'Item 22 Luces Func', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 22 Obs', type: 'multilineText', description: 'Observaciones item 22' },
  { name: 'Item 23 Fugas', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 23 Obs', type: 'multilineText', description: 'Observaciones item 23' },
  { name: 'Item 24 Herramientas', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 24 Obs', type: 'multilineText', description: 'Observaciones item 24' },
  { name: 'Item 25 Anclaje', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 25 Obs', type: 'multilineText', description: 'Observaciones item 25' },
  { name: 'Item 26 Cable Acero', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 26 Obs', type: 'multilineText', description: 'Observaciones item 26' },
  { name: 'Item 27 Espejos Est', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 27 Obs', type: 'multilineText', description: 'Observaciones item 27' },
  { name: 'Item 28 Torque', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 28 Obs', type: 'multilineText', description: 'Observaciones item 28' },
  { name: 'Item 29 Caja Cambios', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 29 Obs', type: 'multilineText', description: 'Observaciones item 29' },
  { name: 'Item 30 Amortiguadores', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 30 Obs', type: 'multilineText', description: 'Observaciones item 30' },
  { name: 'Item 31 Comp Suspension', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 31 Obs', type: 'multilineText', description: 'Observaciones item 31' },
  { name: 'Item 32 Refrigerante', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 32 Obs', type: 'multilineText', description: 'Observaciones item 32' },
  { name: 'Item 33 Mangueras', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 33 Obs', type: 'multilineText', description: 'Observaciones item 33' },
  { name: 'Item 34 Frenos Emerg', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 34 Obs', type: 'multilineText', description: 'Observaciones item 34' },
  { name: 'Item 35 Bateria', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 35 Obs', type: 'multilineText', description: 'Observaciones item 35' },
  { name: 'Item 36 Lubricacion', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 36 Obs', type: 'multilineText', description: 'Observaciones item 36' },
  { name: 'Item 37 Escape', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 37 Obs', type: 'multilineText', description: 'Observaciones item 37' },
  { name: 'Item 38 Correas', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 38 Obs', type: 'multilineText', description: 'Observaciones item 38' },
  { name: 'Item 39 Limpieza', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 39 Obs', type: 'multilineText', description: 'Observaciones item 39' },
  { name: 'Item 40 Descanso', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 40 Obs', type: 'multilineText', description: 'Observaciones item 40' },
  { name: 'Item 41 Tratamiento', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 41 Obs', type: 'multilineText', description: 'Observaciones item 41' },
  { name: 'Item 42 Ansiedad', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 42 Obs', type: 'multilineText', description: 'Observaciones item 42' },
  { name: 'Item 43 Neurologico', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 43 Obs', type: 'multilineText', description: 'Observaciones item 43' },
  { name: 'Item 44 Condiciones Salud', type: 'singleLineText', description: 'Estado: Cumple/No Cumple/N/A' },
  { name: 'Item 44 Obs', type: 'multilineText', description: 'Observaciones item 44' },

  // ============ TOTALES PREOPERACIONAL ============
  { name: 'Total Items Cumple', type: 'singleLineText', description: 'Total de items que cumplen' },
  { name: 'Total Items No Cumple', type: 'singleLineText', description: 'Total de items que no cumplen' },
  { name: 'Porcentaje Cumplimiento', type: 'singleLineText', description: 'Porcentaje de cumplimiento' },

  // ============ KIT DE DERRAME (101-121) ============
  { name: 'Kit 01 Panos Absorbentes', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 01 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 02 Barrera Absorbente', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 02 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 03 Traje Desechable', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 03 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 04 Bolsa Roja', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 04 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 05 Pala Plastica', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 05 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 06 Espatula', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 06 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 07 Guantes Nitrilo', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 07 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 08 Gafas Seguridad', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 08 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 09 Cinta Peligro', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 09 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 10 Martillo Goma', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 10 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 11 Recogedor', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 11 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 12 Respirador', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 12 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 13 Linterna', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 13 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 14 Granulado', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 14 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 15 Masilla', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 15 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 16 Desengrasante', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 16 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 17 Chaleco', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 17 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 18 Conos', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Kit 18 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 19 Procedimiento', type: 'singleLineText', description: 'Conoce procedimiento: B/R/M/NT' },
  { name: 'Kit 19 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 20 Almacenamiento', type: 'singleLineText', description: 'Almacenamiento adecuado: B/R/M/NT' },
  { name: 'Kit 20 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Kit 21 Rotulado', type: 'singleLineText', description: 'Rotulado correcto: B/R/M/NT' },
  { name: 'Kit 21 Obs', type: 'multilineText', description: 'Observaciones' },

  // ============ BOTIQUÍN (201-222) ============
  { name: 'Bot 22 Gasas', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 22 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 22 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 22 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 23 Esparadrapo', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 23 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 23 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 23 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 24 Bajalenguas', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 24 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 24 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 24 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 25 Guantes Latex', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 25 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 25 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 25 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 26 Aplicadores', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 26 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 26 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 26 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 27 Venda 2X5', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 27 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 27 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 27 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 28 Venda 3X5', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 28 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 28 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 28 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 29 Venda 5X5', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 29 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 29 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 29 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 30 Venda Alg 3X5', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 30 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 30 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 30 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 31 Venda Alg 5X5', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 31 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 31 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 31 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 32 Yodopovidona', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 32 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 32 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 32 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 33 Solucion Salina', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 33 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 33 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 33 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 34 Tapabocas', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 34 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 34 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 34 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 35 Alcohol', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 35 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 35 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 35 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 36 Curas', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 36 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 36 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 36 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 37 Jeringa', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 37 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 37 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 37 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 38 Tijeras', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 38 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 38 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 39 Parche Ocular', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 39 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 39 Vencimiento', type: 'singleLineText', description: 'Fecha de vencimiento' },
  { name: 'Bot 39 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 40 Termometro', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 40 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 40 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 41 Libreta', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 41 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 41 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 42 Lapicero', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 42 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 42 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Bot 43 Manual', type: 'singleLineText', description: 'Estado: B/R/M/NT' },
  { name: 'Bot 43 Cantidad', type: 'singleLineText', description: 'Cantidad' },
  { name: 'Bot 43 Obs', type: 'multilineText', description: 'Observaciones' },

  // ============ EXTINTOR (301-310) ============
  { name: 'Ext 44 Presion', type: 'singleLineText', description: 'Estado: B/R/M' },
  { name: 'Ext 44 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Ext 45 Sello', type: 'singleLineText', description: 'Estado: B/R/M' },
  { name: 'Ext 45 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Ext 46 Manometro', type: 'singleLineText', description: 'Estado: B/R/M' },
  { name: 'Ext 46 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Ext 47 Cilindro', type: 'singleLineText', description: 'Estado: B/R/M' },
  { name: 'Ext 47 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Ext 48 Manija', type: 'singleLineText', description: 'Estado: B/R/M' },
  { name: 'Ext 48 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Ext 49 Boquilla', type: 'singleLineText', description: 'Estado: B/R/M' },
  { name: 'Ext 49 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Ext 50 Anillo', type: 'singleLineText', description: 'Estado: B/R/M' },
  { name: 'Ext 50 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Ext 51 Pin', type: 'singleLineText', description: 'Estado: B/R/M' },
  { name: 'Ext 51 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Ext 52 Pintura', type: 'singleLineText', description: 'Estado: B/R/M' },
  { name: 'Ext 52 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Ext 53 Tarjeta', type: 'singleLineText', description: 'Estado: B/R/M' },
  { name: 'Ext 53 Obs', type: 'multilineText', description: 'Observaciones' },
  { name: 'Ext Fecha Actual', type: 'singleLineText', description: 'Fecha actual del extintor' },
  { name: 'Ext Fecha Proxima Recarga', type: 'singleLineText', description: 'Fecha próxima recarga' },

  // ============ FIRMA Y ESTADO ============
  { name: 'Firma Conductor', type: 'multilineText', description: 'Firma del conductor (base64)' },
  { name: 'Estado Inspeccion', type: 'singleLineText', description: 'Estado general de la inspección' },
  { name: 'Observaciones Generales', type: 'multilineText', description: 'Observaciones generales' },
  
  // ============ REVISIÓN HSEQ ============
  { name: 'Firma HSEQ', type: 'multilineText', description: 'Firma HSEQ (base64)' },
  { name: 'Nombre HSEQ', type: 'singleLineText', description: 'Nombre del revisor HSEQ' },
  { name: 'Fecha Revision HSEQ', type: 'singleLineText', description: 'Fecha de revisión HSEQ' },
  { name: 'Observaciones HSEQ', type: 'multilineText', description: 'Observaciones del revisor HSEQ' },
];

// Función para crear un campo usando la Metadata API
async function createField(field) {
  const url = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`;
  
  const options = {
    name: field.name,
    type: field.type,
    description: field.description,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      // Si el campo ya existe, no es un error
      if (errorBody.includes('DUPLICATE_FIELD_NAME') || errorBody.includes('already exists')) {
        console.log(`  ⏭️  Campo "${field.name}" ya existe - omitiendo`);
        return { skipped: true };
      }
      throw new Error(`Error ${response.status}: ${errorBody}`);
    }

    const result = await response.json();
    console.log(`  ✅ Campo "${field.name}" creado exitosamente`);
    return result;
  } catch (error) {
    console.error(`  ❌ Error creando campo "${field.name}":`, error.message);
    return { error: error.message };
  }
}

// Función principal
async function main() {
  console.log('============================================');
  console.log('Creador de Campos - Inspección Vehicular');
  console.log('============================================');
  console.log(`Base ID: ${BASE_ID}`);
  console.log(`Table ID: ${TABLE_ID}`);
  console.log(`Total de campos a crear: ${FIELDS_TO_CREATE.length}`);
  console.log('--------------------------------------------\n');

  let created = 0;
  let skipped = 0;
  let errors = 0;

  // Crear campos en lotes de 10 (para evitar rate limiting)
  const batchSize = 10;
  for (let i = 0; i < FIELDS_TO_CREATE.length; i += batchSize) {
    const batch = FIELDS_TO_CREATE.slice(i, i + batchSize);
    console.log(`\n📦 Procesando lote ${Math.floor(i / batchSize) + 1} de ${Math.ceil(FIELDS_TO_CREATE.length / batchSize)}...`);
    
    for (const field of batch) {
      const result = await createField(field);
      if (result.skipped) {
        skipped++;
      } else if (result.error) {
        errors++;
      } else {
        created++;
      }
      // Pequeña pausa para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Pausa más larga entre lotes
    if (i + batchSize < FIELDS_TO_CREATE.length) {
      console.log('  ⏳ Esperando 2 segundos antes del siguiente lote...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n============================================');
  console.log('RESUMEN:');
  console.log('============================================');
  console.log(`✅ Campos creados: ${created}`);
  console.log(`⏭️  Campos omitidos (ya existían): ${skipped}`);
  console.log(`❌ Errores: ${errors}`);
  console.log('============================================\n');
}

main().catch(console.error);
