import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ScoreGauge } from "@/components/ScoreGauge";
import { ScoreBreakdown } from "@/components/ScoreBreakdown";
import { DataSignals } from "@/components/DataSignals";
import { LoanMatches } from "@/components/LoanMatches";
import { AdvisorChat } from "@/components/AdvisorChat";
import { OnboardingForm } from "@/components/OnboardingForm";
import {
  computeBreakdown,
  computeDataSources,
  computeNextTierGap,
  computeScore,
  getInitials,
  getTier,
  type UserProfile,
} from "@/lib/arthData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arth AI — Credit, redefined for India" },
      { name: "description", content: "AI-powered credit scoring & financial advisor for India's 300M+ credit-invisible. Get your Arth Score, matched loans, and friendly advice in Hindi or English." },
      { property: "og:title", content: "Arth AI — Credit, redefined for India" },
      { property: "og:description", content: "Your Arth Score from UPI, SIPs, bills & more. AI advisor that speaks like a friend." },
    ],
  }),
  component: ArthApp,
});

function ArthApp() {
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);

  const computed = useMemo(() => {
    if (!profile) return null;
    const score = computeScore(profile);
    return {
      score,
      tier: getTier(score),
      breakdown: computeBreakdown(profile),
      sources: computeDataSources(profile),
      gap: computeNextTierGap(score),
    };
  }, [profile]);

  // Onboarding screen
  if (!profile || editing) {
    return (
      <div className="min-h-screen">
        <Toaster theme="dark" richColors position="top-center" />
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
          </div>
        </header>
        <OnboardingForm
          initial={profile ?? undefined}
          onSubmit={(p) => { setProfile(p); setEditing(false); }}
          onCancel={editing ? () => setEditing(false) : undefined}
        />
      </div>
    );
  }

  const { score, tier, breakdown, sources, gap } = computed!;
  const initials = getInitials(profile.name);

  // Personalised next-tier tip
  const tipParts: string[] = [];
  if (profile.avgSavingsBalance < 10000) tipParts.push(`raise your average savings to ₹${Math.min(15000, profile.avgSavingsBalance + 5000).toLocaleString("en-IN")}`);
  if (profile.monthlySip < 1500) tipParts.push(`add a ₹${Math.min(500, 1500 - profile.monthlySip)} SIP`);
  if (!profile.billsOnTime) tipParts.push("pay your next 3 bills on time");
  if (profile.upiTxnsPerMonth < 200) tipParts.push("use UPI a bit more for daily spends");
  if (!profile.kycVerified) tipParts.push("complete Aadhaar + PAN KYC");
  const tip = tipParts.length
    ? `${tipParts.slice(0, 2).join(" and ")} — that alone could push you into the ${gap.nextTier ?? "next"} tier.`
    : `Keep up your current habits for 2–3 more months to lock in the ${gap.nextTier ?? "next"} tier.`;

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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full glass hover:border-[var(--primary)]/40 transition-colors"
            >
              Edit details
            </button>
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
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-8">
        {/* User card */}
        <section className="glass-strong rounded-2xl p-5 flex items-center gap-4 animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-[var(--gradient-primary)] flex items-center justify-center font-bold text-xl text-[var(--primary-foreground)]">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-lg leading-tight">{profile.name}</h2>
              {profile.kycVerified ? (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--success)]/15 text-[var(--success)] font-semibold">
                  ✓ KYC Verified
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--warning)]/15 text-[var(--warning)] font-semibold">
                  KYC Pending
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {profile.age} · {profile.city} · {profile.occupation}
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tier</p>
            <p className="font-mono text-sm font-semibold">{tier}</p>
          </div>
        </section>

        {/* Hero: Score + Breakdown */}
        <section className="grid lg:grid-cols-[auto,1fr] gap-6 items-start">
          <div className="glass-strong rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-glow)" }} />
            <div className="relative">
              <ScoreGauge score={score} size={260} />
              <p className="text-sm text-muted-foreground mt-4 max-w-xs">
                You're in the <span className="text-[var(--primary)] font-semibold">{tier}</span> tier.
                {tier === "Emerging" && " Build the basics — UPI, KYC, on-time bills."}
                {tier === "Developing" && " Strong foundations, room to grow on savings."}
                {tier === "Strong" && " Great habits — premium loans are within reach."}
                {tier === "Excellent" && " Top-tier — you've unlocked the best products."}
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/40 w-full">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Next tier</p>
                  <p className="font-mono font-bold text-sm">{gap.nextTier ? `${gap.gap} pts away` : "Top tier"}</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Percentile</p>
                  <p className="font-mono font-bold text-sm">Top {Math.max(5, Math.round(100 - (score / 850) * 100))}%</p>
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
            <ScoreBreakdown language={language} signals={breakdown} />
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
              {sources.length} connected
            </span>
          </div>
          <DataSignals sources={sources} />
        </section>

        {/* Chat + Loans */}
        <section className="grid lg:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <h3 className="font-bold text-lg">Talk to Arth</h3>
              <p className="text-xs text-muted-foreground">
                {language === "hi" ? "हिंदी या English में पूछिए — आपकी details पता हैं" : "Ask in Hindi or English — Arth knows your profile"}
              </p>
            </div>
            <AdvisorChat language={language} profile={profile} score={score} />
          </div>

          <div>
            <div className="mb-4">
              <h3 className="font-bold text-lg">Matched for You</h3>
              <p className="text-xs text-muted-foreground">3 loans pre-screened against your Arth Score</p>
            </div>
            <LoanMatches loans={(computed!.gap.nextTier ? [] : []).length ? [] : []} gap={gap.gap} nextTier={gap.nextTier} tip={tip} />
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
