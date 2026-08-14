"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  CHAT_LIMIT_REPLY,
  MAX_CHAT_QUESTIONS,
} from "@/lib/chatbot-limits";
import {
  getClientUsageSummary,
  incrementClientUsage,
  syncClientUsage,
} from "@/lib/chatbot-usage-client";
import {
  CHAT_GREETING,
  CHAT_SUGGESTIONS,
  createMessage,
  sendChatMessage,
  type ChatMessage,
} from "@/lib/chatbot";

const TYPING_DELAY_MS = 500;

function scrollToContact() {
  const el = document.getElementById("contact");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(MAX_CHAT_QUESTIONS);
  const [limitReached, setLimitReached] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refreshUsage = useCallback(() => {
    const summary = getClientUsageSummary();
    setRemaining(summary.remaining);
    setLimitReached(summary.limitReached);
  }, []);

  useEffect(() => {
    refreshUsage();
  }, [refreshUsage]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([createMessage("assistant", CHAT_GREETING)]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    if (open && !limitReached) {
      inputRef.current?.focus();
    }
  }, [open, limitReached]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping || limitReached) return;

      setError(null);
      setInput("");

      const userMessage = createMessage("user", trimmed);
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setIsTyping(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, TYPING_DELAY_MS));
        const result = await sendChatMessage(trimmed, nextMessages);

        if (result.usage) {
          syncClientUsage({
            count: result.usage.count,
            windowStart: result.usage.windowStart,
          });
          setRemaining(result.usage.remaining);
          setLimitReached(result.usage.limitReached);
        } else {
          const local = incrementClientUsage();
          setRemaining(Math.max(0, MAX_CHAT_QUESTIONS - local.count));
          setLimitReached(local.count >= MAX_CHAT_QUESTIONS);
        }

        setMessages((prev) => [...prev, createMessage("assistant", result.reply)]);
      } catch {
        setError("Não foi possível enviar a mensagem. Verifique a conexão.");
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, limitReached, messages],
  );

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSend(input);
  };

  const showSuggestions = messages.length <= 1 && !isTyping && !limitReached;

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "fixed z-[9990] flex items-center gap-2 rounded-full border border-neon-red/40",
          "bg-[#1a1a1a] text-white shadow-[0_0_24px_rgba(220,38,38,0.25)]",
          "transition-colors hover:border-neon-red hover:shadow-[0_0_32px_rgba(220,38,38,0.4)]",
          "bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]",
          "px-3 py-2.5 sm:px-5 sm:py-3",
        )}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        aria-label={open ? "Fechar chat" : "Abrir chat"}
        aria-expanded={open}
      >
        {open ? (
          <X size={20} className="text-neon-red shrink-0" />
        ) : (
          <MessageCircle size={20} className="text-neon-red shrink-0" />
        )}
        <span className="hidden text-sm font-medium text-neon-red neon-text-orange sm:inline">
          Fale conosco
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-[9988] bg-black/60 backdrop-blur-sm sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-label="Fechar chat"
            />

            <motion.div
              className={cn(
                "fixed z-[9989] flex flex-col overflow-hidden border border-neon-red/30 bg-[#0a0a0a]",
                "shadow-[0_0_40px_rgba(220,38,38,0.15)]",
                "inset-x-0 bottom-0 max-h-[min(92dvh,100%)] rounded-t-2xl",
                "pb-[env(safe-area-inset-bottom)]",
                "sm:inset-x-auto sm:bottom-[calc(5.5rem+env(safe-area-inset-bottom))]",
                "sm:right-[max(1rem,env(safe-area-inset-right))]",
                "sm:w-[min(100vw-2rem,380px)] sm:max-h-none sm:rounded-2xl sm:pb-0",
              )}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              role="dialog"
              aria-label="Chat de atendimento"
              aria-modal="true"
            >
              <header className="flex shrink-0 items-center justify-between border-b border-neon-red/20 bg-[#111] px-4 py-3 safe-top">
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-semibold text-neon-red neon-text-orange truncate">
                    Assistente Virtual
                  </p>
                  <p className="text-xs text-white/50 truncate">
                    {limitReached
                      ? "Limite atingido — use Contact"
                      : `${remaining} de ${MAX_CHAT_QUESTIONS} perguntas restantes`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="shrink-0 rounded-lg p-2 text-white/50 transition hover:text-neon-red touch-manipulation"
                  aria-label="Fechar"
                >
                  <X size={18} />
                </button>
              </header>

              <div
                ref={listRef}
                className={cn(
                  "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-4",
                  "min-h-[min(38dvh,320px)] max-h-[min(52dvh,420px)]",
                  "sm:min-h-[280px] sm:max-h-[320px]",
                )}
                data-lenis-prevent
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed break-words",
                      msg.role === "user"
                        ? "ml-auto bg-neon-red text-black rounded-br-md"
                        : "mr-auto border border-white/10 bg-[#1a1a1a] text-white/90 rounded-bl-md",
                    )}
                  >
                    {msg.content}
                  </div>
                ))}

                {isTyping && (
                  <div className="mr-auto flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-[#1a1a1a] px-4 py-3">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-neon-red [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-neon-red [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-neon-red [animation-delay:300ms]" />
                  </div>
                )}

                {error && (
                  <p className="text-center text-xs text-red-400" role="alert">{error}</p>
                )}
              </div>

              {showSuggestions && (
                <div className="flex shrink-0 flex-wrap gap-2 px-4 pb-2">
                  {CHAT_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSend(suggestion)}
                      className="rounded-full border border-neon-red/30 px-3 py-1.5 text-xs text-neon-red/90 transition hover:border-neon-red hover:bg-neon-red/10 touch-manipulation"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {limitReached ? (
                <div className="shrink-0 space-y-3 border-t border-neon-red/20 bg-[#111] p-4 safe-bottom">
                  <p className="text-xs leading-relaxed text-white/60">{CHAT_LIMIT_REPLY}</p>
                  <button
                    type="button"
                    onClick={scrollToContact}
                    className="w-full rounded-xl bg-neon-red py-3 text-sm font-medium text-black transition hover:bg-neon-red-bright touch-manipulation"
                  >
                    Ir para Contact
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="shrink-0 border-t border-neon-red/20 bg-[#111] p-3 safe-bottom"
                >
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      disabled={isTyping}
                      className="min-w-0 border-white/10 bg-[#1a1a1a] text-base sm:text-sm focus:border-neon-red/50 focus:shadow-[0_0_20px_rgba(220,38,38,0.12)]"
                      aria-label="Mensagem"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-neon-red text-black transition hover:bg-neon-red-bright disabled:opacity-40 touch-manipulation"
                      aria-label="Enviar mensagem"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
