import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

interface Props {
  language: "en" | "hi";
}

const STARTER_PROMPTS_EN = [
  "Why is my Arth Score 512?",
  "How do I get to the Strong tier?",
  "Which loan should I pick?",
  "Should I start another SIP?",
];

const STARTER_PROMPTS_HI = [
  "मेरा स्कोर 512 क्यों है?",
  "Strong tier तक कैसे पहुँचूँ?",
  "कौन सा loan लूँ?",
  "क्या और SIP शुरू करूँ?",
];

const WELCOME_EN = "Namaste Ravi 👋 Main Arth hoon — your financial friend. Pucho kuch bhi about your score, loans, ya savings.";
const WELCOME_HI = "नमस्ते रवि 👋 मैं अर्थ हूँ — आपका financial दोस्त। अपने score, loan या savings के बारे में कुछ भी पूछिए।";

export function AdvisorChat({ language }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Failed to reach Arth" }));
        toast.error(err.error || "Something went wrong");
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistantSoFar = "";
      let done = false;

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(j);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const starters = language === "hi" ? STARTER_PROMPTS_HI : STARTER_PROMPTS_EN;
  const welcome = language === "hi" ? WELCOME_HI : WELCOME_EN;

  return (
    <div className="flex flex-col h-[560px] glass-strong rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center font-bold text-[var(--primary-foreground)]">
            अ
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--success)] border-2 border-card" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm">Arth</p>
          <p className="text-[11px] text-muted-foreground">Your financial friend · Online</p>
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] font-semibold">
          AI
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.length === 0 && (
          <>
            <div className="glass rounded-2xl rounded-tl-sm p-3 max-w-[85%]">
              <p className="text-sm leading-relaxed">{welcome}</p>
            </div>
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2 px-1">
                {language === "hi" ? "ये पूछ कर देखो" : "Try asking"}
              </p>
              <div className="flex flex-wrap gap-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-2 rounded-full glass hover:border-[var(--primary)]/40 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
          >
            <div
              className={`max-w-[85%] p-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "rounded-2xl rounded-tr-sm bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
                  : "rounded-2xl rounded-tl-sm glass"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl rounded-tl-sm p-3 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="p-3 border-t border-border/40 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={language === "hi" ? "अर्थ से पूछिए..." : "Ask Arth anything..."}
          className="flex-1 bg-secondary/60 rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-[var(--gradient-primary)] text-[var(--primary-foreground)] font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          Send
        </button>
      </form>
    </div>
  );
}
