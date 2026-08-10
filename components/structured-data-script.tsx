import { jsonLd } from "@/lib/structured-data";

type StructuredDataScriptProps = {
  id?: string;
  data: unknown;
};

export function StructuredDataScript({ id, data }: StructuredDataScriptProps) {
  return (
    <script
      id={id}
      suppressHydrationWarning
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}
