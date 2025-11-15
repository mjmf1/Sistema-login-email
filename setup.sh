#!/bin/bash

# ============================================
# SCRIPT DE CONFIGURACIÓN RÁPIDA
# Sistema de Login y Envío de Emails
# ============================================

echo "🚀 Iniciando configuración del proyecto..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor, instálalo desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js v$(node --version) detectado"
echo "✅ npm v$(npm --version) detectado"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias instaladas correctamente"
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo ""

# Crear .env.local si no existe
if [ ! -f .env.local ]; then
    echo "📝 Creando archivo .env.local..."
    cp .env.example .env.local
    echo "✅ Archivo .env.local creado"
    echo ""
    echo "⚠️  IMPORTANTE: Edita .env.local con tus credenciales reales:"
    echo ""
    echo "   1. Abre .env.local en tu editor"
    echo "   2. Ingresa tus credenciales de Gmail"
    echo "   3. Cambia SMTP_USER y SMTP_PASSWORD"
    echo ""
else
    echo "✅ Archivo .env.local ya existe"
fi

echo ""
echo "✅ ¡Configuración completada!"
echo ""
echo "🎯 Para iniciar el servidor:"
echo "   npm run dev"
echo ""
echo "📖 Abre tu navegador en: http://localhost:3000"
echo ""
