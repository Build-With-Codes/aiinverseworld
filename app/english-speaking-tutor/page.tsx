import type { Metadata } from "next";

import { buildUrl } from "@/lib/seo";
import { EnglishTutorClient } from "./tutor-client";

export const metadata: Metadata = {
  title: "AI English Speaking Tutor | AiverseWorld",
  description:
    "Practice spoken English with a real-time AI tutor that listens, corrects grammar, scores fluency, and speaks back.",
  alternates: { canonical: buildUrl("/english-speaking-tutor") },
};

export default function EnglishSpeakingTutorPage() {
  return <EnglishTutorClient />;
}
