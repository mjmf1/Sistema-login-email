# Flujo de la Aplicación

Este documento describe la arquitectura y flujos de la aplicación de login y envío de emails.

---

## 1. Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                     NAVEGADOR DEL USUARIO                       │
│  (React Frontend - Next.js App Router)                          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ├──────── HTTP/HTTPS ────────┐
                 │                             │
                 ▼                             ▼
        ┌────────────────┐          ┌────────────────────┐
        │  Páginas UI    │          │   APIs REST        │
        │                │          │                    │
        │ /login         │          │ /api/auth/login    │
        │ /dashboard     │          │ /api/auth/logout   │
        │ /              │          │ /api/auth/verify   │
        │                │          │ /api/email/send    │
        └────────────────┘          └─────────┬──────────┘
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │   Middleware         │
                                    │   (Protección)       │
                                    └──────────┬───────────┘
                                               │
                                    ┌──────────▼───────────┐
                                    │  JWT Validation      │
                                    │  Cookie Check        │
                                    └──────────┬───────────┘
                                               │
                        ┌──────────────────────┼──────────────────────┐
                        │                      │                      │
                        ▼                      ▼                      ▼
                  ┌────────────┐        ┌────────────┐      ┌──────────────┐
                  │  Auth DB   │        │   JWT     │      │  Nodemailer  │
                  │ (ENV VARS) │        │  Token    │      │  (SMTP)      │
                  └────────────┘        └────────────┘      └──────────────┘
```

---

## 2. Flujo de Autenticación (Login)

```
┌─────────────────┐
│  Usuario accede│
│  /login        │
└────────┬────────┘
         │
         ▼
    ┌─────────────────────────────────┐
    │  Página de Login                │
    │ (app/login/page.tsx)            │
    │                                 │
    │ - Formulario email/password     │
    │ - Validación básica             │
    └────────────┬────────────────────┘
                 │
        ┌────────┴────────┐
        │ Usuario ingresa │
        │ credenciales    │
        └────────┬────────┘
                 │
                 ▼
    ┌─────────────────────────────────┐
    │  onClick "Iniciar Sesión"       │
    │ (handleSubmit)                  │
    └────────────┬────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────┐
    │  POST /api/auth/login           │
    │                                 │
    │ {                               │
    │   email: "admin@example.com",   │
    │   password: "admin123"          │
    │ }                               │
    └────────────┬────────────────────┘
                 │
                 ▼
    ┌─────────────────────────────────┐
    │  API: app/api/auth/login/       │
    │  route.ts                       │
    │                                 │
    │ 1. Validar credenciales         │
    │    (vs ENV variables)           │
    │ 2. Generar JWT Token            │
    │    (exp: 24h)                   │
    │ 3. Establecer Cookie            │
    │    (auth_token, HTTP-only)      │
    └────────────┬────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
      ✅ OK           ❌ Error
         │                │
         ▼                ▼
    ┌─────────┐      ┌──────────────────┐
    │ {       │      │ {                │
    │  token  │      │  error: "..."    │
    │  msg    │      │  status: 401     │
    │  status │      │ }                │
    │ }       │      └──────────────────┘
    └────┬────┘
         │
         ▼
    ┌─────────────────────────────────┐
    │  Frontend recibe respuesta       │
    │                                 │
    │  if (data.token) {              │
    │    router.push('/dashboard')    │
    │  } else {                       │
    │    mostrar error                │
    │  }                              │
    └─────────────────────────────────┘
```

---

## 3. Flujo de Protección de Rutas

```
┌──────────────────────────┐
│ Usuario intenta acceder  │
│ /dashboard               │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  Middleware ejecuta      │
│  (middleware.ts)         │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  ¿Existe cookie "auth_token"?    │
└───┬──────────────────────────┬───┘
    │                          │
   SÍ                         NO
    │                          │
    ▼                          ▼
┌────────────┐        ┌──────────────────┐
│ ¿JWT       │        │ Redirigir a      │
│ válido?    │        │ /login           │
└────┬───┬───┘        └──────────────────┘
  SÍ │   │ NO
     │   └────────┐
     │            │
     ▼            ▼
  ┌──────┐   ┌──────────────────┐
  │Dejar │   │ Redirigir a      │
  │pasar │   │ /login           │
  └──┬───┘   └──────────────────┘
     │
     ▼
┌──────────────────────────┐
│ Mostrar /dashboard       │
│ (usuario autenticado)    │
└──────────────────────────┘
```

---

## 4. Flujo de Envío de Emails

```
┌──────────────────────────┐
│ Usuario en Dashboard     │
│ Completa formulario:     │
│ - Email destinatario     │
│ - Asunto (max 120 chars) │
│ - Mensaje (max 2000)     │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ onClick "Enviar Email"           │
│ (handleSubmit)                   │
└──────────┬───────────────────────┘
           │
           ▼
┌────────────────────────────────────────┐
│ Validación Client-Side:                │
│                                        │
│ ✓ Email no vacío                       │
│ ✓ Asunto no vacío                      │
│ ✓ Mensaje no vacío                     │
│ ✓ Asunto ≤ 120 caracteres              │
│ ✓ Mensaje ≤ 2000 caracteres            │
└────────┬───────────────────────┬────────┘
         │                       │
    ✅ Válido              ❌ Inválido
         │                       │
         ▼                       ▼
   ┌────────────┐         ┌──────────────┐
   │ POST /api  │         │ mostrar      │
   │ /email/    │         │ error en UI  │
   │ send       │         └──────────────┘
   └────┬───────┘
        │
        ▼
┌──────────────────────────────────┐
│ API: app/api/email/send/route.ts │
│                                  │
│ 1. Verificar token JWT           │
│    (¿es válido?)                 │
│ 2. Validar longitudes            │
│    (server-side)                 │
│ 3. Conectar SMTP (Gmail)         │
│ 4. Enviar email                  │
└────────┬─────────────────────────┘
         │
     ┌───┴────┐
  ✅ OK  ❌ Error
     │        │
     ▼        ▼
  ┌────┐  ┌──────────┐
  │{   │  │{         │
  │ok  │  │ error: 1 │
  │msg │  │}         │
  │}   │  └──────────┘
  └────┘
     │
     ▼
┌──────────────────────────────────┐
│ Frontend recibe respuesta         │
│                                  │
│ if (response.ok) {               │
│   Mostrar "Enviado exitosamente" │
│   Limpiar formulario             │
│ } else {                         │
│   Mostrar mensaje de error       │
│ }                                │
└──────────────────────────────────┘
```

---

## 5. Flujo de Logout

```
┌───────────────────────────────────┐
│ Usuario en Dashboard              │
│ Haz clic en "Cerrar Sesión"       │
└──────────┬────────────────────────┘
           │
           ▼
┌───────────────────────────────────┐
│ onClick handleLogout              │
└──────────┬────────────────────────┘
           │
           ▼
┌───────────────────────────────────┐
│ POST /api/auth/logout             │
│                                   │
│ (sin parámetros)                  │
└──────────┬────────────────────────┘
           │
           ▼
┌────────────────────────────────────┐
│ API: app/api/auth/logout/route.ts  │
│                                    │
│ 1. Eliminar cookie "auth_token"    │
│    (maxAge: 0)                     │
│ 2. Retornar { success: true }      │
└──────────┬─────────────────────────┘
           │
           ▼
┌───────────────────────────────────┐
│ Frontend recibe respuesta          │
│ router.push('/login')              │
└──────────┬────────────────────────┘
           │
           ▼
┌───────────────────────────────────┐
│ Redirigir a /login                │
│                                   │
│ Sesión cerrada ✅                 │
└───────────────────────────────────┘
```

---

## 6. Estructura de Carpetas y Responsabilidades

```
sistema-login-email/
│
├── app/                              # App Router de Next.js
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts         # Autenticación (genera JWT + cookie)
│   │   │   ├── logout/
│   │   │   │   └── route.ts         # Elimina cookie
│   │   │   └── verify/
│   │   │       └── route.ts         # Verifica token válido
│   │   │
│   │   └── email/
│   │       └── send/
│   │           └── route.ts         # Envía email vía SMTP
│   │
│   ├── login/
│   │   └── page.tsx                 # Página de login (formulario)
│   │
│   ├── dashboard/
│   │   └── page.tsx                 # Dashboard (formulario de emails)
│   │
│   ├── page.tsx                     # Página de inicio
│   ├── layout.tsx                   # Layout principal (HTML wrapper)
│   └── globals.css                  # Estilos globales
│
├── lib/
│   └── email.ts                     # Configuración de nodemailer (SMTP)
│
├── middleware.ts                    # Protección de rutas (verifica JWT)
│
├── .env.example                     # Variables de entorno (ejemplo)
├── .env.local                       # Variables secretas (NO subir a Git)
├── next.config.ts                  # Configuración de Next.js
├── tsconfig.json                   # Configuración de TypeScript
├── eslint.config.mjs               # Configuración de linter
├── postcss.config.mjs              # Configuración de Tailwind CSS
│
└── package.json                    # Dependencias y scripts
```

---

## 7. Flujo de Datos (Request/Response)

### 7.1 Login Request

```json
POST /api/auth/login

Request Body:
{
  "email": "admin@example.com",
  "password": "admin123"
}

Response (200):
{
  "success": true,
  "message": "Login exitoso",
  "token": "eyJhbGc..."
}

Response (401):
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

### 7.2 Email Send Request

```json
POST /api/email/send

Headers:
{
  "Content-Type": "application/json",
  "Cookie": "auth_token=eyJhbGc..."
}

Request Body:
{
  "to": "destinatario@example.com",
  "subject": "Asunto del email",
  "message": "Contenido del mensaje..."
}

Response (200):
{
  "success": true,
  "message": "Email enviado exitosamente"
}

Response (400):
{
  "success": false,
  "message": "El asunto no debe exceder 120 caracteres"
}

Response (401):
{
  "success": false,
  "message": "No autorizado"
}
```

---

## 8. Seguridad

```
┌────────────────────────────────────────────┐
│          CAPAS DE SEGURIDAD                │
└────────────────────────────────────────────┘

1. AUTENTICACIÓN
   ├─ Validación de email/password
   ├─ JWT con expiración (24h)
   └─ HTTP-only cookies (previene XSS)

2. AUTORIZACIÓN
   ├─ Middleware verifica JWT en cada request
   ├─ Solo usuarios autenticados ven dashboard
   └─ Solo usuarios autenticados envían emails

3. VALIDACIÓN
   ├─ Client-side (UX rápida)
   ├─ Server-side (seguridad real)
   └─ Límites de caracteres (asunto, mensaje)

4. VARIABLES SENSIBLES
   ├─ .env.local excluido de Git (.gitignore)
   ├─ JWT_SECRET en env
   ├─ SMTP_PASSWORD en env
   └─ No están en código fuente
```

---

## 9. Ciclo de Vida de una Sesión

```
TIMELINE:

T0: Usuario accede a /login
    └─ Sin cookie

T1: Usuario completa login
    └─ POST /api/auth/login
    └─ JWT generado (exp: 24h)
    └─ Cookie establecida

T2-T3: Usuario navega /dashboard
    └─ Middleware valida JWT
    └─ Middleware ve cookie válida
    └─ Acceso permitido

T4: Usuario envía email
    └─ Verifica JWT nuevamente
    └─ Envía email vía SMTP
    └─ Respuesta: success

T5: Usuario hace logout
    └─ POST /api/auth/logout
    └─ Cookie eliminada (maxAge: 0)
    └─ Redirige a /login

T6: Usuario intenta /dashboard sin sesión
    └─ Middleware NO ve cookie
    └─ Redirige a /login
    └─ Ciclo de sesión finalizado
```

---

## 10. Configuración Necesaria

```env
# Credenciales (para desarrollo/prueba)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# JWT Secret (muy importante en producción)
JWT_SECRET=una_clave_muy_segura_aqui_123456

# SMTP (Gmail en este caso)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_contraseña_de_aplicacion
SMTP_FROM=tu_email@gmail.com

# Ambiente
NODE_ENV=development
```

---

## Resumen

Esta arquitectura implementa un **flujo seguro de autenticación y autorización** con las siguientes características:

✅ **Login seguro** con JWT y cookies HTTP-only  
✅ **Protección de rutas** con middleware  
✅ **Validación doble** (client + server)  
✅ **Envío de emails** solo para usuarios autenticados  
✅ **Logout efectivo** que elimina la sesión  
✅ **Código profesional** con manejo de errores  

---

**Última actualización:** Noviembre 2025
