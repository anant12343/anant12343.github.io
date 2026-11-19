import Reveal from "./Reveal";

/** Oversized editorial section header with an index number and a side note. */
export default function SectionHeader({ index, title, note, id }: { index: string; title: string; note?: string; id?: string }) {
  return (
    <header className="mb-10 border-t border-fg pt-4 sm:mb-14">
      <div className="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <span className="label">({index})</span>
        {note && <p className="label max-w-[16rem] text-right text-muted">{note}</p>}
      </div>
      <Reveal>
        <h2 id={id} className="display text-[clamp(3.4rem,13.5vw,12.5rem)]">
          {title}
        </h2>
      </Reveal>
    </header>
  );
}
