import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromToken } from '@/lib/auth';

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category');
      return NextResponse.json({ categories: result.rows.map((r: { category: string }) => r.category) });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json({ error: 'Failed to get categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING *',
        [name]
      );
      return NextResponse.json({ category: result.rows[0] || { name } });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
