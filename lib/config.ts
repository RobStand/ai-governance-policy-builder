/** Shared configuration type used across the questionnaire, API, and results. */

export type PriorityLevel = "high" | "medium" | "low";

export interface PolicyConfig {
  // Section 1: Organization profile
  orgName: string;
  industry: string; // Industry.key
  orgSize: string; // "<500" | "500-5,000" | "5,000-50,000" | "50,000+"
  regulated: boolean;
  regulatoryBodies: string[]; // RegulatoryBody.key[]
  otherRegulator: string;

  // Section 2: AI usage profile
  aiTypes: string[];
  customerAffecting: boolean;
  employmentAffecting: boolean;
  usesThirdParty: boolean;
  trainsOwnModels: boolean;

  // Section 3: Risk and maturity
  maturity: string; // "none" | "informal" | "partial" | "formal"
  riskTolerance: string; // "conservative" | "moderate" | "progressive"
  hasMrm: boolean;
  boardReporting: boolean;

  // Section 4: Policy priorities (section key -> level)
  priorities: Record<string, PriorityLevel>;
}

export const AI_TYPES: { key: string; label: string }[] = [
  { key: "genai", label: "Generative AI / large language models" },
  { key: "predictive", label: "Predictive models (credit scoring, fraud, risk)" },
  { key: "vision", label: "Computer vision" },
  { key: "rpa", label: "Robotic process automation" },
  { key: "recommendation", label: "Recommendation systems" },
  { key: "agentic", label: "Autonomous agents / agentic AI" },
];

export const ORG_SIZES = ["<500", "500–5,000", "5,000–50,000", "50,000+"];

export const MATURITY_LEVELS: { key: string; label: string }[] = [
  { key: "none", label: "None — starting from scratch" },
  { key: "informal", label: "Informal — some practices exist but undocumented" },
  { key: "partial", label: "Partial — some formal policies, inconsistently applied" },
  { key: "formal", label: "Formal — documented policies in place, seeking to strengthen" },
];

export const RISK_TOLERANCES: { key: string; label: string }[] = [
  { key: "conservative", label: "Conservative" },
  { key: "moderate", label: "Moderate" },
  { key: "progressive", label: "Progressive" },
];

/** Areas the user ranks by priority in Section 4. */
export const PRIORITY_AREAS: { key: string; label: string }[] = [
  { key: "acceptable-use", label: "Acceptable use and prohibited uses" },
  { key: "model-risk", label: "Model risk management and validation" },
  { key: "data-governance", label: "Data privacy and security" },
  { key: "human-oversight", label: "Human oversight and escalation" },
  { key: "fairness-bias", label: "Fairness, bias, and explainability" },
  { key: "vendor-risk", label: "Vendor and third-party AI risk" },
  { key: "audit-trails", label: "Audit trails and documentation" },
  { key: "training-accountability", label: "Employee training and accountability" },
  { key: "incident-response", label: "Incident response" },
];
