# Alisson Portfolio — Contexto para Agentes

Portfólio pessoal de Alisson de Almeida (Full Stack Developer). Site single-page com tema escuro e destaques **neon laranja** (`#FF5E00`).

## Tecnologias

| Área | Stack |
|------|--------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| Animação | Framer Motion, GSAP (seção Experience) |
| Ícones | Lucide React |
| Chatbot | Widget React + API Route Next.js + template Express opcional |

**Importante:** Esta versão de Next.js pode ter APIs diferentes do treinamento padrão. Consulte `node_modules/next/dist/docs/` antes de alterar convenções do framework.

## Estrutura de diretórios

```
/
├── src/
│   ├── app/                    # App Router (layout, page, global.css, API)
│   │   └── api/chat/route.ts   # Endpoint REST do chatbot (rules + IA opcional)
│   ├── components/
│   │   ├── chat/ChatWidget.tsx # Botão flutuante + painel de chat
│   │   ├── effects/            # NoiseOverlay, MouseGlow, TechGrid
│   │   ├── layout/Navigation.tsx
│   │   ├── sections/           # Hero, About, Experience, Stacks, Contact, Footer
│   │   └── ui/                 # NeonText, NeonButton, GlowCard, Input, SocialIcons
│   ├── hooks/useMousePosition.ts
│   └── lib/
│       ├── chatbot.ts          # Cliente HTTP e tipos do chat
│       ├── constants.ts        # SECTIONS, COLORS, NEON_ORANGE_NAV_LABELS
│       ├── data.ts             # profile, experiences, stacks, techCategories
│       └── utils.ts            # cn() (clsx + tailwind-merge)
├── chatbot-server/             # Backend Express opcional (template)
├── public/
│   └── cv/                     # Currículo estático (index.html)
├── AGENTS.md                   # Este arquivo
└── CLAUDE.md                   # Aponta para AGENTS.md + regras Next.js
```

## Arquitetura

- **Single page:** `src/app/page.tsx` monta todas as seções em ordem.
- **Dados estáticos:** `src/lib/data.ts` — sem CMS ou banco no frontend.
- **Estilos:** Tailwind v4 via `@import "tailwindcss"` em `global.css`; variáveis CSS em `:root` e `@theme inline`.
- **Destaque visual:** textos-chave (nome, títulos de seção, nav Experience/Projects/Contact, "Let's talk") usam neon laranja via `NeonText` (`color="orange"`) e classes `.neon-text-orange` / `.led-sign-orange`.
- **Chatbot:** `ChatWidget` chama `/api/chat` (padrão) ou URL externa via `NEXT_PUBLIC_CHATBOT_API_URL`.

## Seções e IDs (navegação)

| ID | Componente | Título visível |
|----|------------|----------------|
| `home` | Hero | — |
| `about` | About | About Me |
| `experience` | Experience | Experience |
| `stacks` | Stacks | Projects |
| `contact` | Contact | Contact |

Navegação definida em `src/lib/constants.ts` (`SECTIONS`).

## Scripts

```bash
npm run dev      # Desenvolvimento (http://localhost:3000)
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # ESLint
```

Backend opcional do chat:

```bash
cd chatbot-server && npm install && npm start  # http://localhost:4000
```

## Variáveis de ambiente

| Variável | Onde | Descrição |
|----------|------|-----------|
| `NEXT_PUBLIC_CHATBOT_API_URL` | Frontend | URL do servidor Express (ex: `http://localhost:4000`). Se vazio, usa `/api/chat`. |
| `OPENAI_API_KEY` | Next.js / Express | Ativa respostas com IA no chatbot |
| `OPENAI_MODEL` | Next.js / Express | Modelo OpenAI (padrão: `gpt-4o-mini`) |
| `PORT` | chatbot-server | Porta do Express (padrão: 4000) |
| `CORS_ORIGIN` | chatbot-server | Origem CORS permitida |

## Padrões de código

- **Componentes:** PascalCase; seções em `components/sections/`, UI reutilizável em `components/ui/`.
- **Client components:** `"use client"` quando há hooks, eventos ou Framer Motion.
- **Imports:** alias `@/` → `src/`.
- **Classes:** `cn()` de `lib/utils.ts` para merge de Tailwind.
- **Cores neon:** preferir variáveis CSS (`--neon-orange`) e utilitários Tailwind (`text-neon-orange`).
- **Comentários:** apenas para lógica não óbvia (ex.: integração IA no chat).

## Como rodar localmente

1. `npm install`
2. `npm run dev`
3. (Opcional) `cd chatbot-server && npm install && npm start`
4. (Opcional) `.env.local` com `NEXT_PUBLIC_CHATBOT_API_URL` e/ou `OPENAI_API_KEY`

## Componentes principais

- **NeonText / SectionTitle:** texto com efeito neon; títulos de seção em laranja.
- **ChatWidget:** botão "Fale conosco", balões user/bot, indicador de digitação, sugestões rápidas.
- **GlowCard:** cards com glass effect e tilt opcional.
- **Navigation:** menu fixo com scroll spy por `IntersectionObserver`.
