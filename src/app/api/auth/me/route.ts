import { NextResponse } from 'next/server';
import cookie from 'cookie';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    const headerCookie = request.headers.get('cookie') || '';
    const parsed = cookie.parse(headerCookie || '');
    const token = parsed.token;
    
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
