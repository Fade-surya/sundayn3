import { NextResponse } from 'next/server';
import { getAdminFromToken } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET() {
  try {
    const tokenData = await getAdminFromToken();
    if (!tokenData) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT id, email, name, is_super_admin FROM admins WHERE id = $1', [tokenData.id]);
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
      }
      return NextResponse.json({ admin: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Auth check failed' }, { status: 500 });
  }
}
