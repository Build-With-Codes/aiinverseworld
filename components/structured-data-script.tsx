import { jsonLd } from "@/lib/structured-data";
import { headers } from "next/headers";

type StructuredDataScriptProps = {
  id?: string;
  data: unknown;
};

export async function StructuredDataScript({ id, data }: StructuredDataScriptProps) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <script
      id={id}
      nonce={nonce}
      suppressHydrationWarning
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
    />
  );
}
