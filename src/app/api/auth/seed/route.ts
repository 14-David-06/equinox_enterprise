import { NextResponse } from 'next/server';
import turso from '@/lib/turso';
import bcrypt from 'bcryptjs';

// Este endpoint es solo para desarrollo - crear usuario de prueba
export async function POST(request: Request) {
  // Only allow in development or when ENABLE_DEV_ENDPOINTS is true
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEV_ENDPOINTS !== 'true') {
    return NextResponse.json({ error: 'Endpoint disabled in production' }, { status: 403 });
  }
  try {
    // Obtener credenciales de variables de entorno o usar defaults para desarrollo
    const testCedula = process.env.TEST_USER_CEDULA || '123456789';
    const testPassword = process.env.TEST_USER_PASSWORD || '1234';
    const testEmail = process.env.TEST_USER_EMAIL || 'test@equinox.local';
    
    // Verificar si ya existe un usuario de prueba
    const existing = await turso.execute({
      sql: 'SELECT * FROM Usuario WHERE cedula = ?',
      args: [testCedula],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({
        message: 'Usuario de prueba ya existe',
        usuario: {
          cedula: existing.rows[0].cedula,
          nombre: existing.rows[0].nombre,
        },
      });
    }

    // Hashear la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const id = `user_${Date.now()}`;
    const now = new Date().toISOString();

    // Crear usuario de prueba
    await turso.execute({
      sql: `INSERT INTO Usuario (id, createdAt, updatedAt, cedula, password, nombre, email, rol, activo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [id, now, now, testCedula, hashedPassword, 'Conductor de Prueba', testEmail, 'conductor', 1],
    });

    return NextResponse.json({
      message: 'Usuario de prueba creado exitosamente',
      usuario: {
        cedula: testCedula,
        nombre: 'Conductor de Prueba',
        password: 'Contraseña hasheada en BD',
      },
    });
  } catch (error) {
    // Note: Este endpoint está deshabilitado en producción
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error al crear usuario:', error);
    }
    return NextResponse.json(
      { error: 'Error al crear usuario de prueba' },
      { status: 500 }
    );
  }
}

// GET - Listar usuarios (solo para desarrollo)
export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEV_ENDPOINTS !== 'true') {
    return NextResponse.json({ error: 'Endpoint disabled in production' }, { status: 403 });
  }
  try {
    const result = await turso.execute('SELECT id, cedula, nombre, rol, activo, createdAt FROM Usuario');
    
    return NextResponse.json(result.rows);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error al obtener usuarios:', error);
    }
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}
