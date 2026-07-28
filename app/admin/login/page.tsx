import type { Metadata } from "next";

import { buildNoIndexMetadata } from "@/lib/seo/metadata";
import { Suspense } from "react";

import { AdminLoginForm } from "./login-form";

export const metadata: Metadata = buildNoIndexMetadata("Admin sign in | AiverseWorld");

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-16">
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
