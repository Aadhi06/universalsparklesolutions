"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FolderKanban, Inbox, LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav aria-label="Admin">
      <ul className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const current =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-[6px] px-3 text-[0.95rem] font-medium transition-colors",
                  current
                    ? "bg-white/12 text-white"
                    : "text-white/75 hover:bg-white/8 hover:text-white",
                )}
                aria-current={current ? "page" : undefined}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <div className="min-h-dvh bg-surface">
      <a href="#admin-main" className="skip-link">
        Skip to admin content
      </a>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-navy-deep px-4 py-5 text-white lg:flex">
        <Link href="/admin" className="inline-flex items-center rounded-[6px] bg-white px-2 py-1.5">
          <Image
            src="/brand/logo-mark.png"
            alt="Universal Sparkle Solution"
            width={120}
            height={61}
            className="h-9 w-auto"
          />
        </Link>
        <p className="mt-5 px-1 text-[0.72rem] font-semibold tracking-[0.16em] text-gold uppercase">
          Admin
        </p>
        <div className="mt-3 flex-1">{nav}</div>
        <div className="border-t border-white/10 pt-4">
          <p className="px-3 text-sm text-white/70">Signed in as {username}</p>
          <Link
            href="/"
            className="mt-2 flex min-h-11 items-center px-3 text-sm text-white/80 hover:text-white"
          >
            View website
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="mt-1 flex min-h-11 w-full cursor-pointer items-center gap-2 px-3 text-left text-sm text-white/80 hover:text-white"
          >
            <LogOut className="size-4" aria-hidden />
            Sign out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" className="inline-flex items-center rounded-[6px] bg-white">
          <Image
            src="/brand/logo-mark.png"
            alt="Universal Sparkle Solution"
            width={110}
            height={56}
            className="h-8 w-auto"
          />
        </Link>
        <button
          type="button"
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-[6px] border border-line text-navy"
          aria-expanded={open}
          aria-controls="admin-mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </header>

      {open ? (
        <div
          id="admin-mobile-nav"
          className="fixed inset-0 z-40 bg-navy-deep px-4 py-5 text-white lg:hidden"
        >
          <div className="mb-6 flex items-center justify-between">
            <p className="font-display text-lg font-semibold">Admin</p>
            <button
              type="button"
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-[6px] border border-white/20"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          {nav}
          <button
            type="button"
            onClick={signOut}
            className="mt-8 flex min-h-12 w-full cursor-pointer items-center gap-2 rounded-[6px] border border-white/15 px-3 text-white"
          >
            <LogOut className="size-4" aria-hidden />
            Sign out
          </button>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <main id="admin-main" className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
