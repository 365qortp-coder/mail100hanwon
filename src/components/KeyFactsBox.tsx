type Fact = { label: string; value: string };

export function KeyFactsBox({
  title = "핵심 요약",
  facts,
}: {
  title?: string;
  facts: Fact[];
}) {
  return (
    <aside className="my-6 rounded-[20px] border border-black/[0.07] bg-[#F5F5F5] p-6 md:p-7">
      <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C8A87] mb-4">
        {title}
      </p>
      <dl className="space-y-2.5 text-sm">
        {facts.map((fact, i) => (
          <div key={i} className="flex flex-col md:flex-row md:gap-3">
            <dt className="font-bold text-[#0a0a0a] md:w-32 shrink-0">
              {fact.label}
            </dt>
            <dd className="text-[#525252] leading-[1.7]">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
