/**
 * Regulatory bodies offered in the configuration questionnaire and the
 * detailed context strings injected into the prompt when selected.
 */

export interface RegulatoryBody {
  key: string;
  label: string;
  /** Detail injected into the prompt when this body is selected. */
  context: string;
}

export const REGULATORY_BODIES: RegulatoryBody[] = [
  {
    key: "ncua",
    label: "NCUA (credit unions)",
    context:
      "NCUA: examiner expectations around safety and soundness, third-party/vendor due diligence, BSA/AML, and consumer financial protection. Treat AI/model risk as an emerging examination focus.",
  },
  {
    key: "occ-fed-fdic",
    label: "OCC / Federal Reserve / FDIC (banks)",
    context:
      "OCC / Federal Reserve / FDIC: SR 11-7 model risk management (development, implementation, use, validation, governance), third-party risk management guidance, and safety-and-soundness expectations.",
  },
  {
    key: "sec-finra",
    label: "SEC / FINRA (securities)",
    context:
      "SEC / FINRA: recordkeeping, supervision, marketing rules, Regulation Best Interest, and scrutiny of predictive data analytics and conflicts of interest in investor-facing AI.",
  },
  {
    key: "cfpb",
    label: "CFPB (consumer finance)",
    context:
      "CFPB: adverse-action notice requirements under ECOA/Regulation B (specific and accurate reasons, including for AI/complex models), UDAAP, and fair lending expectations for automated decisioning.",
  },
  {
    key: "hhs-cms",
    label: "HHS / CMS (healthcare)",
    context:
      "HHS / CMS: HIPAA privacy and security, Section 1557 nondiscrimination for clinical decision support, CMS program-integrity and coverage rules, and transparency for algorithmic patient-care tools.",
  },
  {
    key: "state-insurance",
    label: "State insurance commissioner",
    context:
      "State insurance commissioner / NAIC: NAIC Model Bulletin on the Use of AI Systems by Insurers, unfair-discrimination and rate-fairness standards, and governance/documentation expectations for underwriting and claims AI.",
  },
  {
    key: "ftc",
    label: "FTC",
    context:
      "FTC: Section 5 prohibition on unfair or deceptive acts or practices, expectations on substantiated AI claims, data minimization, and avoidance of discriminatory or harmful automated outcomes.",
  },
  {
    key: "eu-ai-act",
    label: "EU AI Act (if operating in Europe)",
    context:
      "EU AI Act: risk-based obligations (prohibited, high-risk, limited-risk, minimal-risk), conformity assessment and documentation for high-risk systems, transparency duties for generative AI, human oversight, and post-market monitoring.",
  },
];

export function getRegulatoryBody(key: string): RegulatoryBody | undefined {
  return REGULATORY_BODIES.find((b) => b.key === key);
}
