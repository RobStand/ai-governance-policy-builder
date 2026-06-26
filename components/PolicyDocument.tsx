import { forwardRef } from "react";
import { ParsedDocument } from "@/lib/parse";
import { renderMarkdown } from "@/lib/markdown";
import PolicySection from "@/components/PolicySection";

export interface DocumentMeta {
  orgName: string;
  generatedDate: string;
  version: string;
  regulatorySummary: string;
}

const DISCLAIMER =
  "This document is an AI-generated starting point for internal review. It does not constitute legal advice. Review with qualified legal and compliance counsel before adoption.";

function DisclaimerBanner() {
  return (
    <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <span className="font-semibold">Disclaimer: </span>
      {DISCLAIMER}
    </div>
  );
}

export const PolicyDocument = forwardRef<HTMLDivElement, {
  doc: ParsedDocument;
  meta: DocumentMeta;
}>(function PolicyDocument({ doc, meta }, ref) {
  return (
    <div
      ref={ref}
      className="policy-document mx-auto w-full max-w-3xl rounded-lg bg-white px-8 py-10 shadow-sm ring-1 ring-slate-200 sm:px-12 sm:py-14"
    >
      {/* Metadata block */}
      <div className="mb-6 border-b border-slate-200 pb-6">
        <div className="font-mono text-xs uppercase tracking-wider text-navy/60">
          AI Governance Policy
        </div>
        <h1 className="mt-2 text-3xl font-semibold text-navy">
          {meta.orgName ? meta.orgName : "AI Governance Framework"}
        </h1>
        <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between gap-4 sm:block">
            <dt className="font-mono text-xs uppercase tracking-wide text-slate-400">Generated</dt>
            <dd className="text-charcoal">{meta.generatedDate}</dd>
          </div>
          <div className="flex justify-between gap-4 sm:block">
            <dt className="font-mono text-xs uppercase tracking-wide text-slate-400">Version</dt>
            <dd className="text-charcoal">{meta.version}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-mono text-xs uppercase tracking-wide text-slate-400">
              Regulatory context
            </dt>
            <dd className="mt-0.5 text-charcoal">{meta.regulatorySummary}</dd>
          </div>
        </dl>
      </div>

      <div className="no-print mb-8">
        <DisclaimerBanner />
      </div>

      {doc.preamble ? (
        <div
          className="policy-prose mb-8 border-l-2 border-navy/20 pl-4 text-slate-600"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.preamble) }}
        />
      ) : null}

      <div className="space-y-8">
        {doc.sections.map((s) => (
          <PolicySection
            key={s.number}
            id={`section-${s.number}`}
            number={s.number}
            name={s.name}
            body={s.body}
          />
        ))}
      </div>

      <div className="mt-12 border-t border-slate-200 pt-6">
        <DisclaimerBanner />
      </div>
    </div>
  );
});
