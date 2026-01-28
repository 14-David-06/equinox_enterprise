// Script de diagnóstico para probar la conexión a Airtable
require('dotenv').config({ path: '.env.local' });
const Airtable = require('airtable');

async function testAirtable() {
  console.log('=== DIAGNÓSTICO DE AIRTABLE ===\n');
  
  const apiKey = process.env.AIRTABLE_EQUINOX_USERS_CORE_API_KEY;
  const baseId = process.env.AIRTABLE_EQUINOX_USERS_CORE_BASE_ID;
  const tableId = process.env.AIRTABLE_EQUINOX_USERS_CORE_USUARIOS_TABLE_ID;
  const tableName = process.env.AIRTABLE_EQUINOX_USERS_CORE_USUARIOS_TABLE_NAME;
  
  console.log('Variables de entorno:');
  console.log('  API_KEY:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NO DEFINIDA');
  console.log('  BASE_ID:', baseId || 'NO DEFINIDA');
  console.log('  TABLE_ID:', tableId || 'NO DEFINIDA');
  console.log('  TABLE_NAME:', tableName || 'NO DEFINIDA');
  console.log('');
  
  if (!apiKey || !baseId) {
    console.log('❌ Faltan variables de entorno críticas');
    return;
  }
  
  // Configurar Airtable
  Airtable.configure({
    endpointUrl: 'https://api.airtable.com/v0',
    apiKey: apiKey,
  });
  
  const base = Airtable.base(baseId);
  
  // Probar con Table ID
  console.log('Probando conexión con Table ID:', tableId);
  try {
    const recordsById = await base(tableId).select({ maxRecords: 3 }).all();
    console.log('✅ Conexión con Table ID exitosa');
    console.log('   Registros encontrados:', recordsById.length);
    if (recordsById.length > 0) {
      console.log('   Campos disponibles:', Object.keys(recordsById[0].fields));
    }
  } catch (err) {
    console.log('❌ Error con Table ID:', err.message);
  }
  
  console.log('');
  
  // Probar con Table Name
  console.log('Probando conexión con Table Name:', tableName);
  try {
    const recordsByName = await base(tableName).select({ maxRecords: 3 }).all();
    console.log('✅ Conexión con Table Name exitosa');
    console.log('   Registros encontrados:', recordsByName.length);
    if (recordsByName.length > 0) {
      console.log('   Campos disponibles:', Object.keys(recordsByName[0].fields));
    }
  } catch (err) {
    console.log('❌ Error con Table Name:', err.message);
  }
}

testAirtable().catch(console.error);
