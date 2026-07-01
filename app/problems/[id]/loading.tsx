import { DetailSkeleton, PageShellSkeleton } from "@/components/loading-skeletons";

export default function Loading() {
  return (
    <PageShellSkeleton>
      <DetailSkeleton />
    </PageShellSkeleton>
  );
}
