import { useEffect, useState } from "react";
import { getTier, SCORE_MAX, type ScoreTier } from "@/lib/arthData";

interface Props {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 240 }: Props) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimated(Math.round(score * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const tier = getTier(score);
  const stroke = 14;
  const radius = size / 2 - stroke;
  const circumference = 2 * Math.PI * radius * 0.75; // 270deg arc
  const progress = (animated / SCORE_MAX) * circumference;

  const tierColor: Record<ScoreTier, string> = {
    Emerging: "var(--destructive)",
    Developing: "var(--warning)",
    Strong: "var(--primary)",
    Excellent: "var(--success)",
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-[135deg]">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.78 0.16 185)" />
            <stop offset="100%" stopColor="oklch(0.85 0.18 180)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.28 0.03 250)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference * 2}`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference * 2}`}
          style={{ transition: "stroke-dasharray 0.1s linear", filter: "drop-shadow(0 0 8px oklch(0.78 0.16 185 / 0.5))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Arth Score</span>
        <span className="text-6xl font-bold tabular-nums gradient-text leading-none">{animated}</span>
        <span className="text-xs text-muted-foreground mt-1">/ {SCORE_MAX}</span>
        <div
          className="mt-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
          style={{
            background: `color-mix(in oklab, ${tierColor[tier]} 18%, transparent)`,
            color: tierColor[tier],
            border: `1px solid color-mix(in oklab, ${tierColor[tier]} 40%, transparent)`,
          }}
        >
          {tier}
        </div>
      </div>
    </div>
  );
}
