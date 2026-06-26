import Link from "next/link";
import ConfigForm from "@/components/ConfigForm";

export default function ConfigurePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-wider text-muted hover:text-accent"
        >
          ← AI Governance Policy Builder
        </Link>
        <h1 className="mt-4 text-3xl font-semibold text-ink">
          Configure your governance framework
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Answer the questions below. The more specific your inputs, the more
          tailored the resulting policy. Nothing is stored on a server.
        </p>

        <div className="mt-10">
          <ConfigForm />
        </div>
      </div>
    </main>
  );
}
