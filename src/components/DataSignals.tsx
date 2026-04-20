import { DATA_SOURCES } from "@/lib/arthData";

export function DataSignals() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {DATA_SOURCES.map((src, i) => (
        <div
          key={src.name}
          className="glass rounded-xl p-4 relative overflow-hidden animate-fade-in-up hover:scale-[1.02] transition-transform"
          style={{ animationDelay: `${i * 50}ms` }}
        >
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-[var(--success)] font-semibold">Live</span>
          </div>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm mb-3 text-white"
            style={{ background: src.color }}
          >
            {src.initials}
          </div>
          <p className="font-semibold text-sm leading-tight">{src.name}</p>
          <p className="text-[11px] text-muted-foreground mb-2">{src.category}</p>
          <p className="font-mono text-xs font-semibold text-[var(--primary)]">+{src.contribution} pts</p>
        </div>
      ))}
    </div>
  );
}
