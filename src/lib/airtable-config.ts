/**
 * Configuración de Airtable para Equinox System Core
 * 
 * IMPORTANTE: Todos los IDs sensibles deben estar en variables de entorno (.env.local)
 * NO hardcodear Base IDs, Table IDs o Field IDs en el código fuente.
 * 
 * Usamos los NOMBRES de campos (no IDs) para mejor legibilidad.
 * Airtable permite usar ambos indistintamente.
 */

// ===========================================
// CONFIGURACIÓN PRINCIPAL - USUARIOS (Admin del sistema)
// ===========================================

export function getAirtableConfig() {
  const apiKey = process.env.AIRTABLE_EQUINOX_USERS_CORE_API_KEY;
  const baseId = process.env.AIRTABLE_EQUINOX_USERS_CORE_BASE_ID;
  
  // Validación de seguridad: no permitir inicio sin credenciales
  if (!apiKey || !baseId) {
    console.warn('⚠️ AIRTABLE: Credenciales no configuradas. Revisa las variables de entorno.');
  }
  
  return {
    // Credenciales de acceso (OBLIGATORIO desde variables de entorno)
    API_KEY: apiKey || '',
    BASE_ID: baseId || '',
    BASE_URL: process.env.AIRTABLE_BASE_URL || 'https://api.airtable.com/v0',
    
    // Rate limiting
    RATE_LIMIT: parseInt(process.env.AIRTABLE_RATE_LIMIT || '5'),
    RATE_TIMEOUT: parseInt(process.env.AIRTABLE_RATE_TIMEOUT || '30000'),
  } as const;
}

// ===========================================
// CONFIGURACIÓN - CONDUCTORES
// ===========================================

export function getConductoresConfig() {
  const apiKey = process.env.AIRTABLE_CONDUCTORES_API_KEY || process.env.AIRTABLE_EQUINOX_USERS_CORE_API_KEY;
  const baseId = process.env.AIRTABLE_CONDUCTORES_BASE_ID;
  
  if (!apiKey || !baseId) {
    console.warn('⚠️ AIRTABLE CONDUCTORES: Credenciales no configuradas. Revisa las variables de entorno.');
  }
  
  return {
    API_KEY: apiKey || '',
    BASE_ID: baseId || '',
    BASE_URL: 'https://api.airtable.com/v0',
  } as const;
}

// ===========================================
// CONFIGURACIÓN - FLOTA (Vehículos y Remolques)
// ===========================================

export function getFlotaConfig() {
  const apiKey = process.env.AIRTABLE_FLOTA_API_KEY || process.env.AIRTABLE_EQUINOX_USERS_CORE_API_KEY;
  const baseId = process.env.AIRTABLE_FLOTA_BASE_ID;
  
  if (!apiKey || !baseId) {
    console.warn('⚠️ AIRTABLE FLOTA: Credenciales no configuradas. Revisa las variables de entorno.');
  }
  
  return {
    API_KEY: apiKey || '',
    BASE_ID: baseId || '',
    BASE_URL: 'https://api.airtable.com/v0',
  } as const;
}

// ===========================================
// CONFIGURACIÓN - INSPECCIONES PREOPERACIONALES
// ===========================================

export function getInspeccionesConfig() {
  const apiKey = process.env.AIRTABLE_INSPECCIONES_API_KEY || process.env.AIRTABLE_EQUINOX_USERS_CORE_API_KEY;
  const baseId = process.env.AIRTABLE_INSPECCIONES_BASE_ID;
  
  if (!apiKey || !baseId) {
    console.warn('⚠️ AIRTABLE INSPECCIONES: Credenciales no configuradas. Revisa las variables de entorno.');
  }
  
  return {
    API_KEY: apiKey || '',
    BASE_ID: baseId || '',
    BASE_URL: 'https://api.airtable.com/v0',
  } as const;
}

// ===========================================
// CONFIGURACIÓN - INSPECCIONES VEHICULARES (HSEQ-FOR-065)
// ===========================================

export function getInspeccionVehicularConfig() {
  const apiKey = process.env.AIRTABLE_INSPECCION_VEHICULAR_API_KEY;
  const baseId = process.env.AIRTABLE_INSPECCION_VEHICULAR_BASE_ID;
  const tableId = process.env.AIRTABLE_INSPECCION_VEHICULAR_TABLE_ID;
  const tableItemsPreop    = process.env.AIRTABLE_ITEMS_PREOP_TABLE_ID;
  const tableItemsKit      = process.env.AIRTABLE_ITEMS_KIT_TABLE_ID;
  const tableItemsBotiquin = process.env.AIRTABLE_ITEMS_BOTIQUIN_TABLE_ID;
  const tableItemsExtintor = process.env.AIRTABLE_ITEMS_EXTINTOR_TABLE_ID;

  if (!apiKey || !baseId || !tableId || !tableItemsPreop || !tableItemsKit || !tableItemsBotiquin || !tableItemsExtintor) {
    console.warn('⚠️ AIRTABLE INSPECCION VEHICULAR: Variables de entorno incompletas. Revisa .env.local.');
  }

  return {
    API_KEY: apiKey || '',
    BASE_ID: baseId || '',
    // Tabla principal (encabezado)
    TABLE_ID:   tableId || '',
    TABLE_NAME: process.env.AIRTABLE_INSPECCION_VEHICULAR_TABLE_NAME || '',
    // Tablas hijas normalizadas (4NF)
    TABLE_ITEMS_PREOP:    tableItemsPreop    || '',
    TABLE_ITEMS_KIT:      tableItemsKit      || '',
    TABLE_ITEMS_BOTIQUIN: tableItemsBotiquin || '',
    TABLE_ITEMS_EXTINTOR: tableItemsExtintor || '',
    BASE_URL: 'https://api.airtable.com/v0',
  } as const;
}

export const AIRTABLE_CONFIG = getAirtableConfig();

// ===========================================
// TABLAS - Usar nombres (Airtable acepta ID o nombre)
// Los IDs se leen de variables de entorno si están disponibles
// ===========================================

export const TABLES = {
  // Base: Equinox Users Core
  USUARIOS: {
    ID: process.env.AIRTABLE_USUARIOS_TABLE_ID || '',
    NAME: 'USUARIOS',
  },
  LOGS: {
    ID: process.env.AIRTABLE_LOGS_TABLE_ID || '',
    NAME: 'LOGS',
  },
  // Base: Conductores Core
  CONDUCTORES: {
    ID: process.env.AIRTABLE_CONDUCTORES_TABLE_ID || '',
    NAME: 'CONDUCTORES',
  },
  // Base: Equinox Flota Core
  VEHICULOS: {
    ID: process.env.AIRTABLE_VEHICULOS_TABLE_ID || '',
    NAME: 'VEHICULOS',
  },
  REMOLQUES: {
    ID: process.env.AIRTABLE_REMOLQUES_TABLE_ID || '',
    NAME: 'REMOLQUES',
  },
  // Base: Inspecciones Preoperacionales Core
  INSPECCIONES_PREOPERACIONALES: {
    ID: process.env.AIRTABLE_INSPECCIONES_TABLE_ID || '',
    NAME: 'INSPECCIONES_PREOPERACIONALES',
  },
} as const;

// ===========================================
// CAMPOS DE LA TABLA CONDUCTORES
// ===========================================

export const CONDUCTOR_FIELDS = {
  // Campos computados (solo lectura)
  CODIGO_CONDUCTOR: 'Codigo Conductor',
  CONDUCTOR_ID: 'Conductor ID',
  FECHA_REGISTRO: 'Fecha Registro',
  ULTIMA_ACTUALIZACION: 'Ultima Actualizacion',
  
  // Campos editables
  NOMBRE_COMPLETO: 'Nombre Completo',
  CEDULA: 'Cedula',
  TELEFONO: 'Telefono',
  EMAIL: 'Email',
  
  // Campos de GPS
  GPS_NOMBRE: 'GPS Nombre',
  GPS_USUARIO: 'GPS Usuario',
  GPS_PASSWORD: 'GPS Password',
  GPS_AUTORIZACION_MONITOREO: 'GPS Autorizacion Monitoreo',
  
  // Campos personales
  EDAD: 'Edad',
  RH: 'RH',
  EPS: 'EPS',
  ARL: 'ARL',
  FONDO_PENSION: 'Fondo Pension',
  CATEGORIAS_LICENCIA: 'Categorias Licencia',
  LICENCIA_VIGENTE: 'Licencia Vigente',
  ESTADO: 'Estado',
  ACEPTO_POLITICAS: 'Acepto Politicas',
  ACEPTO_COOKIES: 'Acepto Cookies',
  NOTAS_INTERNAS: 'Notas Internas',
} as const;

// ===========================================
// CAMPOS DE LA TABLA VEHICULOS
// ===========================================

export const VEHICULO_FIELDS = {
  VEHICULO_ID: 'Vehiculo ID',
  PLACA: 'Placa',
  TIPO: 'Tipo',
  MARCA: 'Marca',
  LINEA: 'Linea',
  MODELO: 'Modelo',
  COLOR: 'Color',
  TARJETA_PROPIEDAD: 'Tarjeta Propiedad',
  SOAT_VENCIMIENTO: 'SOAT Vencimiento',
  RTM_VENCIMIENTO: 'RTM Vencimiento',
  POLIZA_VENCIMIENTO: 'Poliza Vencimiento',
  ESTADO: 'Estado',
  KILOMETRAJE_ACTUAL: 'Kilometraje Actual',
} as const;

// ===========================================
// CAMPOS DE LA TABLA REMOLQUES
// ===========================================

export const REMOLQUE_FIELDS = {
  REMOLQUE_ID: 'Remolque ID',
  PLACA: 'Placa',
  MARCA: 'Marca',
  CLASE: 'Clase',
  MODELO: 'Modelo',
  ESTADO: 'Estado',
} as const;

// ===========================================
// CAMPOS DE LA TABLA INSPECCION VEHICULAR (HSEQ-FOR-065)
// ===========================================

export const INSPECCION_VEHICULAR_FIELDS = {
  // Metadatos
  CODIGO_INSPECCION: 'Codigo Inspeccion',
  FECHA_INSPECCION: 'Fecha Inspeccion',
  CODIGO_FORMATO: 'Codigo Formato',
  VERSION_FORMATO: 'Version Formato',
  
  // Conductor
  CONDUCTOR_ID: 'Conductor ID',
  CONDUCTOR_CEDULA: 'Conductor Cedula',
  CONDUCTOR_NOMBRE: 'Conductor Nombre',
  CONDUCTOR_EDAD: 'Conductor Edad',
  CONDUCTOR_EPS: 'Conductor EPS',
  CONDUCTOR_ARL: 'Conductor ARL',
  CONDUCTOR_FONDO_PENSION: 'Conductor Fondo Pension',
  CONDUCTOR_RH: 'Conductor RH',
  
  // Vehículo
  VEHICULO_PLACA: 'Vehiculo Placa',
  VEHICULO_MARCA: 'Vehiculo Marca',
  VEHICULO_LINEA: 'Vehiculo Linea',
  VEHICULO_MODELO: 'Vehiculo Modelo',
  
  // Remolque
  REMOLQUE_PLACA: 'Remolque Placa',
  REMOLQUE_MARCA: 'Remolque Marca',
  REMOLQUE_CLASE: 'Remolque Clase',
  REMOLQUE_MODELO: 'Remolque Modelo',
  
  // Documentos
  SOAT_CUMPLE: 'SOAT Cumple',
  SOAT_VENCIMIENTO: 'SOAT Vencimiento',
  RTM_CUMPLE: 'RTM Cumple',
  RTM_VENCIMIENTO: 'RTM Vencimiento',
  POLIZA_CUMPLE: 'Poliza Cumple',
  POLIZA_VENCIMIENTO: 'Poliza Vencimiento',
  LICENCIA_CUMPLE: 'Licencia Cumple',
  CATEGORIAS_LICENCIA: 'Categorias Licencia',
  VIGENCIAS_LICENCIA: 'Vigencias Licencia',
  
  // Condiciones operativas
  HORAS_DORMIR: 'Horas Dormir',
  KILOMETRAJE_INICIAL: 'Kilometraje Inicial',
  
  // Items de verificación (44 items con sus observaciones)
  ITEM_01_EXTINTOR: 'Item 01 Extintor',
  ITEM_01_OBS: 'Item 01 Obs',
  ITEM_02_EQUIPO_CARRETERA: 'Item 02 Equipo Carretera',
  ITEM_02_OBS: 'Item 02 Obs',
  ITEM_03_BOTIQUIN: 'Item 03 Botiquin',
  ITEM_03_OBS: 'Item 03 Obs',
  ITEM_04_CINTURONES: 'Item 04 Cinturones',
  ITEM_04_OBS: 'Item 04 Obs',
  ITEM_05_BOCINA: 'Item 05 Bocina',
  ITEM_05_OBS: 'Item 05 Obs',
  ITEM_06_LUCES: 'Item 06 Luces',
  ITEM_06_OBS: 'Item 06 Obs',
  ITEM_07_ESPEJOS: 'Item 07 Espejos',
  ITEM_07_OBS: 'Item 07 Obs',
  ITEM_08_RETROVISORES: 'Item 08 Retrovisores',
  ITEM_08_OBS: 'Item 08 Obs',
  ITEM_09_SENALIZACION: 'Item 09 Senalizacion',
  ITEM_09_OBS: 'Item 09 Obs',
  ITEM_10_TANQUE: 'Item 10 Tanque',
  ITEM_10_OBS: 'Item 10 Obs',
  ITEM_11_TAPA_TANQUE: 'Item 11 Tapa Tanque',
  ITEM_11_OBS: 'Item 11 Obs',
  ITEM_12_CABINA: 'Item 12 Cabina',
  ITEM_12_OBS: 'Item 12 Obs',
  ITEM_13_LLANTAS: 'Item 13 Llantas',
  ITEM_13_OBS: 'Item 13 Obs',
  ITEM_14_LLANTA_REPUESTO: 'Item 14 Llanta Repuesto',
  ITEM_14_OBS: 'Item 14 Obs',
  ITEM_15_RINES: 'Item 15 Rines',
  ITEM_15_OBS: 'Item 15 Obs',
  ITEM_16_FRENOS: 'Item 16 Frenos',
  ITEM_16_OBS: 'Item 16 Obs',
  ITEM_17_FRENO_MANO: 'Item 17 Freno Mano',
  ITEM_17_OBS: 'Item 17 Obs',
  ITEM_18_DIRECCION: 'Item 18 Direccion',
  ITEM_18_OBS: 'Item 18 Obs',
  ITEM_19_MOTOR: 'Item 19 Motor',
  ITEM_19_OBS: 'Item 19 Obs',
  ITEM_20_FLUIDOS: 'Item 20 Fluidos',
  ITEM_20_OBS: 'Item 20 Obs',
  ITEM_21_SUSPENSION: 'Item 21 Suspension',
  ITEM_21_OBS: 'Item 21 Obs',
  ITEM_22_LUCES_FUNC: 'Item 22 Luces Func',
  ITEM_22_OBS: 'Item 22 Obs',
  ITEM_23_FUGAS: 'Item 23 Fugas',
  ITEM_23_OBS: 'Item 23 Obs',
  ITEM_24_HERRAMIENTAS: 'Item 24 Herramientas',
  ITEM_24_OBS: 'Item 24 Obs',
  ITEM_25_ANCLAJE: 'Item 25 Anclaje',
  ITEM_25_OBS: 'Item 25 Obs',
  ITEM_26_CABLE_ACERO: 'Item 26 Cable Acero',
  ITEM_26_OBS: 'Item 26 Obs',
  ITEM_27_ESPEJOS_EST: 'Item 27 Espejos Est',
  ITEM_27_OBS: 'Item 27 Obs',
  ITEM_28_TORQUE: 'Item 28 Torque',
  ITEM_28_OBS: 'Item 28 Obs',
  ITEM_29_CAJA_CAMBIOS: 'Item 29 Caja Cambios',
  ITEM_29_OBS: 'Item 29 Obs',
  ITEM_30_AMORTIGUADORES: 'Item 30 Amortiguadores',
  ITEM_30_OBS: 'Item 30 Obs',
  ITEM_31_COMP_SUSPENSION: 'Item 31 Comp Suspension',
  ITEM_31_OBS: 'Item 31 Obs',
  ITEM_32_REFRIGERANTE: 'Item 32 Refrigerante',
  ITEM_32_OBS: 'Item 32 Obs',
  ITEM_33_MANGUERAS: 'Item 33 Mangueras',
  ITEM_33_OBS: 'Item 33 Obs',
  ITEM_34_FRENOS_EMERG: 'Item 34 Frenos Emerg',
  ITEM_34_OBS: 'Item 34 Obs',
  ITEM_35_BATERIA: 'Item 35 Bateria',
  ITEM_35_OBS: 'Item 35 Obs',
  ITEM_36_LUBRICACION: 'Item 36 Lubricacion',
  ITEM_36_OBS: 'Item 36 Obs',
  ITEM_37_ESCAPE: 'Item 37 Escape',
  ITEM_37_OBS: 'Item 37 Obs',
  ITEM_38_CORREAS: 'Item 38 Correas',
  ITEM_38_OBS: 'Item 38 Obs',
  ITEM_39_LIMPIEZA: 'Item 39 Limpieza',
  ITEM_39_OBS: 'Item 39 Obs',
  ITEM_40_DESCANSO: 'Item 40 Descanso',
  ITEM_40_OBS: 'Item 40 Obs',
  ITEM_41_TRATAMIENTO: 'Item 41 Tratamiento',
  ITEM_41_OBS: 'Item 41 Obs',
  ITEM_42_ANSIEDAD: 'Item 42 Ansiedad',
  ITEM_42_OBS: 'Item 42 Obs',
  ITEM_43_NEUROLOGICO: 'Item 43 Neurologico',
  ITEM_43_OBS: 'Item 43 Obs',
  ITEM_44_CONDICIONES_SALUD: 'Item 44 Condiciones Salud',
  ITEM_44_OBS: 'Item 44 Obs',
  
  // Totales y porcentaje
  TOTAL_ITEMS_CUMPLE: 'Total Items Cumple',
  TOTAL_ITEMS_NO_CUMPLE: 'Total Items No Cumple',
  PORCENTAJE_CUMPLIMIENTO: 'Porcentaje Cumplimiento',
  
  // Firma y estado
  FIRMA_CONDUCTOR: 'Firma Conductor',
  ESTADO_INSPECCION: 'Estado Inspeccion',
  OBSERVACIONES_GENERALES: 'Observaciones Generales',
  
  // Revisión HSEQ
  FIRMA_HSEQ: 'Firma HSEQ',
  NOMBRE_HSEQ: 'Nombre HSEQ',
  FECHA_REVISION_HSEQ: 'Fecha Revision HSEQ',
  OBSERVACIONES_HSEQ: 'Observaciones HSEQ',
  
  // ===========================================
  // KIT DE DERRAME - Items (ID 1-18) y Preguntas (ID 19-21)
  // ===========================================
  KIT_01_PANOS_ABSORBENTES: 'Kit 01 Panos Absorbentes',
  KIT_01_OBS: 'Kit 01 Obs',
  KIT_02_BARRERA_ABSORBENTE: 'Kit 02 Barrera Absorbente',
  KIT_02_OBS: 'Kit 02 Obs',
  KIT_03_TRAJE_DESECHABLE: 'Kit 03 Traje Desechable',
  KIT_03_OBS: 'Kit 03 Obs',
  KIT_04_BOLSA_ROJA: 'Kit 04 Bolsa Roja',
  KIT_04_OBS: 'Kit 04 Obs',
  KIT_05_PALA_PLASTICA: 'Kit 05 Pala Plastica',
  KIT_05_OBS: 'Kit 05 Obs',
  KIT_06_ESPATULA: 'Kit 06 Espatula',
  KIT_06_OBS: 'Kit 06 Obs',
  KIT_07_GUANTES_NITRILO: 'Kit 07 Guantes Nitrilo',
  KIT_07_OBS: 'Kit 07 Obs',
  KIT_08_GAFAS_SEGURIDAD: 'Kit 08 Gafas Seguridad',
  KIT_08_OBS: 'Kit 08 Obs',
  KIT_09_CINTA_PELIGRO: 'Kit 09 Cinta Peligro',
  KIT_09_OBS: 'Kit 09 Obs',
  KIT_10_MARTILLO_GOMA: 'Kit 10 Martillo Goma',
  KIT_10_OBS: 'Kit 10 Obs',
  KIT_11_RECOGEDOR: 'Kit 11 Recogedor',
  KIT_11_OBS: 'Kit 11 Obs',
  KIT_12_RESPIRADOR: 'Kit 12 Respirador',
  KIT_12_OBS: 'Kit 12 Obs',
  KIT_13_LINTERNA: 'Kit 13 Linterna',
  KIT_13_OBS: 'Kit 13 Obs',
  KIT_14_GRANULADO: 'Kit 14 Granulado',
  KIT_14_OBS: 'Kit 14 Obs',
  KIT_15_MASILLA: 'Kit 15 Masilla',
  KIT_15_OBS: 'Kit 15 Obs',
  KIT_16_DESENGRASANTE: 'Kit 16 Desengrasante',
  KIT_16_OBS: 'Kit 16 Obs',
  KIT_17_CHALECO: 'Kit 17 Chaleco',
  KIT_17_OBS: 'Kit 17 Obs',
  KIT_18_CONOS: 'Kit 18 Conos',
  KIT_18_OBS: 'Kit 18 Obs',
  KIT_19_PROCEDIMIENTO: 'Kit 19 Procedimiento',
  KIT_19_OBS: 'Kit 19 Obs',
  KIT_20_ALMACENAMIENTO: 'Kit 20 Almacenamiento',
  KIT_20_OBS: 'Kit 20 Obs',
  KIT_21_ROTULADO: 'Kit 21 Rotulado',
  KIT_21_OBS: 'Kit 21 Obs',
  
  // ===========================================
  // BOTIQUÍN - Items (ID 22-43)
  // ===========================================
  BOT_22_GASAS: 'Bot 22 Gasas',
  BOT_22_CANTIDAD: 'Bot 22 Cantidad',
  BOT_22_VENCIMIENTO: 'Bot 22 Vencimiento',
  BOT_22_OBS: 'Bot 22 Obs',
  BOT_23_ESPARADRAPO: 'Bot 23 Esparadrapo',
  BOT_23_CANTIDAD: 'Bot 23 Cantidad',
  BOT_23_VENCIMIENTO: 'Bot 23 Vencimiento',
  BOT_23_OBS: 'Bot 23 Obs',
  BOT_24_BAJALENGUAS: 'Bot 24 Bajalenguas',
  BOT_24_CANTIDAD: 'Bot 24 Cantidad',
  BOT_24_VENCIMIENTO: 'Bot 24 Vencimiento',
  BOT_24_OBS: 'Bot 24 Obs',
  BOT_25_GUANTES_LATEX: 'Bot 25 Guantes Latex',
  BOT_25_CANTIDAD: 'Bot 25 Cantidad',
  BOT_25_VENCIMIENTO: 'Bot 25 Vencimiento',
  BOT_25_OBS: 'Bot 25 Obs',
  BOT_26_APLICADORES: 'Bot 26 Aplicadores',
  BOT_26_CANTIDAD: 'Bot 26 Cantidad',
  BOT_26_VENCIMIENTO: 'Bot 26 Vencimiento',
  BOT_26_OBS: 'Bot 26 Obs',
  BOT_27_VENDA_2X5: 'Bot 27 Venda 2X5',
  BOT_27_CANTIDAD: 'Bot 27 Cantidad',
  BOT_27_VENCIMIENTO: 'Bot 27 Vencimiento',
  BOT_27_OBS: 'Bot 27 Obs',
  BOT_28_VENDA_3X5: 'Bot 28 Venda 3X5',
  BOT_28_CANTIDAD: 'Bot 28 Cantidad',
  BOT_28_VENCIMIENTO: 'Bot 28 Vencimiento',
  BOT_28_OBS: 'Bot 28 Obs',
  BOT_29_VENDA_5X5: 'Bot 29 Venda 5X5',
  BOT_29_CANTIDAD: 'Bot 29 Cantidad',
  BOT_29_VENCIMIENTO: 'Bot 29 Vencimiento',
  BOT_29_OBS: 'Bot 29 Obs',
  BOT_30_VENDA_ALG_3X5: 'Bot 30 Venda Alg 3X5',
  BOT_30_CANTIDAD: 'Bot 30 Cantidad',
  BOT_30_VENCIMIENTO: 'Bot 30 Vencimiento',
  BOT_30_OBS: 'Bot 30 Obs',
  BOT_31_VENDA_ALG_5X5: 'Bot 31 Venda Alg 5X5',
  BOT_31_CANTIDAD: 'Bot 31 Cantidad',
  BOT_31_VENCIMIENTO: 'Bot 31 Vencimiento',
  BOT_31_OBS: 'Bot 31 Obs',
  BOT_32_YODOPOVIDONA: 'Bot 32 Yodopovidona',
  BOT_32_CANTIDAD: 'Bot 32 Cantidad',
  BOT_32_VENCIMIENTO: 'Bot 32 Vencimiento',
  BOT_32_OBS: 'Bot 32 Obs',
  BOT_33_SOLUCION_SALINA: 'Bot 33 Solucion Salina',
  BOT_33_CANTIDAD: 'Bot 33 Cantidad',
  BOT_33_VENCIMIENTO: 'Bot 33 Vencimiento',
  BOT_33_OBS: 'Bot 33 Obs',
  BOT_34_TAPABOCAS: 'Bot 34 Tapabocas',
  BOT_34_CANTIDAD: 'Bot 34 Cantidad',
  BOT_34_VENCIMIENTO: 'Bot 34 Vencimiento',
  BOT_34_OBS: 'Bot 34 Obs',
  BOT_35_ALCOHOL: 'Bot 35 Alcohol',
  BOT_35_CANTIDAD: 'Bot 35 Cantidad',
  BOT_35_VENCIMIENTO: 'Bot 35 Vencimiento',
  BOT_35_OBS: 'Bot 35 Obs',
  BOT_36_CURAS: 'Bot 36 Curas',
  BOT_36_CANTIDAD: 'Bot 36 Cantidad',
  BOT_36_VENCIMIENTO: 'Bot 36 Vencimiento',
  BOT_36_OBS: 'Bot 36 Obs',
  BOT_37_JERINGA: 'Bot 37 Jeringa',
  BOT_37_CANTIDAD: 'Bot 37 Cantidad',
  BOT_37_VENCIMIENTO: 'Bot 37 Vencimiento',
  BOT_37_OBS: 'Bot 37 Obs',
  BOT_38_TIJERAS: 'Bot 38 Tijeras',
  BOT_38_CANTIDAD: 'Bot 38 Cantidad',
  BOT_38_OBS: 'Bot 38 Obs',
  BOT_39_PARCHE_OCULAR: 'Bot 39 Parche Ocular',
  BOT_39_CANTIDAD: 'Bot 39 Cantidad',
  BOT_39_VENCIMIENTO: 'Bot 39 Vencimiento',
  BOT_39_OBS: 'Bot 39 Obs',
  BOT_40_TERMOMETRO: 'Bot 40 Termometro',
  BOT_40_CANTIDAD: 'Bot 40 Cantidad',
  BOT_40_OBS: 'Bot 40 Obs',
  BOT_41_LIBRETA: 'Bot 41 Libreta',
  BOT_41_CANTIDAD: 'Bot 41 Cantidad',
  BOT_41_OBS: 'Bot 41 Obs',
  BOT_42_LAPICERO: 'Bot 42 Lapicero',
  BOT_42_CANTIDAD: 'Bot 42 Cantidad',
  BOT_42_OBS: 'Bot 42 Obs',
  BOT_43_MANUAL: 'Bot 43 Manual',
  BOT_43_CANTIDAD: 'Bot 43 Cantidad',
  BOT_43_OBS: 'Bot 43 Obs',
  
  // ===========================================
  // EXTINTOR - Items (ID 44-53) y Fechas
  // ===========================================
  EXT_44_PRESION: 'Ext 44 Presion',
  EXT_44_OBS: 'Ext 44 Obs',
  EXT_45_SELLO: 'Ext 45 Sello',
  EXT_45_OBS: 'Ext 45 Obs',
  EXT_46_MANOMETRO: 'Ext 46 Manometro',
  EXT_46_OBS: 'Ext 46 Obs',
  EXT_47_CILINDRO: 'Ext 47 Cilindro',
  EXT_47_OBS: 'Ext 47 Obs',
  EXT_48_MANIJA: 'Ext 48 Manija',
  EXT_48_OBS: 'Ext 48 Obs',
  EXT_49_BOQUILLA: 'Ext 49 Boquilla',
  EXT_49_OBS: 'Ext 49 Obs',
  EXT_50_ANILLO: 'Ext 50 Anillo',
  EXT_50_OBS: 'Ext 50 Obs',
  EXT_51_PIN: 'Ext 51 Pin',
  EXT_51_OBS: 'Ext 51 Obs',
  EXT_52_PINTURA: 'Ext 52 Pintura',
  EXT_52_OBS: 'Ext 52 Obs',
  EXT_53_TARJETA: 'Ext 53 Tarjeta',
  EXT_53_OBS: 'Ext 53 Obs',
  EXT_FECHA_ACTUAL: 'Ext Fecha Actual',
  EXT_FECHA_PROXIMA_RECARGA: 'Ext Fecha Proxima Recarga',
  
  // Agregados estado (kit/botiquín/extintor)
  TOTAL_BUENO: 'Total Bueno',
  TOTAL_REGULAR: 'Total Regular',
  TOTAL_MALO: 'Total Malo',
  TOTAL_NO_TIENE: 'Total No Tiene',
} as const;

// ===========================================
// CAMPOS DE LAS TABLAS HIJAS (4NF)
// Cada fila es un ítem de inspección. Se relacionan con la
// tabla principal mediante el campo "Inspeccion" (linked record).
// ===========================================

/** Items Preoperacional — tabla tblt1u5HVdWZfWrYU */
export const ITEMS_PREOP_FIELDS = {
  ITEM_NOMBRE: 'Item Nombre',
  ITEM_NUMERO: 'Item Numero',
  CATEGORIA: 'Categoria',      // Seguridad | Generales | Mecanico | Correas | Higiene | Salud
  CUMPLE: 'Cumple',            // Cumple | No Cumple | N/A
  OBSERVACION: 'Observacion',
  INSPECCION: 'Inspeccion',    // linked record → Inspeccion Vehiccular
} as const;

/** Items Kit Derrame — tabla tblJVw6v3q0KIj61D */
export const ITEMS_KIT_FIELDS = {
  ITEM_NOMBRE: 'Item Nombre',
  ITEM_NUMERO: 'Item Numero',
  TIPO_ITEM: 'Tipo Item',      // Material | Pregunta de Verificacion
  ESTADO: 'Estado',            // B | R | M | NT
  OBSERVACION: 'Observacion',
  INSPECCION: 'Inspeccion',
} as const;

/** Items Botiquín — tabla tblMOa81d8VSIL4bU */
export const ITEMS_BOTIQUIN_FIELDS = {
  ITEM_NOMBRE: 'Item Nombre',
  ITEM_NUMERO: 'Item Numero',
  ESTADO: 'Estado',            // B | R | M | NT
  CANTIDAD: 'Cantidad',
  FECHA_VENCIMIENTO: 'Fecha Vencimiento',
  OBSERVACION: 'Observacion',
  INSPECCION: 'Inspeccion',
} as const;

/** Items Extintor — tabla tbl3jzyUo8KM4KBXQ */
export const ITEMS_EXTINTOR_FIELDS = {
  ITEM_NOMBRE: 'Item Nombre',
  ITEM_NUMERO: 'Item Numero',
  ESTADO: 'Estado',            // B | R | M
  OBSERVACION: 'Observacion',
  INSPECCION: 'Inspeccion',
} as const;

// ===========================================
// CAMPOS DE LA TABLA INSPECCIONES_PREOPERACIONALES
// ===========================================

export const INSPECCION_PREOP_FIELDS = {
  // Metadatos (solo lectura)
  CODIGO_INSPECCION: 'Codigo Inspeccion',
  INSPECCION_ID: 'Inspeccion ID',
  FECHA_CREACION: 'Fecha Creacion',
  
  // Información del formato
  FECHA_INSPECCION: 'Fecha Inspeccion',
  CODIGO_FORMATO: 'Codigo Formato',
  VERSION_FORMATO: 'Version Formato',
  
  // Conductor
  CONDUCTOR_CEDULA: 'Conductor Cedula',
  CONDUCTOR_NOMBRE: 'Conductor Nombre',
  CONDUCTOR_TELEFONO: 'Conductor Telefono',
  CONDUCTOR_EMAIL: 'Conductor Email',
  CONDUCTOR_EDAD: 'Conductor Edad',
  CONDUCTOR_RH: 'Conductor RH',
  CONDUCTOR_EPS: 'Conductor EPS',
  CONDUCTOR_ARL: 'Conductor ARL',
  CONDUCTOR_FONDO_PENSION: 'Conductor Fondo Pension',
  
  // GPS
  GPS_NOMBRE: 'GPS Nombre',
  GPS_USUARIO: 'GPS Usuario',
  GPS_PASSWORD: 'GPS Password',
  GPS_AUTORIZACION_MONITOREO: 'GPS Autorizacion Monitoreo',
  
  // Vehículo
  VEHICULO_PLACA: 'Vehiculo Placa',
  VEHICULO_MARCA: 'Vehiculo Marca',
  VEHICULO_LINEA: 'Vehiculo Linea',
  VEHICULO_MODELO: 'Vehiculo Modelo',
  VEHICULO_COLOR: 'Vehiculo Color',
  TARJETA_PROPIEDAD: 'Tarjeta Propiedad',
  
  // Remolque
  REMOLQUE_PLACA: 'Remolque Placa',
  REMOLQUE_MARCA: 'Remolque Marca',
  REMOLQUE_CLASE: 'Remolque Clase',
  REMOLQUE_MODELO: 'Remolque Modelo',
  
  // Documentos
  SOAT_CUMPLE: 'SOAT Cumple',
  SOAT_VENCIMIENTO: 'SOAT Vencimiento',
  RTM_CUMPLE: 'RTM Cumple',
  RTM_VENCIMIENTO: 'RTM Vencimiento',
  POLIZA_CUMPLE: 'Poliza Cumple',
  POLIZA_VENCIMIENTO: 'Poliza Vencimiento',
  LICENCIA_CUMPLE: 'Licencia Cumple',
  CATEGORIAS_LICENCIA: 'Categorias Licencia',
  VIGENCIAS_LICENCIA: 'Vigencias Licencia',
  
  // Condiciones
  HORAS_DORMIR: 'Horas Dormir',
  KILOMETRAJE_INICIAL: 'Kilometraje Inicial',
  ITEMS_VERIFICACION: 'Items Verificacion',
  ITEMS_NO_CUMPLEN: 'Items No Cumplen',
  
  // Firma y consentimiento
  FIRMA_CONDUCTOR: 'Firma Conductor',
  ACEPTO_POLITICAS: 'Acepto Politicas',
  ACEPTO_COOKIES: 'Acepto Cookies',
  
  // Referencia al conductor
  ID_CONDUCTOR: 'ID Conductor',
  
  // Auditoría
  IP_ORIGEN: 'IP Origen',
  USER_AGENT: 'User Agent',
  
  // Documento y estado
  DOC_PREOPERACIONAL: 'Doc Preoperacional',
  ESTADO_PREOPERACIONAL: 'Estado Preoperacional',
  
  // Revisión HSEQ
  FIRMA_HSEQ: 'Firma HSEQ',
  NOMBRE_HSEQ: 'Nombre HSEQ',
  FECHA_REVISION: 'Fecha Revision',
  OBSERVACIONES_REVISION: 'Observaciones Revision',
} as const;

// ===========================================
// CAMPOS DE LA TABLA USUARIOS
// Usamos nombres de campos (más legible y seguro)
// ===========================================

export const USUARIO_FIELDS = {
  // Campos computados (solo lectura)
  USUARIO_ID: 'Usuario ID',
  FECHA_CREACION: 'Fecha Creacion',
  ULTIMO_ACCESO: 'Último Acceso',
  
  // Campos editables
  NOMBRE_COMPLETO: 'Nombre Completo',
  EMAIL: 'Email',
  TIPO_DOCUMENTO: 'Tipo Documento',
  NUMERO_DOCUMENTO: 'Numero Documento',
  TELEFONO: 'Teléfono',
  PASSWORD: 'Password',
  ROL: 'Rol',
  ESTADO: 'Estado',
  BASES_PERMITIDAS: 'Bases Permitidas',
  NIVEL_ACCESO: 'Nivel Acceso',
  SUPERVISOR: 'Supervisor',
  NOTAS: 'Notas',
} as const;

// Valores permitidos para campos Single Select
export const USUARIO_ROLES = ['Admin', 'Operaciones', 'Finanzas', 'Flota', 'Gerencia'] as const;
export const USUARIO_ESTADOS = ['Activo', 'Suspendido', 'Baja'] as const;
export const USUARIO_NIVELES_ACCESO = ['Lectura', 'Edición', 'Administrador'] as const;
export const USUARIO_BASES_PERMITIDAS = ['Operaciones', 'Flota', 'Comercial', 'Sistema'] as const;

// ===========================================
// CAMPOS DE LA TABLA LOGS
// Usamos nombres de campos (más legible y seguro)
// ===========================================

export const LOG_FIELDS = {
  // Campos computados (solo lectura)
  LOG_ID: 'Log ID',
  FECHA_EVENTO: 'Fecha Evento',
  
  // Campos editables
  USUARIO: 'Usuario',
  TIPO_EVENTO: 'Tipo Evento',
  ENTIDAD_AFECTADA: 'Entidad Afectada',
  ID_ENTIDAD: 'ID Entidad',
  ACCION: 'Acción',
  DESCRIPCION: 'Descripción',
  BASE_ORIGEN: 'Base Origen',
  NIVEL_SEVERIDAD: 'Nivel Severidad',
  IP_ORIGEN: 'IP Origen',
  AUTOMATICO: 'Automático',
} as const;

// ===========================================
// CAMPOS DE LA TABLA INSPECCIONES
// ===========================================

export const INSPECCION_FIELDS = {
  // Metadatos (solo lectura / auto-generados)
  INSPECCION_ID: 'Inspeccion ID',
  FECHA_CREACION: 'Fecha Creacion',
  
  // Información del formato (fija)
  CODIGO_FORMATO: 'Codigo Formato',
  VERSION_FORMATO: 'Version Formato',
  FECHA_EDICION_FORMATO: 'Fecha Edicion Formato',
  FECHA_INSPECCION: 'Fecha Inspeccion',
  
  // Documentos
  SOAT_CUMPLE: 'SOAT Cumple',
  SOAT_VENCIMIENTO: 'SOAT Vencimiento',
  SOAT_OBSERVACION: 'SOAT Observacion',
  REVISION_TECNICA_CUMPLE: 'Revision Tecnica Cumple',
  REVISION_TECNICA_VENCIMIENTO: 'Revision Tecnica Vencimiento',
  REVISION_TECNICA_OBSERVACION: 'Revision Tecnica Observacion',
  POLIZA_CUMPLE: 'Poliza Cumple',
  POLIZA_VENCIMIENTO: 'Poliza Vencimiento',
  POLIZA_OBSERVACION: 'Poliza Observacion',
  LICENCIA_CUMPLE: 'Licencia Cumple',
  LICENCIA_VENCIMIENTO: 'Licencia Vencimiento',
  LICENCIA_OBSERVACION: 'Licencia Observacion',
  
  // Categorías de licencia (JSON)
  CATEGORIAS_LICENCIA: 'Categorias Licencia',
  VIGENCIAS_LICENCIA: 'Vigencias Licencia',
  
  // Conductor
  NOMBRE_CONDUCTOR: 'Nombre Conductor',
  CEDULA: 'Cedula',
  EDAD: 'Edad',
  ARL: 'ARL',
  EPS: 'EPS',
  FONDO_PENSION: 'Fondo Pension',
  RH: 'RH',
  
  // Vehículo
  PLACA_VEHICULO: 'Placa Vehiculo',
  MARCA_VEHICULO: 'Marca Vehiculo',
  LINEA_VEHICULO: 'Linea Vehiculo',
  MODELO_VEHICULO: 'Modelo Vehiculo',
  COLOR_VEHICULO: 'Color Vehiculo',
  TARJETA_PROPIEDAD: 'Tarjeta Propiedad',
  
  // Remolque
  PLACA_REMOLQUE: 'Placa Remolque',
  MARCA_REMOLQUE: 'Marca Remolque',
  CLASE_REMOLQUE: 'Clase Remolque',
  MODELO_REMOLQUE: 'Modelo Remolque',
  
  // Horas dormir
  HORAS_DORMIR: 'Horas Dormir',
  
  // Items de verificación (JSON con todos los items)
  ITEMS_VERIFICACION: 'Items Verificacion',
  
  // Condiciones adicionales
  DESINFECCION: 'Desinfeccion',
  DESCANSO: 'Descanso',
  
  // Salud del conductor
  TOMA_MEDICACION: 'Toma Medicacion',
  ANSIEDAD_ESTRES: 'Ansiedad Estres',
  PROBLEMAS_VISUALES: 'Problemas Visuales',
  ESTADO_SALUD: 'Estado Salud',
  
  // Firmas
  CEDULA_FIRMA_CONDUCTOR: 'Cedula Firma Conductor',
  CEDULA_FIRMA_HSEQ: 'Cedula Firma HSEQ',
  
  // Estado de la inspección
  ESTADO_INSPECCION: 'Estado Inspeccion',
} as const;

// Valores permitidos para campos Single Select en LOGS
export const LOG_TIPOS_EVENTO = ['Login', 'Cambio Estado', 'Asignación', 'Facturación', 'Eliminación', 'Error'] as const;
export const LOG_ENTIDADES = ['Orden', 'Viaje', 'Factura', 'Vehículo', 'Usuario', 'Ruta'] as const;
export const LOG_ACCIONES = ['Crear', 'Editar', 'Eliminar', 'Asignar', 'Aprobar'] as const;
export const LOG_BASES_ORIGEN = ['Operaciones', 'Flota', 'Comercial', 'Sistema'] as const;
export const LOG_NIVELES_SEVERIDAD = ['Info', 'Advertencia', 'Crítico'] as const;

// ===========================================
// TIPOS TYPESCRIPT
// ===========================================

export type UsuarioRole = (typeof USUARIO_ROLES)[number];
export type EstadoUsuario = (typeof USUARIO_ESTADOS)[number];
export type NivelAcceso = (typeof USUARIO_NIVELES_ACCESO)[number];
export type BaseSistema = (typeof USUARIO_BASES_PERMITIDAS)[number];
export type TipoEvento = (typeof LOG_TIPOS_EVENTO)[number];
export type EntidadSistema = (typeof LOG_ENTIDADES)[number];
export type AccionSistema = (typeof LOG_ACCIONES)[number];
export type BaseOrigen = (typeof LOG_BASES_ORIGEN)[number];
export type NivelSeveridad = (typeof LOG_NIVELES_SEVERIDAD)[number];

// ===========================================
// INTERFACES DE DATOS
// ===========================================

export interface UsuarioAirtable {
  id?: string;
  createdTime?: string;
  fields: {
    'Usuario ID'?: string;
    'Fecha Creacion'?: string;
    'Último Acceso'?: string;
    'Nombre Completo': string;
    'Email'?: string;
    'Tipo Documento'?: string;
    'Numero Documento'?: string;
    'Teléfono'?: string;
    'Password'?: string;
    'Rol'?: UsuarioRole;
    'Estado'?: EstadoUsuario;
    'Bases Permitidas'?: BaseSistema[];
    'Nivel Acceso'?: NivelAcceso;
    'Supervisor'?: string[];
    'Notas'?: string;
  };
}

export interface LogAirtable {
  id?: string;
  createdTime?: string;
  fields: {
    'Log ID'?: string;
    'Fecha Evento'?: string;
    'Usuario'?: string[];
    'Tipo Evento': TipoEvento;
    'Entidad Afectada': EntidadSistema;
    'ID Entidad'?: string;
    'Acción': AccionSistema;
    'Descripción'?: string;
    'Base Origen': BaseOrigen;
    'Nivel Severidad': NivelSeveridad;
    'IP Origen'?: string;
    'Automático'?: boolean;
  };
}

// ===========================================
// VALIDACIÓN SIMPLE
// ===========================================

export function validateConfig(): boolean {
  const config = getAirtableConfig();
  
  if (!config.API_KEY) {
    console.error('❌ AIRTABLE_EQUINOX_USERS_CORE_API_KEY no está configurada');
    return false;
  }
  
  if (!config.BASE_ID) {
    console.error('❌ AIRTABLE_EQUINOX_USERS_CORE_BASE_ID no está configurada');
    return false;
  }

  console.log('✅ Configuración de Airtable validada correctamente');
  return true;
}