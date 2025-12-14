import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM admins WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const admin = result.rows[0];
      const isValid = await verifyPassword(password, admin.password);

      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const token = generateToken({
        id: admin.id,
        email: admin.email,
        isSuperAdmin: admin.is_super_admin
      });

      const response = NextResponse.json({ 
        success: true, 
        admin: { 
          id: admin.id, 
          email: admin.email, 
          name: admin.name,
          isSuperAdmin: admin.is_super_admin 
        } 
      });

      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
