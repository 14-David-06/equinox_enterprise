import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

// Este endpoint crea las tablas en Turso
// SOLO USAR UNA VEZ - luego eliminar o proteger
export async function POST(request: Request) {
  // Protect setup endpoint in production
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEV_ENDPOINTS !== 'true') {
    return NextResponse.json({ error: 'Endpoint disabled in production' }, { status: 403 });
  }
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Crear tabla Inspeccion
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Inspeccion" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        "codigo" TEXT,
        "version" TEXT,
        "fechaEdicion" TEXT,
        "fechaInspeccionDesde" TEXT,
        "fechaInspeccionHasta" TEXT,
        "mes" TEXT,
        "anio" TEXT,
        "soatEstado" TEXT,
        "soatVencimiento" TEXT,
        "revisionTecnicaEstado" TEXT,
        "revisionTecnicaVencimiento" TEXT,
        "polizaEstado" TEXT,
        "polizaVencimiento" TEXT,
        "licenciaEstado" TEXT,
        "licenciaVencimiento" TEXT,
        "categorias" TEXT,
        "nombreConductor" TEXT,
        "cedula" TEXT,
        "edad" TEXT,
        "arl" TEXT,
        "eps" TEXT,
        "fondoPension" TEXT,
        "rh" TEXT,
        "placaVehiculo" TEXT,
        "marcaVehiculo" TEXT,
        "lineaVehiculo" TEXT,
        "modeloVehiculo" TEXT,
        "placaRemolque" TEXT,
        "marcaRemolque" TEXT,
        "claseRemolque" TEXT,
        "modeloRemolque" TEXT,
        "horasDormir" TEXT,
        "kilometraje" TEXT,
        "tomaMedicacion" TEXT,
        "ansiedadEstres" TEXT,
        "problemasVisuales" TEXT,
        "estadoSalud" TEXT
      )
    `);

    // Crear tabla Usuario
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "Usuario" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        "cedula" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "nombre" TEXT NOT NULL,
        "email" TEXT,
        "telefono" TEXT,
        "rol" TEXT NOT NULL DEFAULT 'conductor',
        "activo" INTEGER NOT NULL DEFAULT 1
      )
    `);

    // Crear índice único para cédula
    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Usuario_cedula_key" ON "Usuario"("cedula")
    `);

    return NextResponse.json({
      success: true,
      message: 'Tablas creadas exitosamente en Turso',
      tables: ['Inspeccion', 'Usuario'],
    });
  } catch (error) {
    // Note: Este endpoint está deshabilitado en producción
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error al crear tablas:', error);
    }
    return NextResponse.json(
      { error: 'Error al crear tablas' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_DEV_ENDPOINTS !== 'true') {
    return NextResponse.json({ error: 'Endpoint disabled in production' }, { status: 403 });
  }
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Verificar tablas existentes
    const result = await client.execute(`
      SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
    `);

    return NextResponse.json({
      success: true,
      tables: result.rows.map((row) => row.name),
    });
  } catch (error) {
    // Note: Este endpoint está deshabilitado en producción
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error al verificar tablas:', error);
    }
    return NextResponse.json(
      { error: 'Error al conectar con Turso' },
      { status: 500 }
    );
  }
}
