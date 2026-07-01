import type { Metadata } from "next";

import { EnglishTutorClient } from "./tutor-client";

export const metadata: Metadata = {
  title: "AI English Speaking Tutor | AiverseWorld",
  description:
    "Practice spoken English with a real-time AI tutor that listens, corrects grammar, scores fluency, and speaks back.",
};

export default function EnglishSpeakingTutorPage() {
  return <EnglishTutorClient />;
}
