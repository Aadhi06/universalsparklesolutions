import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Draft privacy information for ${site.name}. This wording is for review and is not approved company policy.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Privacy Policy"
        intro="This is a draft for review. It is not approved company policy and should be replaced with confirmed legal wording before public launch."
      />
      <section className="bg-white py-12 sm:py-16">
        <Container className="max-w-3xl space-y-5 leading-relaxed text-body">
          <p>
            {site.name} collects the information you submit through the quote
            form, including your name, contact details, location and message,
            so we can respond to your enquiry.
          </p>
          <p>
            Optional photos attached to an enquiry are used only to understand
            the premises or cleaning requirement. Enquiry attachments will be
            stored privately once the Laravel backend is in place.
          </p>
          <p>
            We do not sell personal information. Contact details submitted
            through the website are not sent to analytics tools.
          </p>
          <p>
            To ask about personal information held from an enquiry, email{" "}
            <a className="font-medium text-blue" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
