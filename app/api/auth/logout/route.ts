import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Sesión cerrada' },
      { status: 200 }
    );

    // Eliminar la cookie estableciendo maxAge en 0
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Esto elimina la cookie
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Error en /api/auth/logout:', err);
    return NextResponse.json(
      { success: false, message: 'Error al cerrar sesión' },
      { status: 500 }
    );
  }
}
