import Link from "next/link";

const SECTIONS = [
  "Purpose and Scope",
  "Definitions",
  "Acceptable Use and Prohibited Uses",
  "Model Risk Management",
  "Human Oversight and Escalation",
  "Data Governance and Privacy",
  "Fairness, Bias, and Explainability",
  "Vendor and Third-Party AI Risk",
  "Governance Structure and Accountability",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="font-mono text-xs uppercase tracking-[0.2em] text-navy/60">
          AI Governance Policy Builder
        </div>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-navy sm:text-5xl">
          Generate a credible, organization-specific AI governance framework in
          minutes.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Answer a structured set of questions about your industry, regulatory
          environment, AI use cases, and risk posture. We produce a complete,
          tailored governance document your legal and compliance teams can refine —
          covering acceptable use, model risk, human oversight, data handling,
          fairness, and accountability.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href="/configure"
            className="inline-flex items-center rounded-md bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-600"
          >
            Build your framework
          </Link>
          <span className="text-sm text-slate-500">
            No account required · Nothing is stored on a server
          </span>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          <Feature
            title="Regulation-aware"
            body="References the specific regulators and frameworks that apply to your organization — NCUA, OCC/Fed/FDIC, SR 11-7, ECOA, GLBA, HIPAA, the EU AI Act, and more."
          />
          <Feature
            title="Tailored, not templated"
            body="Every section reflects your AI use cases, risk tolerance, and maturity — from a lightweight starting framework to strengthening formal policies."
          />
          <Feature
            title="Board-ready output"
            body="A formatted policy document you can export to PDF, copy into Word, or print — professional enough for a CRO, CISO, or audit committee."
          />
        </div>

        <div className="mt-16 rounded-lg border border-slate-200 bg-white p-6">
          <div className="font-mono text-xs uppercase tracking-wide text-navy/60">
            Nine policy sections
          </div>
          <ol className="mt-4 grid gap-x-8 gap-y-2 text-sm text-charcoal sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s, i) => (
              <li key={s} className="flex gap-2">
                <span className="font-mono text-slate-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-12 max-w-2xl text-sm leading-6 text-slate-500">
          This tool produces an AI-generated starting point for internal review. It
          does not constitute legal advice. Review the output with qualified legal
          and compliance counsel before adoption.
        </p>
      </div>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
