import Image from "next/image";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminCredentials } from "@/lib/admin/session";

export default function AdminLoginPage() {
  const credentials = getAdminCredentials();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-md rounded-[6px] border border-line bg-white p-6 shadow-soft sm:p-8">
        <div className="inline-flex items-center rounded-[6px] bg-white">
          <Image
            src="/brand/logo-mark.png"
            alt="Universal Sparkle Solution"
            width={140}
            height={71}
            className="h-12 w-auto"
          />
        </div>
        <h1 className="font-display mt-6 text-[1.7rem] font-semibold text-navy">
          Staff sign in
        </h1>
        <p className="mt-2 text-body">
          Manage enquiries, published work and site details.
        </p>
        <Suspense>
          <LoginForm usingDevDefaults={credentials.usingDevDefaults} />
        </Suspense>
      </div>
    </div>
  );
}
