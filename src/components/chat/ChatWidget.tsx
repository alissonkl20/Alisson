"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import {
  CHAT_GREETING,
  CHAT_SUGGESTIONS,
  createMessage,
  sendChatMessage,
  type ChatMessage,
} from "@/lib/chatbot";

const TYPING_DELAY_MS = 600;

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([createMessage("assistant", CHAT_GREETING)]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      setError(null);
      setInput("");

      const userMessage = createMessage("user", trimmed);
      const nextMessages = [...messages, userMessage];
      setMessages(nextMessages);
      setIsTyping(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, TYPING_DELAY_MS));
        const { reply } = await sendChatMessage(trimmed, nextMessages);
        setMessages((prev) => [...prev, createMessage("assistant", reply)]);
      } catch {
        setError("Não foi possível enviar a mensagem. Verifique a conexão.");
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, messages],
  );

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSend(input);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "fixed bottom-6 right-6 z-[9990] flex items-center gap-2 rounded-full px-5 py-3",
          "bg-[#1a1a1a] border border-neon-orange/40 text-white shadow-[0_0_24px_rgba(255,94,0,0.25)]",
          "transition-colors hover:border-neon-orange hover:shadow-[0_0_32px_rgba(255,94,0,0.4)]",
        )}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        aria-label={open ? "Fechar chat" : "Abrir chat"}
        aria-expanded={open}
      >
        {open ? <X size={20} className="text-neon-orange" /> : <MessageCircle size={20} className="text-neon-orange" />}
        <span className="text-sm font-medium text-neon-orange neon-text-orange">Fale conosco</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-[9989] flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-neon-orange/30 bg-[#0a0a0a] shadow-[0_0_40px_rgba(255,94,0,0.15)]"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Chat de atendimento"
          >
            <header className="flex items-center justify-between border-b border-neon-orange/20 bg-[#111] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-neon-orange neon-text-orange">Assistente Virtual</p>
                <p className="text-xs text-white/50">Alisson de Almeida</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-white/50 transition hover:text-neon-orange"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </header>

            <div
              ref={listRef}
              className="flex max-h-[320px] min-h-[280px] flex-col gap-3 overflow-y-auto p-4"
              data-lenis-prevent
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "ml-auto bg-neon-orange text-black rounded-br-md"
                      : "mr-auto border border-white/10 bg-[#1a1a1a] text-white/90 rounded-bl-md",
                  )}
                >
                  {msg.content}
                </div>
              ))}

              {isTyping && (
                <div className="mr-auto flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-[#1a1a1a] px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-neon-orange [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-neon-orange [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-neon-orange [animation-delay:300ms]" />
                </div>
              )}

              {error && (
                <p className="text-center text-xs text-red-400" role="alert">{error}</p>
              )}
            </div>

            {messages.length <= 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {CHAT_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSend(suggestion)}
                    className="rounded-full border border-neon-orange/30 px-3 py-1 text-xs text-neon-orange/90 transition hover:border-neon-orange hover:bg-neon-orange/10"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={onSubmit} className="border-t border-neon-orange/20 bg-[#111] p-3">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  disabled={isTyping}
                  className="border-white/10 bg-[#1a1a1a] focus:border-neon-orange/50 focus:shadow-[0_0_20px_rgba(255,94,0,0.12)]"
                  aria-label="Mensagem"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-neon-orange text-black transition hover:bg-neon-orange-bright disabled:opacity-40"
                  aria-label="Enviar mensagem"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
