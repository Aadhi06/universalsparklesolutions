import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { PhoneLink } from "@/components/analytics/PhoneLink";
import { Container } from "@/components/ui/Container";
import { formatSiteAddress, services, site } from "@/lib/site";
import type { PublicContacts } from "@/lib/store/settings";

const primaryServices = services.slice(0, 6);
const companyLinks = [
  { href: "/about", label: "About us" },
  { href: "/services", label: "All services" },
  { href: "/locations", label: "Service areas" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Cleaning guides" },
  { href: "/contact", label: "Request a quote" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms & conditions" },
];

export function Footer({ contacts = site }: { contacts?: PublicContacts }) {
  return (
    <footer className="bg-navy-deep text-white pb-[5.75rem] md:pb-0">
      <Container className="grid gap-10 py-14 md:grid-cols-12 md:gap-10 md:py-16">
        <div className="md:col-span-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-[6px] bg-white px-3 py-2"
            aria-label={contacts.shortName}
          >
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={140}
              height={71}
              className="h-11 w-auto"
            />
          </Link>
          <p className="font-display mt-5 text-xl font-semibold text-white">
            {contacts.shortName}
          </p>
          <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-white/80">
            Professional cleaning for offices, homes, clinics, schools and completed
            builds across Melbourne and Regional Victoria.
          </p>
          <Link
            href="/contact#quote"
            className="mt-5 inline-flex min-h-11 items-center font-semibold text-gold hover:text-white"
          >
            Request a free quote
          </Link>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-[0.75rem] font-semibold tracking-[0.16em] text-gold uppercase">
            Popular services
          </h2>
          <ul className="mt-4 space-y-1">
            {primaryServices.map((service) => (
              <li key={service.href}>
                <Link
                  href={service.href}
                  className="inline-flex min-h-10 items-center text-[0.95rem] text-white/85 transition-colors hover:text-white"
                >
                  {service.shortTitle}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/services"
                className="inline-flex min-h-10 items-center font-semibold text-gold hover:text-white"
              >
                View all services
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-[0.75rem] font-semibold tracking-[0.16em] text-gold uppercase">
            Company
          </h2>
          <ul className="mt-4 space-y-1">
            {companyLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-10 items-center text-[0.95rem] text-white/85 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-[0.75rem] font-semibold tracking-[0.16em] text-gold uppercase">
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-[0.95rem]">
            {contacts.phones.map((phone) => (
              <li key={phone.href}>
                <PhoneLink
                  href={phone.href}
                  label={phone.label}
                  className="inline-flex min-h-10 items-center gap-2 text-white hover:text-gold"
                >
                  <Phone className="size-4 text-gold" aria-hidden />
                  {phone.label}
                </PhoneLink>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${contacts.email}`}
                className="inline-flex min-h-10 items-start gap-2 text-white hover:text-gold"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                <span className="break-all">{contacts.email}</span>
              </a>
            </li>
            <li className="flex items-start gap-2 text-white/80">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <span>
                {formatSiteAddress(contacts.address)}
                <span className="mt-1 block text-white/65">
                  Serving {contacts.serviceArea}
                </span>
              </span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-[0.8rem] text-white/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {contacts.legalName}. All rights reserved.
          </p>
          <p className="text-white/55">
            Website by{" "}
            <a
              href="https://avenque.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 transition-colors hover:text-gold"
            >
              Avenque
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}
