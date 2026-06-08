import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      authProvider?: string;
    };
  }

  interface User {
    authServiceSessionToken?: string;
    authServiceSessionExpiresAt?: string;
    authProvider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    authServiceSessionToken?: string;
    authServiceSessionExpiresAt?: string;
    authProvider?: string;
  }
}
