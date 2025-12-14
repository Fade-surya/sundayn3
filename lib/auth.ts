import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import pool from './db';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: { id: string; email: string; isSuperAdmin: boolean }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { id: string; email: string; isSuperAdmin: boolean } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; isSuperAdmin: boolean };
  } catch {
    return null;
  }
}

export async function getAdminFromToken(): Promise<{ id: string; email: string; isSuperAdmin: boolean } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function createInitialAdmin() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM admins WHERE email = $1', ['assooryamsu80@gmail.com']);
    if (result.rows.length === 0) {
      const hashedPassword = await hashPassword('sreevava123');
      await client.query(
        'INSERT INTO admins (email, password, name, is_super_admin) VALUES ($1, $2, $3, $4)',
        ['assooryamsu80@gmail.com', hashedPassword, 'Super Admin', true]
      );
      console.log('Initial admin created');
    }
  } finally {
    client.release();
  }
}
