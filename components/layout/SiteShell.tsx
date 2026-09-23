import { ContactStrip } from "@/components/layout/ContactStrip";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileStickyActions } from "@/components/layout/MobileStickyActions";
import { SkipLink } from "@/components/layout/SkipLink";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <ContactStrip />
      <Header />
      <main id="main-content" className="flex-1 overflow-x-clip" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <MobileStickyActions />
      <WhatsAppButton />
    </>
  );
}
