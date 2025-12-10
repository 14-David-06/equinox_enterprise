import { createClient } from '@libsql/client';

function getTursoConfig() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!url) {
    throw new Error('TURSO_DATABASE_URL is required');
  }
  
  if (process.env.NODE_ENV === 'production' && !authToken) {
    throw new Error('TURSO_AUTH_TOKEN is required in production');
  }
  
  return { url, authToken };
}

// Cliente de Turso para la base de datos
const turso = createClient(getTursoConfig());

export default turso;
