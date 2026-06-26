import { POLICY_SECTIONS } from "@/data/policy-sections";

export interface ParsedSection {
  number: number;
  name: string;
  /** Raw markdown body (without the heading line). */
  body: string;
}

export interface ParsedDocument {
  /** Leading text before the first `## Section` heading (e.g. disclaimer). */
  preamble: string;
  sections: ParsedSection[];
}

const SECTION_HEADING = /^##\s*Section\s+(\d+)\s*:\s*(.+?)\s*$/i;

/**
 * Splits streamed markdown into the nine numbered sections. Tolerant of partial
 * input during streaming — only completed-enough sections are returned with the
 * text accumulated so far.
 */
export function parseDocument(markdown: string): ParsedDocument {
  const lines = markdown.split("\n");
  const preambleLines: string[] = [];
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const line of lines) {
    const match = line.match(SECTION_HEADING);
    if (match) {
      if (current) sections.push(current);
      const number = parseInt(match[1], 10);
      const fallback = POLICY_SECTIONS.find((s) => s.number === number);
      current = {
        number,
        name: fallback?.name ?? match[2],
        body: "",
      };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      preambleLines.push(line);
    }
  }
  if (current) sections.push(current);

  return {
    preamble: preambleLines.join("\n").trim(),
    sections,
  };
}
