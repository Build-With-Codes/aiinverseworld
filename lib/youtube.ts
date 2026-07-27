import { apiGet } from "@/lib/api-service";

export type ToolYoutubeVideo = {
  id: string;
  toolSlug: string;
  videoId: string;
  title: string;
  channelTitle?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  durationSec?: number | null;
  viewCount?: string | null;
  publishedAt?: string | null;
  url: string;
  fetchedAt: string;
};

type YoutubeVideosResponse = {
  data?: ToolYoutubeVideo[];
  meta?: {
    source?: string;
    cached?: boolean;
    unavailable?: boolean;
    message?: string;
  };
};

export async function getToolYoutubeVideos(toolKey: string, limit = 3) {
  const payload = await apiGet<YoutubeVideosResponse>(
    `/api/youtube/${encodeURIComponent(toolKey)}?limit=${limit}`,
    { timeoutMs: 6000 },
  );

  return payload?.data ?? [];
}
