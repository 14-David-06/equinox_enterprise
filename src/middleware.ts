import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

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
  
  return secret;
}

const AUTH_SECRET = getAuthSecret();

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acceso público a /inspeccion - formulario ahora es público
  // Solo proteger rutas administrativas si las hay en el futuro
  // if (pathname.startsWith('/admin')) {
  //   const token = request.cookies.get('token')?.value;
  //   if (!token) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = '/login';
  //     return NextResponse.redirect(url);
  //   }
  //   
  //   try {
  //     jwt.verify(token, AUTH_SECRET);
  //     return NextResponse.next();
  //   } catch (err) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = '/login';
  //     return NextResponse.redirect(url);
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  // Deshabilitado para permitir acceso público
  // matcher: ['/admin/:path*'],
};
