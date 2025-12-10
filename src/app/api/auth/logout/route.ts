import { NextResponse } from 'next/server';
import cookie from 'cookie';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    // Simplemente limpiar la cookie del token
    const clearToken = cookie.serialize('token', '', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax', 
      path: '/', 
      maxAge: 0 
    });

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.headers.append('Set-Cookie', clearToken);
    
    logger.info('User logged out');
    return res;
  } catch (err) {
    logger.error('Error in logout', err);
    return NextResponse.json({ error: 'Error al cerrar sesión' }, { status: 500 });
  }
}
