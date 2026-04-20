export type ScoreTier = "Emerging" | "Developing" | "Strong" | "Excellent";

export interface ScoreSignal {
  label: string;
  labelHi: string;
  points: number;
  max: number;
  icon: string;
  description: string;
}

export interface DataSource {
  name: string;
  category: string;
  contribution: number;
  color: string;
  initials: string;
}

export interface LoanMatch {
  lender: string;
  product: string;
  rate: string;
  amount: string;
  eligibility: string;
  tag: "Best match" | "Quick approval" | "Low EMI";
}

export type Occupation =
  | "Gig worker (Swiggy / Zomato / Uber)"
  | "Salaried (Private)"
  | "Salaried (Govt)"
  | "Small business / Shop owner"
  | "Freelancer"
  | "Homemaker"
  | "Student"
  | "Other";

export interface UserProfile {
  name: string;
  age: number;
  city: string;
  occupation: Occupation;
  upiTxnsPerMonth: number;     // 0 - 600
  avgSavingsBalance: number;   // ₹
  monthlySip: number;          // ₹
  billsOnTime: boolean;
  kycVerified: boolean;
}

export const SCORE_MAX = 850;

export const DEFAULT_PROFILE: UserProfile = {
  name: "",
  age: 25,
  city: "",
  occupation: "Gig worker (Swiggy / Zomato / Uber)",
  upiTxnsPerMonth: 120,
  avgSavingsBalance: 3000,
  monthlySip: 0,
  billsOnTime: true,
  kycVerified: true,
};

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getTier(score: number): ScoreTier {
  if (score >= 750) return "Excellent";
  if (score >= 650) return "Strong";
  if (score >= 450) return "Developing";
  return "Emerging";
}

export function getTierColor(tier: ScoreTier): string {
  switch (tier) {
    case "Excellent": return "var(--success)";
    case "Strong": return "var(--primary)";
    case "Developing": return "var(--warning)";
    case "Emerging": return "var(--destructive)";
  }
}

// ---------- Score computation ----------

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function computeBreakdown(p: UserProfile): ScoreSignal[] {
  // UPI Activity — full marks at 320+ txns/mo
  const upi = Math.round(clamp(p.upiTxnsPerMonth / 320, 0, 1) * 200);

  // Bill payments — binary-ish but soften
  const bills = p.billsOnTime ? 110 : 35;

  // SIP / Investments — full at ₹2000+/mo
  const sip = Math.round(clamp(p.monthlySip / 2000, 0, 1) * 150);

  // KYC — binary
  const kyc = p.kycVerified ? 100 : 20;

  // Savings consistency — full at ₹15,000 avg balance
  const savings = Math.round(clamp(p.avgSavingsBalance / 15000, 0, 1) * 150);

  // Credit history proxy — older + salaried gets a small bump; gig/student start lower
  const ageBoost = clamp((p.age - 18) / 25, 0, 1) * 60; // up to +60 by age ~43
  const occBoost =
    p.occupation === "Salaried (Govt)" ? 70 :
    p.occupation === "Salaried (Private)" ? 55 :
    p.occupation === "Small business / Shop owner" ? 45 :
    p.occupation === "Freelancer" ? 35 :
    p.occupation === "Gig worker (Swiggy / Zomato / Uber)" ? 30 :
    p.occupation === "Homemaker" ? 25 :
    p.occupation === "Student" ? 20 : 30;
  const credit = Math.round(clamp(ageBoost + occBoost, 0, 130));

  return [
    { label: "UPI Activity", labelHi: "UPI लेनदेन", points: upi, max: 200, icon: "↗", description: `${p.upiTxnsPerMonth} transactions/month` },
    { label: "Bill Payments", labelHi: "बिल भुगतान", points: bills, max: 120, icon: "✓", description: p.billsOnTime ? "Mobile, electricity on time" : "Frequent late payments" },
    { label: "SIP / Investments", labelHi: "निवेश", points: sip, max: 150, icon: "₹", description: p.monthlySip > 0 ? `₹${p.monthlySip}/mo SIP` : "No active SIP" },
    { label: "KYC Trust", labelHi: "KYC भरोसा", points: kyc, max: 100, icon: "◆", description: p.kycVerified ? "Aadhaar + PAN verified" : "KYC pending" },
    { label: "Savings Consistency", labelHi: "बचत", points: savings, max: 150, icon: "▲", description: `Avg balance ₹${p.avgSavingsBalance.toLocaleString("en-IN")}` },
    { label: "Credit History", labelHi: "क्रेडिट इतिहास", points: credit, max: 130, icon: "●", description: "Inferred from age & occupation" },
  ];
}

export function computeScore(p: UserProfile): number {
  // Base of 100 + sum of signals, capped at SCORE_MAX
  const base = 100;
  const sum = computeBreakdown(p).reduce((acc, s) => acc + s.points, 0);
  return clamp(base + sum, 300, SCORE_MAX);
}

export function computeNextTierGap(score: number): { gap: number; nextTier: ScoreTier | null } {
  if (score < 450) return { gap: 450 - score, nextTier: "Developing" };
  if (score < 650) return { gap: 650 - score, nextTier: "Strong" };
  if (score < 750) return { gap: 750 - score, nextTier: "Excellent" };
  return { gap: 0, nextTier: null };
}

// ---------- Data sources (display-only, contribution scales with profile a bit) ----------

export function computeDataSources(p: UserProfile): DataSource[] {
  const upiWeight = clamp(p.upiTxnsPerMonth / 320, 0.2, 1);
  const sipWeight = clamp(p.monthlySip / 2000, 0.1, 1);
  const billsWeight = p.billsOnTime ? 1 : 0.4;
  const kycWeight = p.kycVerified ? 1 : 0.3;

  return [
    { name: "PhonePe", category: "UPI", contribution: Math.round(18 * upiWeight), color: "oklch(0.55 0.20 290)", initials: "Pe" },
    { name: "Paytm", category: "UPI & Wallet", contribution: Math.round(16 * upiWeight), color: "oklch(0.62 0.18 240)", initials: "Pa" },
    { name: "Google Pay", category: "UPI", contribution: Math.round(14 * upiWeight), color: "oklch(0.72 0.16 145)", initials: "GP" },
    { name: "Groww", category: "Investments", contribution: Math.round(12 * sipWeight), color: "oklch(0.72 0.18 145)", initials: "Gr" },
    { name: "Zerodha", category: "Trading", contribution: Math.round(6 * sipWeight), color: "oklch(0.70 0.18 30)", initials: "Ze" },
    { name: "Bajaj Finserv", category: "BNPL", contribution: 9, color: "oklch(0.65 0.20 25)", initials: "Bj" },
    { name: "Jio Recharge", category: "Bills", contribution: Math.round(11 * billsWeight), color: "oklch(0.65 0.20 280)", initials: "Ji" },
    { name: "CIBIL", category: "Credit Bureau", contribution: Math.round(14 * kycWeight), color: "oklch(0.78 0.16 185)", initials: "Ci" },
  ];
}

// ---------- Loan matching ----------

export function matchLoans(score: number): LoanMatch[] {
  const tier = getTier(score);

  if (tier === "Excellent") {
    return [
      { lender: "HDFC Bank", product: "Personal Loan", rate: "10.5% p.a.", amount: "Up to ₹5,00,000", eligibility: "Pre-approved · Instant", tag: "Best match" },
      { lender: "ICICI Bank", product: "Credit Card (Premium)", rate: "Joining ₹0", amount: "Limit ₹2,00,000", eligibility: "Lifetime free", tag: "Quick approval" },
      { lender: "Bajaj Finserv", product: "Two-wheeler Loan", rate: "9.9% p.a.", amount: "Up to ₹1,50,000", eligibility: "EMI from ₹1,800/mo", tag: "Low EMI" },
    ];
  }
  if (tier === "Strong") {
    return [
      { lender: "Axis Bank", product: "Personal Loan", rate: "13.5% p.a.", amount: "Up to ₹2,00,000", eligibility: "Pre-approved on Arth Score", tag: "Best match" },
      { lender: "Bajaj Finserv", product: "Two-wheeler Loan", rate: "11.9% p.a.", amount: "Up to ₹1,20,000", eligibility: "EMI from ₹2,100/mo", tag: "Low EMI" },
      { lender: "MoneyTap", product: "Line of Credit", rate: "16% p.a.", amount: "Up to ₹75,000", eligibility: "Disbursal in 2 hrs", tag: "Quick approval" },
    ];
  }
  if (tier === "Developing") {
    return [
      { lender: "KreditBee", product: "Personal Loan", rate: "18.5% p.a.", amount: "Up to ₹40,000", eligibility: "Pre-approved on Arth Score", tag: "Best match" },
      { lender: "MoneyTap", product: "Line of Credit", rate: "21% p.a.", amount: "Up to ₹25,000", eligibility: "Instant disbursal in 4 hrs", tag: "Quick approval" },
      { lender: "Bajaj Finserv", product: "Two-wheeler Loan", rate: "14.9% p.a.", amount: "Up to ₹80,000", eligibility: "EMI from ₹2,100/month", tag: "Low EMI" },
    ];
  }
  // Emerging
  return [
    { lender: "PaySense", product: "Starter Loan", rate: "24% p.a.", amount: "Up to ₹15,000", eligibility: "Score-based · No collateral", tag: "Best match" },
    { lender: "Slice", product: "Pay-later Card", rate: "0% if paid in 30 days", amount: "Limit ₹5,000", eligibility: "Build credit history", tag: "Quick approval" },
    { lender: "Dhani", product: "Micro Loan", rate: "26% p.a.", amount: "Up to ₹10,000", eligibility: "EMI from ₹950/mo", tag: "Low EMI" },
  ];
}
