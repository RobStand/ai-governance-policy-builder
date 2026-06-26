# Copilot instructions: AI Governance Policy Builder

Next.js 14 (App Router, TypeScript) + Tailwind app that generates a tailored,
nine-section AI governance framework by streaming an Anthropic Claude response.
No database, no auth — all client state lives in `sessionStorage`.

## Commands

```bash
npm run dev      # dev server on :3000
npm run build    # production build (also runs type-check + lint)
npm run start    # serve the production build
npm run lint     # next lint (ESLint, next/core-web-vitals)
```

There is no test runner configured. `npm run build` is the primary correctness
gate — it type-checks the whole project. Requires `ANTHROPIC_API_KEY` in `.env`
for live generation (`cp .env.example .env`); the app builds and all routes
render without it, but `/api/policy` returns a 500 JSON error until it is set.

## Architecture

Three-step flow across pages, connected only by `sessionStorage` (keys
`policy-config`, `policy-result`, `policy-generate`):

1. **`/configure`** — `components/ConfigForm.tsx` collects a `PolicyConfig`
   (defined in `lib/config.ts`), writes it to `sessionStorage`, sets the
   `policy-generate` flag, and routes to `/results`.
2. **`/api/policy`** (`app/api/policy/route.ts`) — POST handler. Builds the
   prompt via `lib/prompts.ts` and streams Claude's text back as a raw
   `text/plain` `ReadableStream` (not SSE/JSON). Errors are streamed inline as
   `[ERROR] <message>`.
3. **`/results`** (`app/results/page.tsx`) — reads the stream, accumulates the
   markdown, and re-parses it on every chunk with `lib/parse.ts` so sections
   render progressively. Caches the final markdown in `policy-result`.

The **prompt/parse contract** is the load-bearing convention: `lib/prompts.ts`
instructs Claude to emit each section as `## Section N: <Name>`, and
`lib/parse.ts` splits on the regex `/^##\s*Section\s+(\d+)\s*:\s*(.+?)\s*$/i`.
Anything that changes one must change the other, and section numbers/names must
stay aligned with `data/policy-sections.ts`.

`data/` is the single source of truth for domain content: `industries.ts`,
`regulations.ts`, and `policy-sections.ts` each export a typed array plus a
`getX` lookup helper. Prompt context strings live here, not inline in prompts.

## Conventions

- **Import alias**: use `@/...` (maps to repo root) for all internal imports.
- **Server vs client**: pages are React Server Components by default; any file
  using hooks, browser APIs, or `sessionStorage` starts with `"use client"`
  (`ConfigForm`, `ExportBar`, `app/results/page.tsx`).
- **Forms**: do not use `<form>` elements — use React state and `onClick`
  handlers (see `ConfigForm.tsx`).
- **Browser-only libs**: `html2pdf.js` is dynamically imported inside
  `lib/pdf-export.ts` so it never executes on the server.
- **Markdown rendering**: Claude output is rendered with the dependency-free
  `lib/markdown.ts` (a deliberately minimal subset: `###` headings, bold/italic,
  lists, pipe tables). Prefer extending it over adding a markdown dependency.
- **Styling/theme**: Tailwind with a custom `navy` palette, plus `charcoal` and
  `paper`, in `tailwind.config.ts`. Body uses Inter (`font-sans`); labels and
  metadata use JetBrains Mono (`font-mono`). The aesthetic is intentionally
  formal/document-like and cool-toned — avoid serif body fonts and warm
  paper/green-gold palettes.
- **Disclaimer**: the "AI-generated starting point, not legal advice" disclaimer
  must remain present in the UI and in every export (PDF/text). It lives in
  `components/PolicyDocument.tsx` and is prepended to the copy-as-text output in
  `app/results/page.tsx`.
- **Model**: the Claude model id is set in `app/api/policy/route.ts` (`MODEL`).

## gstack

This environment has the [gstack](https://github.com/garrytan/gstack) skills
installed. For **all web browsing**, use the gstack `/browse` skill — never use
`mcp__claude-in-chrome__*` tools.

Available gstack skills:

`/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`,
`/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`,
`/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`,
`/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`,
`/setup-gbrain`, `/retro`, `/investigate`, `/document-release`,
`/document-generate`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`,
`/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`,
`/gstack-upgrade`, `/learn`.
