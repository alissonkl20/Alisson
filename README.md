# Dev Portfolio — Portfólio Imersivo

Portfólio de desenvolvedor web com animações em Canvas, scroll suave e carrossel interativo.

## Stack

- **Next.js 16** + **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** (carrossel de projetos)
- **Canvas 2D** (animações Data Strings e Data Flow)

## Estrutura

```
src/
├── app/                    # Páginas e layout
├── components/
│   ├── animations/
│   │   ├── DataStrings.tsx # Física de mola + reação ao mouse
│   │   └── DataFlow.tsx    # Partículas em curvas de Bézier
│   ├── sections/           # About, Experience, Projects
│   ├── Navbar.tsx
│   ├── CustomCursor.tsx
│   └── ProjectCarousel.tsx
├── config/
│   ├── theme.ts            # Cores e tokens
│   └── data.ts             # Conteúdo (perfil, experiências, projetos)
└── hooks/
    └── useCanvasAnimation.ts  # Resize, Intersection Observer, reduced-motion
```

## Instalação

```bash
cd dev-portfolio
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Build para produção

```bash
npm run build
npm start
```

## Deploy na Vercel

```bash
npx vercel
```

Ou conecte o repositório em [vercel.com](https://vercel.com) — Next.js é detectado automaticamente.

## Personalização

- **Perfil e conteúdo:** edite `src/config/data.ts`
- **Cores e tema:** edite `src/config/theme.ts`
- **Animações:** ajuste constantes em `DataStrings.tsx` (`STRING_COUNT`, `SPRING`, etc.) e `DataFlow.tsx`

## Funcionalidades

| Seção | Destaque |
|-------|----------|
| About | 280 linhas com física de mola reagindo ao mouse |
| Experience | 60 partículas fluindo entre 3 fontes e 1 núcleo |
| Projects | Carrossel em arco com Framer Motion |

- Pausa automática quando a seção sai da viewport
- Respeita `prefers-reduced-motion`
- Cursor personalizado (desktop)
- Navegação com scroll suave
