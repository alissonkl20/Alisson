"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import {
  chatbotConfig,
  createAssistantReply,
  createMessage,
  createWelcomeMessage,
  type ChatMessage,
} from "@/Api";

function loadStoredMessages(): ChatMessage[] | null {
  if (!chatbotConfig.persistHistory) return null;

  try {
    const raw = localStorage.getItem(chatbotConfig.historyStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function storeMessages(messages: ChatMessage[]) {
  if (!chatbotConfig.persistHistory) return;

  try {
    localStorage.setItem(
      chatbotConfig.historyStorageKey,
      JSON.stringify(messages),
    );
  } catch {
    // ignore quota / private mode
  }
}

export function ChatWidget() {
  const { ui, enabled } = chatbotConfig;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [initialized, setInitialized] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || initialized) return;

    const stored = loadStoredMessages();
    setMessages(stored?.length ? stored : [createWelcomeMessage()]);
    setInitialized(true);
  }, [open, initialized]);

  useEffect(() => {
    storeMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
    inputRef.current?.focus();
  }, [open, messages]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!enabled) return null;

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = createMessage("user", trimmed);
    const assistantMessage = createAssistantReply(trimmed);

    setMessages((current) => {
      const next = [...current, userMessage, assistantMessage];
      return next.slice(-chatbotConfig.ui.maxMessages);
    });
    setInput("");
  };

  const positionClass =
    ui.position === "bottom-right"
      ? "right-4 sm:right-6"
      : "left-4 sm:left-6";

  return (
    <div className={`fixed bottom-4 z-[60] sm:bottom-6 ${positionClass}`}>
      {open && (
        <div
          className="mb-3 flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border border-theme-border bg-theme-nav-bg shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:w-96"
          role="dialog"
          aria-label={ui.title}
        >
          <header className="flex items-start justify-between gap-3 border-b border-theme-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-theme-title">{ui.title}</h2>
              <p className="mt-0.5 text-xs text-theme-text-muted">{ui.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-theme-border bg-theme-surface text-theme-text transition hover:bg-theme-surface-hover"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex max-h-80 flex-col gap-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-theme-brand text-black"
                      : "border border-theme-border bg-theme-surface text-theme-text"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-theme-border p-3"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={ui.placeholder}
              className="min-w-0 flex-1 rounded-xl border border-theme-border bg-theme-surface px-3 py-2 text-sm text-theme-text outline-none transition placeholder:text-theme-text-muted focus:border-theme-brand"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-theme-brand text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={ui.sendLabel}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-theme-border bg-theme-brand text-black shadow-[0_8px_24px_var(--theme-brand-glow)] transition hover:scale-105 hover:opacity-95"
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
