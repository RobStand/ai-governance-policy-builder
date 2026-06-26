import { getIndustry } from "@/data/industries";
import { getRegulatoryBody } from "@/data/regulations";
import { POLICY_SECTIONS } from "@/data/policy-sections";
import {
  AI_TYPES,
  MATURITY_LEVELS,
  PRIORITY_AREAS,
  PolicyConfig,
  RISK_TOLERANCES,
} from "@/lib/config";

export const SYSTEM_PROMPT = `You are a senior AI governance and risk advisor with deep experience in regulated industries, particularly financial services. You write AI governance policies that are specific, enforceable, and grounded in the actual regulatory environment the organization operates in. You do not write generic templates — every policy you produce reflects the organization's industry, risk profile, AI use cases, and regulatory obligations. You write in clear policy language — direct, unambiguous, and structured for a compliance or legal audience. You always include a disclaimer that this document is a starting point for legal and compliance review, not legal advice.`;

function label<T extends { key: string; label: string }>(
  list: T[],
  key: string,
): string {
  return list.find((i) => i.key === key)?.label ?? key;
}

function yn(b: boolean): string {
  return b ? "Yes" : "No";
}

export function buildUserPrompt(config: PolicyConfig): string {
  const industry = getIndustry(config.industry);
  const industryLabel = industry?.label ?? config.industry;

  const bodies = config.regulatoryBodies
    .map((k) => getRegulatoryBody(k))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  const regulatorLines = bodies.map((b) => `- ${b.label}: ${b.context}`);
  if (config.otherRegulator.trim()) {
    regulatorLines.push(`- Other (organization-specified): ${config.otherRegulator.trim()}`);
  }

  const aiTypeLabels = config.aiTypes.map((k) => label(AI_TYPES, k));

  const maturityLabel = label(MATURITY_LEVELS, config.maturity);
  const riskLabel = label(RISK_TOLERANCES, config.riskTolerance);

  // Order priority areas: high first, then medium, then low; stable within group.
  const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const rankedPriorities = [...PRIORITY_AREAS]
    .sort(
      (a, b) =>
        (order[config.priorities[a.key] ?? "medium"] ?? 1) -
        (order[config.priorities[b.key] ?? "medium"] ?? 1),
    )
    .map(
      (area, idx) =>
        `${idx + 1}. ${area.label} (priority: ${config.priorities[area.key] ?? "medium"})`,
    );

  const sectionList = POLICY_SECTIONS.map(
    (s) => `## Section ${s.number}: ${s.name}`,
  ).join("\n");

  return `Generate a complete AI governance framework tailored to the following organization. Produce a credible, organization-specific first draft — not generic template language.

ORGANIZATION PROFILE
- Organization name: ${config.orgName.trim() || "(not provided — use a neutral placeholder such as \"the Organization\")"}
- Industry: ${industryLabel}
- Organization size: ${config.orgSize}
- Publicly traded or regulated by a financial regulator: ${yn(config.regulated)}
- Industry regulatory context: ${industry?.regulatoryContext ?? "General U.S. regulatory environment."}

APPLICABLE REGULATORY BODIES AND OBLIGATIONS
${regulatorLines.length ? regulatorLines.join("\n") : "- No specific regulators selected; apply general U.S. obligations (FTC Act Section 5, applicable state privacy/AI laws, EEOC guidance where employment is affected)."}

AI USAGE PROFILE
- Types of AI in scope: ${aiTypeLabels.length ? aiTypeLabels.join("; ") : "Not specified"}
- AI makes or influences decisions affecting customers/members: ${yn(config.customerAffecting)}
- AI makes or influences employment decisions: ${yn(config.employmentAffecting)}
- Uses third-party AI vendors or models: ${yn(config.usesThirdParty)}
- Fine-tunes or trains models on own data: ${yn(config.trainsOwnModels)}

RISK AND MATURITY
- Current AI governance maturity: ${maturityLabel}
- Risk tolerance: ${riskLabel}
- Formal model risk management process in place: ${yn(config.hasMrm)}
- Board/audit committee currently receives AI risk reporting: ${yn(config.boardReporting)}

POLICY PRIORITIES (highest to lowest)
${rankedPriorities.join("\n")}

INSTRUCTIONS
- Produce exactly nine sections, in this order, each beginning with a level-2 Markdown heading numbered exactly as shown so the frontend can parse them:
${sectionList}
- Within each section, use clear policy language. Use numbered or bulleted policy statements where appropriate rather than long prose.
- Reflect the specific regulatory bodies, AI types, and decisions-in-scope above. Where customer-affecting or employment-affecting decisions are indicated, include corresponding human-oversight, explainability, and adverse-action requirements.
- Tailor Model Risk Management to the stated maturity: if a formal MRM process exists, integrate with SR 11-7; if not, provide a lightweight starting framework. Include a High/Medium/Low model tiering approach with oversight requirements.
- Calibrate strictness to the stated risk tolerance (${riskLabel}) without weakening legally required controls.
- Emphasize the higher-priority areas listed above with greater depth, but still cover all nine sections.
- Begin the document with a one-paragraph disclaimer stating it is an AI-generated starting point for internal legal and compliance review and not legal advice.
- Do not include any preamble or commentary outside the document itself.`;
}
