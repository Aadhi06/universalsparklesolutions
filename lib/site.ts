export const site = {
  name: "Universal Sparkle Solution Pty Ltd",
  shortName: "Universal Sparkle Solution",
  legalName: "Universal Sparkle Solution Pty Ltd",
  tagline: "Cleaning & Facility Support",
  serviceArea: "Melbourne Metropolitan Area & Regional Victoria",
  email: "admin@universalsparklesolution.com.au",
  website: "https://universalsparklesolution.com.au",
  phones: [
    { label: "0402 603 869", href: "tel:+61402603869", tracking: "0402" },
    { label: "0433 708 709", href: "tel:+61433708709", tracking: "0433" },
  ],
  primaryPhone: { label: "0402 603 869", href: "tel:+61402603869" },
} as const;

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    try {
      return new URL(fromEnv).origin;
    } catch {
      // Use the published site URL when the env value is not a valid URL.
    }
  }

  return site.website;
}

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  {
    href: "/services",
    label: "Services",
    children: [
      { href: "/services/commercial-cleaning", label: "Commercial Cleaning" },
      {
        href: "/services/medical-healthcare-cleaning",
        label: "Medical & Healthcare Cleaning",
      },
      {
        href: "/services/education-facility-cleaning",
        label: "Education Facility Cleaning",
      },
      {
        href: "/services/construction-builders-cleaning",
        label: "Construction & Builders Cleaning",
      },
    ],
  },
  { href: "/#current-work", label: "Our Work" },
  { href: "/contact", label: "Contact" },
] as const;

export const services = [
  {
    slug: "commercial-cleaning",
    title: "Commercial Cleaning",
    shortTitle: "Commercial Cleaning",
    href: "/services/commercial-cleaning",
    summary:
      "Scheduled cleaning for offices and warehouses, planned around your operating hours and the way each workplace is used.",
    description:
      "We clean offices and warehouses with a scope matched to each site. Work can include workstations, meeting rooms, amenities, kitchens, reception areas and warehouse floors.",
    image: "/images/service-commercial.jpg",
    imageAlt:
      "A bright, recently cleaned commercial office corridor with glass-fronted rooms and a polished floor.",
  },
  {
    slug: "medical-healthcare-cleaning",
    title: "Medical & Healthcare Cleaning",
    shortTitle: "Medical & Healthcare",
    href: "/services/medical-healthcare-cleaning",
    summary:
      "Methodical cleaning for medical clinics and allied health centres, including high-touch surfaces and clinical support areas.",
    description:
      "Healthcare environments need a consistent, careful clean. We support medical clinics and allied health centres with routines that cover consulting rooms, reception, waiting areas, amenities and high-touch surfaces.",
    image: "/images/service-healthcare.jpg",
    imageAlt:
      "A clean, unused medical treatment room with an examination table and clinical lighting.",
  },
  {
    slug: "education-facility-cleaning",
    title: "Education Facility Cleaning",
    shortTitle: "Schools & Childcare",
    href: "/services/education-facility-cleaning",
    summary:
      "Cleaning for schools and childcare centres, with attention to classrooms, amenities and shared learning spaces.",
    description:
      "Education facilities need a reliable clean that keeps classrooms, amenities and shared areas ready for the next day. We work with schools and childcare centres to agree a practical scope.",
    image: "/images/service-education.jpg",
    imageAlt:
      "An empty classroom with neatly arranged desks, a clean floor and a chalkboard at the front.",
  },
  {
    slug: "construction-builders-cleaning",
    title: "Construction & Builders Cleaning",
    shortTitle: "Construction & Builders",
    href: "/services/construction-builders-cleaning",
    summary:
      "Detailed final cleaning of completed properties before occupancy inspection and handover.",
    description:
      "Builders cleaning focuses on the detail needed before inspection and handover. We remove construction dust and leave completed interiors presentation-ready. Cleaning supports handover; it does not replace building certification or an occupancy permit.",
    image: "/images/service-builders.jpg",
    imageAlt:
      "A completed modern home interior with clean floors, joinery and living areas ready for handover.",
  },
] as const;

export const standards = [
  {
    title: "Experienced Team",
    text: "Cleaning staff who understand commercial and facility environments.",
  },
  {
    title: "Modern Equipment",
    text: "The right tools for offices, clinics, schools and completed builds.",
  },
  {
    title: "Responsible Products",
    text: "Environmentally responsible products selected for the task.",
  },
  {
    title: "Quality Inspections",
    text: "Checks and reporting so the agreed standard is maintained.",
  },
] as const;

export const aboutPoints = [
  "Cleaning plans matched to your premises",
  "Consistent service delivery",
  "Clear communication and quality checks",
] as const;

export const processSteps = [
  {
    number: "01",
    title: "Tell Us What You Need",
    text: "Share your premises type, location and the cleaning outcome you are looking for.",
  },
  {
    number: "02",
    title: "Site Assessment Where Required",
    text: "Some sites need a walkthrough so the scope, access and any specialist requirements are clear.",
  },
  {
    number: "03",
    title: "Agree Your Cleaning Plan",
    text: "We confirm the areas, frequency and responsibilities before work begins.",
  },
  {
    number: "04",
    title: "Cleaning and Quality Checks",
    text: "The team delivers the agreed clean, with inspections and reporting where the contract requires it.",
  },
] as const;

export type Project = {
  id: string;
  title: string;
  category: string;
  summary: string;
  published: boolean;
  isNamedClient: boolean;
};

export const projects: Project[] = [
  {
    id: "westgate-medical-centre",
    title: "Westgate Medical Centre",
    category: "Healthcare",
    summary:
      "Daily cleaning of consulting rooms, reception and waiting areas, treatment rooms, staff amenities, kitchens and washrooms. The scope includes vacuuming, mopping, waste removal, high-touch surface disinfection, infection-control cleaning, quality inspections and reporting.",
    published: true,
    isNamedClient: true,
  },
  {
    id: "rosso-cafe-restaurant",
    title: "Rosso Cafe & Restaurant",
    category: "Hospitality",
    summary:
      "Machine floor scrubbing and detailed window cleaning for a hospitality setting.",
    published: true,
    isNamedClient: true,
  },
  {
    id: "ndis-homes",
    title: "NDIS Homes",
    category: "Residential support",
    summary:
      "Routine general home cleaning in NDIS homes. This is a service category, not a single named client.",
    published: true,
    isNamedClient: false,
  },
  {
    id: "carlton-homes",
    title: "Carlton Homes",
    category: "Builders cleaning",
    summary:
      "Detailed builders cleaning before occupancy inspection and handover. Cleaning prepares the property for inspection; it does not itself grant an occupancy permit.",
    published: true,
    isNamedClient: true,
  },
];

export const faqs = [
  {
    question: "Which areas do you service?",
    answer:
      "We provide cleaning services throughout Melbourne Metropolitan Area and Regional Victoria. Contact the team to discuss your location and requirements.",
  },
  {
    question: "What types of premises do you clean?",
    answer:
      "Our main work is commercial cleaning for offices and warehouses, medical and healthcare facilities, schools and childcare centres, and construction or builders cleaning before handover. We also provide residential cleaning, including routine cleaning in NDIS homes.",
  },
  {
    question: "How do I request a quote?",
    answer:
      "Use the quote form on this website, or call 0402 603 869 or 0433 708 709. Tell us the premises type, suburb or postcode, and the service you need. A quote request is the start of a conversation, not a confirmed booking.",
  },
  {
    question: "Can you provide ongoing cleaning?",
    answer:
      "Yes. We provide ongoing cleaning as well as one-off work. Frequency is agreed with you and can include daily, weekly, fortnightly or another arrangement that suits the site.",
  },
  {
    question: "Do you offer final builders cleaning?",
    answer:
      "Yes. We provide detailed final cleaning of completed properties before occupancy inspection and handover. The exact scope depends on the stage of the build and the areas that need attention.",
  },
  {
    question: "How is the cleaning scope agreed?",
    answer:
      "We agree the areas, tasks and frequency before work starts. Some sites need an assessment so access, products and any specialist requirements can be discussed. If your premises has particular scheduling or compliance needs, talk these through with the team.",
  },
] as const;

export const quoteFrequencies = [
  "One-off",
  "Daily",
  "Weekly",
  "Fortnightly",
  "Other / To discuss",
] as const;

export const quoteServices = [
  "Commercial Cleaning",
  "Medical & Healthcare Cleaning",
  "Education Facility Cleaning",
  "Construction & Builders Cleaning",
  "Residential Cleaning",
  "Other / To discuss",
] as const;

export const quoteSuccessMessage =
  "Thank you. Your enquiry has been received. Our team will contact you to discuss your requirements.";
