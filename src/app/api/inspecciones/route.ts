import { NextRequest, NextResponse } from 'next/server';
import base, { TABLES } from '@/lib/airtable';
import { verifyToken } from '@/lib/jwt';
import cookie from 'cookie';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación (token cookie)
    const headerCookie = request.headers.get('cookie') || '';
    const parsed = cookie.parse(headerCookie || '');
    const token = parsed.token;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Consultar inspecciones desde Airtable
    // TODO: Configurar tabla de inspecciones en Airtable
    // Temporalmente usando tabla LOGS como placeholder
    const records = await base(TABLES.LOGS.ID).select({
      sort: [{ field: 'createdTime', direction: 'desc' }]
    }).all();

    // Formatear los datos de Airtable
    const inspeccionesFormateadas = records.map((record) => ({
      id: record.id,
      ...record.fields,
    }));

    return NextResponse.json(inspeccionesFormateadas);
  } catch (error) {
    console.error('Error fetching inspecciones:', error);
    return NextResponse.json(
      { error: 'Error al obtener inspecciones' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // TEMPORALMENTE DESHABILITADO - Pendiente migración completa a Airtable
  return NextResponse.json(
    { error: 'Endpoint temporarily disabled during migration' },
    { status: 503 }
  );
}
