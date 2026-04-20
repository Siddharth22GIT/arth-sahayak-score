import { SCORE_SIGNALS } from "@/lib/arthData";

interface Props {
  language: "en" | "hi";
}

export function ScoreBreakdown({ language }: Props) {
  return (
    <div className="space-y-3">
      {SCORE_SIGNALS.map((signal, i) => {
        const pct = (signal.points / signal.max) * 100;
        const strong = pct >= 70;
        return (
          <div
            key={signal.label}
            className="glass rounded-xl p-4 animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{
                    background: strong
                      ? "color-mix(in oklab, var(--primary) 20%, transparent)"
                      : "color-mix(in oklab, var(--warning) 18%, transparent)",
                    color: strong ? "var(--primary)" : "var(--warning)",
                  }}
                >
                  {signal.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {language === "hi" ? signal.labelHi : signal.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{signal.description}</p>
                </div>
              </div>
              <span className="font-mono text-sm font-semibold tabular-nums" style={{ color: strong ? "var(--primary)" : "var(--warning)" }}>
                +{signal.points}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${pct}%`,
                  background: strong ? "var(--gradient-primary)" : "linear-gradient(90deg, var(--warning), oklch(0.85 0.13 60))",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
