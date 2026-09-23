import type { Metadata } from "next";
import { Quote } from "@/components/home/Quote";
import { PageIntro } from "@/components/layout/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact and Quote",
  description: `Request a cleaning quote from ${site.shortName} or call ${site.primaryPhone.label}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Request a quote or speak with the team"
        intro="Call, email or send a quote request. We will contact you to discuss your premises and requirements."
      />
      <Quote />
    </>
  );
}
