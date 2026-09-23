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
