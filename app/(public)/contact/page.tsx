import type { Metadata } from "next";
import Image from "next/image";
import { Quote } from "@/components/home/Quote";
import { PageIntro } from "@/components/layout/PageIntro";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { getRuntimeContacts } from "@/lib/store/settings";

export const metadata: Metadata = {
  title: "Contact and Quote",
  description: `Request a cleaning quote from ${site.shortName}, call ${site.primaryPhone.label}, or message us on WhatsApp.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const contacts = await getRuntimeContacts();

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Request a quote or speak with the team"
        intro="Call, email, WhatsApp or send a quote request. We will contact you to discuss your premises and requirements."
      />
      <section className="bg-surface py-10 sm:py-14">
        <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[16/11] overflow-hidden rounded-[6px]">
            <Image
              src="/images/melbourne.jpg"
              alt={`Melbourne skyline and Princes Bridge, representing ${contacts.serviceArea}.`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
          </div>
          <div>
            <h2 className="font-display text-[1.65rem] font-semibold text-navy">
              How to reach us
            </h2>
            <p className="mt-4 leading-relaxed text-body">
              The team works across {contacts.serviceArea}. Tell us the premises
              type, suburb or postcode, and the service you need.
            </p>
            <ul className="mt-6 space-y-3 font-medium text-navy">
              <li>
                Call {contacts.phones[0]?.label}
                {contacts.phones[1] ? ` or ${contacts.phones[1].label}` : ""}
              </li>
              <li>WhatsApp {contacts.whatsapp.numberLabel}</li>
              <li className="break-all">{contacts.email}</li>
            </ul>
          </div>
        </Container>
      </section>
      <Quote />
    </>
  );
}
