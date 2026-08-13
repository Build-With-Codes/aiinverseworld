import { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';
import { AIVERSE_JOBS_BASE_URL } from '@/lib/service-urls';
import { apiGet } from '@/lib/api-service';
import { promptTools } from '@/lib/prompt-tools';

type BackendSitemapEntry = {
  url: string;
  lastModified: string;
  changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority?: number;
};

async function getWorldSitemap(section: string) {
  const payload = await apiGet<{ data?: BackendSitemapEntry[] }>(
    `/api/seo/sitemap/${section}`,
    { revalidate: 21_600, timeoutMs: 5000 },
  );
  return payload?.data ?? [];
}

async function getJobsSitemap(section: string) {
  try {
    const response = await fetch(`${AIVERSE_JOBS_BASE_URL}/seo/sitemap/${section}`, {
      next: { revalidate: 21_600 },
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as { data?: BackendSitemapEntry[] };
    return payload.data ?? [];
  } catch {
    return [];
  }
}

function toNextSitemap(entries: BackendSitemapEntry[]): MetadataRoute.Sitemap {
  return entries.map((entry) => ({
    url: entry.url,
    lastModified: new Date(entry.lastModified),
    changeFrequency: entry.changeFrequency ?? 'weekly',
    priority: entry.priority ?? 0.6,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl.replace(/\/$/, '');
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.78,
    },
    {
      url: `${baseUrl}/prompt-tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...promptTools.map((tool) => ({
      url: `${baseUrl}${tool.href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.68,
    })),
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dmca`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/copyright`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/advertising-disclosure`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/affiliate-disclosure`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/security`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const [tools, blogPosts, categories, managedWorldPages, prompts, jobs, managedJobPages] =
    await Promise.all([
      getWorldSitemap('tools'),
      getWorldSitemap('blog'),
      getWorldSitemap('categories'),
      getWorldSitemap('seo-pages'),
      getJobsSitemap('prompts'),
      getJobsSitemap('jobs'),
      getJobsSitemap('seo-pages'),
    ]);

  return [
    ...staticPages,
    ...toNextSitemap(tools),
    ...toNextSitemap(blogPosts),
    ...toNextSitemap(categories),
    ...toNextSitemap(managedWorldPages),
    ...toNextSitemap(prompts),
    ...toNextSitemap(jobs),
    ...toNextSitemap(managedJobPages),
  ];
}
