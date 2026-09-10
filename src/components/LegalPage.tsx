export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="font-serif text-4xl text-ink">{title}</h1>
      <p className="mt-2 text-xs text-ink-soft">Last updated: {updated}</p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <div key={s.heading}>
            <p className="label-caps text-ink">{s.heading}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
