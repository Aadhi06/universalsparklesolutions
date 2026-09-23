import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { PhoneLink } from "@/components/analytics/PhoneLink";
import { Container } from "@/components/ui/Container";
import { navigation, services, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white pb-[5.75rem] md:pb-0">
      <Container className="grid gap-10 py-12 md:grid-cols-12 md:gap-12 md:py-20">
        <div className="md:col-span-5">
          <div className="inline-flex items-center rounded-[6px] bg-white px-3 py-2">
            <Image
              src="/brand/logo-mark.png"
              alt=""
              width={140}
              height={71}
              className="h-12 w-auto"
            />
          </div>
          <p className="mt-5 font-display text-lg font-semibold text-white">
            {site.name}
          </p>
          <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-white/75">
            A professional commercial cleaning and facility support company
            delivering consistent, high-quality services across different
            industries in {site.serviceArea}.
          </p>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-[0.78rem] font-semibold tracking-[0.16em] text-gold uppercase">
            Services
          </h2>
          <ul className="mt-4 space-y-2.5">
            {services.map((service) => (
              <li key={service.href}>
                <Link
                  href={service.href}
                  className="inline-flex min-h-11 items-center text-[0.95rem] text-white/80 transition-colors hover:text-white"
                >
                  {service.shortTitle}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/services"
                className="inline-flex min-h-11 items-center text-[0.95rem] text-white/80 transition-colors hover:text-white"
              >
                All services
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-[0.78rem] font-semibold tracking-[0.16em] text-gold uppercase">
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-[0.95rem] text-white/80 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-[0.78rem] font-semibold tracking-[0.16em] text-gold uppercase">
            Contact
          </h2>
          <ul className="mt-4 space-y-3 text-[0.95rem]">
            {site.phones.map((phone) => (
              <li key={phone.href}>
                <PhoneLink
                  href={phone.href}
                  label={phone.label}
                  className="inline-flex min-h-11 items-center gap-2 text-white/85 hover:text-white"
                >
                  <Phone className="size-4 text-gold" aria-hidden />
                  {phone.label}
                </PhoneLink>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex min-h-11 items-start gap-2 text-white/85 hover:text-white"
              >
                <Mail className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
                <span className="break-all">{site.email}</span>
              </a>
            </li>
            <li className="flex items-start gap-2 text-white/75">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              {site.serviceArea}
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-[0.82rem] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy-policy" className="inline-flex min-h-11 items-center hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
