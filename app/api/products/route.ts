import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const adminOnly = searchParams.get('admin') === 'true';

    const client = await pool.connect();
    try {
      let query = 'SELECT * FROM products';
      const params: (string | boolean)[] = [];
      const conditions: string[] = [];

      if (!adminOnly) {
        conditions.push('is_active = true');
      }

      if (category) {
        params.push(category);
        conditions.push(`category = $${params.length}`);
      }

      if (search) {
        params.push(`%${search}%`);
        conditions.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY created_at DESC';

      const result = await client.query(query, params);
      return NextResponse.json({ products: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ error: 'Failed to get products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, price, originalPrice, imageUrl, category, stock, instagramLink } = await request.json();

    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO products (name, description, price, original_price, image_url, category, stock, instagram_link) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [name, description, price, originalPrice || null, imageUrl || null, category || null, stock || 0, instagramLink || null]
      );
      return NextResponse.json({ product: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
