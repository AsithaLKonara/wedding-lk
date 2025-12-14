import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Build-safe clients endpoint' });
}
export async function POST() {
  return NextResponse.json({ status: 'ok', message: 'Build-safe clients endpoint' });
} 