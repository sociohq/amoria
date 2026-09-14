// Content blocks a legal section can be made of — plain paragraphs and
// bulleted lists, matching how the source policy documents (T&Cs,
// Privacy Policy, etc.) are actually structured, rather than forcing
// everything into one paragraph string.
export type LegalBlock = { type: "p"; text: string } | { type: "ul"; items: string[] };

export type LegalSection = {
  heading: string;
  blocks?: LegalBlock[];
  // A section can itself contain labelled sub-groups (e.g. the Privacy
  // Policy's "Information We Collect" splitting into "Information You
  // Provide" / "Transaction Information" / "Automatically Collected
  // Information").
  subsections?: { heading: string; blocks: LegalBlock[] }[];
};

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((b, i) =>
        b.type === "p" ? (
          <p key={i} className="mt-2 text-sm leading-relaxed text-ink-soft">
            {b.text}
          </p>
        ) : (
          <ul key={i} className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-soft">
            {b.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        )
      )}
    </>
  );
}

export function LegalPage({
  title,
  updated,
  intro,
  sections,
  closing,
}: {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSection[];
  closing?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="font-serif text-4xl text-ink">{title}</h1>
      <p className="mt-2 text-xs text-ink-soft">Last updated: {updated}</p>
      {intro && <p className="mt-6 text-sm leading-relaxed text-ink-soft">{intro}</p>}
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <div key={s.heading}>
            <p className="label-caps text-ink">{s.heading}</p>
            {s.blocks && <Blocks blocks={s.blocks} />}
            {s.subsections?.map((sub) => (
              <div key={sub.heading} className="mt-4">
                <p className="text-sm font-medium text-ink">{sub.heading}</p>
                <Blocks blocks={sub.blocks} />
              </div>
            ))}
          </div>
        ))}
      </div>
      {closing && <p className="mt-10 text-sm leading-relaxed text-ink-soft">{closing}</p>}
    </div>
  );
}
