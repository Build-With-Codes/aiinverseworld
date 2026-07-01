import { FilterBarSkeleton, PageShellSkeleton, ToolGridSkeleton } from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <PageShellSkeleton compact>
      <FilterBarSkeleton />
      <ToolGridSkeleton count={9} />
    </PageShellSkeleton>
  );
}
