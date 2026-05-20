<div align="center">

# ⚛ Rick & Morty — Portal Database

**Aplicación Next.js que explora el multiverso de Rick and Morty**  
con estrategias de renderizado modernas: SSG · ISR · CSR

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

🔗 [**Ver demo en vivo**](https://rick-morty-nextjs-kefo.vercel.app) · [**Repositorio**](https://github.com/YamileOchoa/rick-morty-nextjs.git)

</div>

---

## 📁 Estructura del proyecto

```
rick-morty-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Layout raíz con Navbar y metadata
│   │   ├── page.tsx                    # Página principal — SSG
│   │   ├── globals.css                 # Estilos globales + fuentes
│   │   ├── not-found.tsx               # Página 404 personalizada
│   │   ├── search/
│   │   │   └── page.tsx                # Búsqueda — CSR
│   │   └── character/[id]/
│   │       └── page.tsx                # Detalle — ISR + generateStaticParams
│   ├── components/
│   │   ├── Navbar.tsx                  # Barra de navegación sticky
│   │   ├── CharacterCard.tsx           # Tarjeta con Lazy Loading
│   │   └── SearchClient.tsx            # Búsqueda en tiempo real (use client)
│   ├── lib/
│   │   └── api.ts                      # Llamadas a la Rick and Morty API
│   └── types/
│       └── character.ts                # Interfaces TypeScript
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 🚀 Instalación

```bash
git clone https://github.com/YamileOchoa/rick-morty-nextjs.git
cd rick-morty-nextjs
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## ⚡ Estrategias de Renderizado

| Página                      | Estrategia                     | Justificación                                                                                                             |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `/` — Inicio                | **SSG** (`force-cache`)        | La lista de personajes no cambia frecuentemente. Cacheamos en build time para máximo rendimiento.                         |
| `/search` — Búsqueda        | **CSR** (`use client`)         | La búsqueda es interactiva en tiempo real. Requiere `useState`/`useEffect` → solo puede ser cliente.                      |
| `/character/[id]` — Detalle | **ISR** (`revalidate: 864000`) | Los datos del personaje son estables pero podrían actualizarse. ISR regenera la página cada 10 días sin rebuild completo. |
| `generateStaticParams`      | **SSG** para rutas dinámicas   | Pre-genera todas las rutas `/character/1` ... `/character/826` en build time para carga instantánea.                      |

---

## 🛠 Tecnologías

- **Next.js 14** — App Router
- **TypeScript** — Tipado estático
- **Tailwind CSS** — Estilos utilitarios
- **Next/Image** — Optimización + Lazy Loading automático
- **Rick and Morty API** — https://rickandmortyapi.com

---

## 🔗 Links

- **Repositorio:** `https://github.com/YamileOchoa/rick-morty-nextjs.git`
- **App en Vercel:** `https://rick-morty-nextjs-kefo.vercel.app/`

---

## 📝 Notas del desarrollador

### ¿Por qué `force-cache` en la Home?

La página principal carga los primeros 20 personajes. Estos datos son prácticamente inmutables — el show terminó y la API no cambia. Usar `force-cache` (SSG) significa que Next.js genera el HTML en tiempo de build y lo sirve desde CDN, sin tocar el servidor en cada visita.

### ¿Por qué ISR en el detalle de personaje?

Cada personaje podría recibir correcciones menores en la API. ISR con 10 días (`864000` segundos) nos da lo mejor de los dos mundos: velocidad de SSG con la capacidad de actualizar sin rebuild.

### ¿Por qué CSR en la búsqueda?

La búsqueda necesita reaccionar a cada keystroke del usuario. Eso requiere `useState` y `useEffect` — herramientas que solo existen en el cliente. No tiene sentido usar SSR aquí porque el servidor no sabe qué está escribiendo el usuario.
