import { NextRequest, NextResponse } from 'next/server';
import turso from '@/lib/turso';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import cookie from 'cookie';
import { loginSchema, validateRequest } from '@/lib/validations';
import { applyRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: máximo 5 intentos por IP cada 15 minutos
    const rateLimitResult = applyRateLimit(request, {
      maxRequests: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimitResult.success) {
      logger.warn('Rate limit exceeded', { 
        endpoint: '/api/auth/login',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });
      
      const response = NextResponse.json(
        { error: rateLimitResult.error },
        { status: rateLimitResult.status }
      );
      response.headers.set('Retry-After', String(rateLimitResult.retryAfter));
      return response;
    }

    const requestBody = await request.json();
    
    // Validar con Zod
    const validation = validateRequest(loginSchema, requestBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.errors },
        { status: 400 }
      );
    }

    const { cedula, password } = validation.data;

    // Buscar usuario por cédula
    const result = await turso.execute({
      sql: 'SELECT * FROM Usuario WHERE cedula = ?',
      args: [cedula],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    const usuario = result.rows[0];

    // Verificar contraseña con bcrypt
    const isValidPassword = await bcrypt.compare(password, usuario.password as string);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    // Generar token JWT simple (7 días)
    const token = signToken({ 
      id: usuario.id, 
      cedula: usuario.cedula, 
      nombre: usuario.nombre, 
      rol: usuario.rol 
    }, '7d');

    const tokenCookie = cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    const responseBody = {
      success: true,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        cedula: usuario.cedula,
        rol: usuario.rol,
      },
    };

    const res = NextResponse.json(responseBody, { status: 200 });
    res.headers.append('Set-Cookie', tokenCookie);
    
    logger.info('Login successful', { 
      userId: usuario.id, 
      cedula: usuario.cedula,
    });
    
    return res;
  } catch (error) {
    logger.error('Error in login endpoint', error, {
      endpoint: '/api/auth/login',
    });
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
