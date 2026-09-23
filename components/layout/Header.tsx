"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { navigation, site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  function closeMenus() {
    setMobileOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    document.body.dataset.menuOpen = mobileOpen ? "true" : "";
    return () => {
      document.body.style.overflow = "";
      delete document.body.dataset.menuOpen;
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!servicesRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/97 backdrop-blur-sm">
      <Container className="flex h-14 items-center justify-between gap-3 sm:h-16 lg:h-[72px]">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/brand/logo-mark.png"
            alt=""
            width={148}
            height={75}
            className="h-8 w-auto shrink-0 sm:h-11 lg:h-12"
            priority
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-[0.86rem] leading-tight font-semibold tracking-[-0.03em] text-navy sm:text-[1.02rem]">
              Universal Sparkle
            </span>
            <span className="block truncate text-[0.65rem] leading-tight font-medium tracking-[0.04em] text-muted uppercase sm:text-[0.72rem]">
              Solution Pty Ltd
            </span>
          </span>
          <span className="sr-only">{site.name} home</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navigation.map((item) => {
            if ("children" in item && item.children) {
              return (
                <div key={item.href} className="relative" ref={servicesRef}>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-[6px] px-3 text-[0.95rem] font-medium text-navy transition-colors hover:bg-surface",
                      pathname.startsWith("/services") && "text-blue",
                    )}
                    aria-expanded={servicesOpen}
                    aria-controls={menuId}
                    onClick={() => setServicesOpen((open) => !open)}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform duration-200",
                        servicesOpen && "rotate-180",
                      )}
                      aria-hidden
                    />
                  </button>
                  {servicesOpen ? (
                    <div
                      id={menuId}
                      className="absolute top-full left-0 z-50 mt-1 min-w-[280px] rounded-[6px] border border-line bg-white py-2 shadow-soft"
                    >
                      <Link
                        href="/services"
                        onClick={closeMenus}
                        className="block px-4 py-2.5 text-[0.92rem] font-semibold text-navy hover:bg-surface"
                      >
                        All services
                      </Link>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeMenus}
                          className="block px-4 py-2.5 text-[0.92rem] text-body hover:bg-surface hover:text-navy"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            }

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-[6px] px-3 text-[0.95rem] font-medium text-navy transition-colors hover:bg-surface",
                  active && "text-blue",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ButtonLink href="/contact#quote" className="header-quote-cta">
            Request a Free Quote
          </ButtonLink>
          <button
            type="button"
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-[6px] text-navy hover:bg-surface lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            <span className="sr-only">
              {mobileOpen ? "Close menu" : "Open menu"}
            </span>
          </button>
        </div>
      </Container>

      {mobileOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-line bg-white lg:hidden"
        >
          <Container className="flex max-h-[min(32rem,calc(100dvh-8.5rem))] flex-col gap-1 overflow-y-auto py-3 pb-6">
            {navigation.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenus}
                  className="flex min-h-12 items-center text-[1.05rem] font-medium text-navy"
                >
                  {item.label}
                </Link>
                {"children" in item && item.children
                  ? item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeMenus}
                        className="flex min-h-11 items-center pl-4 text-[0.98rem] text-body"
                      >
                        {child.label}
                      </Link>
                    ))
                  : null}
              </div>
            ))}
            <ButtonLink href="/contact#quote" className="mt-3 w-full" onClick={closeMenus}>
              Request a Free Quote
            </ButtonLink>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
