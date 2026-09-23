import { Mail, MapPin, Phone } from "lucide-react";
import { PhoneLink } from "@/components/analytics/PhoneLink";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export function Quote() {
  return (
    <section id="quote" className="scroll-mt-24 bg-white py-12 sm:py-20 lg:py-24">
      <Container className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="rounded-[6px] bg-navy px-5 py-7 text-white sm:px-8 sm:py-10">
          <h2 className="font-display text-[1.65rem] leading-[1.2] font-semibold text-pretty text-white sm:text-[2.2rem]">
            Tell Us About Your Cleaning Requirements
          </h2>
          <p className="mt-4 leading-relaxed text-white/80">
            Share a little about the premises and the service you need. We
            will contact you to discuss the scope. A quote request is not an
            automatic booking.
          </p>
          <ul className="mt-8 space-y-4 text-[0.98rem]">
            {site.phones.map((phone) => (
              <li key={phone.href}>
                <PhoneLink
                  href={phone.href}
                  label={phone.label}
                  className="inline-flex min-h-11 items-center gap-3 text-white hover:text-gold"
                >
                  <Phone className="size-4 text-gold" aria-hidden />
                  {phone.label}
                </PhoneLink>
              </li>
            ))}
            <li>
              <a
                href={site.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-3 text-white hover:text-gold"
              >
                <span className="inline-flex size-4 items-center justify-center text-gold" aria-hidden>
                  <svg viewBox="0 0 24 24" className="size-4">
                    <path
                      fill="currentColor"
                      d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02m-7.01 15.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.67 8.23-8.24 8.23m4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74 1.49.64 1.84.7 2.49.59.4-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.17-.48-.29"
                    />
                  </svg>
                </span>
                WhatsApp {site.whatsapp.numberLabel}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-11 items-start gap-3 text-white hover:text-gold"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                <span className="break-all">{site.email}</span>
              </a>
            </li>
            <li className="flex items-start gap-3 text-white/80">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              {site.serviceArea}
            </li>
          </ul>
        </div>
        <QuoteForm />
      </Container>
    </section>
  );
}
