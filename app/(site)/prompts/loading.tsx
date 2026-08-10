export default function PromptsLoading() {
  return (
    <div className="space-y-8 pt-8">
      <section className="rounded-card-lg border border-border-subtle bg-surface-2/85 p-7 shadow-card">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.75fr]">
          <div className="space-y-5">
            <div className="h-7 w-36 animate-pulse rounded-full bg-surface-1" />
            <div className="h-12 w-4/5 animate-pulse rounded-full bg-surface-1" />
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-surface-1" />
            <div className="h-16 w-full animate-pulse rounded-card bg-surface-1" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-8 w-28 animate-pulse rounded-full bg-surface-1" />
              ))}
            </div>
          </div>
          <div className="min-h-64 animate-pulse rounded-card border border-border-subtle bg-surface-1" />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid animate-pulse gap-4 rounded-card border border-border-subtle bg-surface-2/60 p-4 shadow-card sm:grid-cols-[5.5rem_1fr_auto]"
            >
              <div className="h-[5.5rem] w-[5.5rem] rounded-[1.35rem] bg-surface-1" />
              <div className="space-y-3">
                <div className="h-5 w-28 rounded-full bg-surface-1" />
                <div className="h-6 w-2/3 rounded-full bg-surface-1" />
                <div className="h-4 w-full rounded-full bg-surface-1" />
                <div className="h-4 w-4/5 rounded-full bg-surface-1" />
              </div>
              <div className="space-y-2 sm:w-32">
                <div className="h-9 rounded-sm bg-surface-1" />
                <div className="h-9 rounded-sm bg-surface-1" />
              </div>
            </div>
          ))}
        </div>
        <aside className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-card border border-border-subtle bg-surface-2" />
          ))}
        </aside>
      </section>
    </div>
  );
}
