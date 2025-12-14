import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAdminFromToken } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromToken();
    if (!admin || !admin.isSuperAdmin) {
      return NextResponse.json({ error: 'Only super admin can remove admins' }, { status: 401 });
    }

    const { id } = await params;

    if (id === admin.id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM admins WHERE id = $1 AND is_super_admin = false RETURNING *', [id]);
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Admin not found or cannot be deleted' }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
  }
}
