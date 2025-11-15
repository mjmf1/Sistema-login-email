import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validar credenciales (en producción, consultar base de datos)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generar JWT
      const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      const response = NextResponse.json(
        { success: true, message: 'Login exitoso', token: token },
        { status: 200 }
      );

      // Establecer cookie
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400, // 24 horas
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Credenciales inválidas' },
      { status: 401 }
    );
  } catch (err) {
    console.error('Error en /api/auth/login:', err);
    return NextResponse.json(
      { success: false, message: 'Error en el servidor' },
      { status: 500 }
    );
  }
}