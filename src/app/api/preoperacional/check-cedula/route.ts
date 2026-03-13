import { NextRequest, NextResponse } from 'next/server';
import { getConductoresConfig, TABLES, CONDUCTOR_FIELDS } from '@/lib/airtable-config';

/**
 * POST /api/preoperacional/check-cedula
 * 
 * Verifica si existe un conductor con la cédula o email proporcionados.
 * NO expone datos del conductor, solo devuelve si existe o no.
 * 
 * Body: { cedula: string, email?: string }
 * Response: { 
 *   exists: boolean, 
 *   message: string,
 *   emailConflict?: boolean,
 *   emailMessage?: string 
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cedula, email } = body;

    // Validación básica
    if (!cedula || typeof cedula !== 'string') {
      return NextResponse.json(
        { error: 'Cédula es requerida' },
        { status: 400 }
      );
    }

    // Sanitizar cédula (solo números)
    const cedulaLimpia = cedula.replace(/\D/g, '');
    
    if (cedulaLimpia.length < 5 || cedulaLimpia.length > 15) {
      return NextResponse.json(
        { error: 'Formato de cédula inválido' },
        { status: 400 }
      );
    }

    const config = getConductoresConfig();

    // 1. Buscar conductor por cédula
    // cedulaLimpia already contains only digits (replace(/\D/g,'')) — safe for formula
    const filterCedula = `{${CONDUCTOR_FIELDS.CEDULA}} = '${cedulaLimpia}'`;
    const urlCedula = `${config.BASE_URL}/${config.BASE_ID}/${TABLES.CONDUCTORES.NAME}?filterByFormula=${encodeURIComponent(filterCedula)}&maxRecords=1&fields%5B%5D=${encodeURIComponent(CONDUCTOR_FIELDS.CEDULA)}&fields%5B%5D=${encodeURIComponent(CONDUCTOR_FIELDS.EMAIL)}`;

    const responseCedula = await fetch(urlCedula, {
      headers: {
        'Authorization': `Bearer ${config.API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!responseCedula.ok) {
      console.error('Error consultando Airtable:', responseCedula.status);
      return NextResponse.json(
        { error: 'Error al verificar cédula' },
        { status: 500 }
      );
    }

    const dataCedula = await responseCedula.json();
    const existsByCedula = dataCedula.records && dataCedula.records.length > 0;

    // 2. Si hay email, verificar que no esté registrado con otra cédula
    let emailConflict = false;
    let emailMessage = '';

    if (email && typeof email === 'string' && email.includes('@')) {
      // Sanitize: allowlist chars valid in email addresses, preventing Airtable formula injection
      const emailLimpio = email.toLowerCase().trim().replace(/[^a-zA-Z0-9@._\-+]/g, '');
      const filterEmail = `AND({${CONDUCTOR_FIELDS.EMAIL}} = '${emailLimpio}', {${CONDUCTOR_FIELDS.CEDULA}} != '${cedulaLimpia}')`;
      const urlEmail = `${config.BASE_URL}/${config.BASE_ID}/${TABLES.CONDUCTORES.NAME}?filterByFormula=${encodeURIComponent(filterEmail)}&maxRecords=1&fields%5B%5D=${encodeURIComponent(CONDUCTOR_FIELDS.EMAIL)}`;

      const responseEmail = await fetch(urlEmail, {
        headers: {
          'Authorization': `Bearer ${config.API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (responseEmail.ok) {
        const dataEmail = await responseEmail.json();
        emailConflict = dataEmail.records && dataEmail.records.length > 0;
        if (emailConflict) {
          emailMessage = 'Este correo ya está registrado con otra cédula';
        }
      }
    }

    // Solo devolver si existe o no, sin datos adicionales
    return NextResponse.json({
      exists: existsByCedula,
      message: existsByCedula 
        ? 'Ya existe un conductor registrado con esta cédula' 
        : 'Cédula disponible',
      emailConflict,
      emailMessage,
    });

  } catch (error) {
    console.error('Error en check-cedula:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
