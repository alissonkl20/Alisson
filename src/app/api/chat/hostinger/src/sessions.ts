const SESSION_TTL_MS = 86_400_000;

type ChatTurn = { role: "user" | "assistant"; content: string };
type Session = { messages: ChatTurn[]; expiresAt: number; busy: boolean };

const sessions = new Map<string, Session>();

function getSession(sessionId: string): Session {
  const now = Date.now();
  const existing = sessions.get(sessionId);
  if (existing && existing.expiresAt > now) return existing;
  const created: Session = { messages: [], expiresAt: now + SESSION_TTL_MS, busy: false };
  sessions.set(sessionId, created);
  return created;
}

export function isSessionBusy(sessionId: string): boolean {
  return getSession(sessionId).busy;
}

export function setSessionBusy(sessionId: string, busy: boolean) {
  getSession(sessionId).busy = busy;
}

export function appendSessionMessage(sessionId: string, role: ChatTurn["role"], content: string) {
  const session = getSession(sessionId);
  session.messages.push({ role, content });
  if (session.messages.length > 40) {
    session.messages = session.messages.slice(-40);
  }
}

export function getSessionMessages(sessionId: string): ChatTurn[] {
  return [...getSession(sessionId).messages];
}
