import { NextRequest, NextResponse } from 'next/server';
import { buscarUsuarioPorCedula, USUARIO_FIELDS } from '@/lib/airtable';
import { applyRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const checkUserSchema = z.object({
  cedula: z.string()
    .min(6, 'La cédula debe tener al menos 6 caracteres')
    .max(20, 'La cédula no puede exceder 20 caracteres')
    .regex(/^[0-9]+$/, 'La cédula solo puede contener números'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = applyRateLimit(request, {
      maxRequests: 10,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: rateLimitResult.status }
      );
    }

    const requestBody = await request.json();
    
    // Validar
    const validation = checkUserSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { cedula } = validation.data;

    // Buscar usuario por número de documento en Airtable
    const usuario = await buscarUsuarioPorCedula(cedula);

    if (!usuario) {
      return NextResponse.json(
        { 
          exists: false,
          error: 'Usuario no encontrado. Contacte al administrador.' 
        },
        { status: 404 }
      );
    }

    // Verificar si el usuario tiene contraseña
    const passwordField = usuario.fields[USUARIO_FIELDS.PASSWORD];
    const hasPassword = passwordField && 
      typeof passwordField === 'string' && 
      passwordField.trim() !== '';

    // Verificar estado del usuario
    const estadoUsuario = usuario.fields[USUARIO_FIELDS.ESTADO] as string | undefined;
    if (estadoUsuario && estadoUsuario !== 'Activo') {
      return NextResponse.json(
        { 
          exists: true,
          error: `Usuario ${estadoUsuario.toLowerCase()}. Contacte al administrador.` 
        },
        { status: 403 }
      );
    }

    logger.info('User check successful', { 
      cedula,
      hasPassword,
    });

    return NextResponse.json({
      exists: true,
      hasPassword,
      nombre: usuario.fields[USUARIO_FIELDS.NOMBRE_COMPLETO] || 'Usuario',
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Error in check-user endpoint', error, {
      endpoint: '/api/auth/check-user',
      detail: errorMessage,
      hasApiKey: !!process.env.AIRTABLE_EQUINOX_USERS_CORE_API_KEY,
      hasBaseId: !!process.env.AIRTABLE_EQUINOX_USERS_CORE_BASE_ID,
    });
    return NextResponse.json(
      { error: 'Error al verificar usuario', detail: errorMessage },
      { status: 500 }
    );
  }
}
