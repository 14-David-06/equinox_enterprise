/**
 * Configuración de Airtable para el Sistema Equinox Users Core
 * 
 * Este archivo centraliza todas las configuraciones y constantes
 * necesarias para la integración con la base de datos Airtable.
 */

// ===========================================
// CONFIGURACIÓN PRINCIPAL
// ===========================================

function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable de entorno requerida faltante: ${name}`);
  }
  return value;
}

export const AIRTABLE_CONFIG = {
  // Credenciales de acceso
  API_KEY: getRequiredEnvVar('AIRTABLE_API_KEY'),
  BASE_ID: getRequiredEnvVar('AIRTABLE_BASE_ID'),
  BASE_URL: process.env.AIRTABLE_BASE_URL || 'https://api.airtable.com/v0',
  
  // Rate limiting
  RATE_LIMIT: parseInt(process.env.AIRTABLE_RATE_LIMIT || '5'),
  RATE_TIMEOUT: parseInt(process.env.AIRTABLE_RATE_TIMEOUT || '30000'),
} as const;

// ===========================================
// TABLAS DEL SISTEMA
// ===========================================

export const TABLES = {
  USUARIOS: {
    ID: getRequiredEnvVar('AIRTABLE_USUARIOS_TABLE_ID'),
    NAME: process.env.AIRTABLE_USUARIOS_TABLE_NAME || 'USUARIOS',
  },
  LOGS: {
    ID: getRequiredEnvVar('AIRTABLE_LOGS_TABLE_ID'),
    NAME: process.env.AIRTABLE_LOGS_TABLE_NAME || 'LOGS',
  },
} as const;

// ===========================================
// CAMPOS DE LA TABLA USUARIOS
// ===========================================

export const USUARIO_FIELDS = {
  // Campos computados (solo lectura)
  USUARIO_ID: getRequiredEnvVar('AIRTABLE_USUARIO_ID_FIELD'),
  FECHA_CREACION: getRequiredEnvVar('AIRTABLE_FECHA_CREACION_FIELD'),
  ULTIMO_ACCESO: getRequiredEnvVar('AIRTABLE_ULTIMO_ACCESO_FIELD'),
  
  // Campos editables
  NOMBRE_COMPLETO: getRequiredEnvVar('AIRTABLE_NOMBRE_COMPLETO_FIELD'),
  EMAIL: getRequiredEnvVar('AIRTABLE_EMAIL_FIELD'),
  TELEFONO: getRequiredEnvVar('AIRTABLE_TELEFONO_FIELD'),
  PASSWORD: getRequiredEnvVar('AIRTABLE_PASSWORD_FIELD'),
  ROL: getRequiredEnvVar('AIRTABLE_ROL_FIELD'),
  ESTADO: getRequiredEnvVar('AIRTABLE_ESTADO_FIELD'),
  BASES_PERMITIDAS: getRequiredEnvVar('AIRTABLE_BASES_PERMITIDAS_FIELD'),
  NIVEL_ACCESO: getRequiredEnvVar('AIRTABLE_NIVEL_ACCESO_FIELD'),
  SUPERVISOR: getRequiredEnvVar('AIRTABLE_SUPERVISOR_FIELD'),
  NOTAS: getRequiredEnvVar('AIRTABLE_NOTAS_FIELD'),
} as const;

// ===========================================
// CAMPOS DE LA TABLA LOGS
// ===========================================

export const LOG_FIELDS = {
  // Campos computados (solo lectura)
  LOG_ID: getRequiredEnvVar('AIRTABLE_LOG_ID_FIELD'),
  FECHA_EVENTO: getRequiredEnvVar('AIRTABLE_FECHA_EVENTO_FIELD'),
  
  // Campos editables
  USUARIO: getRequiredEnvVar('AIRTABLE_USUARIO_LOG_FIELD'),
  TIPO_EVENTO: getRequiredEnvVar('AIRTABLE_TIPO_EVENTO_FIELD'),
  ENTIDAD_AFECTADA: getRequiredEnvVar('AIRTABLE_ENTIDAD_AFECTADA_FIELD'),
  ID_ENTIDAD: getRequiredEnvVar('AIRTABLE_ID_ENTIDAD_FIELD'),
  ACCION: getRequiredEnvVar('AIRTABLE_ACCION_FIELD'),
  DESCRIPCION: getRequiredEnvVar('AIRTABLE_DESCRIPCION_LOG_FIELD'),
  BASE_ORIGEN: getRequiredEnvVar('AIRTABLE_BASE_ORIGEN_FIELD'),
  NIVEL_SEVERIDAD: getRequiredEnvVar('AIRTABLE_NIVEL_SEVERIDAD_FIELD'),
  IP_ORIGEN: getRequiredEnvVar('AIRTABLE_IP_ORIGEN_FIELD'),
  AUTOMATICO: getRequiredEnvVar('AIRTABLE_AUTOMATICO_FIELD'),
} as const;

// ===========================================
// OPCIONES DE SELECT
// ===========================================

export const SELECT_OPTIONS = {
  ROLES: (process.env.AIRTABLE_ROLES_DISPONIBLES || 'Admin,Operaciones,Finanzas,Flota,Gerencia').split(','),
  ESTADOS_USUARIO: (process.env.AIRTABLE_ESTADOS_USUARIO || 'Activo,Suspendido,Baja').split(','),
  BASES_SISTEMA: (process.env.AIRTABLE_BASES_SISTEMA || 'Operaciones,Flota,Comercial,Sistema').split(','),
  NIVELES_ACCESO: (process.env.AIRTABLE_NIVELES_ACCESO || 'Lectura,Edición,Administrador').split(','),
  TIPOS_EVENTO: (process.env.AIRTABLE_TIPOS_EVENTO || 'Login,Cambio Estado,Asignación,Facturación,Eliminación,Error').split(','),
  ENTIDADES: (process.env.AIRTABLE_ENTIDADES || 'Orden,Viaje,Factura,Vehículo,Usuario,Ruta').split(','),
  ACCIONES: (process.env.AIRTABLE_ACCIONES || 'Crear,Editar,Eliminar,Asignar,Aprobar').split(','),
  BASES_ORIGEN: (process.env.AIRTABLE_BASES_ORIGEN || 'Operaciones,Flota,Comercial,Sistema').split(','),
  NIVELES_SEVERIDAD: (process.env.AIRTABLE_NIVELES_SEVERIDAD || 'Info,Advertencia,Crítico').split(','),
} as const;

// ===========================================
// TIPOS TYPESCRIPT
// ===========================================

export type UsuarioRole = typeof SELECT_OPTIONS.ROLES[number];
export type EstadoUsuario = typeof SELECT_OPTIONS.ESTADOS_USUARIO[number];
export type BaseSistema = typeof SELECT_OPTIONS.BASES_SISTEMA[number];
export type NivelAcceso = typeof SELECT_OPTIONS.NIVELES_ACCESO[number];
export type TipoEvento = typeof SELECT_OPTIONS.TIPOS_EVENTO[number];
export type EntidadSistema = typeof SELECT_OPTIONS.ENTIDADES[number];
export type AccionSistema = typeof SELECT_OPTIONS.ACCIONES[number];
export type BaseOrigen = typeof SELECT_OPTIONS.BASES_ORIGEN[number];
export type NivelSeveridad = typeof SELECT_OPTIONS.NIVELES_SEVERIDAD[number];

// ===========================================
// INTERFACES DE DATOS
// ===========================================

export interface UsuarioAirtable {
  id?: string;
  createdTime?: string;
  fields: {
    [USUARIO_FIELDS.USUARIO_ID]?: string;
    [USUARIO_FIELDS.FECHA_CREACION]?: string;
    [USUARIO_FIELDS.ULTIMO_ACCESO]?: string;
    [USUARIO_FIELDS.NOMBRE_COMPLETO]: string;
    [USUARIO_FIELDS.EMAIL]: string;
    [USUARIO_FIELDS.TELEFONO]?: string;
    [USUARIO_FIELDS.PASSWORD]: string;
    [USUARIO_FIELDS.ROL]: UsuarioRole;
    [USUARIO_FIELDS.ESTADO]: EstadoUsuario;
    [USUARIO_FIELDS.BASES_PERMITIDAS]?: BaseSistema[];
    [USUARIO_FIELDS.NIVEL_ACCESO]: NivelAcceso;
    [USUARIO_FIELDS.SUPERVISOR]?: string[];
    [USUARIO_FIELDS.NOTAS]?: string;
  };
}

export interface LogAirtable {
  id?: string;
  createdTime?: string;
  fields: {
    [LOG_FIELDS.LOG_ID]?: string;
    [LOG_FIELDS.FECHA_EVENTO]?: string;
    [LOG_FIELDS.USUARIO]?: string[];
    [LOG_FIELDS.TIPO_EVENTO]: TipoEvento;
    [LOG_FIELDS.ENTIDAD_AFECTADA]: EntidadSistema;
    [LOG_FIELDS.ID_ENTIDAD]?: string;
    [LOG_FIELDS.ACCION]: AccionSistema;
    [LOG_FIELDS.DESCRIPCION]?: string;
    [LOG_FIELDS.BASE_ORIGEN]: BaseOrigen;
    [LOG_FIELDS.NIVEL_SEVERIDAD]: NivelSeveridad;
    [LOG_FIELDS.IP_ORIGEN]?: string;
    [LOG_FIELDS.AUTOMATICO]?: boolean;
  };
}

// ===========================================
// UTILIDADES DE VALIDACIÓN
// ===========================================

export function validateConfig(): boolean {
  const requiredVars = [
    'AIRTABLE_API_KEY',
    'AIRTABLE_BASE_ID',
    'AIRTABLE_USUARIOS_TABLE_ID',
    'AIRTABLE_LOGS_TABLE_ID',
    // Campos críticos para USUARIOS
    'AIRTABLE_USUARIO_ID_FIELD',
    'AIRTABLE_EMAIL_FIELD',
    'AIRTABLE_PASSWORD_FIELD',
    'AIRTABLE_ROL_FIELD',
    'AIRTABLE_ESTADO_FIELD',
    // Campos críticos para LOGS
    'AIRTABLE_LOG_ID_FIELD',
    'AIRTABLE_TIPO_EVENTO_FIELD',
    'AIRTABLE_NIVEL_SEVERIDAD_FIELD',
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missing);
    console.error('💡 Asegúrate de configurar todas las variables requeridas en .env.local');
    return false;
  }

  console.log('✅ Configuración de Airtable validada correctamente');
  return true;
}

export function getFullUrl(tableId: string): string {
  return `${AIRTABLE_CONFIG.BASE_URL}/${AIRTABLE_CONFIG.BASE_ID}/${tableId}`;
}

export function getAuthHeaders(): Record<string, string> {
  return {
    'Authorization': `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
    'Content-Type': 'application/json',
  };
}

// ===========================================
// CONFIGURACIÓN POR DEFECTO DE FETCH
// ===========================================

export const defaultFetchConfig = {
  headers: getAuthHeaders(),
  timeout: AIRTABLE_CONFIG.RATE_TIMEOUT,
};

// ===========================================
// VALIDACIÓN AL IMPORTAR EL MÓDULO
// ===========================================

if (process.env.NODE_ENV !== 'production') {
  validateConfig();
}