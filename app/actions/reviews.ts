"use server";

import { addReview } from "@/lib/review-store";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

export type ReviewFormState = {
  error?: string;
  success?: string;
};

export async function submitReview(
  _previousState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: "Please sign in with Google before posting a review." };
  }

  const toolSlug = formData.get("toolSlug")?.toString().trim();
  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment")?.toString().trim() || "";

  if (!toolSlug) {
    return { error: "Missing tool information for this review." };
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { error: "Please choose a rating between 1 and 5." };
  }

  if (comment.length < 20) {
    return { error: "Please write at least 20 characters in your review." };
  }

  await addReview({
    toolSlug,
    rating,
    comment,
    author: session.user.name || session.user.email.split("@")[0],
    role: "Verified Google user",
    userEmail: session.user.email,
    userId: session.user.id || session.user.email,
    userImage: session.user.image || undefined,
  });

  revalidatePath(`/tool/${toolSlug}`);

  return { success: "Your review has been saved." };
}
