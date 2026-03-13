import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { decrypt } from '@/lib/encryption';
import { applyRateLimit } from '@/lib/rate-limit';
import cookie from 'cookie';
import { getInspeccionesConfig, getConductoresConfig, TABLES } from '@/lib/airtable-config';

/**
 * API para obtener los datos GPS desencriptados de una inspección
 * Busca primero en la inspección, luego en la tabla de conductores
 * Solo accesible por usuarios con rol HSEQ o Admin
 * Requiere autenticación y tiene rate limiting estricto
 */

export async function POST(request: NextRequest) {
  try {
    // Rate limiting estricto para datos sensibles
    const rateLimitResult = applyRateLimit(request, {
      maxRequests: 10,
      windowMs: 60 * 1000, // 10 requests por minuto
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { 
          status: rateLimitResult.status,
          headers: { 'Retry-After': String(rateLimitResult.retryAfter) }
        }
      );
    }

    // Verificar autenticación
    const headerCookie = request.headers.get('cookie') || '';
    const parsed = cookie.parse(headerCookie);
    const token = parsed.token;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Solo usuarios HSEQ o Admin pueden ver datos GPS
    if (user.rol !== 'HSEQ' && user.rol !== 'Admin' && user.rol !== 'Administrador') {
      return NextResponse.json(
        { error: 'Sin permisos para ver datos GPS' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { inspeccionId } = body;

    if (!inspeccionId) {
      return NextResponse.json(
        { error: 'ID de inspección requerido' },
        { status: 400 }
      );
    }

    // Obtener la inspección de Airtable
    const config = getInspeccionesConfig();
    const url = `https://api.airtable.com/v0/${config.BASE_ID}/${encodeURIComponent(TABLES.INSPECCIONES_PREOPERACIONALES.NAME)}/${inspeccionId}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Inspección no encontrada' },
          { status: 404 }
        );
      }
      throw new Error(`Error de Airtable: ${response.status}`);
    }

    const data = await response.json();
    const fields = data.fields || {};

    // Intentar obtener datos GPS de la inspección primero
    let gpsNombre = fields['GPS Nombre'] || '';
    let gpsUsuarioEncriptado = fields['GPS Usuario'] || '';
    let gpsPasswordEncriptado = fields['GPS Password'] || '';
    let gpsAutorizacion = fields['GPS Autorizacion Monitoreo'] || false;

    // Si no hay datos GPS en la inspección, buscar en la tabla de conductores
    if (!gpsUsuarioEncriptado && !gpsPasswordEncriptado) {
      const conductorCedula = fields['Conductor Cedula'];
      
      if (conductorCedula) {
        // Sanitize: conductor cedula is numeric-only
        const safeCedula = String(conductorCedula).replace(/[^0-9]/g, '');
        const conductorConfig = getConductoresConfig();
        const filterFormula = `{Cedula} = '${safeCedula}'`;
        const conductorUrl = `https://api.airtable.com/v0/${conductorConfig.BASE_ID}/${encodeURIComponent(TABLES.CONDUCTORES.NAME)}?filterByFormula=${encodeURIComponent(filterFormula)}&maxRecords=1`;

        const conductorResponse = await fetch(conductorUrl, {
          headers: {
            'Authorization': `Bearer ${conductorConfig.API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        if (conductorResponse.ok) {
          const conductorData = await conductorResponse.json();
          
          if (conductorData.records && conductorData.records.length > 0) {
            const conductorFields = conductorData.records[0].fields || {};
            gpsNombre = conductorFields['GPS Nombre'] || '';
            gpsUsuarioEncriptado = conductorFields['GPS Usuario'] || '';
            gpsPasswordEncriptado = conductorFields['GPS Password'] || '';
            gpsAutorizacion = conductorFields['GPS Autorizacion Monitoreo'] || false;
          }
        }
      }
    }

    // Verificar si hay datos GPS
    if (!gpsUsuarioEncriptado && !gpsPasswordEncriptado && !gpsNombre) {
      return NextResponse.json({
        success: true,
        gpsData: null,
        message: 'No hay datos GPS registrados para este conductor'
      });
    }

    // Verificar autorización de monitoreo
    if (!gpsAutorizacion) {
      return NextResponse.json({
        success: true,
        gpsData: null,
        message: 'El conductor no autorizó el monitoreo GPS'
      });
    }

    // Desencriptar los datos
    let gpsUsuario = '';
    let gpsPassword = '';

    try {
      gpsUsuario = gpsUsuarioEncriptado ? decrypt(gpsUsuarioEncriptado) : '';
      gpsPassword = gpsPasswordEncriptado ? decrypt(gpsPasswordEncriptado) : '';
    } catch (decryptError) {
      console.error('Error desencriptando datos GPS:', decryptError);
      // Si falla el descifrado, podría ser texto plano (datos antiguos)
      gpsUsuario = gpsUsuarioEncriptado;
      gpsPassword = gpsPasswordEncriptado;
    }

    // Log de auditoría (sin mostrar los datos sensibles)
    console.log(`[GPS ACCESS] Usuario ${user.cedula} (${user.nombre}) accedió a datos GPS de inspección ${inspeccionId}`);

    return NextResponse.json({
      success: true,
      gpsData: {
        nombre: gpsNombre,
        usuario: gpsUsuario,
        password: gpsPassword,
        autorizacionMonitoreo: gpsAutorizacion,
      },
      accessedBy: user.nombre,
      accessedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error obteniendo datos GPS:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos GPS' },
      { status: 500 }
    );
  }
}
