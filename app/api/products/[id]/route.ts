import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ product: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json({ error: 'Failed to get product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { name, description, price, originalPrice, imageUrl, category, stock, isActive, instagramLink } = await request.json();

    const client = await pool.connect();
    try {
      const result = await client.query(
        `UPDATE products SET 
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          original_price = $4,
          image_url = $5,
          category = $6,
          stock = COALESCE($7, stock),
          is_active = COALESCE($8, is_active),
          instagram_link = $9,
          updated_at = NOW()
         WHERE id = $10 RETURNING *`,
        [name, description, price, originalPrice, imageUrl, category, stock, isActive, instagramLink, id]
      );
      
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ product: result.rows[0] });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
