import { NextResponse } from 'next/server';
import { TABLES, USUARIO_FIELDS, getAirtableConfig } from '@/lib/airtable-config';

// ⚠️ SEGURIDAD: Este endpoint solo está disponible en desarrollo
const IS_DEV = process.env.NODE_ENV === 'development' && process.env.ENABLE_DEV_ENDPOINTS === 'true';

// Función auxiliar para fetch a Airtable
async function fetchAirtable(tableName: string, params?: Record<string, string>) {
  const config = getAirtableConfig();
  let url = `${config.BASE_URL}/${config.BASE_ID}/${encodeURIComponent(tableName)}`;
  
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${config.API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Airtable error: ${response.status}`);
  }

  return response.json();
}

export async function GET(request: Request) {
  // ⚠️ SEGURIDAD: Bloquear en producción
  if (!IS_DEV) {
    return NextResponse.json(
      { error: 'Este endpoint solo está disponible en desarrollo' },
      { status: 403 }
    );
  }

  try {
    // Probar conexión básica a la tabla de usuarios
    console.log('Probando conexión a Airtable...');
    console.log('Tabla USUARIOS:', TABLES.USUARIOS.NAME);

    // Obtener los primeros 5 registros
    const data = await fetchAirtable(TABLES.USUARIOS.NAME, { maxRecords: '5' });
    const records = data.records || [];

    console.log(`Encontrados ${records.length} registros en la tabla USUARIOS`);

    if (records.length > 0) {
      const firstRecord = records[0].fields;
      const allFields = Object.keys(firstRecord);

      // ⚠️ SEGURIDAD: No exponer valores de campos sensibles
      const fieldChecks = {
        numeroDocumento: {
          configuredName: USUARIO_FIELDS.NUMERO_DOCUMENTO,
          exists: USUARIO_FIELDS.NUMERO_DOCUMENTO in firstRecord,
          value: firstRecord[USUARIO_FIELDS.NUMERO_DOCUMENTO]
        },
        nombreCompleto: {
          configuredName: USUARIO_FIELDS.NOMBRE_COMPLETO,
          exists: USUARIO_FIELDS.NOMBRE_COMPLETO in firstRecord,
          value: firstRecord[USUARIO_FIELDS.NOMBRE_COMPLETO]
        },
        email: {
          configuredName: USUARIO_FIELDS.EMAIL,
          exists: USUARIO_FIELDS.EMAIL in firstRecord,
          value: firstRecord[USUARIO_FIELDS.EMAIL]
        },
        password: {
          configuredName: USUARIO_FIELDS.PASSWORD,
          exists: USUARIO_FIELDS.PASSWORD in firstRecord,
          value: firstRecord[USUARIO_FIELDS.PASSWORD] ? '***HIDDEN***' : undefined
        },
        rol: {
          configuredName: USUARIO_FIELDS.ROL,
          exists: USUARIO_FIELDS.ROL in firstRecord,
          value: firstRecord[USUARIO_FIELDS.ROL]
        },
        estado: {
          configuredName: USUARIO_FIELDS.ESTADO,
          exists: USUARIO_FIELDS.ESTADO in firstRecord,
          value: firstRecord[USUARIO_FIELDS.ESTADO]
        }
      };

      return NextResponse.json({
        success: true,
        message: 'Conexión exitosa con Airtable',
        recordsCount: records.length,
        allFields,
        fieldChecks
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Conexión exitosa pero tabla vacía',
        recordsCount: 0
      });
    }
  } catch (error) {
    console.error('Error probando conexión a Airtable:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        tableName: TABLES.USUARIOS.NAME,
        fieldMappings: {
          numeroDocumento: USUARIO_FIELDS.NUMERO_DOCUMENTO,
          nombreCompleto: USUARIO_FIELDS.NOMBRE_COMPLETO,
          email: USUARIO_FIELDS.EMAIL,
          password: USUARIO_FIELDS.PASSWORD,
          rol: USUARIO_FIELDS.ROL,
          estado: USUARIO_FIELDS.ESTADO
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return NextResponse.json(
    { error: 'Endpoint disabled' },
    { status: 503 }
  );
}
