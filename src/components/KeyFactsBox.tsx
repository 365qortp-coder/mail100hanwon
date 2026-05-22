type Fact = { label: string; value: string };

export function KeyFactsBox({
  title = "핵심 요약",
  facts,
}: {
  title?: string;
  facts: Fact[];
}) {
  return (
    <aside className="my-6 rounded-lg border border-[var(--border)] bg-[var(--brand-primary-light)] p-5">
      <p className="text-sm font-bold text-[var(--brand-primary-dark)] mb-3">
        {title}
      </p>
      <dl className="space-y-2 text-sm">
        {facts.map((fact, i) => (
          <div key={i} className="flex flex-col md:flex-row md:gap-3">
            <dt className="font-semibold text-[var(--brand-primary-dark)] md:w-32 shrink-0">
              {fact.label}
            </dt>
            <dd className="text-[var(--foreground)]">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
