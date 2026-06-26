export interface Industry {
  key: string;
  label: string;
  /** Short regulatory context injected into the prompt. */
  regulatoryContext: string;
}

export const INDUSTRIES: Industry[] = [
  {
    key: "credit-union",
    label: "Credit Union",
    regulatoryContext:
      "Regulated by the NCUA. Subject to the Bank Secrecy Act (BSA/AML), ECOA and Regulation B (fair lending), the Truth in Lending Act (TILA), the Fair Credit Reporting Act (FCRA), and the Gramm-Leach-Bliley Act (GLBA) for data privacy and safeguarding. Emerging NCUA supervisory attention on AI/model risk and third-party relationships. State-level requirements may also apply.",
  },
  {
    key: "bank",
    label: "Bank",
    regulatoryContext:
      "Supervised by the OCC, Federal Reserve, and/or FDIC. SR 11-7 governs model risk management. Subject to ECOA/Regulation B, FCRA, GLBA, TILA, BSA/AML, and CFPB supervision for consumer financial products. Fair lending and UDAAP scrutiny applies to AI-driven decisioning.",
  },
  {
    key: "insurance",
    label: "Insurance",
    regulatoryContext:
      "Regulated by state insurance commissioners and guided by the NAIC, including the NAIC Model Bulletin on the Use of Artificial Intelligence Systems by Insurers and NAIC AI principles. Underwriting and claims AI is subject to unfair discrimination and rate fairness standards; state-specific AI/algorithmic accountability rules may apply.",
  },
  {
    key: "securities",
    label: "Securities / Wealth Management",
    regulatoryContext:
      "Regulated by the SEC and FINRA. Subject to Regulation Best Interest, recordkeeping requirements, marketing/advertising rules, and emerging guidance on predictive data analytics and conflicts of interest in the use of AI with investors.",
  },
  {
    key: "healthcare",
    label: "Healthcare",
    regulatoryContext:
      "Subject to HIPAA (privacy and security of PHI), HHS guidance on AI, CMS reimbursement and program-integrity rules, and FDA oversight of AI/ML-based software as a medical device (SaMD). Nondiscrimination requirements under Section 1557 of the ACA apply to clinical decision support.",
  },
  {
    key: "fintech",
    label: "Fintech",
    regulatoryContext:
      "Depending on activities, subject to CFPB supervision, ECOA/Regulation B, FCRA, GLBA, state money-transmission and lending laws, and partner-bank oversight expectations. Heightened scrutiny of automated underwriting and adverse-action explainability.",
  },
  {
    key: "government",
    label: "Government / Public Sector",
    regulatoryContext:
      "Subject to OMB AI guidance (e.g., M-24-10), agency-specific AI use policies, public records and transparency obligations, procurement rules, and heightened expectations for fairness, accountability, and impact assessment of public-facing automated decisions.",
  },
  {
    key: "technology",
    label: "Technology / Software",
    regulatoryContext:
      "Subject to the FTC Act Section 5 (unfair or deceptive practices), state privacy laws (e.g., CCPA/CPRA), sector rules where applicable, and the EU AI Act for products offered in Europe. Employment-related AI tooling triggers EEOC and state/local automated-employment-decision rules.",
  },
  {
    key: "retail",
    label: "Retail / Consumer",
    regulatoryContext:
      "Subject to the FTC Act Section 5, state privacy laws (CCPA/CPRA and similar), consumer protection and advertising standards, and payment-data security obligations. Recommendation and pricing AI raises fairness and deception considerations.",
  },
  {
    key: "manufacturing",
    label: "Manufacturing / Industrial",
    regulatoryContext:
      "Subject to workplace safety (OSHA) obligations where AI affects operations, product liability standards, supply-chain and export controls where applicable, and the EU AI Act for products placed on the EU market.",
  },
  {
    key: "other",
    label: "Other / General",
    regulatoryContext:
      "Subject to the FTC Act Section 5 (unfair or deceptive practices), applicable state privacy and AI laws (e.g., Colorado AI Act, Illinois BIPA, NYC Local Law 144 for automated employment decisions), EEOC guidance on AI in employment, and the EU AI Act if operating in Europe.",
  },
];

export function getIndustry(key: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.key === key);
}
