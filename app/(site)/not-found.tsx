import type { Metadata } from "next";

import { SectionHeading } from "@/components/section-heading";
import { cardClass } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildNoIndexMetadata("Page not found | AiverseWorld");

export default function NotFound() {
  return (
    <div className="space-y-8 pb-10 pt-10 sm:pt-14">
      <section className={cardClass({ padding: "lg", radius: "card-lg" })}>
        <SectionHeading
          level="h1"
          eyebrow="404"
          title="We couldn't find that page"
          description="The link may be outdated, mistyped, or the content may have been removed. Try searching the catalog or head back to the homepage."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/" variant="primary">
            Go to homepage
          </Button>
          <Button href="/search" variant="outline">
            Search tools
          </Button>
        </div>
      </section>
    </div>
  );
}
