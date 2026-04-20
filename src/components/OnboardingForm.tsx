import { useState } from "react";
import { DEFAULT_PROFILE, type Occupation, type UserProfile, computeScore } from "@/lib/arthData";

interface Props {
  initial?: UserProfile;
  onSubmit: (profile: UserProfile) => void;
  onCancel?: () => void;
}

const OCCUPATIONS: Occupation[] = [
  "Gig worker (Swiggy / Zomato / Uber)",
  "Salaried (Private)",
  "Salaried (Govt)",
  "Small business / Shop owner",
  "Freelancer",
  "Homemaker",
  "Student",
  "Other",
];

export function OnboardingForm({ initial, onSubmit, onCancel }: Props) {
  const [p, setP] = useState<UserProfile>(initial ?? DEFAULT_PROFILE);
  const livePreview = computeScore(p);

  const update = <K extends keyof UserProfile>(k: K, v: UserProfile[K]) =>
    setP((prev) => ({ ...prev, [k]: v }));

  const canSubmit = p.name.trim().length >= 2 && p.city.trim().length >= 2 && p.age >= 18 && p.age <= 80;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="text-center mb-6 animate-fade-in-up">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-[var(--gradient-primary)] items-center justify-center font-bold text-2xl text-[var(--primary-foreground)] shadow-[var(--shadow-glow)] mb-3">
          अ
        </div>
        <h2 className="text-2xl font-bold">Let's build your Arth Score</h2>
        <p className="text-sm text-muted-foreground mt-1">
          8 quick questions. No bank login needed — this is a demo.
        </p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); if (canSubmit) onSubmit(p); }}
        className="glass-strong rounded-2xl p-5 space-y-5 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        {/* Identity */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Your name">
            <input
              value={p.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Ravi Kumar"
              maxLength={60}
              className={inputCls}
              required
            />
          </Field>
          <Field label="City">
            <input
              value={p.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="e.g. Delhi"
              maxLength={40}
              className={inputCls}
              required
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={`Age — ${p.age}`}>
            <input
              type="range"
              min={18}
              max={70}
              value={p.age}
              onChange={(e) => update("age", Number(e.target.value))}
              className={rangeCls}
            />
          </Field>
          <Field label="Occupation">
            <select
              value={p.occupation}
              onChange={(e) => update("occupation", e.target.value as Occupation)}
              className={inputCls}
            >
              {OCCUPATIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="h-px bg-border/40" />

        {/* Financial behavior */}
        <Field
          label={`UPI transactions per month — ${p.upiTxnsPerMonth}`}
          hint="Count of PhonePe / GPay / Paytm payments. Most gig workers do 200–400."
        >
          <input
            type="range" min={0} max={600} step={10}
            value={p.upiTxnsPerMonth}
            onChange={(e) => update("upiTxnsPerMonth", Number(e.target.value))}
            className={rangeCls}
          />
        </Field>

        <Field
          label={`Average savings balance — ₹${p.avgSavingsBalance.toLocaleString("en-IN")}`}
          hint="What's typically sitting in your bank account."
        >
          <input
            type="range" min={0} max={50000} step={500}
            value={p.avgSavingsBalance}
            onChange={(e) => update("avgSavingsBalance", Number(e.target.value))}
            className={rangeCls}
          />
        </Field>

        <Field
          label={`Monthly SIP / investment — ₹${p.monthlySip.toLocaleString("en-IN")}`}
          hint="Mutual fund SIP, recurring deposit, or stocks."
        >
          <input
            type="range" min={0} max={5000} step={100}
            value={p.monthlySip}
            onChange={(e) => update("monthlySip", Number(e.target.value))}
            className={rangeCls}
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle
            label="Bills paid on time"
            sub="Mobile, electricity, rent"
            checked={p.billsOnTime}
            onChange={(v) => update("billsOnTime", v)}
          />
          <Toggle
            label="Aadhaar + PAN verified"
            sub="KYC complete"
            checked={p.kycVerified}
            onChange={(v) => update("kycVerified", v)}
          />
        </div>

        {/* Live preview */}
        <div className="rounded-xl p-4 flex items-center justify-between border border-[var(--primary)]/30"
          style={{ background: "linear-gradient(135deg, oklch(0.22 0.06 200 / 0.5), oklch(0.20 0.04 240 / 0.5))" }}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--primary)] font-semibold">Live preview</p>
            <p className="text-xs text-muted-foreground">Your score updates as you change inputs</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold gradient-text tabular-nums leading-none">{livePreview}</p>
            <p className="text-[10px] text-muted-foreground mt-1">/ 850</p>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl glass font-semibold text-sm hover:border-border transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--gradient-primary)] text-[var(--primary-foreground)] font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity shadow-[var(--shadow-glow)]"
          >
            Generate my Arth Score →
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full bg-secondary/60 rounded-xl px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 border border-border/40";

const rangeCls =
  "w-full accent-[var(--primary)] cursor-pointer";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold mb-1.5 text-foreground/90">{label}</div>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </label>
  );
}

function Toggle({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all text-left ${
        checked
          ? "border-[var(--primary)]/50 bg-[var(--primary)]/10"
          : "border-border/40 glass hover:border-border"
      }`}
    >
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
      <span className={`relative w-10 h-6 rounded-full transition-colors ${checked ? "bg-[var(--primary)]" : "bg-secondary"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}
