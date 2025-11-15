# Sistema de Login y Envío de Emails

Esta aplicación es un proyecto en Next.js (App Router) que implementa:

- Autenticación básica mediante JWT y cookie HTTP-only.
- Dashboard protegido con un formulario para enviar emails vía SMTP (nodemailer).
- Frontend con Tailwind CSS y TypeScript.

Este README contiene todo lo necesario para configurar y ejecutar el proyecto en local.

---

## Requisitos previos

- Node.js 18+ (recomendado)
- npm o yarn
- Git

## Instalación y configuración

1. Clona el repositorio:

```bash
git clone https://github.com/mjmf1/Sistema-login-email.git

cd Sistema-login-email
```

2. Instala dependencias:

```bash
npm install
```

3. Copia el ejemplo de variables de entorno y edítalo (flujo recomendado)

```bash
cp .env.example .env.local
# luego edita .env.local con tu editor (no lo subas al repo)
```

Variables mínimas a configurar en `.env.local` (ejemplo):

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
JWT_SECRET=una_clave_segura_aqui
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_contraseña_de_aplicación
SMTP_FROM=tu_email@gmail.com
NODE_ENV=development
```

Notas importantes:

- Mantén `.env.local` fuera del control de versiones. El repositorio incluye `.env.example` como plantilla para el entrevistador y para facilitar la configuración local.
- Si cambias variables en `.env.local`, reinicia el servidor de desarrollo para que se recarguen las variables de entorno.
- No subas secretos reales al repositorio. Usa valores de ejemplo o variables en el entorno de despliegue.

---

## Scripts útiles

- `npm run dev` — Inicia el servidor en modo desarrollo (Hot reload).
- `npm run build` — Compila la aplicación para producción.
- `npm run start` — Inicia la app compilada en modo producción.
- `npm run lint` — Ejecuta eslint.

Ejemplo (desarrollo):

```bash
npm run dev
# abrir http://localhost:3000
```

Si `3000` está ocupado, Next arrancará en otro puerto (por ejemplo 3001).

---

## Uso rápido

- Página de login: `/login` (credenciales por defecto desde `.env.local`).
- Dashboard: `/dashboard` (protegido; requiere cookie JWT).
- API relevantes:
  - `POST /api/auth/login` — login (genera cookie `auth_token`).
  - `POST /api/auth/logout` — elimina cookie.
  - `GET /api/auth/verify` — verifica token.
  - `POST /api/email/send` — envía email (requiere autenticación).

---

## Buenas prácticas y seguridad

- Mantén `JWT_SECRET` y credenciales SMTP fuera del repo público.
- Las cookies de sesión son HTTP-only; para producción, habilita `secure`.
- Reemplaza la validación por variables de entorno con una base de datos real para producción.

---

## Estructura principal del proyecto

```
app/
  ├─ api/auth/*   # login, logout, verify
  ├─ api/email/*  # envío de emails
  ├─ login/page.tsx
  └─ dashboard/page.tsx
lib/
  └─ email.ts     # configuración SMTP
middleware.ts     # protección de rutas
```

---

## Troubleshooting rápido

- Si el servidor no arranca: asegúrate de `npm install` y que el puerto no esté en uso.
- Si fallan envíos SMTP: revisa `SMTP_USER`, `SMTP_PASSWORD`, y prueba con credenciales válidas.

---

Última actualización: Noviembre 2025
