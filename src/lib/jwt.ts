import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Cache para el secret generado en desarrollo
let devSecretCache: string | null = null;

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_SECRET is required in production environment');
    }
    // En desarrollo: generar secret aleatorio por sesión (no predecible)
    if (process.env.NODE_ENV === 'development') {
      if (!devSecretCache) {
        devSecretCache = crypto.randomBytes(32).toString('hex');
        console.warn('⚠️ JWT: Usando secret aleatorio temporal. Configura AUTH_SECRET en .env.local');
      }
      return devSecretCache;
    }
    throw new Error('AUTH_SECRET is required');
  }
  
  if (process.env.NODE_ENV === 'production' && secret.length < 64) {
    throw new Error('AUTH_SECRET must be at least 64 characters in production (256-bit minimum). Generate with: openssl rand -hex 32');
  }
  
  return secret;
}

const SECRET = getAuthSecret();

export function signToken(payload: object, expiresIn = '24h') {
  return jwt.sign(
    { ...payload as object, iss: 'equinox-enterprise', aud: 'equinox-users' } as any,
    SECRET as any,
    { expiresIn, algorithm: 'HS256' } as any
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET, {
      algorithms: ['HS256'],
      issuer: 'equinox-enterprise',
      audience: 'equinox-users',
    }) as any;
  } catch (err) {
    return null;
  }
}
