---
name: portfolio-ollama-knowledge
description: Maintain Ollama chat knowledge for Alisson portfolio. Use when updating CV, stack, projects, experience, or chat system prompt / knowledge base.
---

# Portfolio Ollama knowledge

The chat LLM reads context from Markdown files — not from hardcoded TypeScript.

## Source of truth

| File | Purpose |
|------|---------|
| [src/app/api/chat/knowledge/portfolio/SKILL.md](../../../src/app/api/chat/knowledge/portfolio/SKILL.md) | Facts: profile, stack, experience, projects, contact |
| [src/app/api/chat/knowledge/portfolio/rules.md](../../../src/app/api/chat/knowledge/portfolio/rules.md) | Behavior rules: 3rd person, no invented prices, forbidden phrases |

Sections use `## section_id` headers: `profile`, `contact`, `stack`, `experience`, `projects`, `services`, `examples`.

## Do

- Edit `SKILL.md` when CV, stack, or projects change
- Keep stack lists complete (Backend, Frontend, DB, DevOps, Cloud)
- Use third-person facts about Alisson
- After edits: rebuild and restart chat API on VPS

## Do not

- Put portfolio facts in `build-prompt.ts` or `system-prompt.ts`
- Commit secrets or prices in knowledge files

## Deploy after knowledge change

```bash
# On VPS
cd /var/www/portfolio
git pull
cd src/app/api/chat/hostinger && npm run build
pm2 restart portfolio-chat-api
```

Restart clears in-memory response cache.

## How it works

`build-prompt.ts` reads Markdown at runtime, picks relevant sections by keywords in the user message, and builds the Ollama system prompt per request.
