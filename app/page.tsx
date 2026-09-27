import type { Metadata } from "next";
import { CurrentWork } from "@/components/home/CurrentWork";
import { Environments } from "@/components/home/Environments";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { Quote } from "@/components/home/Quote";
import { Services } from "@/components/home/Services";
import { StandardsStrip } from "@/components/home/StandardsStrip";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Commercial Cleaning Melbourne | Offices, Healthcare & Builders",
  description:
    "Commercial, healthcare, education and builders cleaning across Melbourne and Regional Victoria. Request a free quote from Universal Sparkle Solution.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `Commercial Cleaning Melbourne | ${site.shortName}`,
    description:
      "Offices, clinics, schools and completed builds cleaned across Melbourne Metropolitan Area and Regional Victoria.",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StandardsStrip />
      <Services />
      <Environments />
      <CurrentWork />
      <Process />
      <Quote />
    </>
  );
}
