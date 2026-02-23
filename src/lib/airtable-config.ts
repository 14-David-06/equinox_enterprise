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
  
  if (!apiKey || !baseId) {
    console.warn('⚠️ AIRTABLE INSPECCION VEHICULAR: Credenciales no configuradas. Revisa las variables de entorno.');
  }
  
  return {
    API_KEY: apiKey || '',
    BASE_ID: baseId || '',
    TABLE_ID: tableId || '',
    TABLE_NAME: process.env.AIRTABLE_INSPECCION_VEHICULAR_TABLE_NAME || 'Inspeccion Vehiccular',
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