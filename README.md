# LinkChest Frontend 

<p align="center">
  <img src="https://raw.githubusercontent.com/github/explore/main/topics/react/react.png" width="70" />
  <img src="https://raw.githubusercontent.com/github/explore/main/topics/vite/vite.png" width="70" />
  <img src="https://raw.githubusercontent.com/github/explore/main/topics/tailwind/tailwind.png" width="70" />
</p>

## 📌 Descripción

**LinkChest Frontend** es una **extensión de navegador** desarrollada con **React + Vite + Tailwind CSS**, cuyo objetivo es permitir la gestión rápida y eficiente de enlaces. Incluye un popup principal, una vista de opciones personalizable y un módulo web que funciona como panel administrativo.

---

## 🚀 Tecnologías Utilizadas

- **React** – Interfaz basada en componentes
- **Vite** – Herramienta rápida de bundling y desarrollo
- **Tailwind CSS** – Estilos con clases utilitarias

---

## 📁 Estructura del Proyecto

La arquitectura general del frontend se basa en una división clara por áreas de la extensión.

```bash
src/
│
├── assets/        # Imágenes, iconos y recursos estáticos
├── common/        # Componentes reutilizables y utilidades comunes
├── config/        # Configuraciones generales del proyecto
├── context/       # Contextos globales (React Context API)
├── options/       # Vista de la página de Opciones de la extensión
├── popup/         # Vista principal del Popup de la extensión
├── services/      # Comunicación con APIs, manejo de datos
└── web/           # Versión web / panel administrativo
```

Además, contiene archivos clave como:

- `.env` → Variables de entorno
- `.env.example` → Plantilla de variables
- `tailwind.config.js` → Configuración de Tailwind
- `package.json` → Dependencias y scripts

---

## ⚙️ Instalación

```bash
npm install
```

---

## ▶️ Ejecución en modo desarrollo

```bash
npm run dev
```

Debido a que es una **extensión**, recuerda cargar la carpeta generada en `dist/` dentro del navegador (modo desarrollador).

---

## 🧩 Construcción de la extensión

```bash
npm run build
```

Esto generará la carpeta `dist/`, lista para subir como extensión al navegador.

---

## 🔧 Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
VITE_API_URL=http://localhost:4000
VITE_ENV=development
```

Puedes leerlas en React mediante:

```js
import.meta.env.VITE_API_URL;
```

---

## 🧭 Secciones del proyecto

### 🔹 Popup (`src/popup/`)

Interfaz principal que aparece al abrir la extensión. Permite gestionar enlaces de forma rápida y directa.

### 🔹 Opciones (`src/options/`) (En desarrollo 👀)

Página de configuración de la extension  Aquí controla preferencias y ajustes.

### 🔹 Web (`src/web/`)

Actualmente funciona como un panel administrativo, pensado para evolucionar en una versión web más completa.

---

## ✅ Características clave

- UI minimalista con Tailwind
- Manejo de estados globales mediante Context
- Integración directa con la API de LinkChest
- Código modular y organizado
- Soporte para modo Popup, Options y Web

---

## 📄 Licencia

Este proyecto utiliza la licencia **MIT**.
