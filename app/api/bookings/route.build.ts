import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Build-safe bookings endpoint' });
}
export async function POST() {
  return NextResponse.json({ status: 'ok', message: 'Build-safe bookings endpoint' });
} 