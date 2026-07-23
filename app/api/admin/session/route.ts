import { cookies } from "next/headers";

import { ADMIN_COOKIE_NAME } from "@/lib/admin-constants";
import { isValidAdminPassword } from "@/lib/admin-proxy";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isValidAdminPassword(password)) {
    return Response.json({ error: "Invalid password." }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return Response.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  return Response.json({ ok: true });
}
