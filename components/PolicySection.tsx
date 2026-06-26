import { renderMarkdown } from "@/lib/markdown";
import { getSectionByNumber } from "@/data/policy-sections";

export default function PolicySection({
  number,
  name,
  body,
  id,
}: {
  number: number;
  name: string;
  body: string;
  id: string;
}) {
  const def = getSectionByNumber(number);
  return (
    <section id={id} className="print-section scroll-mt-28 border-t border-line pt-8 first:border-t-0 first:pt-0">
      <header className="mb-3">
        <div className="font-mono text-xs uppercase tracking-wider text-accent">
          Section {number}
        </div>
        <h2 className="mt-1 text-2xl font-semibold text-ink">{name}</h2>
        {def?.description ? (
          <p className="mt-1 text-sm text-muted">{def.description}</p>
        ) : null}
      </header>
      <div
        className="policy-prose"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
      />
    </section>
  );
}
