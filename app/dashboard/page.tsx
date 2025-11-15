'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [subjectRemaining, setSubjectRemaining] = useState(120);
  const [message, setMessage] = useState('');
  const [messageRemaining, setMessageRemaining] = useState(2000);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Obtener información del usuario desde el token
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/auth/verify');
        if (!response.ok) {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      }
    };

    verifyToken();
    setUserEmail('admin@example.com'); // En producción, obtener del token
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Client-side length validation
    const SUBJECT_MAX = 120;
    const MESSAGE_MAX = 2000;
    if (subject.trim().length === 0 || message.trim().length === 0) {
      setError('Asunto y mensaje no pueden estar vacíos');
      setLoading(false);
      return;
    }

    if (subject.length > SUBJECT_MAX) {
      setError(`El asunto no debe exceder ${SUBJECT_MAX} caracteres`);
      setLoading(false);
      return;
    }

    if (message.length > MESSAGE_MAX) {
      setError(`El mensaje no debe exceder ${MESSAGE_MAX} caracteres`);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('¡Email enviado exitosamente!');
        setTo('');
        setSubject('');
        setMessage('');
      } else {
        setError(data.message || 'Error al enviar el email');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Limpiar estado y redirigir
        router.push('/login');
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      // Si hay error, igual redirigir
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-2">Bienvenido, {userEmail}</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="block px-4 py-2 rounded bg-blue-500 text-white"
              >
                Enviar Email
              </a>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">
            Formulario de Envío de Emails
          </h1>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  {success}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Destinatario
                </label>
                <input
                  type="email"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="destinatario@example.com"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Asunto
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => { setSubject(e.target.value); setSubjectRemaining(120 - e.target.value.length); }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="Asunto del email"
                  maxLength={120}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{subjectRemaining} caracteres restantes</p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Mensaje
                </label>
                <textarea
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setMessageRemaining(2000 - e.target.value.length); }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="Escribe tu mensaje aquí..."
                  maxLength={2000}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{messageRemaining} caracteres restantes</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition font-semibold"
              >
                {loading ? 'Enviando...' : 'Enviar Email'}
              </button>
            </form>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">Instrucciones:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Ingresa el email del destinatario</li>
                <li>Escribe el asunto del mensaje</li>
                <li>Redacta el contenido del email</li>
                <li>Haz clic en "Enviar Email"</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
