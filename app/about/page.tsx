import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { StructuredDataScript } from "@/components/structured-data-script";
import { buildUrl, defaultOpenGraphImage } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About AiverseWorld | AI Tool Discovery Platform",
  description: "Learn about AiverseWorld - a platform dedicated to helping people and organizations discover, compare, understand, and adopt artificial intelligence technologies.",
  keywords: "AI tools, AI discovery, AI comparison, artificial intelligence platform, AI adoption, AI solutions, machine learning tools",
  alternates: { canonical: buildUrl("/about") },
  openGraph: {
    title: "About AiverseWorld | AI Tool Discovery Platform",
    description: "AiverseWorld is a trusted platform for discovering, comparing, and understanding AI technologies. Learn about our mission and vision.",
    type: "website",
    url: "https://aiinverseworld.com/about",
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "About AiverseWorld | AI Tool Discovery Platform",
    description: "Discover how AiverseWorld helps individuals and organizations navigate the AI landscape with clarity and confidence.",
    images: [defaultOpenGraphImage.url],
  },
};

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AiverseWorld",
    "description": "A platform dedicated to helping people and organizations discover, compare, understand, and adopt artificial intelligence technologies",
    "url": "https://aiinverseworld.com",
    "sameAs": [
      "https://twitter.com/aiinverseworld",
      "https://linkedin.com/company/aiinverseworld"
    ]
  };

  return (
    <>
      <StructuredDataScript id="about-schema" data={structuredData} />
      <ContentPage
        eyebrow="Company"
        title="About AiverseWorld"
        description="AiverseWorld is a platform dedicated to helping people and organizations discover, compare, understand, and adopt artificial intelligence technologies."
        theme="company"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-cyan-100">Our Mission</h2>
          <p className="text-base leading-8 text-slate-300">
            Our mission is to make AI more accessible through trusted tool discovery, unbiased comparisons, practical guides, industry insights, and educational resources. We help users navigate the rapidly evolving AI landscape with clarity and confidence.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-cyan-100">What We Provide</h2>
          <p className="text-base leading-8 text-slate-300">
            AiverseWorld brings together AI tools, product comparisons, reviews, tutorials, guides, industry news, and technology insights in one place.
          </p>
          <p className="text-base leading-8 text-slate-300">
            Our platform helps users:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>Discover AI tools across multiple categories</li>
            <li>Compare products, features, and pricing</li>
            <li>Explore reviews and evaluations</li>
            <li>Learn through practical guides and tutorials</li>
            <li>Stay informed about AI trends and developments</li>
            <li>Research emerging technologies and use cases</li>
            <li>Make smarter technology decisions</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-cyan-100">Who We Serve</h2>
          <p className="text-base leading-8 text-slate-300">
            AiverseWorld is designed for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li>Business leaders and entrepreneurs</li>
            <li>Developers and technology professionals</li>
            <li>Marketers and content creators</li>
            <li>Students and researchers</li>
            <li>Startups and growing teams</li>
            <li>Organizations evaluating AI solutions</li>
            <li>Anyone interested in artificial intelligence</li>
          </ul>
          <p className="text-base leading-8 text-slate-300 mt-4">
            Whether you&apos;re looking for the right AI tool, learning about emerging technologies, researching industry trends, or exploring the future of artificial intelligence, AiverseWorld provides the resources and insights to help you move forward with confidence.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-cyan-100">Our Vision</h2>
          <p className="text-base leading-8 text-slate-300">
            We believe artificial intelligence will reshape how people work, learn, create, and innovate. AiverseWorld aims to become a trusted destination where individuals and organizations can discover reliable information, evaluate AI solutions, and stay ahead in an AI-powered world.
          </p>
        </div>
      </ContentPage>
    </>
  );
}
