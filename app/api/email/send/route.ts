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

    // Longitud coherente: asunto corto, mensaje más largo
    const SUBJECT_MAX = 120;
    const MESSAGE_MAX = 2000;

    if (subject.length > SUBJECT_MAX) {
      return NextResponse.json(
        { success: false, message: `El asunto no debe exceder ${SUBJECT_MAX} caracteres` },
        { status: 400 }
      );
    }

    if (message.length > MESSAGE_MAX) {
      return NextResponse.json(
        { success: false, message: `El mensaje no debe exceder ${MESSAGE_MAX} caracteres` },
        { status: 400 }
      );
    }

    // Enviar email
    await sendEmail(to, subject, message);

    return NextResponse.json(
      { success: true, message: 'Email enviado exitosamente' },
      { status: 200 }
    );
  } catch (err) {
    // Manejar error de forma segura sin usar `any`
    const message = err instanceof Error ? err.message : String(err);
    console.error('Error al enviar email:', err);
    return NextResponse.json(
      { success: false, message: 'Error al enviar el email: ' + message },
      { status: 500 }
    );
  }
}