/**
 * Client-side PDF export using html2pdf.js (dynamically imported so it never
 * runs on the server). Produces a clean, document-like PDF with page numbers
 * and a running header containing the organization name and generation date.
 */

export interface PdfMeta {
  orgName: string;
  generatedDate: string;
  version: string;
}

export async function exportToPdf(element: HTMLElement, meta: PdfMeta): Promise<void> {
  const mod = await import("html2pdf.js");
  const html2pdf = (mod.default ?? mod) as any;

  const filename = `${slugify(meta.orgName || "ai-governance-policy")}-governance-policy.pdf`;

  const opt = {
    margin: [0.85, 0.75, 0.85, 0.75],
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] },
  };

  const worker = html2pdf().set(opt).from(element);
  const pdf = await worker.toPdf().get("pdf");

  const pageCount = pdf.internal.getNumberOfPages();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(120);
    const headerLeft = meta.orgName ? `${meta.orgName} — AI Governance Policy` : "AI Governance Policy";
    pdf.text(headerLeft, 0.75, 0.5);
    pdf.text(`${meta.version} • ${meta.generatedDate}`, pageWidth - 0.75, 0.5, {
      align: "right",
    });
    pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 0.45, {
      align: "center",
    });
  }

  await worker.save();
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}
