import { NextRequest, NextResponse } from 'next/server';
import turso from '@/lib/turso';
import cookie from 'cookie';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/jwt';
import { logger } from '@/lib/logger';

// POST /api/auth/refresh
export async function POST(request: NextRequest) {
  try {
    const headerCookie = request.headers.get('cookie') || '';
    const parsed = cookie.parse(headerCookie || '');
    const refreshVal = parsed.refreshToken;

    if (!refreshVal) return NextResponse.json({ error: 'No refresh token' }, { status: 401 });

    // refreshVal is stored as id|value
    const [id, value] = refreshVal.split('|');
    if (!id || !value) return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });

    // Get refresh record by id
    const result = await turso.execute({ sql: 'SELECT * FROM RefreshToken WHERE id = ?', args: [id] });
    if (result.rows.length === 0) return NextResponse.json({ error: 'Refresh token not found' }, { status: 401 });

    const record = result.rows[0];
    const now = new Date();
    if (new Date(String(record.expiresAt)) < now) {
      // delete expired token
      await turso.execute({ sql: 'DELETE FROM RefreshToken WHERE id = ?', args: [id] });
      return NextResponse.json({ error: 'Refresh token expired' }, { status: 401 });
    }

    // verify token value using bcrypt
    const isValid = await bcrypt.compare(value, record.tokenHash as string);
    if (!isValid) return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });

    // load user
    const ures = await turso.execute({ sql: 'SELECT id, cedula, nombre, rol FROM Usuario WHERE id = ?', args: [record.userId] });
    if (ures.rows.length === 0) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });

    const user = ures.rows[0];

    // rotate refresh token (generate a new value and hash; update record)
    const newRaw = require('crypto').randomBytes(48).toString('hex');
    const newHash = await bcrypt.hash(newRaw, 10);
    const newExpires = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000).toISOString(); // 30 days
    const updatedAt = new Date().toISOString();

    await turso.execute({
      sql: 'UPDATE RefreshToken SET tokenHash = ?, expiresAt = ?, updatedAt = ? WHERE id = ?',
      args: [newHash, newExpires, updatedAt, id],
    });

    const newRefreshCookie = `${id}|${newRaw}`;
    const accessToken = signToken({ id: user.id, cedula: user.cedula, nombre: user.nombre, rol: user.rol }, '15m');

    const setRefresh = cookie.serialize('refreshToken', newRefreshCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    const setAccess = cookie.serialize('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    });

    const body = { success: true, usuario: user };
    const res = NextResponse.json(body, { status: 200 });
    res.headers.append('Set-Cookie', setRefresh);
    res.headers.append('Set-Cookie', setAccess);
    return res;
  } catch (err) {
    logger.error('Error in token refresh', err);
    return NextResponse.json({ error: 'Error en refresh' }, { status: 500 });
  }
}
