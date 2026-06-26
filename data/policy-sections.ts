export interface PolicySectionDef {
  /** Stable key, e.g. "purpose-scope". */
  key: string;
  /** Section number, 1-9, as it appears in the document. */
  number: number;
  /** Display name (matches the Claude `## Section N: Name` heading). */
  name: string;
  /** One-sentence description shown in the sidebar nav. */
  description: string;
  /** Estimated read time in minutes, for UX. */
  readTimeMinutes: number;
}

export const POLICY_SECTIONS: PolicySectionDef[] = [
  {
    key: "purpose-scope",
    number: 1,
    name: "Purpose and Scope",
    description: "What this policy covers, who it applies to, and why it exists.",
    readTimeMinutes: 2,
  },
  {
    key: "definitions",
    number: 2,
    name: "Definitions",
    description: "Key terms tailored to the AI systems in use.",
    readTimeMinutes: 2,
  },
  {
    key: "acceptable-use",
    number: 3,
    name: "Acceptable Use and Prohibited Uses",
    description: "What AI may and may not be used for, with industry-specific prohibitions.",
    readTimeMinutes: 3,
  },
  {
    key: "model-risk",
    number: 4,
    name: "Model Risk Management",
    description: "Inventory, validation, monitoring, retirement, and risk tiering.",
    readTimeMinutes: 4,
  },
  {
    key: "human-oversight",
    number: 5,
    name: "Human Oversight and Escalation",
    description: "When humans must be in the loop, with override and escalation paths.",
    readTimeMinutes: 3,
  },
  {
    key: "data-governance",
    number: 6,
    name: "Data Governance and Privacy",
    description: "Permissible data, minimization, retention, and special-category data.",
    readTimeMinutes: 3,
  },
  {
    key: "fairness-bias",
    number: 7,
    name: "Fairness, Bias, and Explainability",
    description: "Pre-deployment testing, disparate-impact monitoring, and explainability.",
    readTimeMinutes: 3,
  },
  {
    key: "vendor-risk",
    number: 8,
    name: "Vendor and Third-Party AI Risk",
    description: "Due diligence, contract requirements, and ongoing vendor monitoring.",
    readTimeMinutes: 3,
  },
  {
    key: "governance-structure",
    number: 9,
    name: "Governance Structure and Accountability",
    description: "Roles, approval authority, board reporting, and policy review cadence.",
    readTimeMinutes: 3,
  },
];

export function getSectionByNumber(n: number): PolicySectionDef | undefined {
  return POLICY_SECTIONS.find((s) => s.number === n);
}
