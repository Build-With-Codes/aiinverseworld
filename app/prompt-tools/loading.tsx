export default function PromptToolsLoading() {
  return (
    <div className="space-y-6 pb-14 pt-8">
      <div className="skeleton-shimmer min-h-72 rounded-card-lg border border-border-subtle" />
      <div className="grid gap-5 lg:grid-cols-[17rem_1fr]">
        <div className="skeleton-shimmer h-96 rounded-card border border-border-subtle" />
        <div className="skeleton-shimmer h-[34rem] rounded-card-lg border border-border-subtle" />
      </div>
    </div>
  );
}
