"use server";

import { redirect } from "next/navigation";

import { createProblem } from "@/lib/problem-store";

export async function submitProblemAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const industry = String(formData.get("industry") ?? "").trim();
  const frequency = String(formData.get("frequency") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const painScore = Number(formData.get("painScore") ?? 0);

  if (!title || !description || !industry || !frequency) {
    throw new Error("Missing required fields.");
  }

  if (!Number.isFinite(painScore) || painScore < 1 || painScore > 10) {
    throw new Error("Pain score must be between 1 and 10.");
  }

  const problem = await createProblem({
    title,
    description,
    industry,
    frequency,
    painScore,
    email: email || undefined,
  });

  redirect(`/problems/${problem.id}`);
}
