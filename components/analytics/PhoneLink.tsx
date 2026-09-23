"use client";

import { trackPhoneClick } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export function PhoneLink({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      data-analytics="phone_click"
      onClick={() => trackPhoneClick(label)}
      className={cn(className)}
    >
      {children}
    </a>
  );
}
