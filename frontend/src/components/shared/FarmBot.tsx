"use client";

import { useState, useRef, useEffect } from "react";
import { aiApi } from "@/lib/services/api";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
}

const GREETING: Message = {
  id: 0,
  role: "bot",
  text: "Hi there! 🌾 I'm FarmBot, your FarmLease assistant. I can help you with finding land, understanding lease agreements, managing payments, and more. How can I help you today?",
};

const QUICK_PROMPTS = [
  "How do I list my land?",
  "How are payments processed?",
  "How do I sign a lease?",
];

const BOT_REPLIES: Record<string, string> = {
  "how do i list my land": "To list your land, go to **Owner → My Lands** and click **'Add New Land'**. You'll need to fill in the title, location, acreage, and upload clear photos. Once submitted, our team will review it within 24 hours.",
  "how are payments processed": "Lease payments are processed securely via M-Pesa or bank transfer. Funds are held in escrow and released to the landowner after the tenant confirms receipt of the land. You can track all transactions under **Financials → Payments**.",
  "how do i sign a lease": "Once a landowner approves your request, you'll receive a digital lease agreement via email. Open it in **Leases → My Leases**, review the terms, and click **Sign Agreement**. Both parties must sign for the lease to become active.",
  "default": "I don't have a ready answer for that right now, but our support team would be happy to help. You can reach us at **support@farmlease.co.ke** or browse the Help Center from your dashboard.",
};

function matchReply(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const key of Object.keys(BOT_REPLIES)) {
    if (key !== "default" && lower.includes(key)) return BOT_REPLIES[key];
  }
  return BOT_REPLIES["default"];
}

function BotBubble({ text }: { text: string }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <div className="flex items-end gap-2 max-w-[88%]">
      <div className="w-7 h-7 rounded-full bg-sidebar-bg flex items-center justify-center shrink-0 mb-0.5">
        <span className="material-symbols-outlined text-white" style={{ fontSize: 14 }}>
          spa
        </span>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm text-gray-800 leading-relaxed shadow-sm">
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="font-semibold text-sidebar-bg">
              {part}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end max-w-[88%] ml-auto">
      <div className="bg-sidebar-bg text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed">
        {text}
      </div>
    </div>
  );
}

export default function FarmBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await aiApi.chat({ message: trimmed });
      const reply = String(res.data?.reply || "").trim() || matchReply(trimmed);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: reply }]);
    } catch {
      const reply = matchReply(trimmed);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: reply }]);
    } finally {
      setTyping(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Pulse ring when closed */}
        {!open && (
          <div className="absolute inset-0 rounded-full bg-sidebar-bg/30 animate-ping pointer-events-none" />
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle FarmBot"
          className="relative w-14 h-14 rounded-full bg-sidebar-bg text-white shadow-2xl flex items-center justify-center hover:bg-[#1a5c3e] transition-all active:scale-95"
        >
          <span
            className="material-symbols-outlined transition-all duration-200"
            style={{ fontSize: 26 }}
          >
            {open ? "close" : "smart_toy"}
          </span>
        </button>
      </div>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-85 max-h-130 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 origin-bottom-right ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
          }`}
      >
        {/* Header */}
        <div className="bg-sidebar-bg px-4 py-3 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>
              spa
            </span>
          </div>
          <div>
            <p className="text-white font-bold text-sm" style={{ fontFamily: "Playfair Display, serif" }}>
              FarmBot
            </p>
            <p className="text-[10px] text-emerald-300 font-medium">Always online · FarmLease AI</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="ml-auto text-white/60 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              close
            </span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50 min-h-0">
          {messages.map((m) =>
            m.role === "bot" ? (
              <BotBubble key={m.id} text={m.text} />
            ) : (
              <UserBubble key={m.id} text={m.text} />
            )
          )}
          {typing && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-sidebar-bg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white" style={{ fontSize: 14 }}>
                  spa
                </span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 flex flex-wrap gap-2 bg-slate-50 border-t border-gray-100 shrink-0">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="text-xs px-3 py-1.5 rounded-full border border-sidebar-bg/30 text-sidebar-bg hover:bg-emerald-50 transition font-medium"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 py-3 border-t border-gray-100 bg-white shrink-0 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask me anything…"
            className="flex-1 text-sm px-4 py-2.5 rounded-xl bg-slate-100 border border-transparent focus:border-sidebar-bg/30 focus:outline-none text-gray-800 placeholder-gray-400 transition"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || typing}
            className="w-9 h-9 rounded-xl bg-sidebar-bg text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#1a5c3e] transition active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              send
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
