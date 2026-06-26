"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { INDUSTRIES } from "@/data/industries";
import { REGULATORY_BODIES } from "@/data/regulations";
import {
  AI_TYPES,
  MATURITY_LEVELS,
  ORG_SIZES,
  PRIORITY_AREAS,
  PolicyConfig,
  PriorityLevel,
  RISK_TOLERANCES,
} from "@/lib/config";

const STORAGE_KEY = "policy-config";

function defaultConfig(): PolicyConfig {
  const priorities: Record<string, PriorityLevel> = {};
  PRIORITY_AREAS.forEach((a) => (priorities[a.key] = "medium"));
  return {
    orgName: "",
    industry: "",
    orgSize: ORG_SIZES[1],
    regulated: false,
    regulatoryBodies: [],
    otherRegulator: "",
    aiTypes: [],
    customerAffecting: false,
    employmentAffecting: false,
    usesThirdParty: false,
    trainsOwnModels: false,
    maturity: "none",
    riskTolerance: "moderate",
    hasMrm: false,
    boardReporting: false,
    priorities,
  };
}

export default function ConfigForm() {
  const router = useRouter();
  const [config, setConfig] = useState<PolicyConfig>(defaultConfig);
  const [error, setError] = useState<string | null>(null);

  // Preserve previous inputs (e.g. for "Regenerate").
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setConfig({ ...defaultConfig(), ...JSON.parse(saved) });
    } catch {
      /* ignore */
    }
  }, []);

  function update<K extends keyof PolicyConfig>(key: K, value: PolicyConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }));
  }

  function toggleArray(key: "regulatoryBodies" | "aiTypes", value: string) {
    setConfig((c) => {
      const arr = c[key];
      return {
        ...c,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }

  function handleSubmit() {
    if (!config.industry) {
      setError("Please select an industry to continue.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setError(null);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    sessionStorage.setItem("policy-generate", "1");
    sessionStorage.removeItem("policy-result");
    router.push("/results");
  }

  return (
    <div className="space-y-12">
      {error ? (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {/* Section 1 */}
      <FormSection
        n={1}
        title="Organization profile"
        subtitle="Tells us which regulatory environment applies."
      >
        <Field label="Organization name" hint="Optional — used to personalize the document header.">
          <input
            type="text"
            value={config.orgName}
            onChange={(e) => update("orgName", e.target.value)}
            placeholder="e.g. Cascade Federal Credit Union"
            className={inputClass}
          />
        </Field>

        <Field label="Industry" required>
          <select
            value={config.industry}
            onChange={(e) => update("industry", e.target.value)}
            className={inputClass}
          >
            <option value="">Select an industry…</option>
            {INDUSTRIES.map((i) => (
              <option key={i.key} value={i.key}>
                {i.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Organization size">
          <select
            value={config.orgSize}
            onChange={(e) => update("orgSize", e.target.value)}
            className={inputClass}
          >
            {ORG_SIZES.map((s) => (
              <option key={s} value={s}>
                {s} employees
              </option>
            ))}
          </select>
        </Field>

        <Toggle
          label="Is your organization publicly traded or regulated by a financial regulator?"
          value={config.regulated}
          onChange={(v) => update("regulated", v)}
        />

        <Field label="Primary regulatory bodies that apply">
          <div className="grid gap-2 sm:grid-cols-2">
            {REGULATORY_BODIES.map((b) => (
              <Checkbox
                key={b.key}
                label={b.label}
                checked={config.regulatoryBodies.includes(b.key)}
                onChange={() => toggleArray("regulatoryBodies", b.key)}
              />
            ))}
          </div>
          <input
            type="text"
            value={config.otherRegulator}
            onChange={(e) => update("otherRegulator", e.target.value)}
            placeholder="Other regulator(s) — optional"
            className={`${inputClass} mt-3`}
          />
        </Field>
      </FormSection>

      {/* Section 2 */}
      <FormSection
        n={2}
        title="AI usage profile"
        subtitle="What you're deploying — and whether it affects people."
      >
        <Field label="What types of AI are you deploying or considering?">
          <div className="grid gap-2 sm:grid-cols-2">
            {AI_TYPES.map((t) => (
              <Checkbox
                key={t.key}
                label={t.label}
                checked={config.aiTypes.includes(t.key)}
                onChange={() => toggleArray("aiTypes", t.key)}
              />
            ))}
          </div>
        </Field>

        <Toggle
          label="Do any AI systems make or influence decisions that affect customers/members?"
          value={config.customerAffecting}
          onChange={(v) => update("customerAffecting", v)}
        />
        <Toggle
          label="Do any AI systems make or influence employment decisions?"
          value={config.employmentAffecting}
          onChange={(v) => update("employmentAffecting", v)}
        />
        <Toggle
          label="Are you using third-party AI vendors or models?"
          value={config.usesThirdParty}
          onChange={(v) => update("usesThirdParty", v)}
        />
        <Toggle
          label="Do you fine-tune or train models on your own data?"
          value={config.trainsOwnModels}
          onChange={(v) => update("trainsOwnModels", v)}
        />
      </FormSection>

      {/* Section 3 */}
      <FormSection
        n={3}
        title="Risk and maturity"
        subtitle="Calibrates how strict and how detailed the framework should be."
      >
        <Field label="Current AI governance maturity">
          <Segmented
            options={MATURITY_LEVELS}
            value={config.maturity}
            onChange={(v) => update("maturity", v)}
            stacked
          />
        </Field>
        <Field label="Risk tolerance">
          <Segmented
            options={RISK_TOLERANCES}
            value={config.riskTolerance}
            onChange={(v) => update("riskTolerance", v)}
          />
        </Field>
        <Toggle
          label="Does your organization have a formal model risk management process?"
          value={config.hasMrm}
          onChange={(v) => update("hasMrm", v)}
        />
        <Toggle
          label="Does your board or audit committee currently receive AI risk reporting?"
          value={config.boardReporting}
          onChange={(v) => update("boardReporting", v)}
        />
      </FormSection>

      {/* Section 4 */}
      <FormSection
        n={4}
        title="Policy priorities"
        subtitle="Set the priority for each area. Higher-priority areas get greater depth."
      >
        <div className="divide-y divide-line">
          {PRIORITY_AREAS.map((area) => (
            <PriorityRow
              key={area.key}
              label={area.label}
              value={config.priorities[area.key] ?? "medium"}
              onChange={(level) =>
                update("priorities", { ...config.priorities, [area.key]: level })
              }
            />
          ))}
        </div>
      </FormSection>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          Generate governance framework
        </button>
      </div>
    </div>
  );
}

/* ---------- presentational helpers ---------- */

const inputClass =
  "w-full rounded-md border border-line-strong bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

function FormSection({
  n,
  title,
  subtitle,
  children,
}: {
  n: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-6 sm:p-8">
      <header className="mb-6">
        <div className="font-mono text-xs uppercase tracking-wider text-muted">
          Section {n}
        </div>
        <h2 className="mt-1 text-xl font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </header>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </label>
      {hint ? <p className="mt-0.5 text-xs text-muted-soft">{hint}</p> : null}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 rounded border-line-strong text-accent focus:ring-accent"
      />
      <span>{label}</span>
    </label>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-ink">{label}</span>
      <div className="inline-flex shrink-0 overflow-hidden rounded-md border border-line-strong">
        {[
          { l: "Yes", v: true },
          { l: "No", v: false },
        ].map((o) => (
          <button
            key={o.l}
            type="button"
            onClick={() => onChange(o.v)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              value === o.v
                ? "bg-accent text-white"
                : "bg-white text-muted hover:bg-neutral-50"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
  stacked,
}: {
  options: { key: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  stacked?: boolean;
}) {
  return (
    <div
      className={
        stacked
          ? "flex flex-col gap-2"
          : "inline-flex flex-wrap overflow-hidden rounded-md border border-line-strong"
      }
    >
      {options.map((o) => {
        const active = value === o.key;
        if (stacked) {
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => onChange(o.key)}
              className={`rounded-md border px-4 py-2.5 text-left text-sm transition-colors ${
                active
                  ? "border-accent bg-accent-wash font-medium text-accent"
                  : "border-line bg-white text-muted hover:bg-neutral-50"
              }`}
            >
              {o.label}
            </button>
          );
        }
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              active ? "bg-accent text-white" : "bg-white text-muted hover:bg-neutral-50"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const LEVELS: { key: PriorityLevel; label: string }[] = [
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

function PriorityRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: PriorityLevel;
  onChange: (v: PriorityLevel) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-ink">{label}</span>
      <div className="inline-flex shrink-0 overflow-hidden rounded-md border border-line-strong">
        {LEVELS.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => onChange(l.key)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              value === l.key
                ? "bg-accent text-white"
                : "bg-white text-muted hover:bg-neutral-50"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
