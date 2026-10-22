import type { Metadata } from "next";
import { CurrentWork } from "@/components/home/CurrentWork";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { Quote } from "@/components/home/Quote";
import { Services } from "@/components/home/Services";
import { StandardsStrip } from "@/components/home/StandardsStrip";
import { getSettings } from "@/lib/store/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: { absolute: settings.homeTitle },
    description: settings.homeDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: settings.homeTitle,
      description: settings.homeDescription,
    },
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <StandardsStrip />
      <Services />
      <CurrentWork />
      <Process />
      <Quote />
    </>
  );
}
