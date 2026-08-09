/**
 * Template de backend Express para o chatbot do portfólio.
 * Rode com: npm install && npm start
 * Configure NEXT_PUBLIC_CHATBOT_API_URL=http://localhost:4000 no frontend.
 */

import cors from "cors";
import express from "express";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(express.json());

type ChatRole = "user" | "assistant";

interface ChatRequestBody {
  message?: string;
  history?: Array<{ role: ChatRole; content: string }>;
}

function buildRuleBasedReply(message: string): string {
  const text = message.toLowerCase().trim();

  if (/^(oi|olá|ola|hey|hi|hello)\b/.test(text)) {
    return "Olá! Como posso ajudar? Pergunte sobre experiência, projetos ou contato.";
  }

  if (text.includes("alisson") || text.includes("quem")) {
    return "Alisson de Almeida é desenvolvedor Full Stack com mais de 3 anos de experiência.";
  }

  if (text.includes("experiência") || text.includes("experience")) {
    return "Experiência em Rauzee, freelancing e WhaticketSaaS com Node.js, React e PostgreSQL.";
  }

  if (text.includes("projeto") || text.includes("project")) {
    return "Projetos: Finance AI, Chatbot Self-Service e automação RPA para MEI.";
  }

  if (text.includes("contato") || text.includes("contact")) {
    return "Use a seção Contact do site ou os links de e-mail e WhatsApp.";
  }

  return "Posso ajudar com experiência, projetos ou contato. Reformule sua pergunta!";
}

async function buildAiReply(
  message: string,
  history: ChatRequestBody["history"],
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) return null;

  const messages = [
    {
      role: "system",
      content:
        "Assistente do portfólio de Alisson de Almeida. Respostas curtas em português.",
    },
    ...(history ?? []).map((entry) => ({ role: entry.role, content: entry.content })),
    { role: "user", content: message },
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0.6, max_tokens: 280 }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  const body = req.body as ChatRequestBody;
  const message = body.message?.trim();

  if (!message) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  try {
    const aiReply = await buildAiReply(message, body.history);

    if (aiReply) {
      res.json({ reply: aiReply, source: "ai" });
      return;
    }

    res.json({ reply: buildRuleBasedReply(message), source: "rules" });
  } catch {
    res.status(500).json({
      reply: "Erro interno. Tente novamente.",
      source: "fallback",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot server listening on http://localhost:${PORT}`);
});
