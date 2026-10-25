"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageCircle,
  Settings,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const bottomLinks = [
  { href: "/admin", label: "Home", icon: LayoutDashboard },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/appointments", label: "Visits", icon: CalendarDays },
  { href: "/admin/projects", label: "Work", icon: FolderKanban },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const menuLinks = [
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/admin/chats", label: "Chats", icon: MessageCircle },
  { href: "/admin/users", label: "Staff", icon: UserCog },
];

const sidebarLinks = [
  bottomLinks[0],
  bottomLinks[1],
  bottomLinks[2],
  bottomLinks[3],
  ...menuLinks,
  bottomLinks[4],
];

export function AdminShell({
  username,
  waitingChats = 0,
  children,
}: {
  username: string;
  waitingChats?: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  function current(href: string) {
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
  }

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
        <nav className="mt-3 flex-1" aria-label="Admin">
          <ul className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = current(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-[6px] px-3 text-[0.95rem] font-medium transition-colors",
                      active
                        ? "bg-white/12 text-white"
                        : "text-white/75 hover:bg-white/8 hover:text-white",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden />
                    {link.label === "Visits" ? "Appointments" : link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
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

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-3 py-3 lg:hidden">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-[6px] text-navy"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu className="size-6" aria-hidden />
          </button>
          <Link href="/admin" className="inline-flex items-center">
            <Image
              src="/brand/logo-mark.png"
              alt="Universal Sparkle Solution"
              width={110}
              height={56}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[6px] px-2 text-sm font-semibold text-navy"
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </button>
      </header>
      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/40"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white px-4 py-4 shadow-soft"
            aria-label="More"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold tracking-[0.14em] text-blue uppercase">Menu</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-[6px] text-navy"
                aria-label="Close menu"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <ul className="mt-3 space-y-1">
              {menuLinks.map((link) => {
                const Icon = link.icon;
                const active = current(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex min-h-12 items-center gap-3 rounded-[6px] px-3 text-base font-semibold",
                        active ? "bg-surface text-blue" : "text-navy",
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="size-5" aria-hidden />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      ) : null}

      <InstallHint />

      <div className="lg:pl-64">
        <main
          id="admin-main"
          className="px-4 py-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-10 lg:py-8 lg:pb-8"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
        aria-label="Admin"
      >
        <ul className="grid grid-cols-5">
          {bottomLinks.map((link) => {
            const Icon = link.icon;
            const active = current(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[0.68rem] font-semibold",
                    active ? "text-blue" : "text-muted",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-5" aria-hidden />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <ChatButton pathname={pathname} waitingChats={waitingChats} />
    </div>
  );
}

function ChatButton({
  pathname,
  waitingChats,
}: {
  pathname: string;
  waitingChats: number;
}) {
  const onChat =
    pathname === "/admin/chats" || pathname.includes("/chat");
  if (onChat) return null;

  return (
    <Link
      href="/admin/chats"
      className="fixed right-4 z-40 flex size-14 items-center justify-center rounded-full bg-blue text-white shadow-[0_8px_24px_rgb(20_109_173_/_0.35)] bottom-[calc(5.25rem+env(safe-area-inset-bottom))] lg:bottom-6 lg:right-8"
      aria-label={waitingChats > 0 ? `Chats, ${waitingChats} waiting` : "Chats"}
    >
      <MessageCircle className="size-7" aria-hidden />
      {waitingChats > 0 ? (
        <span className="absolute -top-1 -right-1 flex min-h-6 min-w-6 items-center justify-center rounded-full bg-gold px-1 text-xs font-semibold text-navy">
          {waitingChats > 9 ? "9+" : waitingChats}
        </span>
      ) : null}
    </Link>
  );
}

function InstallHint() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && Boolean(navigator.standalone));
    if (standalone) return;
    setHidden(false);

    function onPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (hidden) return null;

  return (
    <div className="border-b border-line bg-navy px-4 py-3 text-sm text-white lg:hidden">
      <p>Add USS Admin to your home screen for the full-screen app.</p>
      {promptEvent ? (
        <button
          type="button"
          className="mt-2 inline-flex min-h-11 cursor-pointer items-center rounded-[6px] bg-white px-4 font-semibold text-navy"
          onClick={async () => {
            await promptEvent.prompt();
            setHidden(true);
          }}
        >
          Install app
        </button>
      ) : (
        <p className="mt-1 text-white/80">On iPhone: Share, then Add to Home Screen.</p>
      )}
    </div>
  );
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

declare global {
  interface Navigator {
    standalone?: boolean;
  }
}
