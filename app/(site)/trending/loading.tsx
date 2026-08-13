export default function TrendingLoading() {
  return (
    <div className="space-y-8 pb-16 pt-10">
      <div className="rounded-card-lg border border-border-subtle bg-surface-2 p-8">
        <div className="h-4 w-44 animate-pulse rounded-pill bg-surface-3" />
        <div className="mt-6 h-14 w-full max-w-3xl animate-pulse rounded-card bg-surface-3" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded-pill bg-surface-3" />
        <div className="mt-3 h-5 w-4/5 max-w-xl animate-pulse rounded-pill bg-surface-3" />
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-card-lg border border-border-subtle bg-surface-2 p-5">
            <div className="h-8 w-10 animate-pulse rounded-sm bg-surface-3" />
            <div className="mt-4 h-14 w-14 animate-pulse rounded-card bg-surface-3" />
            <div className="mt-4 h-5 w-2/3 animate-pulse rounded-pill bg-surface-3" />
            <div className="mt-3 h-4 w-full animate-pulse rounded-pill bg-surface-3" />
            <div className="mt-2 h-4 w-4/5 animate-pulse rounded-pill bg-surface-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
