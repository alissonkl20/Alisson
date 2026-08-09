import { NextResponse } from "next/server";

type ChatRole = "user" | "assistant";

interface ChatRequestBody {
  message?: string;
  history?: Array<{ role: ChatRole; content: string }>;
}

/** Respostas pré-definidas — estrutura pronta para integração com IA externa */
function buildRuleBasedReply(message: string): string {
  const text = message.toLowerCase().trim();

  if (/^(oi|olá|ola|hey|hi|hello)\b/.test(text)) {
    return "Olá! Como posso ajudar? Pergunte sobre experiência, projetos ou contato.";
  }

  if (text.includes("alisson") || text.includes("quem")) {
    return "Alisson de Almeida é desenvolvedor Full Stack com mais de 3 anos de experiência em backends escaláveis, APIs e interfaces modernas.";
  }

  if (text.includes("experiência") || text.includes("experience") || text.includes("trabalho")) {
    return "Alisson trabalhou em Rauzee (Full Stack), como freelancer em SaaS WhatsApp e no projeto WhaticketSaaS com Node.js, React e PostgreSQL.";
  }

  if (text.includes("projeto") || text.includes("project") || text.includes("stack")) {
    return "Destaques: Finance AI (gestão financeira com LLM local), Chatbot Self-Service com RAG e automação RPA para emissão de notas MEI.";
  }

  if (
    text.includes("contato") ||
    text.includes("contact") ||
    text.includes("email") ||
    text.includes("whatsapp")
  ) {
    return "Você pode entrar em contato pela seção Contact do site, por e-mail ou WhatsApp. Role até o final da página!";
  }

  if (text.includes("tecnologia") || text.includes("tech") || text.includes("stack")) {
    return "Principais tecnologias: React, Next.js, Node.js, TypeScript, Laravel, Vue.js, PostgreSQL e Docker.";
  }

  return "Não encontrei uma resposta exata, mas posso ajudar com experiência, projetos, tecnologias ou contato. Tente reformular a pergunta!";
}

/**
 * Integração opcional com API de IA (OpenAI-compatible).
 * Defina OPENAI_API_KEY e OPENAI_MODEL no ambiente para ativar.
 */
async function buildAiReply(message: string, history: ChatRequestBody["history"]): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (!apiKey) return null;

  const messages = [
    {
      role: "system",
      content:
        "Você é o assistente virtual do portfólio de Alisson de Almeida, desenvolvedor Full Stack. Responda em português, breve e profissional.",
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
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.6,
      max_tokens: 280,
    }),
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const aiReply = await buildAiReply(message, body.history);

    if (aiReply) {
      return NextResponse.json({ reply: aiReply, source: "ai" });
    }

    return NextResponse.json({
      reply: buildRuleBasedReply(message),
      source: "rules",
    });
  } catch {
    return NextResponse.json(
      {
        reply: "Ocorreu um erro ao processar sua mensagem. Tente novamente em instantes.",
        source: "fallback",
      },
      { status: 200 },
    );
  }
}
