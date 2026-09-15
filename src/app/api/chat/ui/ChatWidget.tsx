"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Mail, MessageCircle, Send, X } from "lucide-react";
import {
  chatbotConfig,
  createAssistantReply,
  createMessage,
  createWelcomeMessage,
  type ChatMessage,
} from "@/app/api/chat/bot";
import { CONTACT_LINKS } from "@/app/api/chat/shared/contact-links";
import { useChatLauncherScroll } from "@/shared/hooks/useChatLauncherScroll";
import { readLocalStorage, writeLocalStorage } from "@/shared/lib/safeStorage";
import "./ChatWidget.css";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ChatApiPayload = {
  reply?: string;
  status?: string;
  contact_links?: typeof CONTACT_LINKS;
};

type ChatReplyResult =
  | { kind: "ok"; reply: string }
  | { kind: "limit_reached"; reply: string; contactLinks: typeof CONTACT_LINKS }
  | { kind: "busy" }
  | { kind: "offline" };

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return (
    typeof message.id === "string" &&
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    typeof message.createdAt === "number" &&
    Number.isFinite(message.createdAt)
  );
}

function loadStoredMessages(): ChatMessage[] | null {
  if (!chatbotConfig.persistHistory) return null;
  try {
    const raw = localStorage.getItem(chatbotConfig.historyStorageKey);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(isChatMessage) ? parsed : null;
  } catch {
    return null;
  }
}

function storeMessages(messages: ChatMessage[]) {
  if (!chatbotConfig.persistHistory) return;
  try {
    localStorage.setItem(chatbotConfig.historyStorageKey, JSON.stringify(messages));
  } catch {
    // ignore
  }
}

function getOrCreateSessionId(): string {
  const stored = readLocalStorage(chatbotConfig.sessionStorageKey);
  if (stored && UUID_PATTERN.test(stored)) return stored;
  const sessionId = crypto.randomUUID();
  writeLocalStorage(chatbotConfig.sessionStorageKey, sessionId);
  return sessionId;
}

function isLimitReachedStored(): boolean {
  return readLocalStorage(chatbotConfig.limitReachedStorageKey) === "1";
}

function setLimitReachedStored() {
  writeLocalStorage(chatbotConfig.limitReachedStorageKey, "1");
}

function appendMessage(messages: ChatMessage[], next: ChatMessage) {
  return [...messages, next].slice(-chatbotConfig.ui.maxMessages);
}

function parseChatResponse(response: Response, payload: ChatApiPayload): ChatReplyResult {
  if (response.status === 429 || payload.status === "limit_reached") {
    return {
      kind: "limit_reached",
      reply: payload.reply?.trim() || "You've reached the chat limit for today.",
      contactLinks: payload.contact_links ?? CONTACT_LINKS,
    };
  }
  if (response.status === 409) return { kind: "busy" };
  if (!response.ok) return { kind: "offline" };
  const reply = payload.reply?.trim();
  if (!reply) return { kind: "offline" };
  return { kind: "ok", reply };
}

async function requestChatReply(
  sessionId: string,
  message: string,
  signal: AbortSignal,
): Promise<ChatReplyResult> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session_id: sessionId, message }),
    cache: "no-store",
    signal,
  });

  let payload: ChatApiPayload = {};
  try {
    payload = (await response.json()) as ChatApiPayload;
  } catch {
    payload = {};
  }

  return parseChatResponse(response, payload);
}

function ContactLinksBlock({ links }: { links: typeof CONTACT_LINKS }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      <a
        href={links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text transition hover:bg-theme-surface-hover"
      >
        <ExternalLink size={12} aria-hidden />
        LinkedIn
      </a>
      <a
        href={links.email}
        className="inline-flex items-center gap-1 rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text transition hover:bg-theme-surface-hover"
      >
        <Mail size={12} aria-hidden />
        Email
      </a>
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-lg border border-theme-border bg-theme-surface px-2.5 py-1.5 text-xs text-theme-text transition hover:bg-theme-surface-hover"
      >
        <MessageCircle size={12} aria-hidden />
        WhatsApp
      </a>
    </div>
  );
}

export function ChatWidget() {
  const { ui, enabled } = chatbotConfig;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [sending, setSending] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [contactLinks, setContactLinks] = useState(CONTACT_LINKS);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const sendingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isLimitReachedStored()) setLimitReached(true);
  }, []);

  const ensureInitialized = () => {
    if (initialized) return;
    const stored = loadStoredMessages();
    setMessages(stored?.length ? stored : [createWelcomeMessage()]);
    setInitialized(true);
  };

  const toggleOpen = () => {
    if (open) {
      setOpen(false);
      return;
    }
    ensureInitialized();
    setOpen(true);
  };

  useEffect(() => {
    if (!initialized) return;
    storeMessages(messages);
  }, [initialized, messages]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [open, messages, sending]);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      if (!limitReached) inputRef.current?.focus();
      return;
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      launcherRef.current?.focus();
    }
  }, [open, limitReached]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  if (!enabled) return null;

  const applyLimitReached = (reply: string, links: typeof CONTACT_LINKS) => {
    setLimitReached(true);
    setLimitReachedStored();
    setContactLinks(links);
    setMessages((current) => appendMessage(current, createMessage("assistant", reply)));
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || sendingRef.current || limitReached) return;

    sendingRef.current = true;
    setSending(true);
    setInput("");
    setMessages((current) => appendMessage(current, createMessage("user", trimmed)));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await requestChatReply(
        getOrCreateSessionId(),
        trimmed,
        controller.signal,
      );

      if (result.kind === "limit_reached") {
        applyLimitReached(result.reply, result.contactLinks);
        return;
      }

      if (result.kind === "busy") {
        setMessages((current) => current.slice(0, -1));
        setInput(trimmed);
        return;
      }

      const assistantMessage =
        result.kind === "ok"
          ? createMessage("assistant", result.reply)
          : createAssistantReply(trimmed);

      setMessages((current) => appendMessage(current, assistantMessage));
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      setMessages((current) => appendMessage(current, createAssistantReply(trimmed)));
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      sendingRef.current = false;
      setSending(false);
    }
  };

  const isRight = ui.position === "bottom-right";
  const { tucked } = useChatLauncherScroll(open);
  const sideClass = isRight ? "chat-launcher--right" : "chat-launcher--left";
  const openClass = open ? " chat-launcher--open" : "";
  const tuckedClass = tucked ? " chat-launcher--tucked" : "";

  return (
    <div className={`chat-launcher ${sideClass}${openClass}${tuckedClass}`}>
      {open && (
        <div
          className="chat-launcher__panel flex max-h-[calc(100dvh-6rem)] w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-theme-border bg-theme-nav-bg shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:w-96 lg:max-h-none"
          role="dialog"
          aria-label={ui.title}
          aria-busy={sending}
        >
          <header className="flex items-start justify-between gap-3 border-b border-theme-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-theme-title">{ui.title}</h2>
              <p className="mt-0.5 text-xs text-theme-text-muted">{ui.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-theme-border bg-theme-surface text-theme-text transition hover:bg-theme-surface-hover lg:h-8 lg:w-8"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex max-h-[min(20rem,calc(100dvh-14rem))] flex-col gap-3 overflow-y-auto px-4 py-4 lg:max-h-80"
            aria-live="polite"
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-theme-brand text-theme-bg"
                      : "border border-theme-border bg-theme-surface text-theme-text"
                  }`}
                >
                  <p>{message.content}</p>
                  {limitReached && message.role === "assistant" && index === messages.length - 1 ? (
                    <ContactLinksBlock links={contactLinks} />
                  ) : null}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <p
                  className="max-w-[85%] rounded-2xl border border-theme-border bg-theme-surface px-3 py-2 text-sm text-theme-text-muted"
                  aria-label="Loading reply"
                >
                  …
                </p>
              </div>
            )}
          </div>

          {limitReached ? (
            <div className="border-t border-theme-border p-3">
              <p className="text-center text-xs text-theme-text-muted">
                Chat limit reached — use the links above to continue.
              </p>
              <ContactLinksBlock links={contactLinks} />
            </div>
          ) : (
            <form
              className="flex items-center gap-2 border-t border-theme-border p-3"
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={ui.placeholder}
                disabled={sending}
                className="min-h-11 min-w-0 flex-1 rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-sm text-theme-text outline-none transition placeholder:text-theme-text-muted focus:border-theme-brand disabled:cursor-not-allowed disabled:opacity-60 lg:min-h-0"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-theme-brand text-theme-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 lg:h-10 lg:w-10"
                aria-label={ui.sendLabel}
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        onClick={toggleOpen}
        className="chat-launcher__btn"
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <span className="chat-launcher__icon" aria-hidden>
          {open ? <X size={20} /> : <MessageCircle size={20} />}
        </span>
        {open ? null : <span className="chat-launcher__label">Chat</span>}
      </button>
    </div>
  );
}
