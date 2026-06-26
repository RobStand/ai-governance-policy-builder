# Claude Code Build Instructions: AI Governance Policy Builder

## What we're building

A web app that generates a draft AI governance framework tailored to an organization's industry, regulatory environment, risk posture, and maturity level. The user answers a structured set of questions. Claude produces a complete, downloadable governance document covering acceptable use, model risk management, human oversight, data handling, audit requirements, and accountability structures.

This is the highest-stakes tool in the portfolio for a financial services audience. Credit unions, banks, and insurers are under active regulatory pressure around AI governance — this demonstrates you understand that dimension of transformation, not just the technology.

---

## The problem this solves

Most organizations deploying AI have no governance framework. The ones that do either paid a consultant to write it or copied a generic template that doesn't reflect their regulatory context. This tool generates a credible, organization-specific starting point in minutes. It's not legal advice — it's a structured first draft that a legal or compliance team can refine.

The target user is an AI transformation lead, Chief Risk Officer, or compliance team preparing for regulatory scrutiny or board-level AI governance conversations.

---

## Tech stack

- **Framework**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **AI**: Anthropic SDK (`@anthropic-ai/sdk`) with streaming
- **Export**: `html2pdf.js` for PDF, plain text copy for Word import
- **State**: React state only — no database, no auth

---

## Project structure

```
/
├── app/
│   ├── page.tsx                        # Landing page
│   ├── configure/
│   │   └── page.tsx                    # Configuration questionnaire
│   ├── results/
│   │   └── page.tsx                    # Generated governance document
│   └── api/
│       └── policy/
│           └── route.ts                # Calls Claude, streams response
├── data/
│   ├── industries.ts                   # Industries with regulatory context
│   ├── regulations.ts                  # Regulatory frameworks by industry
│   └── policy-sections.ts             # Section definitions and descriptions
├── lib/
│   ├── prompts.ts                      # Prompt construction
│   └── pdf-export.ts                  # PDF generation
└── components/
    ├── ConfigForm.tsx
    ├── PolicySection.tsx               # Renders one policy section
    ├── PolicyDocument.tsx              # Full assembled document
    └── ExportBar.tsx
```

---

## Configuration questionnaire: app/configure/page.tsx

Four sections. Present as a clean single-page form, well-spaced with section headings. No wizard steps.

**Section 1: Organization profile**
- Organization name (optional — used to personalize the document header)
- Industry (dropdown — same list as Business Case Generator)
- Organization size (dropdown: <500, 500–5,000, 5,000–50,000, 50,000+)
- Is your organization publicly traded or regulated by a financial regulator? (yes/no toggle)
- Primary regulatory bodies that apply (multi-select checkboxes):
  - NCUA (credit unions)
  - OCC / Federal Reserve / FDIC (banks)
  - SEC / FINRA (securities)
  - CFPB (consumer finance)
  - HHS / CMS (healthcare)
  - State insurance commissioner
  - FTC
  - EU AI Act (if operating in Europe)
  - Other (text field)

**Section 2: AI usage profile**
- What types of AI are you deploying or considering? (multi-select):
  - Generative AI / large language models
  - Predictive models (credit scoring, fraud, risk)
  - Computer vision
  - Robotic process automation
  - Recommendation systems
  - Autonomous agents / agentic AI
- Do any AI systems make or influence decisions that affect customers/members? (yes/no)
- Do any AI systems make or influence employment decisions? (yes/no)
- Are you using third-party AI vendors or models? (yes/no)
- Do you fine-tune or train models on your own data? (yes/no)

**Section 3: Risk and maturity**
- Current AI governance maturity (segmented control):
  - None — starting from scratch
  - Informal — some practices exist but undocumented
  - Partial — some formal policies, inconsistently applied
  - Formal — documented policies in place, seeking to strengthen
- Risk tolerance (segmented control): Conservative / Moderate / Progressive
- Does your organization have a formal model risk management process? (yes/no)
- Does your board or audit committee currently receive AI risk reporting? (yes/no)

**Section 4: Policy priorities**
Ask the user to rank these areas by priority (drag to reorder, or use high/medium/low selectors):
- Acceptable use and prohibited uses
- Model risk management and validation
- Data privacy and security
- Human oversight and escalation
- Fairness, bias, and explainability
- Vendor and third-party AI risk
- Audit trails and documentation
- Employee training and accountability
- Incident response

Submit button: "Generate governance framework"

Do not use `<form>` elements. Use React state and onClick handlers.

---

## Output structure

The governance document has nine sections. Stream them in order. Each section is a real policy artifact — specific, actionable, and tailored to the inputs. Not generic template language.

1. **Purpose and Scope**
Defines what this policy covers, who it applies to, and why it exists. References the specific regulatory environment. 2–3 paragraphs.

2. **Definitions**
Key terms: AI system, high-risk AI, generative AI, model, training data, human oversight, etc. Tailored to the types of AI the organization is using.

3. **Acceptable Use and Prohibited Uses**
What AI may be used for. What it may not be used for — with specific prohibitions appropriate to the industry (e.g. for financial services: prohibited from making final adverse action decisions without human review; prohibited from using protected class proxies in credit models). Formatted as clear policy statements, not prose.

4. **Model Risk Management**
Covers model inventory, validation requirements, performance monitoring, and model retirement. For organizations with existing MRM processes, integrates with SR 11-7 guidance. For others, provides a lightweight framework to start from. Includes a model tiering approach (High/Medium/Low risk) with corresponding oversight requirements.

5. **Human Oversight and Escalation**
Defines when and how humans must be in the loop. Covers: decisions that require human review before action, escalation paths when AI confidence is low, override procedures, and documentation requirements. Specific to whether the org indicated customer-affecting or employment-affecting AI.

6. **Data Governance and Privacy**
Covers: permissible training data sources, data minimization requirements, retention and deletion, third-party data use, and special category data (if applicable). References specific regulations (GLBA, CCPA, HIPAA) based on industry inputs.

7. **Fairness, Bias, and Explainability**
Testing requirements before deployment, ongoing monitoring for disparate impact, explainability standards for customer-facing decisions, and documentation requirements. For credit unions and banks, references ECOA/Regulation B and fair lending examination expectations.

8. **Vendor and Third-Party AI Risk**
Due diligence requirements before adopting third-party AI. Contract requirements (audit rights, data handling, model documentation). Ongoing monitoring. References FFIEC third-party risk guidance for financial institutions.

9. **Governance Structure and Accountability**
Defines roles and responsibilities: who owns AI policy, who approves high-risk AI deployments, how AI risk is reported to the board or audit committee, and how the policy is reviewed and updated. Includes a suggested governance committee structure if none exists.

---

## API route: app/api/policy/route.ts

POST endpoint. Accepts the full configuration object. Streams the Claude response.

**System prompt:**
```
You are a senior AI governance and risk advisor with deep experience in regulated industries, 
particularly financial services. You write AI governance policies that are specific, enforceable, 
and grounded in the actual regulatory environment the organization operates in. You do not write 
generic templates — every policy you produce reflects the organization's industry, risk profile, 
AI use cases, and regulatory obligations. You write in clear policy language — direct, 
unambiguous, and structured for a compliance or legal audience. You always include a disclaimer 
that this document is a starting point for legal and compliance review, not legal advice.
```

**User prompt:** construct from all configuration inputs. Be explicit about:
- Which regulatory bodies apply
- Which types of AI are in scope
- Whether customer-affecting or employment-affecting decisions are involved
- Risk tolerance level
- Maturity starting point
- Priority ordering of sections

Instruct Claude to produce each section with a `##` heading and number it (e.g. `## Section 4: Model Risk Management`) so the frontend can parse and render sections individually.

Use `claude-sonnet-4-6`. Stream the response. API key from `process.env.ANTHROPIC_API_KEY`.

---

## Results page: app/results/page.tsx

- Document layout: white card on gray background, formatted like a real policy document
- Stream sections in as they arrive, rendering each under its heading
- Show a document metadata block at the top: organization name (if provided), generation date, policy version ("Draft 1.0"), regulatory context summary
- Include a disclaimer banner at the top and bottom: "This document is an AI-generated starting point for internal review. It does not constitute legal advice. Review with qualified legal and compliance counsel before adoption."
- Export options: Download PDF / Copy as plain text (for pasting into Word) / Print
- "Regenerate" button that returns to the configuration form with inputs preserved
- Section navigation: a sticky left sidebar (on desktop) showing the nine section names as anchor links so users can jump directly to any section

---

## data/industries.ts and data/regulations.ts

Build out regulatory context strings for each industry that get injected into the prompt. Key ones:

**Credit unions**: NCUA regulations, Bank Secrecy Act, ECOA/Regulation B, TILA, FCRA, GLBA, emerging NCUA AI guidance, state-level requirements.

**Banks**: OCC, Federal Reserve, FDIC guidance, SR 11-7 model risk management, ECOA, FCRA, GLBA, BSA/AML, CFPB supervision.

**Insurance**: State commissioner oversight, NAIC AI principles, underwriting fairness standards.

**Healthcare**: HIPAA, HHS AI guidance, CMS reimbursement rules, FDA oversight of AI/ML-based medical devices.

**General / other industries**: FTC Act Section 5, EEOC guidance on AI in employment, state AI laws (Colorado, Illinois, New York City), EU AI Act (if applicable).

---

## data/policy-sections.ts

Define each of the nine sections with:
- Section key
- Display name
- One-sentence description shown in the sidebar nav
- Estimated read time (for UX)

---

## Visual design

Formal and document-like. This is a compliance artifact, not a consumer app.

- Color palette: white document, charcoal text, single accent (deep navy or dark green — appropriate for governance/legal context)
- Typography: clean, readable — Inter or a system serif for body text
- Policy statements formatted as numbered or bulleted lists where appropriate — easy to scan
- Disclaimer banner: amber or yellow background, clearly visible
- Section headings: clear numbering, easy to reference ("Section 4")
- Print/PDF styles: no backgrounds, clean margins, page numbers, header with org name and date
- Mobile: readable, but this is primarily a desktop tool

---

## Environment

```
ANTHROPIC_API_KEY=your_key_here
```

---

## Suggested build order

1. Scaffold Next.js + Tailwind
2. Build `industries.ts`, `regulations.ts`, `policy-sections.ts`
3. Build `prompts.ts`
4. Build the configuration form
5. Build the API route with streaming
6. Build the results page with section navigation and progressive rendering
7. Add PDF export and plain text copy
8. Build landing page
9. Polish: disclaimer banner, metadata block, mobile layout, error handling

---

## Definition of done

- User completes configuration and receives a complete, structured governance document
- Document is specific to the inputs — not generic boilerplate
- Regulatory references are accurate and industry-appropriate
- All nine sections render progressively as they stream in
- Section navigation sidebar works correctly
- PDF export looks like a real policy document with proper headers and page numbers
- Disclaimer is clearly visible and present in the export
- Regenerate preserves the previous inputs
- Professional enough to show a CISO, CRO, or board audit committee as a starting point
