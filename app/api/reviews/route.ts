import { addReview, getReviewsForTool } from "@/lib/review-store";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const toolSlug = searchParams.get("toolSlug");

  if (!toolSlug) {
    return NextResponse.json(
      { error: "toolSlug is required." },
      { status: 400 },
    );
  }

  const reviews = await getReviewsForTool(toolSlug);

  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    toolSlug?: string;
    rating?: number;
    comment?: string;
  };

  if (!body.toolSlug || !body.rating || !body.comment) {
    return NextResponse.json(
      { error: "toolSlug, rating, and comment are required." },
      { status: 400 },
    );
  }

  const review = await addReview({
    toolSlug: body.toolSlug,
    rating: body.rating,
    comment: body.comment,
    author: session.user.name || session.user.email.split("@")[0],
    role: "Verified Google user",
    userEmail: session.user.email,
    userId: session.user.id || session.user.email,
    userImage: session.user.image || undefined,
  });

  return NextResponse.json({ review }, { status: 201 });
}
