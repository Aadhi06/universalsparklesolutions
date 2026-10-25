"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserAction } from "@/app/admin/user-actions";

export function UserCreateForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [login, setLogin] = useState<{ name: string; username: string; password: string } | null>(
    null,
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    const result = await createUserAction(data);
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setLogin({
      name: String(data.get("name") ?? "").trim(),
      username: String(data.get("username") ?? "").trim().toLowerCase(),
      password: String(data.get("password") ?? ""),
    });
    form.reset();
    router.refresh();
  }

  if (login) {
    return (
      <section className="rounded-[6px] border border-line bg-white p-5">
        <h2 className="font-display text-xl font-semibold text-navy">
          Give this login to {login.name}
        </h2>
        <p className="mt-2 text-body">
          They can sign in at the admin page. This password is not shown again.
        </p>
        <dl className="mt-4 space-y-2">
          <div>
            <dt className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">Username</dt>
            <dd className="mt-1 font-semibold text-navy">{login.username}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-[0.08em] text-muted uppercase">Password</dt>
            <dd className="mt-1 font-semibold text-navy">{login.password}</dd>
          </div>
        </dl>
        <button
          type="button"
          className="mt-4 inline-flex min-h-12 cursor-pointer items-center font-semibold text-blue"
          onClick={() => setLogin(null)}
        >
          Add another person
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[6px] border border-line bg-white p-5">
      <h2 className="font-display text-xl font-semibold text-navy">New staff login</h2>
      <Field label="Name" name="name" autoComplete="name" required />
      <Field label="Username" name="username" autoComplete="off" required />
      <Field label="Password" name="password" type="text" autoComplete="new-password" required />
      <p className="-mt-2 text-sm text-muted">At least 8 characters. You will share this with them.</p>
      <label className="block text-sm font-medium text-navy" htmlFor="role">
        Access
      </label>
      <select
        id="role"
        name="role"
        defaultValue="Staff"
        className="min-h-12 w-full rounded-[6px] border border-line px-3 text-base text-navy"
      >
        <option value="Staff">Staff — day to day admin</option>
        <option value="Admin">Admin — can also create logins</option>
      </select>
      {error ? (
        <p className="text-sm text-navy" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-[6px] bg-blue px-5 font-semibold text-white disabled:opacity-60 sm:w-auto"
      >
        {saving ? "Saving…" : "Create login"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-navy">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        minLength={name === "password" ? 8 : name === "username" ? 3 : undefined}
        autoComplete={autoComplete}
        className="min-h-12 w-full rounded-[6px] border border-line px-3 text-base text-navy outline-none focus:border-blue"
      />
    </div>
  );
}
