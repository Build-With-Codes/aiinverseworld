import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { googleAuthEnabled } from "@/lib/auth-config";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  providers: googleAuthEnabled
    ? [
        GoogleProvider({
          clientId: process.env.AUTH_GOOGLE_ID ?? "",
          clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
        }),
      ]
    : [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
};
