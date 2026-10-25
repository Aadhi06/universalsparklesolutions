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
  whatsapp: {
    href: "https://wa.me/61402603869?text=Hello%2C%20I%20would%20like%20to%20discuss%20cleaning%20for%20my%20premises.",
    label: "Chat on WhatsApp",
    numberLabel: "0402 603 869",
  },
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
  { href: "/services", label: "Services", hasServiceMenu: true },
  { href: "/#current-work", label: "Our Work" },
  { href: "/blog", label: "Guides" },
  { href: "/contact", label: "Contact" },
] as const;

export const serviceGroups = [
  {
    id: "workplaces",
    title: "Workplaces & facilities",
    intro: "Offices, clinics, schools and completed builds.",
  },
  {
    id: "homes",
    title: "Homes",
    intro: "House cleaning and end of lease presentation.",
  },
  {
    id: "specialist",
    title: "Specialist cleaning",
    intro: "Carpet, furniture, glass, ceilings, childcare and urgent work.",
  },
] as const;

export type ServiceGroupId = (typeof serviceGroups)[number]["id"];

export const services = [
  {
    slug: "commercial-cleaning",
    title: "Commercial Cleaning",
    shortTitle: "Commercial Cleaning",
    href: "/services/commercial-cleaning",
    group: "workplaces",
    featured: true,
    homeLine: "Offices and warehouses, on your schedule.",
    summary:
      "Scheduled cleaning for offices and warehouses, planned around your operating hours and the way each workplace is used.",
    description:
      "We clean offices and warehouses with a scope matched to each site. Work can include workstations, meeting rooms, amenities, kitchens, reception areas and warehouse floors.",
    image: "/images/service-commercial.jpg",
    imageAlt:
      "A bright, recently cleaned commercial office corridor with glass-fronted rooms and a polished floor.",
    galleryImage: "/images/env-office.jpg",
    galleryImageAlt:
      "A clean commercial office corridor with glass partitions and a polished floor.",
    includes: [
      "Workstations, meeting rooms and reception areas",
      "Kitchens, tea points and staff amenities",
      "Washrooms and high-touch surfaces",
      "Warehouse floors and shared circulation spaces",
      "Schedules planned around your operating hours",
    ],
  },
  {
    slug: "medical-healthcare-cleaning",
    title: "Medical & Healthcare Cleaning",
    shortTitle: "Medical & Healthcare",
    href: "/services/medical-healthcare-cleaning",
    group: "workplaces",
    featured: true,
    homeLine: "Clinics and allied health centres.",
    summary:
      "Methodical cleaning for medical clinics and allied health centres, including high-touch surfaces and clinical support areas.",
    description:
      "Healthcare environments need a consistent, careful clean. We support medical clinics and allied health centres with routines that cover consulting rooms, reception, waiting areas, amenities and high-touch surfaces.",
    image: "/images/service-healthcare.jpg",
    imageAlt:
      "A clean, unused medical treatment room with an examination table and clinical lighting.",
    galleryImage: "/images/env-clinic.jpg",
    galleryImageAlt:
      "A clean healthcare reception desk and waiting corridor ready for patients.",
    includes: [
      "Consulting rooms, treatment rooms and waiting areas",
      "Reception, staff amenities, kitchens and washrooms",
      "High-touch surface cleaning",
      "Waste removal and routine floor care",
      "Quality checks where the work requires reporting",
    ],
  },
  {
    slug: "education-facility-cleaning",
    title: "Education Facility Cleaning",
    shortTitle: "Schools",
    href: "/services/education-facility-cleaning",
    group: "workplaces",
    featured: true,
    homeLine: "Schools and learning facilities.",
    summary:
      "Cleaning for schools, with attention to classrooms, amenities and shared learning spaces.",
    description:
      "Education facilities need a reliable clean that keeps classrooms, amenities and shared areas ready for the next day. We work with schools to agree a practical scope around the school day.",
    image: "/images/service-education.jpg",
    imageAlt:
      "An empty classroom with neatly arranged desks, a clean floor and a chalkboard at the front.",
    galleryImage: "/images/env-school.jpg",
    galleryImageAlt:
      "A classroom ready for the next day of teaching, with desks and a clean shared learning space.",
    includes: [
      "Classrooms, staff rooms and shared learning spaces",
      "Amenities, kitchens and high-traffic corridors",
      "School common areas and high-traffic corridors",
      "Routine waste removal and floor care",
      "A practical scope agreed around the school day",
    ],
  },
  {
    slug: "construction-builders-cleaning",
    title: "Construction & Builders Cleaning",
    shortTitle: "Construction & Builders",
    href: "/services/construction-builders-cleaning",
    group: "workplaces",
    featured: true,
    homeLine: "Final clean before inspection and handover.",
    summary:
      "Detailed final cleaning of completed properties before occupancy inspection and handover.",
    description:
      "Builders cleaning focuses on the detail needed before inspection and handover. We remove construction dust and leave completed interiors presentation-ready. Cleaning supports handover; it does not replace building certification or an occupancy permit.",
    image: "/images/service-builders.jpg",
    imageAlt:
      "A completed modern home interior with clean floors, joinery and living areas ready for handover.",
    galleryImage: "/images/builders-exterior.jpg",
    galleryImageAlt:
      "A completed contemporary home exterior, representing builders cleaning before handover.",
    includes: [
      "Detailed dust removal from completed interiors",
      "Floors, joinery, glass and fittings",
      "Kitchens, bathrooms and living areas",
      "Presentation-ready clean before inspection",
      "Scope matched to the stage of the build",
    ],
  },
  {
    slug: "residential-house-cleaning",
    title: "Residential House Cleaning",
    shortTitle: "House Cleaning",
    href: "/services/residential-house-cleaning",
    group: "homes",
    featured: false,
    homeLine: "Routine cleaning for homes across Victoria.",
    summary:
      "Regular or one-off house cleaning for living areas, kitchens, bathrooms and bedrooms, matched to how the home is used.",
    description:
      "Residential cleaning covers the rooms that matter in a home, from kitchens and bathrooms to living areas and high-touch surfaces. We agree a practical plan for ongoing visits or a one-off clean. This is a cleaning service, not a tenancy or NDIS registration claim.",
    image: "/images/service-residential.jpg",
    imageAlt:
      "A bright, tidy living room with a sofa, timber floors and natural light, representing house cleaning.",
    galleryImage: "/images/env-kitchen.jpg",
    galleryImageAlt: "A clean kitchen with a marble bench and white cabinetry.",
    includes: [
      "Kitchens, bathrooms and living areas",
      "Bedrooms, hallways and high-touch surfaces",
      "Floors, benches and waste removal",
      "A plan for weekly, fortnightly or one-off visits",
      "Optional extras such as ovens, windows or carpets on request",
    ],
  },
  {
    slug: "end-of-lease-cleaning",
    title: "End of Lease Cleaning",
    shortTitle: "End of Lease",
    href: "/services/end-of-lease-cleaning",
    group: "homes",
    featured: false,
    homeLine: "A detailed clean before you hand the keys back.",
    summary:
      "Presentation-ready cleaning of a rental property before vacancy inspection. Cleaning supports handover; it does not itself guarantee a bond refund.",
    description:
      "End of lease cleaning focuses on the detail landlords and agents typically check: kitchens, bathrooms, floors, windows and built-in appliances. We agree the rooms and inclusions before the visit. Cleaning prepares the property for inspection. It does not replace the inspection or grant a bond refund.",
    image: "/images/service-end-of-lease.jpg",
    imageAlt:
      "A clean, unoccupied apartment living area ready for vacancy inspection.",
    galleryImage: "/images/env-amenities.jpg",
    galleryImageAlt:
      "A clean bathroom with a glass shower and vanity, representing end of lease presentation.",
    includes: [
      "Kitchens, ovens, cooktops and rangehoods as agreed",
      "Bathrooms, toilets, showers and vanities",
      "Floors, skirting, doors and light switches",
      "Interior glass and window tracks where accessible",
      "Scope confirmed before the keys are handed over",
    ],
  },
  {
    slug: "carpet-rug-cleaning",
    title: "Carpet & Rug Cleaning",
    shortTitle: "Carpet & Rugs",
    href: "/services/carpet-rug-cleaning",
    group: "specialist",
    featured: false,
    homeLine: "Carpets and rugs cleaned in homes and workplaces.",
    summary:
      "Cleaning of carpets and rugs in homes, offices and other premises, with a method matched to the fibre and the soiling.",
    description:
      "Carpet and rug cleaning is quoted for each site. We look at the type of floor covering, access and the result you need — from a routine refresh to a more thorough clean after an event or a move. Steam furniture cleaning is listed as its own service.",
    image: "/images/service-carpet.jpg",
    imageAlt:
      "A living room with a large rug and seating, representing carpet and rug cleaning.",
    galleryImage: "/images/office-lounge.jpg",
    galleryImageAlt:
      "A commercial lounge with carpet and upholstered seating.",
    includes: [
      "Wall-to-wall carpets in homes and offices",
      "Area rugs and high-traffic walkways",
      "A method matched to the fibre and soiling",
      "Drying time and access agreed before the visit",
      "Can be booked with house, office or end of lease cleaning",
    ],
  },
  {
    slug: "steam-furniture-cleaning",
    title: "Steam Furniture Cleaning",
    shortTitle: "Steam Furniture",
    href: "/services/steam-furniture-cleaning",
    group: "specialist",
    featured: false,
    homeLine: "Sofas, chairs and fabric furniture, quoted on their own.",
    summary:
      "Steam cleaning for upholstered sofas, chairs and fabric furniture. This is a separate service from carpet and rug cleaning.",
    description:
      "Steam furniture cleaning is quoted on its own so the scope for sofas, armchairs and fabric seating is clear. We match the method to the fabric and discuss drying time before work starts. A hidden-area test can be done where the upholstery needs it. This service does not restore damaged or worn fabric.",
    image: "/images/service-furniture.jpg",
    imageAlt:
      "A modern fabric sofa in a living room, representing steam furniture cleaning.",
    galleryImage: "/images/office-lounge.jpg",
    galleryImageAlt:
      "Upholstered commercial seating in a lounge, representing fabric furniture cleaning.",
    includes: [
      "Sofas, armchairs and fabric dining chairs",
      "Office reception and breakout seating",
      "A method suited to the fabric type",
      "Quoted separately from carpet and rug cleaning",
      "Can be booked with house or commercial cleaning",
    ],
  },
  {
    slug: "child-care-cleaning",
    title: "Child Care Cleaning",
    shortTitle: "Child Care",
    href: "/services/child-care-cleaning",
    group: "specialist",
    featured: false,
    homeLine: "Centres cleaned around the care day.",
    summary:
      "Cleaning for childcare centres and early learning rooms, including play areas, amenities and high-touch surfaces.",
    description:
      "Childcare environments need a reliable clean that is ready for the next session. We work with centres to cover play rooms, sleep rooms, amenities, kitchens and high-touch surfaces, planned around drop-off, pick-up and rest times. This is a cleaning service for childcare premises, not a claim of government registration.",
    image: "/images/service-childcare-centre.jpg",
    imageAlt:
      "A bright early learning room with children on the floor during story time, representing childcare centre cleaning.",
    galleryImage: "/images/env-school.jpg",
    galleryImageAlt:
      "A classroom and shared learning space representing early learning environments.",
    includes: [
      "Play rooms, sleep rooms and activity areas",
      "Amenities, nappy-change and kitchen spaces as agreed",
      "High-touch surfaces, floors and waste removal",
      "A schedule around the care day",
      "Quality checks where the centre requires reporting",
    ],
  },
  {
    slug: "last-minute-cleaning",
    title: "Last Minute Cleaning",
    shortTitle: "Last Minute",
    href: "/services/last-minute-cleaning",
    group: "specialist",
    featured: false,
    homeLine: "Urgent cleaning when the team is available.",
    summary:
      "Short-notice cleaning for homes and workplaces when a visit is needed quickly. Availability is confirmed before any booking.",
    description:
      "Last minute cleaning is for sites that need a clean on short notice — before an inspection, an event, a handover or an unexpected visit. Call or WhatsApp the team with the suburb, premises type and timing. We confirm whether a crew can attend. A request is not a confirmed booking.",
    image: "/images/service-last-minute.jpg",
    imageAlt:
      "A cleaner wiping a window, representing a short-notice cleaning visit.",
    galleryImage: "/images/env-cleaning.jpg",
    galleryImageAlt:
      "Detailed finishing work during a cleaning visit.",
    includes: [
      "Same-day or next-day visits where a team is free",
      "Homes, offices and other premises as agreed",
      "A focused scope for the time available",
      "Confirmed by phone or WhatsApp before we attend",
      "Can include glass, bathrooms, kitchens or a full tidy",
    ],
  },
  {
    slug: "glass-cleaning",
    title: "Glass Cleaning",
    shortTitle: "Glass Cleaning",
    href: "/services/glass-cleaning",
    group: "specialist",
    featured: false,
    homeLine: "Interior glass, partitions and accessible windows.",
    summary:
      "Cleaning of interior glass, partitions and accessible windows in homes, offices and completed builds.",
    description:
      "Glass cleaning covers interior windows, glass partitions, shopfronts and other accessible glazing. High or external work is quoted only where safe access can be arranged. We agree which panes, tracks and frames are included before the visit.",
    image: "/images/service-glass.jpg",
    imageAlt:
      "A bright bedroom with full-height glass doors, representing interior glass cleaning.",
    galleryImage: "/images/about-working.jpg",
    galleryImageAlt:
      "A cleaner using a pole tool on full-height interior windows.",
    includes: [
      "Interior windows and glass doors",
      "Office partitions and shopfront glass as agreed",
      "Window tracks and frames where accessible",
      "Can be booked with house, office or builders cleaning",
      "External or high-level work quoted only with safe access",
    ],
  },
  {
    slug: "ceiling-cleaning",
    title: "Ceiling Cleaning",
    shortTitle: "Ceiling Cleaning",
    href: "/services/ceiling-cleaning",
    group: "specialist",
    featured: false,
    homeLine: "Dust, cobwebs and high surfaces, done safely.",
    summary:
      "Cleaning of ceilings, cornices and high surfaces in homes, offices and other interiors, using access methods suited to the height.",
    description:
      "Ceiling cleaning removes dust, cobwebs and build-up from ceilings, cornices, vents and high corners. The method depends on ceiling height and finish. We confirm access equipment and any fragile fittings before work starts. This is interior cleaning, not a painting or restoration service.",
    image: "/images/service-ceiling.jpg",
    imageAlt:
      "A living room with high walls and windows, representing ceiling and high-surface cleaning.",
    galleryImage: "/images/env-office.jpg",
    galleryImageAlt:
      "A commercial interior with full-height surfaces and a clean finish.",
    includes: [
      "Ceilings, cornices and high corners",
      "Cobweb removal and dusting of vents as agreed",
      "Homes, offices and other interiors",
      "Access method matched to the ceiling height",
      "Can be combined with glass or builders cleaning",
    ],
  },
] as const;

export function servicesByGroup(id: ServiceGroupId) {
  return services.filter((service) => service.group === id);
}

export const environments = [
  {
    title: "Offices",
    image: "/images/env-office.jpg",
    imageAlt:
      "A clean commercial office corridor with glass meeting rooms and a polished floor.",
  },
  {
    title: "Staff kitchens",
    image: "/images/env-kitchen.jpg",
    imageAlt: "A bright, clean kitchen with a marble bench and white cabinetry.",
  },
  {
    title: "Amenities",
    image: "/images/env-amenities.jpg",
    imageAlt: "A clean bathroom with a glass shower, vanity and tiled walls.",
  },
  {
    title: "Healthcare",
    image: "/images/env-clinic.jpg",
    imageAlt: "A clean clinic reception desk and healthcare corridor.",
  },
  {
    title: "Warehouses",
    image: "/images/warehouse.jpg",
    imageAlt: "A warehouse interior with racking and a clear, maintained floor.",
  },
  {
    title: "Completed builds",
    image: "/images/builders-exterior.jpg",
    imageAlt: "A completed contemporary home ready for occupancy inspection.",
  },
] as const;

export const standards = [
  {
    title: "Experienced Team",
    text: "Cleaning staff who understand workplaces, facilities and homes.",
  },
  {
    title: "Modern Equipment",
    text: "The right tools for offices, clinics, schools, homes and completed builds.",
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

export const typicalScope = [
  {
    title: "Floors and circulation",
    text: "Vacuuming, mopping and attention to entries, corridors and shared walkways.",
  },
  {
    title: "Work areas",
    text: "Desks, meeting rooms, reception and other occupied spaces agreed in the plan.",
  },
  {
    title: "Kitchens and amenities",
    text: "Benches, sinks, appliances in staff kitchens, washrooms and high-touch fittings.",
  },
  {
    title: "Waste and presentation",
    text: "Waste removal and a consistent finish so the premises is ready for the next day.",
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
    text: "Share the premises, suburb and the result you need.",
  },
  {
    number: "02",
    title: "Site Assessment Where Required",
    text: "A walkthrough if access, rooms or specialist work need checking.",
  },
  {
    number: "03",
    title: "Agree Your Cleaning Plan",
    text: "We agree the areas, timing and the plan before work starts.",
  },
  {
    number: "04",
    title: "Cleaning and Quality Checks",
    text: "The team delivers the agreed clean, with checks where needed.",
  },
] as const;

export type Project = {
  id: string;
  title: string;
  category: string;
  homeLine: string;
  summary: string;
  published: boolean;
  isNamedClient: boolean;
  image: string;
  imageAlt: string;
};

export const projects: Project[] = [
  {
    id: "westgate-medical-centre",
    title: "Westgate Medical Centre",
    category: "Healthcare",
    homeLine: "Daily clinic, reception and amenities cleaning.",
    summary:
      "Daily cleaning of consulting rooms, reception and waiting areas, treatment rooms, staff amenities, kitchens and washrooms. The scope includes vacuuming, mopping, waste removal, high-touch surface disinfection, infection-control cleaning, quality inspections and reporting.",
    published: true,
    isNamedClient: true,
    image: "/images/service-healthcare.jpg",
    imageAlt:
      "A clean medical treatment room representing healthcare cleaning environments.",
  },
  {
    id: "rosso-cafe-restaurant",
    title: "Rosso Cafe & Restaurant",
    category: "Hospitality",
    homeLine: "Floor scrubbing and window cleaning.",
    summary:
      "Machine floor scrubbing and detailed window cleaning for a hospitality setting.",
    published: true,
    isNamedClient: true,
    image: "/images/env-kitchen.jpg",
    imageAlt:
      "A clean kitchen and hospitality-style interior representing cafe and restaurant environments.",
  },
  {
    id: "ndis-homes",
    title: "NDIS Homes",
    category: "Residential support",
    homeLine: "Routine home cleaning in NDIS homes.",
    summary:
      "Routine general home cleaning in NDIS homes. This is a service category, not a single named client.",
    published: true,
    isNamedClient: false,
    image: "/images/env-amenities.jpg",
    imageAlt:
      "A clean bathroom representing routine home cleaning in residential settings.",
  },
  {
    id: "carlton-homes",
    title: "Carlton Homes",
    category: "Builders cleaning",
    homeLine: "Builders clean before occupancy inspection.",
    summary:
      "Detailed builders cleaning before occupancy inspection and handover. Cleaning prepares the property for inspection; it does not itself grant an occupancy permit.",
    published: true,
    isNamedClient: true,
    image: "/images/service-builders.jpg",
    imageAlt:
      "A completed home interior representing builders cleaning before handover.",
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
      "We clean workplaces, homes and specialist interiors. That includes offices, clinics, schools, childcare centres, completed builds, house cleaning, end of lease, carpets, steam furniture, glass, ceilings and last-minute visits. Routine cleaning in NDIS homes is available as a residential service.",
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
  {
    question: "Can I contact you on WhatsApp?",
    answer:
      "Yes. Message 0402 603 869 on WhatsApp to discuss your premises, or use the quote form if you prefer email. A message is a request for contact, not a confirmed booking.",
  },
  {
    question: "What information helps you quote?",
    answer:
      "The premises type, suburb or postcode, the areas that need cleaning, and how often you need the service. Photos of the site are optional and help us understand the requirement.",
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
  ...services.map((service) => service.title),
  "Other / To discuss",
] as const;

export const quoteSuccessMessage =
  "Thank you. Your enquiry has been received. Our team will contact you to discuss your requirements.";
