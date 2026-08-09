# Chatbot Server (Express)

Backend opcional para o widget de chat do portfólio.

## Uso

```bash
cd chatbot-server
npm install
npm start
```

Servidor em `http://localhost:4000`.

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta (padrão: 4000) |
| `CORS_ORIGIN` | Origem permitida (padrão: `*`) |
| `OPENAI_API_KEY` | Chave OpenAI para respostas com IA |
| `OPENAI_MODEL` | Modelo (padrão: `gpt-4o-mini`) |

No frontend, defina `NEXT_PUBLIC_CHATBOT_API_URL=http://localhost:4000`.

Sem essa variável, o frontend usa a rota interna `/api/chat` do Next.js.
