import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Draft website terms for ${site.name}. This wording is for review and is not approved company policy.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Terms & Conditions"
        intro="This is a draft for review. It is not approved company policy and should be replaced with confirmed legal wording before public launch."
      />
      <section className="bg-white py-12 sm:py-16">
        <Container className="max-w-3xl space-y-5 leading-relaxed text-body">
          <p>
            This website is published by {site.name} to describe cleaning and
            facility support services and to receive quote requests.
          </p>
          <p>
            Submitting a quote form is a request for contact. It does not
            create a contract or confirm a booking.
          </p>
          <p>
            Service descriptions on this website are general. The agreed
            cleaning scope, frequency and price are confirmed directly with
            the company before work starts.
          </p>
          <p>
            Named client references are published only where approval has been
            given and may be withdrawn.
          </p>
        </Container>
      </section>
    </>
  );
}
