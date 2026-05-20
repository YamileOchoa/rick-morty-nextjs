# ⚛ Rick & Morty — Portal Database

Aplicación Next.js 14 que consume la API de Rick and Morty implementando SSG, SSR, ISR y CSR con un diseño sci-fi oscuro.

---

## 🚀 Pasos para ejecutar localmente

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/rick-morty-nextjs.git
cd rick-morty-nextjs
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000)

### 4. Build de producción
```bash
npm run build
npm run start
```

---

## 🌐 Despliegue en Vercel

### Opción A — Deploy automático desde GitHub (recomendado)
1. Sube tu proyecto a GitHub
2. Entra a [vercel.com](https://vercel.com) → **Add New Project**
3. Importa tu repositorio
4. Vercel detecta Next.js automáticamente → click **Deploy**
5. ¡Listo! Obtienes una URL tipo `https://rick-morty-xxx.vercel.app`

### Opción B — Deploy con Vercel CLI
```bash
# Instalar CLI
npm install -g vercel

# Hacer deploy
vercel

# Deploy a producción
vercel --prod
```

---

## 📁 Estructura del Proyecto

```
rick-morty-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout raíz con Navbar
│   │   ├── page.tsx                # Página principal (SSG)
│   │   ├── globals.css             # Estilos globales + fuentes
│   │   ├── not-found.tsx           # Página 404 personalizada
│   │   ├── search/
│   │   │   └── page.tsx            # Página de búsqueda (CSR)
│   │   └── character/
│   │       └── [id]/
│   │           └── page.tsx        # Detalle de personaje (ISR + generateStaticParams)
│   ├── components/
│   │   ├── Navbar.tsx              # Barra de navegación
│   │   ├── CharacterCard.tsx       # Tarjeta con Lazy Loading
│   │   └── SearchClient.tsx        # Búsqueda en tiempo real ('use client')
│   ├── lib/
│   │   └── api.ts                  # Funciones fetch hacia la API
│   └── types/
│       └── character.ts            # Interfaces TypeScript
├── next.config.js                  # Config de imágenes externas
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## ⚡ Estrategias de Renderizado

| Página | Estrategia | Justificación |
|--------|-----------|---------------|
| `/` — Inicio | **SSG** (`force-cache`) | La lista de personajes no cambia frecuentemente. Cacheamos en build time para máximo rendimiento. |
| `/search` — Búsqueda | **CSR** (`use client`) | La búsqueda es interactiva en tiempo real. Requiere `useState`/`useEffect` → solo puede ser cliente. |
| `/character/[id]` — Detalle | **ISR** (`revalidate: 864000`) | Los datos del personaje son estables pero podrían actualizarse. ISR regenera la página cada 10 días sin rebuild completo. |
| `generateStaticParams` | **SSG** para rutas dinámicas | Pre-genera todas las rutas `/character/1` ... `/character/826` en build time para carga instantánea. |

---

## 🛠 Tecnologías

- **Next.js 14** — App Router
- **TypeScript** — Tipado estático
- **Tailwind CSS** — Estilos utilitarios
- **Next/Image** — Optimización + Lazy Loading automático
- **Rick and Morty API** — https://rickandmortyapi.com

---

## 📸 Capturas de pantalla

> Agrega aquí las capturas de tu app desplegada en Vercel.

| Pantalla | Descripción |
|---------|-------------|
| ![Home](/screenshots/home.png) | Página principal con grid SSG |
| ![Search](/screenshots/search.png) | Búsqueda CSR en tiempo real |
| ![Detail](/screenshots/detail.png) | Detalle ISR con todos los campos |

---

## 🔗 Links

- **Repositorio:** `https://github.com/TU_USUARIO/rick-morty-nextjs`
- **App en Vercel:** `https://rick-morty-TU_PROYECTO.vercel.app`

---

## 📝 Notas del desarrollador

### ¿Por qué `force-cache` en la Home?
La página principal carga los primeros 20 personajes. Estos datos son prácticamente inmutables — el show terminó y la API no cambia. Usar `force-cache` (SSG) significa que Next.js genera el HTML en tiempo de build y lo sirve desde CDN, sin tocar el servidor en cada visita.

### ¿Por qué ISR en el detalle de personaje?
Cada personaje podría recibir correcciones menores en la API. ISR con 10 días (`864000` segundos) nos da lo mejor de los dos mundos: velocidad de SSG con la capacidad de actualizar sin rebuild.

### ¿Por qué CSR en la búsqueda?
La búsqueda necesita reaccionar a cada keystroke del usuario. Eso requiere `useState` y `useEffect` — herramientas que solo existen en el cliente. No tiene sentido usar SSR aquí porque el servidor no sabe qué está escribiendo el usuario.
