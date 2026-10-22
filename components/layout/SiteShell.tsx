import { ContactStrip } from "@/components/layout/ContactStrip";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileStickyActions } from "@/components/layout/MobileStickyActions";
import { SkipLink } from "@/components/layout/SkipLink";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { getRuntimeContacts } from "@/lib/store/settings";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const contacts = await getRuntimeContacts();

  return (
    <>
      <SkipLink />
      <ContactStrip contacts={contacts} />
      <Header contacts={contacts} />
      <main id="main-content" className="flex-1 overflow-x-clip" tabIndex={-1}>
        {children}
      </main>
      <Footer contacts={contacts} />
      <MobileStickyActions contacts={contacts} />
      <WhatsAppButton contacts={contacts} />
    </>
  );
}
