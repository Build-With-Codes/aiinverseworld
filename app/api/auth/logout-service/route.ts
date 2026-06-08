import { authOptions } from "@/auth";
import { logoutFromAuthService } from "@/lib/auth-service";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: authOptions.secret,
  });

  if (token?.authServiceSessionToken) {
    await logoutFromAuthService(token.authServiceSessionToken);
  }

  return Response.json({ ok: true });
}
