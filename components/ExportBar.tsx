"use client";

import { useState } from "react";
import { exportToPdf } from "@/lib/pdf-export";

export default function ExportBar({
  targetRef,
  plainText,
  meta,
  onRegenerate,
  disabled,
}: {
  targetRef: React.RefObject<HTMLDivElement>;
  plainText: string;
  meta: { orgName: string; generatedDate: string; version: string };
  onRegenerate: () => void;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function handlePdf() {
    if (!targetRef.current) return;
    setExporting(true);
    try {
      await exportToPdf(targetRef.current, meta);
    } catch (e) {
      console.error(e);
      alert("PDF export failed. Try the Print option as a fallback.");
    } finally {
      setExporting(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("Copy failed — your browser blocked clipboard access.");
    }
  }

  const btn =
    "inline-flex items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handlePdf}
        disabled={disabled || exporting}
        className={`${btn} bg-accent text-white hover:bg-accent-dark`}
      >
        {exporting ? "Preparing PDF…" : "Download PDF"}
      </button>
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        className={`${btn} border border-line-strong bg-white text-ink hover:bg-neutral-50`}
      >
        {copied ? "Copied" : "Copy as text"}
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        disabled={disabled}
        className={`${btn} border border-line-strong bg-white text-ink hover:bg-neutral-50`}
      >
        Print
      </button>
      <button
        type="button"
        onClick={onRegenerate}
        className={`${btn} ml-auto text-accent hover:bg-accent-wash`}
      >
        Regenerate
      </button>
    </div>
  );
}
