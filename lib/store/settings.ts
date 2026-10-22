import { site } from "@/lib/site";
import { readJsonFile, writeJsonFile } from "@/lib/store/io";

const FILE = "settings.json";

export type AdminSettings = {
  email: string;
  phoneOne: string;
  phoneTwo: string;
  whatsappNumber: string;
  serviceArea: string;
  homeTitle: string;
  homeDescription: string;
};

export const defaultSettings: AdminSettings = {
  email: site.email,
  phoneOne: site.phones[0].label,
  phoneTwo: site.phones[1].label,
  whatsappNumber: site.whatsapp.numberLabel,
  serviceArea: site.serviceArea,
  homeTitle: "Cleaning Melbourne | Offices, Homes, Healthcare & Builders",
  homeDescription:
    "Office, home, healthcare, education and builders cleaning across Melbourne and Regional Victoria. Request a free quote from Universal Sparkle Solution.",
};

export function phoneHref(label: string) {
  const compact = label.replace(/\s+/g, "");
  if (compact.startsWith("+")) return `tel:${compact}`;
  if (compact.startsWith("0")) return `tel:+61${compact.slice(1)}`;
  return `tel:${compact}`;
}

export function phoneTracking(label: string) {
  return label.replace(/\D/g, "").slice(-4) || "phone";
}

export function whatsappHref(numberLabel: string) {
  const digits = numberLabel.replace(/\D/g, "");
  const international = digits.startsWith("0") ? `61${digits.slice(1)}` : digits;
  return `https://wa.me/${international}?text=Hello%2C%20I%20would%20like%20to%20discuss%20cleaning%20for%20my%20premises.`;
}

export async function getSettings() {
  const stored = await readJsonFile<Partial<AdminSettings>>(FILE, {});
  return { ...defaultSettings, ...stored };
}

export async function saveSettings(settings: AdminSettings) {
  await writeJsonFile(FILE, settings);
}

export async function getRuntimeContacts() {
  const settings = await getSettings();
  const phones = [
    {
      label: settings.phoneOne,
      href: phoneHref(settings.phoneOne),
      tracking: phoneTracking(settings.phoneOne),
    },
    {
      label: settings.phoneTwo,
      href: phoneHref(settings.phoneTwo),
      tracking: phoneTracking(settings.phoneTwo),
    },
  ].filter((phone) => phone.label.trim());

  const primary = phones[0] ?? {
    label: site.primaryPhone.label,
    href: site.primaryPhone.href,
    tracking: "0402",
  };

  return {
    name: site.name,
    shortName: site.shortName,
    legalName: site.legalName,
    tagline: site.tagline,
    serviceArea: settings.serviceArea,
    email: settings.email,
    website: site.website,
    phones,
    primaryPhone: { label: primary.label, href: primary.href },
    whatsapp: {
      href: whatsappHref(settings.whatsappNumber),
      label: site.whatsapp.label,
      numberLabel: settings.whatsappNumber,
    },
  };
}

export type RuntimeContacts = Awaited<ReturnType<typeof getRuntimeContacts>>;

export type PublicContacts = {
  name: string;
  email: string;
  serviceArea: string;
  phones: readonly { label: string; href: string }[];
  primaryPhone: { label: string; href: string };
  whatsapp: { href: string; label: string; numberLabel: string };
};
