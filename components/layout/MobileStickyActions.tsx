"use client";

import { FileText, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { trackPhoneClick } from "@/lib/analytics";

export function MobileStickyActions() {
  const pathname = usePathname();
  const onQuote = pathname === "/contact";

  return (
    <div className="mobile-sticky-actions fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/96 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgb(16_35_66_/_0.08)] md:hidden">
      <div className="grid grid-cols-2 gap-2 px-3 py-2.5">
        <a
          href={site.primaryPhone.href}
          data-analytics="phone_click"
          onClick={() => trackPhoneClick(site.primaryPhone.label)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] border border-navy/15 bg-white text-[0.95rem] font-semibold text-navy"
        >
          <Phone className="size-4" aria-hidden />
          Call Us
        </a>
        <a
          href={onQuote ? "#quote" : "/contact#quote"}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] bg-blue text-[0.95rem] font-semibold text-white"
        >
          <FileText className="size-4" aria-hidden />
          Get a Quote
        </a>
      </div>
    </div>
  );
}
