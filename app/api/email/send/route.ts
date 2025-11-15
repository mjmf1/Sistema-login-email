import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No autorizado' },
        { status: 401 }
      );
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const { to, subject, message } = await request.json();

    // Validar campos
    if (!to || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Enviar email
    await sendEmail(to, subject, message);

    return NextResponse.json(
      { success: true, message: 'Email enviado exitosamente' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error al enviar email:', error);
    return NextResponse.json(
      { success: false, message: 'Error al enviar el email: ' + error.message },
      { status: 500 }
    );
  }
}