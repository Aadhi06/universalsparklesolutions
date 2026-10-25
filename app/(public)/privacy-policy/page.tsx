import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and stores personal information from website enquiries, chats and marketing emails.`,
  alternates: { canonical: "/privacy-policy" },
};

const sections = [
  {
    title: "Who we are",
    paragraphs: [
      `${site.name} (“we”, “us”) operates ${site.website} and provides cleaning and facility support across ${site.serviceArea}.`,
      `You can contact us about privacy at ${site.email} or by calling ${site.phones[0].label}.`,
    ],
  },
  {
    title: "Information we collect",
    paragraphs: [
      "When you request a quote or contact us, we collect the details you provide. That usually includes your name, email address, phone number, suburb or postcode, company name if you give it, the service you need, how often you want cleaning, your message, and any photos you attach.",
      "If you reply through our enquiry chat, we also store the messages you send so our team can continue the conversation.",
      "If you subscribe to or receive offers by email, we keep your contact details, the services you have enquired about, and whether you have asked to stop receiving marketing.",
      "Technical information such as browser type, device type and pages visited may be recorded by our hosting provider when you use the website. We use this to keep the site working and secure.",
    ],
  },
  {
    title: "How we use your information",
    paragraphs: [
      "We use your information to respond to enquiries, prepare quotes, arrange visits, send service messages, and improve how we look after customers.",
      "We may send offers or updates by email when you have enquired with us and have not unsubscribed. Every marketing email includes a link to stop further offers.",
      "We may send push notifications to staff devices that have opted in inside our admin system. Those alerts help the team reply to new enquiries and appointment changes.",
    ],
  },
  {
    title: "Photos and attachments",
    paragraphs: [
      "Optional photos attached to an enquiry are used only to understand the premises or cleaning requirement. Do not upload images that contain personal documents or other people’s information you are not authorised to share.",
    ],
  },
  {
    title: "Who we share information with",
    paragraphs: [
      "We do not sell personal information.",
      "We may share information with trusted service providers who help us run the website, send email, host the site, or support our systems. They are only given what they need to do that work.",
      "We may disclose information if the law requires it, or if it is needed to protect the company, our staff, or other people.",
    ],
  },
  {
    title: "Storage and security",
    paragraphs: [
      "Enquiry and customer records are stored so our team can manage quotes and follow-up. Access to the admin system is limited to authorised staff.",
      "No online system is completely secure. We take reasonable steps to protect personal information from misuse, interference, loss, and unauthorised access or disclosure.",
    ],
  },
  {
    title: "Cookies and analytics",
    paragraphs: [
      "The website may use cookies or similar tools that are needed for basic operation, such as keeping an admin session signed in.",
      "If analytics tools are switched on, they may collect anonymous or aggregated usage information. Contact details from quote forms are not sent to analytics tools as a marketing list.",
    ],
  },
  {
    title: "Your choices",
    paragraphs: [
      "You can ask us what personal information we hold about you from a website enquiry, and ask us to update or correct it.",
      "You can stop marketing emails at any time through the unsubscribe link in the email, or by writing to us at the address above.",
      "You can ask us to delete an enquiry record where that is practical and we are not required to keep it for a business or legal reason.",
    ],
  },
  {
    title: "Children",
    paragraphs: [
      "This website is intended for adults arranging cleaning for workplaces or homes. We do not knowingly collect personal information from children through the quote form.",
    ],
  },
  {
    title: "Changes to this policy",
    paragraphs: [
      "We may update this privacy policy when our services or systems change. The current version will be published on this page.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Legal"
        title="Privacy Policy"
        intro={`How ${site.shortName} handles personal information collected through this website, enquiries, chats and email offers.`}
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
                    {paragraph.includes(site.email) ? (
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
