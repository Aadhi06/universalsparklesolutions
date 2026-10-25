import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Website terms for ${site.name}, covering quote requests, service descriptions and use of this site.`,
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    title: "About these terms",
    paragraphs: [
      `These terms apply when you use ${site.website}, request a quote, or communicate with ${site.name} through this website.`,
      `The website is published by ${site.name} to describe cleaning and facility support services across ${site.serviceArea}.`,
    ],
  },
  {
    title: "Quote requests are not bookings",
    paragraphs: [
      "Submitting a quote form, chat message or email enquiry is a request for contact. It does not create a contract and it does not confirm a booking.",
      "A cleaning visit is only confirmed when our team has agreed the scope, timing and price with you and has confirmed availability.",
      "Last-minute cleaning and other short-notice requests are subject to availability. An enquiry does not guarantee that a team can attend on the day you ask for.",
    ],
  },
  {
    title: "Service descriptions",
    paragraphs: [
      "Service pages and guides on this website are general information. The cleaning work for your premises is set out in the quote or agreement we give you for that job.",
      "End of lease cleaning is a presentation clean before inspection. It does not guarantee a bond refund. The property manager or landlord decides that against the condition report.",
      "Child care cleaning on this website means cleaning of childcare premises. It is not government registration or approval of a childcare service.",
      "Routine cleaning in homes where a person receives support can be quoted as residential house cleaning. That is premises cleaning. It is not a claim of NDIS registration.",
    ],
  },
  {
    title: "Photos and site content",
    paragraphs: [
      "Images on this website show the type of premises and finish we work with. Named-client photos are representative stock images unless we say otherwise. They are not photographs of every contract shown.",
      "Named client references are published only where approval has been given and may be withdrawn.",
      "You must not copy, scrape or reuse our website content, branding or photos for another business without our written permission.",
    ],
  },
  {
    title: "Your responsibilities",
    paragraphs: [
      "Provide accurate contact details and a clear description of the premises and work you need.",
      "Do not upload unlawful, harmful or confidential material that you are not authorised to share.",
      "Make sure someone with authority can give access, power and water for the visit when that is needed for the clean.",
    ],
  },
  {
    title: "Pricing and payment",
    paragraphs: [
      "Prices quoted on request are based on the information you give us. If the site, rooms or scope differ from what was quoted, we may revise the price before work starts.",
      "Payment terms are confirmed with the quote or invoice for each job.",
    ],
  },
  {
    title: "Website availability",
    paragraphs: [
      "We aim to keep the website available, but we do not promise uninterrupted access. We may update, pause or change pages without notice.",
      "External links, including WhatsApp or third-party services, are provided for convenience. We are not responsible for those sites.",
    ],
  },
  {
    title: "Limitation of liability",
    paragraphs: [
      "To the extent permitted by Australian law, we are not liable for loss arising from your use of this website or from relying on general information published here.",
      "Nothing in these terms excludes rights you have under the Australian Consumer Law that cannot be excluded.",
      "Liability for cleaning work itself is governed by the quote or contract for that work, and by applicable law.",
    ],
  },
  {
    title: "Privacy",
    paragraphs: [
      "Personal information collected through this website is handled as described in our Privacy Policy.",
    ],
  },
  {
    title: "Governing law",
    paragraphs: [
      "These terms are governed by the laws of Victoria, Australia. Courts in Victoria have non-exclusive jurisdiction.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      `Questions about these terms can be sent to ${site.email} or by calling ${site.phones[0].label}.`,
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Terms & Conditions"
        intro={`The rules for using this website and requesting a quote from ${site.shortName}.`}
      />
      <section className="bg-white py-12 sm:py-16">
        <Container className="max-w-3xl">
          <p className="text-sm text-muted">Last updated: 25 October 2026</p>
          <div className="mt-8 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-2xl font-semibold text-navy">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-relaxed text-body">
                    {section.title === "Privacy" ? (
                      <>
                        Personal information collected through this website is handled as described in our{" "}
                        <Link href="/privacy-policy" className="font-semibold text-blue">
                          Privacy Policy
                        </Link>
                        .
                      </>
                    ) : paragraph.includes(site.email) ? (
                      <>
                        {paragraph.split(site.email)[0]}
                        <a className="font-medium text-blue" href={`mailto:${site.email}`}>
                          {site.email}
                        </a>
                        {paragraph.split(site.email)[1]}
                      </>
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
