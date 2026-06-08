export const AUTH_SERVICE_BASE_URL =
  process.env.AUTH_SERVICE_BASE_URL ?? "http://localhost:3002";

type AuthServiceResult = {
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    provider: "email" | "google" | "hybrid";
    createdAt: string;
    updatedAt: string;
  };
  sessionToken: string;
  expiresAt: string;
};

async function postToAuthService<T>(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${AUTH_SERVICE_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = (await response.json()) as {
    data?: T;
    message?: string;
  };

  if (!response.ok || !payload.data) {
    throw new Error(payload.message || "Auth service request failed.");
  }

  return payload.data;
}

export async function signupWithAuthService(input: {
  email: string;
  password: string;
  name: string;
}) {
  return postToAuthService<AuthServiceResult>("/api/auth/signup", input);
}

export async function loginWithAuthService(input: {
  email: string;
  password: string;
}) {
  return postToAuthService<AuthServiceResult>("/api/auth/login", input);
}

export async function loginWithGoogleAuthService(input: { idToken: string }) {
  return postToAuthService<AuthServiceResult>("/api/auth/google", input);
}

export async function logoutFromAuthService(sessionToken: string) {
  const response = await fetch(`${AUTH_SERVICE_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
    cache: "no-store",
  });

  return response.ok;
}
