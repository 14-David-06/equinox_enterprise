import { NextRequest, NextResponse } from 'next/server';
import turso from '@/lib/turso';
import { verifyToken } from '@/lib/jwt';
import cookie from 'cookie';
import { inspeccionSchema, validateRequest } from '@/lib/validations';
import { logger } from '@/lib/logger';
import { applyRateLimit } from '@/lib/rate-limit';

// GET - Obtener todas las inspecciones (requiere autenticación)
export async function GET(request: Request) {
  try {
    // Verificar autenticación (token cookie)
    const headerCookie = request.headers.get('cookie') || '';
    const parsed = cookie.parse(headerCookie || '');
    const token = parsed.token;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    const result = await turso.execute('SELECT * FROM Inspeccion ORDER BY createdAt DESC');

    // Parsear los campos JSON
    const inspeccionesFormateadas = result.rows.map((insp) => ({
      ...insp,
      categorias: insp.categorias ? JSON.parse(insp.categorias as string) : [],
      kilometraje: insp.kilometraje ? JSON.parse(insp.kilometraje as string) : [],
    }));

    return NextResponse.json(inspeccionesFormateadas);
  } catch (error) {
    logger.error('Error fetching inspections', error);
    return NextResponse.json(
      { error: 'Error al obtener las inspecciones' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva inspección (público)
export async function POST(request: NextRequest) {
  try {
    // Rate limiting para prevenir spam: máximo 10 inspecciones por IP cada hora
    const rateLimitResult = applyRateLimit(request, {
      maxRequests: 10,
      windowMs: 60 * 60 * 1000, // 1 hora
    });

    if (!rateLimitResult.success) {
      logger.warn('Rate limit exceeded for inspections', { 
        endpoint: '/api/inspecciones',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });
      
      const response = NextResponse.json(
        { error: rateLimitResult.error },
        { status: rateLimitResult.status }
      );
      response.headers.set('Retry-After', String(rateLimitResult.retryAfter));
      return response;
    }

    // Verificar token (opcional - para logging de usuario si existe)
    const headerCookie = request.headers.get('cookie') || '';
    const parsed = cookie.parse(headerCookie || '');
    const token = parsed.token;
    const user = token ? verifyToken(token) : null;
    
    const body = await request.json();
    
    // Validar con Zod
    const validation = validateRequest(inspeccionSchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.errors },
        { status: 400 }
      );
    }
    
    const data = validation.data;
    const id = `insp_${Date.now()}`;
    const now = new Date().toISOString();

    await turso.execute({
      sql: `INSERT INTO Inspeccion (
        id, createdAt, updatedAt, codigo, version, fechaEdicion,
        fechaInspeccionDesde, fechaInspeccionHasta, mes, anio,
        soatEstado, soatVencimiento, revisionTecnicaEstado, revisionTecnicaVencimiento,
        polizaEstado, polizaVencimiento, licenciaEstado, licenciaVencimiento,
        categorias, nombreConductor, cedula, edad, arl, eps, fondoPension, rh,
        placaVehiculo, marcaVehiculo, lineaVehiculo, modeloVehiculo,
        placaRemolque, marcaRemolque, claseRemolque, modeloRemolque,
        horasDormir, kilometraje, tomaMedicacion, ansiedadEstres, problemasVisuales, estadoSalud
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, now, now,
        data.codigo || null,
        data.version || null,
        data.fechaEdicion || null,
        data.fechaInspeccionDesde || null,
        data.fechaInspeccionHasta || null,
        data.mes || null,
        data.anio || null,
        data.soatEstado || null,
        data.soatVencimiento || null,
        data.revisionTecnicaEstado || null,
        data.revisionTecnicaVencimiento || null,
        data.polizaEstado || null,
        data.polizaVencimiento || null,
        data.licenciaEstado || null,
        data.licenciaVencimiento || null,
        JSON.stringify(data.categorias || []),
        data.nombreConductor || null,
        data.cedula || null,
        data.edad || null,
        data.arl || null,
        data.eps || null,
        data.fondoPension || null,
        data.rh || null,
        data.placaVehiculo || null,
        data.marcaVehiculo || null,
        data.lineaVehiculo || null,
        data.modeloVehiculo || null,
        data.placaRemolque || null,
        data.marcaRemolque || null,
        data.claseRemolque || null,
        data.modeloRemolque || null,
        data.horasDormir || null,
        JSON.stringify(data.kilometraje || []),
        data.tomaMedicacion || null,
        data.ansiedadEstres || null,
        data.problemasVisuales || null,
        data.estadoSalud || null,
      ],
    });

    logger.info('Inspection created', { id, userId: user?.id || 'anonymous' });
    
    return NextResponse.json({ id, message: 'Inspección guardada exitosamente' }, { status: 201 });
  } catch (error) {
    logger.error('Error creating inspection', error);
    return NextResponse.json(
      { error: 'Error al guardar la inspección' },
      { status: 500 }
    );
  }
}
