import { promises as fs } from "node:fs";
import path from "node:path";

import { reviews as seededReviews } from "@/lib/site-data";

export type StoredReview = {
  id: string;
  toolSlug: string;
  author: string;
  role: string;
  rating: number;
  comment: string;
  userId: string;
  userEmail: string;
  userImage?: string;
  createdAt: string;
};

type AddReviewInput = {
  toolSlug: string;
  author: string;
  role: string;
  rating: number;
  comment: string;
  userId: string;
  userEmail: string;
  userImage?: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const reviewFile = path.join(dataDirectory, "reviews.json");

function createSeedData(): StoredReview[] {
  return Object.entries(seededReviews).flatMap(([toolSlug, toolReviews]) =>
    toolReviews.map((review, index) => ({
      id: `${toolSlug}-${index + 1}`,
      toolSlug,
      author: review.author,
      role: review.role,
      rating: review.rating,
      comment: review.comment,
      userId: `seed-${toolSlug}-${index + 1}`,
      userEmail: `seed-${toolSlug}-${index + 1}@aiverseworld.com`,
      createdAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
    })),
  );
}

async function ensureStore() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(reviewFile);
  } catch {
    await fs.writeFile(reviewFile, JSON.stringify(createSeedData(), null, 2), "utf8");
  }
}

async function readAllReviews() {
  await ensureStore();
  const raw = await fs.readFile(reviewFile, "utf8");

  return JSON.parse(raw) as StoredReview[];
}

async function writeAllReviews(reviews: StoredReview[]) {
  await fs.writeFile(reviewFile, JSON.stringify(reviews, null, 2), "utf8");
}

export async function getReviewsForTool(toolSlug: string) {
  const reviews = await readAllReviews();

  return reviews
    .filter((review) => review.toolSlug === toolSlug)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function addReview(input: AddReviewInput) {
  const reviews = await readAllReviews();

  const existingIndex = reviews.findIndex(
    (review) => review.toolSlug === input.toolSlug && review.userId === input.userId,
  );

  const nextReview: StoredReview = {
    id: existingIndex >= 0 ? reviews[existingIndex].id : crypto.randomUUID(),
    toolSlug: input.toolSlug,
    author: input.author,
    role: input.role,
    rating: input.rating,
    comment: input.comment,
    userId: input.userId,
    userEmail: input.userEmail,
    userImage: input.userImage,
    createdAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    reviews[existingIndex] = nextReview;
  } else {
    reviews.unshift(nextReview);
  }

  await writeAllReviews(reviews);

  return nextReview;
}
