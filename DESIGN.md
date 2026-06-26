# Design System — AI Governance Policy Builder

> **Memorable thing:** "The person who created this is an expert in AI
> transformation." Every decision below serves that — the product should read as
> *engineered by an authority*, not assembled from a template. Precision over
> decoration.

## Product Context
- **What this is:** A B2B compliance web app that generates a tailored,
  nine-section AI governance framework, streamed in real time.
- **Who it's for:** Compliance, risk, and legal teams at banks, credit unions,
  insurers, and healthcare organizations.
- **Space/industry:** RegTech / GRC / legal-tech, AI governance.
- **Project type:** Web app (configurator + streamed document + export).

## Aesthetic Direction
- **Direction:** Engineered / Technical-Authoritative (refined industrial).
- **Decoration level:** Intentional-minimal — hairline rules, a whisper-faint
  engineering-grid dot texture, and monospace structural labels (`§ 04`,
  eyebrows, metadata). Typography does the work.
- **Mood:** Precise, sober, current. Reads like a well-set technical spec, not a
  marketing site or a Word template. Confidence through restraint.
- **Reference sites:** none (worked from design knowledge, no competitive
  research this session).

## Typography
- **Display/Hero:** Hanken Grotesk (700–800, letter-spacing −0.02em) — an
  engineered grotesk that feels authored and confident; deliberately not Inter.
- **Body:** Hanken Grotesk (400–500, ~16/26) — cohesive with display, highly
  legible for long-form policy text.
- **UI/Labels/Metadata:** JetBrains Mono (400–500) — section numbers, eyebrows,
  field labels, version/timestamp metadata. The "built by an engineer" signal.
- **Data/Tables:** JetBrains Mono with `font-variant-numeric: tabular-nums` for
  aligned figures.
- **Code:** JetBrains Mono.
- **Loading:** Google Fonts / Bunny Fonts. In Next.js prefer `next/font/google`
  (`Hanken_Grotesk` + `JetBrains_Mono`) exposed as CSS variables
  `--font-sans` / `--font-mono`.
- **Scale (px):** 11 (mono label) · 13 (small/table) · 15 (body) · 16 (body-lg) ·
  20 · 24 (section h3) · 32 · 40–56 (display, clamp).

## Color
- **Approach:** Restrained — true-gray neutrals + one saturated accent. Color is
  rare and meaningful. (No blue: cobalt was tried and rejected as "too much
  blue.")
- **Accent (Emerald):** `#047857` — primary action, active section/nav state,
  the live "streaming" indicator, and the document section number. Used
  sparingly. Dark-mode accent: `#34D399`.
- **Ink (primary text):** `#111317`.
- **Neutrals (true gray, light → dark):** Paper `#F6F6F7` · Line `#E5E5E7` ·
  Line-strong `#D4D4D6` · Muted-2 `#9A9AA0` · Muted `#6B6B70` · Ink `#111317`.
  Surface `#FFFFFF`.
- **Semantic:** success `#047857` (shares the accent — success is positive) ·
  warning `#B45309` · error `#DC2626` · info = neutral muted gray (deliberately
  not a second green).
- **Dark mode:** Redesign surfaces (Paper `#0C0D0E`, Surface `#141517`, Line
  `#26262A`, Ink text `#E7E7EA`); lighten the accent to `#34D399` and reduce
  saturation of semantic colors ~10–20%.

## Spacing
- **Base unit:** 8px (4px for fine adjustments).
- **Density:** Comfortable-spacious — long documents need air.
- **Scale:** 2xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64).

## Layout
- **Approach:** Grid-disciplined hybrid — strict left-aligned document column
  with a sticky section-navigation rail; generous reading measure.
- **Grid:** Single reading column (~720px max) beside a ~232px sticky section
  nav on desktop; nav collapses below ~760px.
- **Max content width:** ~1120px shell; ~720px reading measure for policy body.
- **Border radius:** sm 4px · md 8px · lg 12px · full 9999px (pills only).
- **Texture:** whisper-faint dot grid (`radial-gradient` ~22px, ~4% ink) on the
  app background; hairline `1px` rules between sections.

## Motion
- **Approach:** Minimal-functional. Streamed sections fade + rise (~200ms) as
  they arrive; a blinking monospace caret marks the live insertion point.
- **Easing:** enter `ease-out` · exit `ease-in` · move `ease-in-out`.
- **Duration:** micro 50–100ms · short 150–250ms · medium 250–400ms ·
  long 400–700ms.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-26 | Initial design system created | /design-consultation, worked from design knowledge (no competitive research). |
| 2026-06-26 | Hanken Grotesk (display+body) + JetBrains Mono (labels/data) | Engineered grotesk + mono = authored-by-an-expert feel; replaces Inter. |
| 2026-06-26 | Mono as a structural system (section numbers, eyebrows, metadata) | Risk taken deliberately — signals engineered spec software, not a template. |
| 2026-06-26 | Dropped cobalt `#2348FF` accent | User feedback: "too much blue." |
| 2026-06-26 | Single accent = Emerald `#047857` on true-gray neutrals, used sparingly | Credible/GRC-adjacent but sharp; cool engineered framing keeps it clear of warm green/gold "AI slop." |
