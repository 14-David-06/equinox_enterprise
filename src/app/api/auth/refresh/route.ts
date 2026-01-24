import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // TEMPORALMENTE DESHABILITADO - Pendiente migración completa a Airtable
  return NextResponse.json(
    { error: 'Endpoint temporarily disabled during migration' },
    { status: 503 }
  );
}
