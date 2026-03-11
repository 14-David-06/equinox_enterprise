import { NextRequest, NextResponse } from 'next/server';
import { getConductoresConfig, TABLES, CONDUCTOR_FIELDS } from '@/lib/airtable-config';

// ===========================================
// GET - Obtener lista de conductores
// ===========================================

export async function GET() {
  try {
    const config = getConductoresConfig();

    if (!config.API_KEY || !config.BASE_ID) {
      return NextResponse.json(
        { error: 'Configuración de Airtable no encontrada' },
        { status: 500 }
      );
    }

    // Obtener conductores activos
    const filterFormula = `OR({${CONDUCTOR_FIELDS.ESTADO}} = 'Activo', {${CONDUCTOR_FIELDS.ESTADO}} = '')`;
    const url = `${config.BASE_URL}/${config.BASE_ID}/${TABLES.CONDUCTORES.NAME}?filterByFormula=${encodeURIComponent(filterFormula)}&sort%5B0%5D%5Bfield%5D=${encodeURIComponent(CONDUCTOR_FIELDS.NOMBRE_COMPLETO)}&sort%5B0%5D%5Bdirection%5D=asc`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${config.API_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache por 60 segundos
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Airtable error:', errorBody);
      throw new Error(`Airtable error: ${response.status}`);
    }

    const data = await response.json();
    
    // Mapear datos relevantes
    const conductores = (data.records || []).map((record: any) => ({
      id: record.id,
      codigoConductor: record.fields?.[CONDUCTOR_FIELDS.CODIGO_CONDUCTOR] || '',
      nombreCompleto: record.fields?.[CONDUCTOR_FIELDS.NOMBRE_COMPLETO] || '',
      cedula: record.fields?.[CONDUCTOR_FIELDS.CEDULA] || '',
      telefono: record.fields?.[CONDUCTOR_FIELDS.TELEFONO] || '',
      email: record.fields?.[CONDUCTOR_FIELDS.EMAIL] || '',
      edad: record.fields?.[CONDUCTOR_FIELDS.EDAD] || '',
      rh: record.fields?.[CONDUCTOR_FIELDS.RH] || '',
      eps: record.fields?.[CONDUCTOR_FIELDS.EPS] || '',
      arl: record.fields?.[CONDUCTOR_FIELDS.ARL] || '',
      fondoPension: record.fields?.[CONDUCTOR_FIELDS.FONDO_PENSION] || '',
      categoriasLicencia: record.fields?.[CONDUCTOR_FIELDS.CATEGORIAS_LICENCIA] || '',
      estado: record.fields?.[CONDUCTOR_FIELDS.ESTADO] || 'Activo',
    }));

    return NextResponse.json({
      success: true,
      conductores,
      total: conductores.length,
    });

  } catch (error) {
    console.error('Error obteniendo conductores:', error);
    return NextResponse.json(
      { error: 'Error al obtener conductores', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

// ===========================================
// POST - Crear nuevo conductor
// ===========================================

export async function POST(request: NextRequest) {
  try {
    const config = getConductoresConfig();

    if (!config.API_KEY || !config.BASE_ID) {
      return NextResponse.json(
        { error: 'Configuración de Airtable no encontrada' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { nombreCompleto, cedula, telefono, email, edad, rh, eps, arl, fondoPension, categoriasLicencia } = body;

    // Validaciones mínimas
    if (!nombreCompleto || !cedula) {
      return NextResponse.json(
        { error: 'Nombre completo y cédula son obligatorios' },
        { status: 400 }
      );
    }

    // Verificar si ya existe un conductor con esa cédula
    const checkUrl = `${config.BASE_URL}/${config.BASE_ID}/${TABLES.CONDUCTORES.NAME}?filterByFormula=${encodeURIComponent(`{${CONDUCTOR_FIELDS.CEDULA}} = '${cedula}'`)}&maxRecords=1`;
    const checkResponse = await fetch(checkUrl, {
      headers: {
        'Authorization': `Bearer ${config.API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (checkResponse.ok) {
      const checkData = await checkResponse.json();
      if (checkData.records && checkData.records.length > 0) {
        return NextResponse.json(
          { error: `Ya existe un conductor con cédula ${cedula}` },
          { status: 409 }
        );
      }
    }

    // Crear el registro
    const fields: Record<string, string> = {
      [CONDUCTOR_FIELDS.NOMBRE_COMPLETO]: nombreCompleto,
      [CONDUCTOR_FIELDS.CEDULA]: cedula,
      [CONDUCTOR_FIELDS.ESTADO]: 'Activo',
    };

    if (telefono) fields[CONDUCTOR_FIELDS.TELEFONO] = telefono;
    if (email) fields[CONDUCTOR_FIELDS.EMAIL] = email;
    if (edad) fields[CONDUCTOR_FIELDS.EDAD] = edad;
    if (rh) fields[CONDUCTOR_FIELDS.RH] = rh;
    if (eps) fields[CONDUCTOR_FIELDS.EPS] = eps;
    if (arl) fields[CONDUCTOR_FIELDS.ARL] = arl;
    if (fondoPension) fields[CONDUCTOR_FIELDS.FONDO_PENSION] = fondoPension;
    if (categoriasLicencia) fields[CONDUCTOR_FIELDS.CATEGORIAS_LICENCIA] = categoriasLicencia;

    const createUrl = `${config.BASE_URL}/${config.BASE_ID}/${TABLES.CONDUCTORES.NAME}`;
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!createResponse.ok) {
      const errorBody = await createResponse.text();
      console.error('Airtable create error:', errorBody);
      throw new Error(`Error creando conductor: ${createResponse.status}`);
    }

    const record = await createResponse.json();

    const nuevoConductor = {
      id: record.id,
      codigoConductor: record.fields?.[CONDUCTOR_FIELDS.CODIGO_CONDUCTOR] || '',
      nombreCompleto: record.fields?.[CONDUCTOR_FIELDS.NOMBRE_COMPLETO] || '',
      cedula: record.fields?.[CONDUCTOR_FIELDS.CEDULA] || '',
      telefono: record.fields?.[CONDUCTOR_FIELDS.TELEFONO] || '',
      email: record.fields?.[CONDUCTOR_FIELDS.EMAIL] || '',
      edad: record.fields?.[CONDUCTOR_FIELDS.EDAD] || '',
      rh: record.fields?.[CONDUCTOR_FIELDS.RH] || '',
      eps: record.fields?.[CONDUCTOR_FIELDS.EPS] || '',
      arl: record.fields?.[CONDUCTOR_FIELDS.ARL] || '',
      fondoPension: record.fields?.[CONDUCTOR_FIELDS.FONDO_PENSION] || '',
      categoriasLicencia: record.fields?.[CONDUCTOR_FIELDS.CATEGORIAS_LICENCIA] || '',
      estado: record.fields?.[CONDUCTOR_FIELDS.ESTADO] || 'Activo',
    };

    return NextResponse.json({
      success: true,
      conductor: nuevoConductor,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creando conductor:', error);
    return NextResponse.json(
      { error: 'Error al crear conductor', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
