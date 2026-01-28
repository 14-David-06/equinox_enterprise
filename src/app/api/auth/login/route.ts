import { NextRequest, NextResponse } from 'next/server';
import { buscarUsuarioPorCedula, actualizarPasswordUsuario, USUARIO_FIELDS } from '@/lib/airtable';
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

    // Buscar usuario por número de documento en Airtable
    const usuario = await buscarUsuarioPorCedula(cedula);

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    // Verificar si el usuario tiene contraseña
    const storedPassword = usuario.fields[USUARIO_FIELDS.PASSWORD] as string | undefined;
    const hasPassword = storedPassword && storedPassword.trim() !== '';

    if (!hasPassword) {
      // Usuario sin contraseña: hashear la nueva contraseña y guardarla
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Actualizar el registro en Airtable
      await actualizarPasswordUsuario(usuario.id, hashedPassword);

      logger.info('Password set for user', { 
        userId: usuario.id, 
        cedula: usuario.fields[USUARIO_FIELDS.NUMERO_DOCUMENTO],
      });
    } else {
      // Usuario con contraseña: verificar
      const isValidPassword = await bcrypt.compare(password, storedPassword);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Contraseña incorrecta' },
          { status: 401 }
        );
      }
    }

    // Generar token JWT simple (7 días)
    const token = signToken({ 
      id: usuario.id, 
      cedula: usuario.fields[USUARIO_FIELDS.NUMERO_DOCUMENTO], 
      nombre: usuario.fields[USUARIO_FIELDS.NOMBRE_COMPLETO], 
      rol: usuario.fields[USUARIO_FIELDS.ROL] 
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
      isFirstLogin: !hasPassword,
      usuario: {
        id: usuario.id,
        nombre: usuario.fields[USUARIO_FIELDS.NOMBRE_COMPLETO],
        cedula: usuario.fields[USUARIO_FIELDS.NUMERO_DOCUMENTO],
        rol: usuario.fields[USUARIO_FIELDS.ROL],
      },
    };

    const res = NextResponse.json(responseBody, { status: 200 });
    res.headers.append('Set-Cookie', tokenCookie);
    
    logger.info('Login successful', { 
      userId: usuario.id, 
      cedula: usuario.fields[USUARIO_FIELDS.NUMERO_DOCUMENTO],
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
