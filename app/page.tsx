import type { Metadata } from "next";
import { About } from "@/components/home/About";
import { CurrentWork } from "@/components/home/CurrentWork";
import { FAQ } from "@/components/home/FAQ";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { Quote } from "@/components/home/Quote";
import { ServiceArea } from "@/components/home/ServiceArea";
import { Services } from "@/components/home/Services";
import { StandardsStrip } from "@/components/home/StandardsStrip";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.shortName} | Professional Cleaning Across Melbourne & Regional Victoria`,
  description:
    "Commercial, healthcare, education and builders cleaning across Melbourne Metropolitan Area and Regional Victoria. Request a free quote.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StandardsStrip />
      <Services />
      <About />
      <CurrentWork />
      <Process />
      <ServiceArea />
      <FAQ />
      <Quote />
    </>
  );
}
