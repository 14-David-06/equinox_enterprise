import Airtable from 'airtable';

// Configuración de Airtable
function getAirtableConfig() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  
  if (!apiKey) {
    throw new Error('AIRTABLE_API_KEY is required');
  }
  
  if (!baseId) {
    throw new Error('AIRTABLE_BASE_ID is required');
  }
  
  return { apiKey, baseId };
}

// Cliente de Airtable
const { apiKey, baseId } = getAirtableConfig();

Airtable.configure({
  endpointUrl: 'https://api.airtable.com',
  apiKey: apiKey,
});

const base = Airtable.base(baseId);

export default base;

// Nombres de tablas - ajustar según tu configuración de Airtable
export const Tables = {
  USUARIOS: 'Usuarios',
  INSPECCIONES: 'Inspecciones',
} as const;