import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ScoreGauge } from "@/components/ScoreGauge";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { DataSignals } from "@/components/DataSignals";
import { LoanMatches } from "@/components/LoanMatches";
import { AdvisorChat } from "@/components/AdvisorChat";
import { ARTH_SCORE, USER, getTier } from "@/lib/arthData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arth AI — Credit, redefined for India" },
      { name: "description", content: "AI-powered credit scoring & financial advisor for India's 300M+ credit-invisible. Get your Arth Score, matched loans, and friendly advice in Hindi or English." },
      { property: "og:title", content: "Arth AI — Credit, redefined for India" },
      { property: "og:description", content: "Your Arth Score from UPI, SIPs, bills & more. AI advisor that speaks like a friend." },
    ],
  }),
  component: ArthDashboard,
});

function ArthDashboard() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const tier = getTier(ARTH_SCORE);

  return (
    <div className="min-h-screen pb-12">
      <Toaster theme="dark" richColors position="top-center" />

      {/* Top Nav */}
      <header className="sticky top-0 z-30 glass-strong border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center font-bold text-[var(--primary-foreground)] text-lg shadow-[var(--shadow-glow)]">
              अ
            </div>
            <div>
              <h1 className="font-bold text-base leading-none">Arth AI</h1>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">Credit, redefined</p>
            </div>
          </div>

          {/* Lang toggle */}
          <div className="flex items-center gap-1 p-1 rounded-full glass">
            <button
              onClick={() => setLanguage("en")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                language === "en" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                language === "hi" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              हिं
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-8">
        {/* User card */}
        <section className="glass-strong rounded-2xl p-5 flex items-center gap-4 animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center font-bold text-xl text-[var(--primary-foreground)]">
            {USER.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-lg leading-tight">{USER.name}</h2>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--success)]/15 text-[var(--success)] font-semibold">
                ✓ KYC Verified
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {USER.age} · {USER.city} · {USER.occupation}
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Member since</p>
            <p className="font-mono text-sm font-semibold">Mar 2024</p>
          </div>
        </section>

        {/* Hero: Score + Breakdown */}
        <section className="grid lg:grid-cols-[auto,1fr] gap-6 items-start">
          <div className="glass-strong rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-glow)" }} />
            <div className="relative">
              <ScoreGauge score={ARTH_SCORE} size={260} />
              <p className="text-sm text-muted-foreground mt-4 max-w-xs">
                You're in the <span className="text-[var(--primary)] font-semibold">{tier}</span> tier.
                Strong UPI behaviour, room to grow on savings.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/40 w-full">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">vs Last Month</p>
                  <p className="font-mono font-bold text-[var(--success)] text-sm">+24 ↑</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Percentile</p>
                  <p className="font-mono font-bold text-sm">Top 38%</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">Score Breakdown</h3>
                <p className="text-xs text-muted-foreground">How each signal contributes</p>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                6 signals
              </span>
            </div>
            <ScoreBreakdown language={language} />
          </div>
        </section>

        {/* Data Signals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Connected Data Sources</h3>
              <p className="text-xs text-muted-foreground">Real-time signals from your fintech footprint</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full glass font-semibold">
              8 connected
            </span>
          </div>
          <DataSignals />
        </section>

        {/* Chat + Loans */}
        <section className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h3 className="font-bold text-lg">Talk to Arth</h3>
              <p className="text-xs text-muted-foreground">
                {language === "hi" ? "हिंदी या English में पूछिए" : "Ask in Hindi or English — your call"}
              </p>
            </div>
            <AdvisorChat language={language} />
          </div>

          <div>
            <div className="mb-4">
              <h3 className="font-bold text-lg">Matched for You</h3>
              <p className="text-xs text-muted-foreground">3 loans pre-screened against your Arth Score</p>
            </div>
            <LoanMatches />
          </div>
        </section>

        <footer className="pt-8 text-center text-xs text-muted-foreground">
          <p>
            Arth AI · Built for the Blostem Fintech Hackathon · Demo prototype with simulated data
          </p>
        </footer>
      </main>
    </div>
  );
}
