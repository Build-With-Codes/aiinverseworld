import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin sign in | AiverseWorld",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-16">
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
