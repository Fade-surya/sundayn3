import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { createInitialAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await initializeDatabase();
    await createInitialAdmin();
    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json({ success: false, error: 'Failed to initialize' }, { status: 500 });
  }
}
