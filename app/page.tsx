import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black sm:items-center">
        <h1 className="text-4xl font-bold mb-6 text-center text-black dark:text-zinc-50">
          Sistema de Login y Envío de Emails
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 text-center">
          Prueba técnica desarrollada en Next.js
        </p>

        <Link
          href="/login"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Ir al Login
        </Link>
      </main>
    </div>
  );
}
