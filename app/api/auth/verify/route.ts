import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (err) {
    console.error('Error en /api/auth/verify:', err);
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}