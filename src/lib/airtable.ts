import Airtable from 'airtable';
import { 
  AIRTABLE_CONFIG, 
  TABLES, 
  USUARIO_FIELDS, 
  LOG_FIELDS,
  SELECT_OPTIONS,
  validateConfig 
} from './airtable-config';

/**
 * Cliente de Airtable para el Sistema Equinox Users Core
 * 
 * Este módulo proporciona acceso configurado a la base de datos
 * Airtable del Sistema Equinox Users Core.
 */

// Validar configuración al inicializar
validateConfig();

// Configurar cliente de Airtable
Airtable.configure({
  endpointUrl: AIRTABLE_CONFIG.BASE_URL,
  apiKey: AIRTABLE_CONFIG.API_KEY,
});

// Base principal del Sistema Equinox Users Core
const base = Airtable.base(AIRTABLE_CONFIG.BASE_ID);

export default base;

// ===========================================
// EXPORTAR CONFIGURACIONES
// ===========================================

export {
  AIRTABLE_CONFIG,
  TABLES,
  USUARIO_FIELDS,
  LOG_FIELDS,
  SELECT_OPTIONS,
};

// ===========================================
// TABLAS CONFIGURADAS
// ===========================================

export const UsuariosTable = base(TABLES.USUARIOS.ID);
export const LogsTable = base(TABLES.LOGS.ID);

// ===========================================
// FUNCIONES DE UTILIDAD
// ===========================================

/**
 * Crear un nuevo usuario en Airtable
 */
export async function crearUsuario(usuarioData: {
  nombreCompleto: string;
  email: string;
  telefono?: string;
  password: string;
  rol: string;
  estado: string;
  basesPermitidas?: string[];
  nivelAcceso: string;
  supervisor?: string[];
  notas?: string;
}) {
  try {
    const record = await UsuariosTable.create([
      {
        fields: {
          [USUARIO_FIELDS.NOMBRE_COMPLETO]: usuarioData.nombreCompleto,
          [USUARIO_FIELDS.EMAIL]: usuarioData.email,
          [USUARIO_FIELDS.TELEFONO]: usuarioData.telefono,
          [USUARIO_FIELDS.PASSWORD]: usuarioData.password,
          [USUARIO_FIELDS.ROL]: usuarioData.rol,
          [USUARIO_FIELDS.ESTADO]: usuarioData.estado,
          [USUARIO_FIELDS.BASES_PERMITIDAS]: usuarioData.basesPermitidas,
          [USUARIO_FIELDS.NIVEL_ACCESO]: usuarioData.nivelAcceso,
          [USUARIO_FIELDS.SUPERVISOR]: usuarioData.supervisor,
          [USUARIO_FIELDS.NOTAS]: usuarioData.notas,
        },
      },
    ]);

    return record[0];
  } catch (error) {
    console.error('Error creando usuario:', error);
    throw error;
  }
}

/**
 * Buscar usuario por email
 */
export async function buscarUsuarioPorEmail(email: string) {
  try {
    const records = await UsuariosTable.select({
      filterByFormula: `{${USUARIO_FIELDS.EMAIL}} = '${email}'`,
      maxRecords: 1,
    }).firstPage();

    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error('Error buscando usuario por email:', error);
    throw error;
  }
}

/**
 * Crear log de evento
 */
export async function crearLog(logData: {
  usuario?: string[];
  tipoEvento: string;
  entidadAfectada: string;
  idEntidad?: string;
  accion: string;
  descripcion?: string;
  baseOrigen: string;
  nivelSeveridad: string;
  ipOrigen?: string;
  automatico?: boolean;
}) {
  try {
    const record = await LogsTable.create([
      {
        fields: {
          [LOG_FIELDS.USUARIO]: logData.usuario,
          [LOG_FIELDS.TIPO_EVENTO]: logData.tipoEvento,
          [LOG_FIELDS.ENTIDAD_AFECTADA]: logData.entidadAfectada,
          [LOG_FIELDS.ID_ENTIDAD]: logData.idEntidad,
          [LOG_FIELDS.ACCION]: logData.accion,
          [LOG_FIELDS.DESCRIPCION]: logData.descripcion,
          [LOG_FIELDS.BASE_ORIGEN]: logData.baseOrigen,
          [LOG_FIELDS.NIVEL_SEVERIDAD]: logData.nivelSeveridad,
          [LOG_FIELDS.IP_ORIGEN]: logData.ipOrigen,
          [LOG_FIELDS.AUTOMATICO]: logData.automatico,
        },
      },
    ]);

    return record[0];
  } catch (error) {
    console.error('Error creando log:', error);
    throw error;
  }
}

/**
 * Obtener todos los usuarios activos
 */
export async function obtenerUsuariosActivos() {
  try {
    const records = await UsuariosTable.select({
      filterByFormula: `{${USUARIO_FIELDS.ESTADO}} = 'Activo'`,
      sort: [{ field: USUARIO_FIELDS.NOMBRE_COMPLETO, direction: 'asc' }],
    }).all();

    return records;
  } catch (error) {
    console.error('Error obteniendo usuarios activos:', error);
    throw error;
  }
}

/**
 * Obtener logs recientes
 */
export async function obtenerLogsRecientes(limite: number = 50) {
  try {
    const records = await LogsTable.select({
      sort: [{ field: LOG_FIELDS.FECHA_EVENTO, direction: 'desc' }],
      maxRecords: limite,
    }).all();

    return records;
  } catch (error) {
    console.error('Error obteniendo logs recientes:', error);
    throw error;
  }
}