import { AIVERSE_JOBS_BASE_URL } from "@/lib/service-urls";

export type JobCompany = {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  website?: string | null;
  logoUrl?: string | null;
};

export type JobLocation = {
  id: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  countryCode?: string | null;
  isRemote: boolean;
};

export type JobSource = {
  sourceUrl: string;
  applyUrl: string;
  provider: {
    name: string;
    type: string;
  };
};

export type JobSkill = {
  skill: {
    id: string;
    name: string;
    normalizedName: string;
  };
};

export type AiJob = {
  id: string;
  title: string;
  slug: string;
  descriptionText?: string | null;
  employmentType?: string | null;
  workplaceType?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency?: string | null;
  salaryPeriod?: string | null;
  postedAt?: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  updatedAt: string;
  company: JobCompany;
  locations: JobLocation[];
  sources: JobSource[];
  skills: JobSkill[];
};

export type JobsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type JobsSearchResult = {
  data: AiJob[];
  meta: JobsPagination;
};

export type SearchJobsOptions = {
  q?: string;
  location?: string;
  country?: string;
  city?: string;
  remote?: boolean;
  employmentType?: string;
  company?: string;
  salaryMin?: number;
  salaryMax?: number;
  postedWithin?: number;
  page?: number;
  limit?: number;
  sort?: "relevance" | "newest" | "salary";
};

function appendDefined(params: URLSearchParams, key: string, value: unknown) {
  if (value === undefined || value === null || value === "") return;
  params.set(key, String(value));
}

export function buildJobsSearchParams(options: SearchJobsOptions) {
  const params = new URLSearchParams();
  appendDefined(params, "q", options.q);
  appendDefined(params, "location", options.location);
  appendDefined(params, "country", options.country);
  appendDefined(params, "city", options.city);
  appendDefined(params, "remote", options.remote);
  appendDefined(params, "employmentType", options.employmentType);
  appendDefined(params, "company", options.company);
  appendDefined(params, "salaryMin", options.salaryMin);
  appendDefined(params, "salaryMax", options.salaryMax);
  appendDefined(params, "postedWithin", options.postedWithin);
  appendDefined(params, "page", options.page ?? 1);
  appendDefined(params, "limit", options.limit ?? 20);
  appendDefined(params, "sort", options.sort);
  return params;
}

export async function searchJobs(
  options: SearchJobsOptions,
  fetchOptions: { revalidate?: number; timeoutMs?: number } = {},
): Promise<JobsSearchResult> {
  const params = buildJobsSearchParams(options);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), fetchOptions.timeoutMs ?? 8000);

  try {
    const response = await fetch(`${AIVERSE_JOBS_BASE_URL}/jobs/search?${params.toString()}`, {
      next: fetchOptions.revalidate !== undefined ? { revalidate: fetchOptions.revalidate } : undefined,
      cache: fetchOptions.revalidate === undefined ? "no-store" : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      console.warn(`[jobs-api] /jobs/search returned ${response.status} ${response.statusText}`);
      return { data: [], meta: { page: options.page ?? 1, limit: options.limit ?? 20, total: 0, totalPages: 1 } };
    }

    return (await response.json()) as JobsSearchResult;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    console.warn(`[jobs-api] /jobs/search failed: ${reason}`);
    return { data: [], meta: { page: options.page ?? 1, limit: options.limit ?? 20, total: 0, totalPages: 1 } };
  } finally {
    clearTimeout(timeout);
  }
}
