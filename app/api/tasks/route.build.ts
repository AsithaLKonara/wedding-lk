import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  return NextResponse.json({ tasks: [] })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, task: { id: 'build-task' } })
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json({ success: true, task: { id: 'build-task' } })
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: true })
} 