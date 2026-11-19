import type { Metadata } from "next";
import Image from "next/image";
import { asset } from "@/lib/site";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}: PGDM Marketing at BIMTECH, data science, mechanical engineering.`,
  alternates: { canonical: "/resume/" },
};

export default function ResumePage() {
  const pdf = asset("/resume.pdf");
  return (
    <section className="mx-auto max-w-site px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-6 border-b border-fg pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label text-muted">One page · PDF</p>
          <h1 className="display mt-4 text-[clamp(3.4rem,12vw,10rem)]">Resume</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={pdf} download="Ananth_Madabhushini_Resume.pdf" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-ink transition-transform hover:-translate-y-0.5">
            Download PDF <span aria-hidden>↓</span>
          </a>
          <a href={pdf} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-fg px-6 py-3 font-medium transition-colors hover:bg-fg hover:text-bg">
            Open in new tab <span aria-hidden>↗</span>
          </a>
        </div>
      </div>

      {/* Desktop: native PDF viewer. Mobile browsers often won't render inline PDFs, so show a preview image. */}
      <div className="mt-8 hidden md:block">
        <object data={`${pdf}#view=FitH`} type="application/pdf" aria-label="Resume PDF viewer" className="h-[min(90vh,72rem)] w-full rounded-tile border border-line bg-card">
          <a href={pdf} className="mx-auto block max-w-3xl p-6">
            <Image src={asset("/images/resume-preview.webp")} alt="Preview of the one-page resume. Click to open the PDF." width={1240} height={1753} className="h-auto w-full rounded-lg" />
          </a>
        </object>
      </div>
      <a href={pdf} className="tile mt-8 block md:hidden">
        <Image src={asset("/images/resume-preview.webp")} alt="Preview of the one-page resume. Tap to open the PDF." width={1240} height={1753} priority sizes="100vw" className="h-auto w-full" />
      </a>
    </section>
  );
}
