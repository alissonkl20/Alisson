/**
 * Template Express — respostas alinhadas com src/lib/chatbot-responses.ts
 */

import cors from "cors";
import express from "express";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
app.use(express.json());

const REPLY_ALISSON =
  "Alisson de Almeida é desenvolvedor Full Stack com mais de 3 anos de experiência profissional e mais de 5 anos estudando e inserido na área de tecnologia. Atua com stacks novas e legadas.";

const REPLY_EXPERIENCE =
  "Experiência em backends robustos, seguros e escaláveis; otimização de performance; frontend moderno e responsivo; landing pages e projetos personalizados; RPA web server-side ou no-code com simulação de ação humanizada.";

const REPLY_PROJECTS =
  "RPAs para nota MEI, consultas automatizadas, notificações e mensagens; Finance AI com LLM local para análise de extratos; agentes para agilização de trabalho, entre outros.";

function buildRuleBasedReply(message) {
  const text = message.toLowerCase().trim();

  if (/^(oi|olá|ola|hey|hi|hello)\b/.test(text)) {
    return "Olá! Pergunte sobre Alisson, experiência ou projetos.";
  }

  if (text.includes("alisson") || text.includes("quem")) {
    return REPLY_ALISSON;
  }

  if (
    text.includes("experiência") ||
    text.includes("experience") ||
    text.includes("backend") ||
    text.includes("frontend") ||
    text.includes("rpa")
  ) {
    return REPLY_EXPERIENCE;
  }

  if (text.includes("projeto") || text.includes("project") || text.includes("finance")) {
    return REPLY_PROJECTS;
  }

  return "Pergunte sobre quem é Alisson, experiência, projetos ou tecnologias.";
}

async function buildAiReply(message, history) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) return null;

  const messages = [
    {
      role: "system",
      content:
        "Assistente do portfólio de Alisson de Almeida. Respostas em português. Não ofereça contato.",
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
    body: JSON.stringify({ model, messages, temperature: 0.6, max_tokens: 400 }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  const message = req.body?.message?.trim();

  if (!message) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  try {
    const aiReply = await buildAiReply(message, req.body.history);

    if (aiReply) {
      res.json({ reply: aiReply, source: "ai" });
      return;
    }

    res.json({ reply: buildRuleBasedReply(message), source: "rules" });
  } catch {
    res.status(500).json({ reply: "Erro interno. Tente novamente.", source: "fallback" });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot server listening on http://localhost:${PORT}`);
});
