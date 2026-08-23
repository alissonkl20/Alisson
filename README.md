# Alisson Portfolio

Immersive full-stack developer portfolio with Canvas animations, scroll-driven sections, and an interactive project timeline.

## Stack

- **Next.js 16** + **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion**
- **Three.js / React Three Fiber** (Data Flow particles)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm start
```

## Customization

- **Profile & content:** `src/shared/config/data.ts`
- **Theme tokens:** `src/shared/config/theme.ts`
- **Experience timeline:** `src/features/about/lib/timelineData.ts`

## Features

- Intro particle animation
- Scroll-driven bio reveal
- Career narrative timeline
- Data Flow ecosystem visualization
- Projects timeline with mobile layout
- Light/dark theme
- `prefers-reduced-motion` support
