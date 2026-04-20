import type { LoanMatch, ScoreTier } from "@/lib/arthData";

interface Props {
  loans: LoanMatch[];
  gap: number;
  nextTier: ScoreTier | null;
  tip: string;
}

export function LoanMatches({ loans, gap, nextTier, tip }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {loans.map((loan, i) => (
          <div
            key={loan.lender}
            className="glass rounded-xl p-4 animate-fade-in-up hover:border-[var(--primary)]/40 transition-colors"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold">{loan.lender}</h4>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] font-semibold">
                    {loan.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{loan.product}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-sm">{loan.rate}</p>
                <p className="text-[11px] text-muted-foreground">{loan.amount}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{loan.eligibility}</p>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-glow)] transition-colors">
                Apply →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Motivational nudge */}
      {nextTier && (
        <div className="relative rounded-xl p-5 overflow-hidden border border-[var(--primary)]/30"
          style={{ background: "linear-gradient(135deg, oklch(0.22 0.06 200 / 0.6), oklch(0.20 0.04 240 / 0.6))" }}>
          <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--primary)] font-semibold mb-2">
              ↑ Next Tier: {nextTier}
            </p>
            <h4 className="font-bold text-lg mb-2">You're {gap} points away</h4>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{tip}</p>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-[var(--gradient-primary)] animate-pulse-glow" style={{ width: `${Math.max(10, 100 - (gap / 200) * 100)}%` }} />
            </div>
          </div>
        </div>
      )}

      {!nextTier && (
        <div className="rounded-xl p-5 border border-[var(--success)]/40 bg-[var(--success)]/10 text-center">
          <p className="text-2xl mb-1">🏆</p>
          <h4 className="font-bold text-lg text-[var(--success)]">You're at the top tier!</h4>
          <p className="text-xs text-muted-foreground mt-1">Excellent score — premium credit unlocked.</p>
        </div>
      )}
    </div>
  );
}
