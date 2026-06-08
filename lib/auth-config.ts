export const googleAuthEnabled = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

export const authSecretConfigured = Boolean(
  process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
);

export const authServiceConfigured = Boolean(
  process.env.AUTH_SERVICE_BASE_URL || process.env.NEXT_PUBLIC_AUTH_SERVICE_ENABLED,
);
