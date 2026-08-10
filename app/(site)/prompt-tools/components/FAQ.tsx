type FAQProps = {
  items: { question: string; answer: string }[];
};

export function FAQ({ items }: FAQProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-5">
        <p className="text-eyebrow text-brand-cyan-strong">FAQ</p>
        <h2 className="text-display-2 mt-2 text-text-primary">Simple answers before you use it</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.question} className="rounded-card border border-border-subtle bg-surface-2 p-6 shadow-card">
            <h3 className="text-heading-2 text-text-primary">{item.question}</h3>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
