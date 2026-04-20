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

export const USER = {
  name: "Ravi Kumar",
  age: 26,
  city: "Delhi",
  occupation: "Swiggy delivery partner",
  initials: "RK",
};

export const ARTH_SCORE = 512;
export const SCORE_MAX = 850;

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

export const SCORE_SIGNALS: ScoreSignal[] = [
  { label: "UPI Activity", labelHi: "UPI लेनदेन", points: 142, max: 200, icon: "↗", description: "320 transactions/month, consistent" },
  { label: "Bill Payments", labelHi: "बिल भुगतान", points: 88, max: 120, icon: "✓", description: "Mobile, electricity on time" },
  { label: "SIP / Investments", labelHi: "निवेश", points: 64, max: 150, icon: "₹", description: "₹500/mo SIP for 8 months" },
  { label: "KYC Trust", labelHi: "KYC भरोसा", points: 95, max: 100, icon: "◆", description: "Aadhaar + PAN verified" },
  { label: "Savings Consistency", labelHi: "बचत", points: 48, max: 150, icon: "▲", description: "Low avg balance — needs work" },
  { label: "Credit History", labelHi: "क्रेडिट इतिहास", points: 75, max: 130, icon: "●", description: "No formal EMI yet" },
];

export const DATA_SOURCES: DataSource[] = [
  { name: "PhonePe", category: "UPI", contribution: 18, color: "oklch(0.55 0.20 290)", initials: "Pe" },
  { name: "Paytm", category: "UPI & Wallet", contribution: 16, color: "oklch(0.62 0.18 240)", initials: "Pa" },
  { name: "Google Pay", category: "UPI", contribution: 14, color: "oklch(0.72 0.16 145)", initials: "GP" },
  { name: "Groww", category: "Investments", contribution: 12, color: "oklch(0.72 0.18 145)", initials: "Gr" },
  { name: "Zerodha", category: "Trading", contribution: 6, color: "oklch(0.70 0.18 30)", initials: "Ze" },
  { name: "Bajaj Finserv", category: "BNPL", contribution: 9, color: "oklch(0.65 0.20 25)", initials: "Bj" },
  { name: "Jio Recharge", category: "Bills", contribution: 11, color: "oklch(0.65 0.20 280)", initials: "Ji" },
  { name: "CIBIL", category: "Credit Bureau", contribution: 14, color: "oklch(0.78 0.16 185)", initials: "Ci" },
];

export const LOAN_MATCHES: LoanMatch[] = [
  {
    lender: "KreditBee",
    product: "Personal Loan",
    rate: "18.5% p.a.",
    amount: "Up to ₹40,000",
    eligibility: "Pre-approved on Arth Score",
    tag: "Best match",
  },
  {
    lender: "MoneyTap",
    product: "Line of Credit",
    rate: "21% p.a.",
    amount: "Up to ₹25,000",
    eligibility: "Instant disbursal in 4 hrs",
    tag: "Quick approval",
  },
  {
    lender: "Bajaj Finserv",
    product: "Two-wheeler Loan",
    rate: "14.9% p.a.",
    amount: "Up to ₹80,000",
    eligibility: "EMI from ₹2,100/month",
    tag: "Low EMI",
  },
];

export const NEXT_TIER_GAP = 138; // points to "Strong"
