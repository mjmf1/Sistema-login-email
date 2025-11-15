# 🚀 Sistema de Login y Envío de EmailsThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



Sistema de autenticación funcional con envío de correos vía SMTP, desarrollado en **Next.js** (Node.js y React.js). Este proyecto incluye un sistema completo de login y un dashboard con formulario para envío de emails.## Getting Started



## ✨ CaracterísticasFirst, run the development server:



- ✅ **Autenticación segura** con JWT```bash

- ✅ **Login funcional** con validación de credencialesnpm run dev

- ✅ **Dashboard protegido** con rutas privadas# or

- ✅ **Envío de emails** vía SMTP (Gmail)yarn dev

- ✅ **Formulario dinámico** para envío de emails# or

- ✅ **Middleware de protección** de rutaspnpm dev

- ✅ **Cookies HTTP-only** para mayor seguridad# or

- ✅ **Diseño responsivo** con Tailwind CSSbun dev

- ✅ **TypeScript** para mayor robustez```



## 📋 Requisitos PreviosOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.



Antes de instalar el proyecto, asegúrate de tener:You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.



- **Node.js** v18 o superior ([descargar](https://nodejs.org/))This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

- **npm** o **yarn** instalado

- Una **cuenta de Gmail** con [contraseña de aplicación](https://support.google.com/accounts/answer/185833?hl=es) generada## Learn More

- **Git** instalado

To learn more about Next.js, take a look at the following resources:

## 📦 Instalación

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

### 1. Clonar el repositorio- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.



```bashYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

git clone https://github.com/marlon-mora/sistema-login-email.git

cd sistema-login-email## Deploy on Vercel

```

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### 2. Instalar dependencias

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configúralo con tus credenciales:

```bash
cp .env.example .env.local
```

Edita el archivo `.env.local` con tus datos:

```bash
# Credenciales de usuarios
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# JWT Secret (usa un valor seguro en producción)
JWT_SECRET=tu_secreto_super_seguro_aqui_12345

# Configuración SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_contraseña_de_aplicación
SMTP_FROM=tu_email@gmail.com

# Node environment
NODE_ENV=development
```

### ⚠️ Importante: Configurar Gmail

1. Ve a tu [cuenta de Google](https://myaccount.google.com/)
2. En el menú de la izquierda, ve a **Seguridad**
3. Busca **"Contraseña de aplicación"** (requiere verificación en 2 pasos)
4. Selecciona **Mail** y **Windows (o tu sistema operativo)**
5. Copia la contraseña generada y pégala en `SMTP_PASSWORD`

## 🚀 Ejecución

### Modo de desarrollo

```bash
npm run dev
```

El servidor estará disponible en: **[http://localhost:3000](http://localhost:3000)**

### Modo de producción

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

## 📖 Uso de la Aplicación

### 1. **Página de Inicio** (`/`)
- Página de bienvenida con navegación
- Acceso directo al login

### 2. **Login** (`/login`)
- Formulario de autenticación
- Validación de credenciales

**Credenciales de prueba:**
```
Email: admin@example.com
Password: admin123
```

### 3. **Dashboard** (`/dashboard`)
- Formulario para enviar emails
- Campos: destinatario, asunto, mensaje
- Botón de cerrar sesión

## 🏗️ Estructura del Proyecto

```
sistema-login-email/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts        # Endpoint de autenticación
│   │   │   └── verify/route.ts       # Verificación de token
│   │   └── email/
│   │       └── send/route.ts         # Envío de emails
│   ├── dashboard/
│   │   └── page.tsx                  # Página del dashboard
│   ├── login/
│   │   └── page.tsx                  # Página de login
│   ├── page.tsx                      # Página de inicio
│   ├── layout.tsx                    # Layout principal
│   └── globals.css                   # Estilos globales
├── lib/
│   └── email.ts                      # Configuración SMTP
├── middleware.ts                     # Protección de rutas
├── .env.example                      # Ejemplo de variables
├── .env.local                        # Variables de entorno (no subir a Git)
├── next.config.ts                    # Configuración de Next.js
├── tsconfig.json                     # Configuración TypeScript
└── package.json                      # Dependencias del proyecto
```

## 🔐 Seguridad

- Las cookies son **HTTP-only** para prevenir XSS
- Los tokens JWT expiran en **24 horas**
- Las contraseñas se validan contra variables de entorno
- Las rutas protegidas se validan con **middleware**
- Variables sensibles se almacenan en `.env.local` (excluido de Git)

## 🛠️ Dependencias Principales

| Dependencia | Versión | Uso |
|-------------|---------|-----|
| Next.js | 16.0.3 | Framework web |
| React | 19.2.0 | Librería UI |
| TypeScript | 5.x | Lenguaje tipado |
| jsonwebtoken | 9.0.2 | Autenticación JWT |
| nodemailer | 7.0.10 | Envío de emails |
| bcryptjs | 3.0.3 | Hash de contraseñas |
| Tailwind CSS | 4.x | Estilos CSS |

## 🚨 Troubleshooting

### "Error al enviar email"
- Verifica que la contraseña de aplicación sea correcta
- Confirma que Gmail tiene habilitado el acceso de aplicaciones menos seguras (si no usas contraseña de app)
- Asegúrate de que el puerto SMTP es el correcto (587 para TLS)

### "No autorizado" en dashboard
- Limpia las cookies del navegador
- Vuelve a iniciar sesión
- Verifica que `JWT_SECRET` sea igual en `.env.local` y el código

### El servidor no inicia
- Verifica que el puerto 3000 esté disponible
- Intenta `npm install` nuevamente
- Limpia la carpeta `.next` con `rm -rf .next`

## 📝 Variables de Entorno Necesarias

```env
ADMIN_EMAIL              # Email para login
ADMIN_PASSWORD           # Contraseña para login
JWT_SECRET               # Clave secreta para tokens JWT
SMTP_HOST                # Host del servidor SMTP (ej: smtp.gmail.com)
SMTP_PORT                # Puerto SMTP (ej: 587)
SMTP_USER                # Usuario SMTP
SMTP_PASSWORD            # Contraseña SMTP (contraseña de aplicación en Gmail)
SMTP_FROM                # Email remitente
NODE_ENV                 # Ambiente (development/production)
```

## 🤝 Contribuciones

Este es un proyecto de prueba práctica. Para sugerencias o mejoras, contacta al desarrollador.

## 📄 Licencia

Este proyecto está disponible bajo la licencia MIT.

## 👨‍💻 Desarrollador

**Marlon Mora**

## 🔗 Enlaces

- [Repositorio GitHub](https://github.com/marlon-mora/sistema-login-email)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Nodemailer](https://nodemailer.com/)

---

**Última actualización:** Noviembre 2025
