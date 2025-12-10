import jwt, { SignOptions } from 'jsonwebtoken';

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('AUTH_SECRET is required in production environment');
    }
    // Solo permitir fallback en desarrollo local
    if (process.env.NODE_ENV === 'development') {
      return 'dev_secret_min_32_chars_local_only';
    }
    throw new Error('AUTH_SECRET is required');
  }
  
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error('AUTH_SECRET must be at least 32 characters in production');
  }
  
  return secret;
}

const SECRET = getAuthSecret();

export function signToken(payload: object, expiresIn = '7d') {
  return jwt.sign(payload as any, SECRET as any, { expiresIn } as any);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as any;
  } catch (err) {
    return null;
  }
}
