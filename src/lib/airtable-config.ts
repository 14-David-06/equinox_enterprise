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
  CONDUCTOR_ID: 'Conductor ID',
  FECHA_REGISTRO: 'Fecha Registro',
  ULTIMA_ACTUALIZACION: 'Ultima Actualizacion',
  
  // Campos editables
  NOMBRE_COMPLETO: 'Nombre Completo',
  CEDULA: 'Cedula',
  TELEFONO: 'Telefono',
  EMAIL: 'Email',
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
  
  // GPS
  GPS_NOMBRE: 'GPS Nombre',
  GPS_USUARIO: 'GPS Usuario',
  GPS_AUTORIZACION: 'GPS Autorizacion',
  
  // Condiciones
  HORAS_DORMIR: 'Horas Dormir',
  KILOMETRAJE_INICIAL: 'Kilometraje Inicial',
  ITEMS_VERIFICACION: 'Items Verificacion',
  ITEMS_NO_CUMPLEN: 'Items No Cumplen',
  
  // Firma y consentimiento
  FIRMA_CONDUCTOR: 'Firma Conductor',
  ACEPTO_POLITICAS: 'Acepto Politicas',
  ACEPTO_COOKIES: 'Acepto Cookies',
  
  // Auditoría
  IP_ORIGEN: 'IP Origen',
  USER_AGENT: 'User Agent',
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