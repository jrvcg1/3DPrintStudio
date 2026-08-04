# 3D Print Studio 🚀

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

Plataforma web de última generación para un estudio de impresión 3D gestionado por un joven emprendedor. Combina una estética minimalista y futurista inspirada en **Apple, Tesla, Nothing, Stripe y Vercel** con una experiencia de compra inmediata vía WhatsApp y un panel de administración ultra intuitivo.

---

## ✨ Características Principales

- 🎨 **Diseño Hipermoderno**: Obsidian Dark Mode, acentos en azul eléctrico, cian y morado, superficies glassmorphism y animaciones fluidas.
- 📱 **Mobile First & Responsive**: Optimizado para la mejor experiencia en cualquier dispositivo.
- 💬 **Integración WhatsApp Directa**: Generación automática de enlace con nombre del producto, color seleccionado, precio y detalles de personalización.
- 🔍 **Buscador Inteligente & Filtros**: Filtra por categorías (Llaveros, Organizadores, Figuras, Decoración, Juegos, Regalos), rango de precio, colores y disponibilidad.
- ⚡ **Panel de Administración Teen-Friendly**: Diseñado para que un chico de 13 años gestione el catálogo, precios, fotos, pedidos y categorías sin complicaciones técnicas.
- 🎯 **SEO & Accesibilidad (WCAG AA)**: Metadatos OpenGraph, Twitter Cards, Schema.org estructurado y soporte completo de navegación por teclado.
- 🚀 **Optimizado para Firebase Hosting**: Configurado para despliegue rápido con un solo comando.

---

## 🛠️ Tecnologías

- **Core**: React 18, TypeScript, Vite
- **Estilos**: TailwindCSS, PostCSS, Lucide Icons, Framer Motion
- **Backend / Persistencia**: Firebase Firestore, Firebase Storage, Firebase Auth
- **Hosting**: Firebase Hosting

---

## 🚀 Instalación y Desarrollo Local

1. **Clonar el repositorio / Acceder al directorio**:
   ```bash
   cd 3d-print-studio
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

4. **Variables de entorno (Opcional para Firebase)**:
   Crea un archivo `.env` en la raíz con tus credenciales de Firebase:
   ```env
   VITE_FIREBASE_API_KEY=tu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu_proyecto
   VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   VITE_FIREBASE_APP_ID=tu_app_id
   ```

---

## 📦 Despliegue en Firebase Hosting

1. Compilar el proyecto para producción:
   ```bash
   npm run build
   ```

2. Desplegar en Firebase:
   ```bash
   firebase deploy --only hosting
   ```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](file:///C:/Users/ruedaj/.gemini/antigravity/scratch/3d-print-studio/LICENSE) para más información.
