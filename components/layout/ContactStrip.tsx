import { Mail, MapPin, Phone } from "lucide-react";
import { PhoneLink } from "@/components/analytics/PhoneLink";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function ContactStrip() {
  return (
    <div className="bg-navy text-white">
      <Container className="flex min-h-10 items-center justify-between gap-4 py-2 text-[0.8rem] leading-none sm:min-h-11">
        <p className="flex min-w-0 items-center gap-2 font-medium tracking-[0.01em]">
          <MapPin className="hidden size-3.5 shrink-0 text-gold sm:block" aria-hidden />
          <span className="sm:hidden">Melbourne & Regional Victoria</span>
          <span className="hidden sm:inline">Serving {site.serviceArea}</span>
        </p>
        <div className="hidden items-center gap-5 md:flex">
          {site.phones.map((phone) => (
            <PhoneLink
              key={phone.href}
              href={phone.href}
              label={phone.label}
              className="inline-flex min-h-8 items-center gap-2 text-white/90 transition-colors hover:text-white"
            >
              <Phone className="size-3.5 text-gold" aria-hidden />
              {phone.label}
            </PhoneLink>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="inline-flex min-h-8 items-center gap-2 text-white/90 transition-colors hover:text-white"
          >
            <Mail className="size-3.5 text-gold" aria-hidden />
            {site.email}
          </a>
        </div>
      </Container>
    </div>
  );
}
