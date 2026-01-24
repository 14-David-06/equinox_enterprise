import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

export function middleware(request: NextRequest) {
  // Crear respuesta con headers de seguridad mejorados
  const response = NextResponse.next();
  
  // Headers de seguridad adicionales para todas las rutas
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // CSP básico para prevenir ataques XSS
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );

  return response;

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
