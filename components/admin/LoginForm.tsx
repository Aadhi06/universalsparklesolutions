"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function LoginForm({ usingDevDefaults }: { usingDevDefaults: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = event.currentTarget;
    const body = {
      username: String(new FormData(form).get("username") || "").trim(),
      password: String(new FormData(form).get("password") || ""),
    };

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message || "Could not sign in.");
      }
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not sign in. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate>
      {usingDevDefaults ? (
        <p className="rounded-[6px] bg-surface px-4 py-3 text-sm text-body">
          Local sign-in is <span className="font-semibold text-navy">admin</span>{" "}
          / <span className="font-semibold text-navy">sparkle-admin</span>. Set
          ADMIN_PASSWORD before going live.
        </p>
      ) : null}
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-navy">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          defaultValue={usingDevDefaults ? "admin" : ""}
          className="min-h-12 w-full rounded-[6px] border border-line px-3 text-base text-navy outline-none focus:border-blue"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="min-h-12 w-full rounded-[6px] border border-line px-3 text-base text-navy outline-none focus:border-blue"
        />
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
