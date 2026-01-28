import { 
  getAirtableConfig, 
  TABLES,
  USUARIO_FIELDS, 
  LOG_FIELDS,
} from './airtable-config';

/**
 * Cliente de Airtable para Equinox System Core
 * 
 * Usa fetch directo a la API de Airtable para mejor compatibilidad.
 */

interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

// Función para hacer peticiones a la API de Airtable
async function airtableFetch(
  tableName: string, 
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    params?: Record<string, string>;
    body?: Record<string, unknown>;
    recordId?: string;
  } = {}
): Promise<AirtableResponse | AirtableRecord> {
  const config = getAirtableConfig();
  
  if (!config.API_KEY) {
    throw new Error('AIRTABLE_EQUINOX_USERS_CORE_API_KEY no está configurada');
  }

  const { method = 'GET', params, body, recordId } = options;
  
  // Construir URL
  let url = `${config.BASE_URL}/${config.BASE_ID}/${encodeURIComponent(tableName)}`;
  if (recordId) {
    url += `/${recordId}`;
  }
  
  // Agregar query params para GET
  if (params && method === 'GET') {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${config.API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PATCH')) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || 
      `Airtable error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

// Función para listar registros con filtro
async function selectRecords(
  tableName: string,
  options: {
    filterByFormula?: string;
    maxRecords?: number;
    view?: string;
    fields?: string[];
  } = {}
): Promise<AirtableRecord[]> {
  const params: Record<string, string> = {};
  
  if (options.filterByFormula) {
    params.filterByFormula = options.filterByFormula;
  }
  if (options.maxRecords) {
    params.maxRecords = String(options.maxRecords);
  }
  if (options.view) {
    params.view = options.view;
  }
  
  const response = await airtableFetch(tableName, { params }) as AirtableResponse;
  return response.records;
}

// Función para actualizar un registro
async function updateRecord(
  tableName: string,
  recordId: string,
  fields: Record<string, unknown>
): Promise<AirtableRecord> {
  const response = await airtableFetch(tableName, {
    method: 'PATCH',
    recordId,
    body: { fields },
  });
  return response as AirtableRecord;
}

// Función para crear registros
async function createRecords(
  tableName: string,
  records: Array<{ fields: Record<string, unknown> }>
): Promise<AirtableRecord[]> {
  const response = await airtableFetch(tableName, {
    method: 'POST',
    body: { records },
  }) as AirtableResponse;
  return response.records;
}

// ===========================================
// RE-EXPORTAR CONFIGURACIONES
// ===========================================

export { TABLES, USUARIO_FIELDS, LOG_FIELDS };

// ===========================================
// FUNCIONES DE UTILIDAD PARA USUARIOS
// ===========================================

/**
 * Buscar usuario por número de documento (cédula)
 */
export async function buscarUsuarioPorCedula(cedula: string): Promise<AirtableRecord | null> {
  try {
    const records = await selectRecords(TABLES.USUARIOS.NAME, {
      filterByFormula: `{Numero Documento} = '${cedula}'`,
      maxRecords: 1,
    });

    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error('Error buscando usuario por cédula:', error);
    throw error;
  }
}

/**
 * Buscar usuario por email
 */
export async function buscarUsuarioPorEmail(email: string): Promise<AirtableRecord | null> {
  try {
    const records = await selectRecords(TABLES.USUARIOS.NAME, {
      filterByFormula: `{Email} = '${email}'`,
      maxRecords: 1,
    });

    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error('Error buscando usuario por email:', error);
    throw error;
  }
}

/**
 * Actualizar contraseña de usuario
 */
export async function actualizarPasswordUsuario(recordId: string, hashedPassword: string): Promise<AirtableRecord> {
  try {
    return await updateRecord(TABLES.USUARIOS.NAME, recordId, {
      [USUARIO_FIELDS.PASSWORD]: hashedPassword
    });
  } catch (error) {
    console.error('Error actualizando contraseña:', error);
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
}): Promise<AirtableRecord> {
  try {
    const records = await createRecords(TABLES.LOGS.NAME, [
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

    return records[0];
  } catch (error) {
    console.error('Error creando log:', error);
    throw error;
  }
}

/**
 * Obtener todos los usuarios activos
 */
export async function obtenerUsuariosActivos(): Promise<AirtableRecord[]> {
  try {
    return await selectRecords(TABLES.USUARIOS.NAME, {
      filterByFormula: `{Estado} = 'Activo'`,
    });
  } catch (error) {
    console.error('Error obteniendo usuarios activos:', error);
    throw error;
  }
}

// Default export para compatibilidad
const airtable = {
  selectRecords,
  updateRecord,
  createRecords,
};

export default airtable;