import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import {
  loginWithAuthService,
  loginWithGoogleAuthService,
  signupWithAuthService,
} from "@/lib/auth-service";
import { googleAuthEnabled } from "@/lib/auth-config";

type AuthServiceUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: "email" | "google" | "hybrid";
};

type AuthServicePayload = {
  user: AuthServiceUser;
  sessionToken: string;
  expiresAt: string;
};

async function attachGoogleUserToToken(
  token: JWT,
  account?: { provider?: string; id_token?: string | null },
) {
  if (account?.provider !== "google" || !account.id_token) {
    return token;
  }

  const authPayload = await loginWithGoogleAuthService({
    idToken: account.id_token,
  });

  token.sub = authPayload.user.id;
  token.email = authPayload.user.email;
  token.name = authPayload.user.name;
  token.picture = authPayload.user.avatarUrl;
  token.authServiceSessionToken = authPayload.sessionToken;
  token.authServiceSessionExpiresAt = authPayload.expiresAt;
  token.authProvider = authPayload.user.provider;

  return token;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        mode: { label: "Mode", type: "text" },
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim() ?? "";
        const password = credentials?.password ?? "";
        const mode = credentials?.mode ?? "login";
        const name = credentials?.name?.trim() ?? "";

        let payload: AuthServicePayload;

        if (mode === "signup") {
          payload = await signupWithAuthService({ email, password, name });
        } else {
          payload = await loginWithAuthService({ email, password });
        }

        return {
          id: payload.user.id,
          email: payload.user.email,
          name: payload.user.name,
          image: payload.user.avatarUrl,
          authServiceSessionToken: payload.sessionToken,
          authServiceSessionExpiresAt: payload.expiresAt,
          authProvider: payload.user.provider,
        };
      },
    }),
    ...(googleAuthEnabled
      ? [
          GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID ?? "",
            clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.authServiceSessionToken =
          (user as typeof user & { authServiceSessionToken?: string })
            .authServiceSessionToken;
        token.authServiceSessionExpiresAt =
          (user as typeof user & { authServiceSessionExpiresAt?: string })
            .authServiceSessionExpiresAt;
        token.authProvider =
          (user as typeof user & { authProvider?: string }).authProvider;
      }

      return attachGoogleUserToToken(
        token,
        account
          ? {
              provider: account.provider,
              id_token:
                "id_token" in account && typeof account.id_token === "string"
                  ? account.id_token
                  : null,
            }
          : undefined,
      );
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image =
          typeof token.picture === "string" ? token.picture : null;
        session.user.authProvider =
          typeof token.authProvider === "string" ? token.authProvider : undefined;
      }

      return session;
    },
  },
};
