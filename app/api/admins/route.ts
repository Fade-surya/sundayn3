import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromToken, hashPassword } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getAdminFromToken();
    if (!admin || !admin.isSuperAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT id, email, name, is_super_admin, created_at FROM admins ORDER BY created_at DESC');
      return NextResponse.json({ admins: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get admins error:', error);
    return NextResponse.json({ error: 'Failed to get admins' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromToken();
    if (!admin || !admin.isSuperAdmin) {
      return NextResponse.json({ error: 'Only super admin can add new admins' }, { status: 401 });
    }

    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const client = await pool.connect();
    try {
      const existing = await client.query('SELECT id FROM admins WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return NextResponse.json({ error: 'Admin with this email already exists' }, { status: 400 });
      }

      const result = await client.query(
        'INSERT INTO admins (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, is_super_admin, created_at',
        [email, hashedPassword, name || null]
      );
      return NextResponse.json({ admin: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create admin error:', error);
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}
