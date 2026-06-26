"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PolicyConfig } from "@/lib/config";
import { parseDocument } from "@/lib/parse";
import { POLICY_SECTIONS } from "@/data/policy-sections";
import { getIndustry } from "@/data/industries";
import { getRegulatoryBody } from "@/data/regulations";
import { PolicyDocument } from "@/components/PolicyDocument";
import ExportBar from "@/components/ExportBar";

const CONFIG_KEY = "policy-config";
const RESULT_KEY = "policy-result";
const GENERATE_KEY = "policy-generate";

export default function ResultsPage() {
  const router = useRouter();
  const docRef = useRef<HTMLDivElement>(null);
  const [config, setConfig] = useState<PolicyConfig | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [status, setStatus] = useState<"idle" | "streaming" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const generatedDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  );

  const generate = useCallback(async (cfg: PolicyConfig) => {
    setStatus("streaming");
    setMarkdown("");
    setError(null);
    try {
      const res = await fetch("/api/policy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(cfg),
      });

      if (!res.ok || !res.body) {
        const msg = await res.json().catch(() => null);
        throw new Error(msg?.error ?? `Request failed (${res.status}).`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        if (acc.includes("[ERROR]")) {
          throw new Error(acc.split("[ERROR]").pop()?.trim() || "Generation error.");
        }
        setMarkdown(acc);
      }
      sessionStorage.setItem(RESULT_KEY, acc);
      sessionStorage.removeItem(GENERATE_KEY);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate policy.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cfg: PolicyConfig | null = null;
    try {
      const raw = sessionStorage.getItem(CONFIG_KEY);
      if (raw) cfg = JSON.parse(raw);
    } catch {
      /* ignore */
    }

    if (!cfg) {
      router.replace("/configure");
      return;
    }
    setConfig(cfg);

    const cached = sessionStorage.getItem(RESULT_KEY);
    const shouldGenerate = sessionStorage.getItem(GENERATE_KEY) === "1";
    if (cached && !shouldGenerate) {
      setMarkdown(cached);
      setStatus("done");
    } else {
      generate(cfg);
    }
  }, [generate, router]);

  const doc = useMemo(() => parseDocument(markdown), [markdown]);

  const regulatorySummary = useMemo(() => {
    if (!config) return "";
    const industry = getIndustry(config.industry)?.label ?? config.industry;
    const bodies = config.regulatoryBodies
      .map((k) => getRegulatoryBody(k)?.label.replace(/\s*\(.*\)$/, ""))
      .filter(Boolean);
    if (config.otherRegulator.trim()) bodies.push(config.otherRegulator.trim());
    return bodies.length ? `${industry} · ${bodies.join(", ")}` : industry;
  }, [config]);

  const meta = {
    orgName: config?.orgName?.trim() ?? "",
    generatedDate,
    version: "Draft 1.0",
    regulatorySummary,
  };

  const plainText = useMemo(() => {
    const header = [
      meta.orgName ? `${meta.orgName} — AI Governance Policy` : "AI Governance Policy",
      `${meta.version} • Generated ${meta.generatedDate}`,
      `Regulatory context: ${meta.regulatorySummary}`,
      "",
      "DISCLAIMER: This document is an AI-generated starting point for internal review. It does not constitute legal advice. Review with qualified legal and compliance counsel before adoption.",
      "",
      "----------------------------------------",
      "",
    ].join("\n");
    return header + markdown;
  }, [markdown, meta.generatedDate, meta.orgName, meta.regulatorySummary, meta.version]);

  const availableNumbers = new Set(doc.sections.map((s) => s.number));

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Top bar */}
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/configure"
            className="font-mono text-xs uppercase tracking-wider text-muted hover:text-accent"
          >
            ← Reconfigure
          </Link>
          <ExportBar
            targetRef={docRef}
            plainText={plainText}
            meta={meta}
            disabled={status === "streaming" && doc.sections.length === 0}
            onRegenerate={() => {
              sessionStorage.setItem(GENERATE_KEY, "1");
              sessionStorage.removeItem(RESULT_KEY);
              router.push("/configure");
            }}
          />
        </div>

        {status === "error" ? (
          <div className="no-print mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p className="font-semibold">Generation failed</p>
            <p className="mt-1">{error}</p>
            <button
              type="button"
              onClick={() => config && generate(config)}
              className="mt-3 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-dark"
            >
              Retry
            </button>
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          {/* Sticky section nav */}
          <aside className="no-print hidden lg:block">
            <div className="sticky top-8">
              <div className="font-mono text-xs uppercase tracking-wider text-muted">
                Sections
              </div>
              <nav className="mt-3 space-y-1">
                {POLICY_SECTIONS.map((s) => {
                  const ready = availableNumbers.has(s.number);
                  return (
                    <a
                      key={s.number}
                      href={ready ? `#section-${s.number}` : undefined}
                      className={`block rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                        ready
                          ? "text-ink hover:bg-accent-wash hover:text-accent"
                          : "cursor-default text-line-strong"
                      }`}
                    >
                      <span className="font-mono text-xs text-muted-soft">
                        {String(s.number).padStart(2, "0")}
                      </span>{" "}
                      {s.name}
                    </a>
                  );
                })}
              </nav>
              {status === "streaming" ? (
                <p className="mt-4 flex items-center gap-2 px-2.5 text-xs text-accent">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  Generating…
                </p>
              ) : null}
            </div>
          </aside>

          {/* Document */}
          <div>
            {doc.sections.length === 0 && status === "streaming" ? (
              <div className="rounded-lg border border-line bg-white px-8 py-16 text-center">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
                <p className="mt-3 text-sm text-muted">
                  Drafting your governance framework…
                </p>
              </div>
            ) : (
              <PolicyDocument ref={docRef} doc={doc} meta={meta} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
