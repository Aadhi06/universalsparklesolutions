export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  published: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  serviceHref: string;
  serviceLabel: string;
  sections: BlogSection[];
};

export const posts: BlogPost[] = [
  {
    slug: "office-cleaning-melbourne",
    title: "Office cleaning in Melbourne: what a workplace clean should cover",
    description:
      "A practical guide to office cleaning in Melbourne, including workstations, amenities, warehouses and schedules that fit operating hours.",
    published: "2026-10-08",
    keywords: [
      "office cleaning Melbourne",
      "commercial cleaning Melbourne",
      "office cleaners Melbourne",
    ],
    image: "/images/service-commercial.jpg",
    imageAlt:
      "A bright commercial office corridor with glass-fronted rooms and a polished floor.",
    serviceHref: "/services/commercial-cleaning",
    serviceLabel: "Commercial cleaning",
    sections: [
      {
        heading: "What office cleaning in Melbourne usually includes",
        paragraphs: [
          "[Office cleaning in Melbourne](/services/commercial-cleaning) is more than a vacuum at the end of the day. A useful [commercial cleaning](/services/commercial-cleaning) visit follows how the workplace is actually used: reception, workstations, meeting rooms, kitchens, washrooms and the paths people walk all day.",
          "Warehouses and mixed office-warehouse sites need the same plan, with floors, amenities and shared circulation added to the scope. The clean should be agreed in writing so the team and the site manager expect the same result.",
        ],
      },
      {
        heading: "Fit the schedule around the business",
        paragraphs: [
          "Many Melbourne offices want the clean before staff arrive, after they leave, or in a split visit. A warehouse may need an early floor clean that does not cross forklift traffic. The right frequency is the one that keeps the site presentable between visits, whether that is daily, a few times a week, or weekly.",
          "High-touch points such as door handles, taps, kitchen benches and reception counters are worth naming in the scope. They are used constantly and they show when a clean is only a quick tidy.",
        ],
      },
      {
        heading: "How to compare commercial cleaning quotes",
        paragraphs: [
          "Ask what is included, how often each area is done, and what happens if the site needs a change. A lower price that leaves kitchens or washrooms off the regular visit is not a saving. Photos of a generic office are not a promise about your building.",
          "Universal Sparkle Solution provides [commercial cleaning in Melbourne](/services/commercial-cleaning) and Regional Victoria. [Request a free quote](/contact#quote) and we will talk through the rooms, the hours and the frequency before any visit is booked.",
        ],
      },
    ],
  },
  {
    slug: "end-of-lease-cleaning-melbourne",
    title: "End of lease cleaning in Melbourne before the final inspection",
    description:
      "How end of lease cleaning in Melbourne prepares a rental for inspection, including kitchens, bathrooms, floors and what a quote should list.",
    published: "2026-10-12",
    keywords: [
      "end of lease cleaning Melbourne",
      "bond cleaning Melbourne",
      "end of lease cleaners Melbourne",
    ],
    image: "/images/service-end-of-lease.jpg",
    imageAlt: "A clean, empty rental kitchen and living area prepared for inspection.",
    serviceHref: "/services/end-of-lease-cleaning",
    serviceLabel: "End of lease cleaning",
    sections: [
      {
        heading: "What an end of lease clean is for",
        paragraphs: [
          "[End of lease cleaning in Melbourne](/services/end-of-lease-cleaning) is a presentation clean before the final inspection. It is there so the property can be handed back in a careful, finished condition. It is not a promise that a bond will be refunded. The property manager or landlord decides that against the condition report.",
          "A proper [end of lease cleaning](/services/end-of-lease-cleaning) scope names the kitchen, bathrooms, floors, internal glass, skirting and the fittings that collect grease and dust. Ovens, rangehoods and shower screens are the areas people notice first.",
        ],
      },
      {
        heading: "What to have ready on the day",
        paragraphs: [
          "The clean is easier when the home is empty, power and water are on, and any agreed carpet or wall work is already booked. Tell the cleaner about pets, stairs, a second bathroom, or a balcony so the quote matches the property.",
          "If you also need [carpet cleaning](/services/carpet-rug-cleaning) or [steam furniture cleaning](/services/steam-furniture-cleaning), ask for those as separate services. They are not automatically part of a general end of lease clean.",
        ],
      },
      {
        heading: "Booking across Melbourne and regional Victoria",
        paragraphs: [
          "Timing matters near the end of a lease. Share the inspection date when you enquire so the visit can be planned around it. Availability is confirmed when we reply. It is not booked by the enquiry form alone.",
          "Universal Sparkle Solution quotes [end of lease cleaning across Melbourne](/services/end-of-lease-cleaning) and Regional Victoria. [Send your suburb and inspection date](/contact#quote) with your request.",
        ],
      },
    ],
  },
  {
    slug: "house-cleaning-melbourne",
    title: "House cleaning in Melbourne for regular homes and one-off visits",
    description:
      "House cleaning in Melbourne for weekly, fortnightly and one-off visits, including what to agree before a cleaner comes to your home.",
    published: "2026-10-16",
    keywords: [
      "house cleaning Melbourne",
      "home cleaning Melbourne",
      "house cleaners Melbourne",
    ],
    image: "/images/service-residential.jpg",
    imageAlt: "A bright residential living room with a clean floor and tidy furnishings.",
    serviceHref: "/services/residential-house-cleaning",
    serviceLabel: "House cleaning",
    sections: [
      {
        heading: "Regular house cleaning and one-off cleans",
        paragraphs: [
          "[House cleaning in Melbourne](/services/residential-house-cleaning) can be a repeating visit or a single reset. Weekly and fortnightly cleans keep kitchens, bathrooms and floors in order. A one-off clean suits a busy week, guests, or a home that has fallen behind.",
          "The useful [home cleaning](/services/residential-house-cleaning) quote lists the rooms, whether the clean includes inside the oven or fridge, and how often you want the team back. A vague “whole house” line leads to mismatched expectations.",
        ],
      },
      {
        heading: "Homes that need a careful routine",
        paragraphs: [
          "Some homes need a quieter, more methodical clean, including residences where a person receives support. We can quote that as [residential house cleaning](/services/residential-house-cleaning). That is premises cleaning. It is not a claim of NDIS registration.",
          "Tell us about access, pets, products you prefer, and any rooms that should be left alone. Those details belong in the first conversation, not on the day.",
        ],
      },
      {
        heading: "Melbourne suburbs and regional Victoria",
        paragraphs: [
          "We quote [house cleaners in Melbourne](/services/residential-house-cleaning) and Regional Victoria. Suburb, home size and frequency change the time on site, so include them when you enquire.",
          "A request on the website is a quote enquiry. [Request a free quote](/contact#quote) and the visit is confirmed when our team contacts you.",
        ],
      },
    ],
  },
  {
    slug: "carpet-cleaning-melbourne",
    title: "Carpet cleaning in Melbourne for homes, offices and rugs",
    description:
      "Carpet cleaning in Melbourne for homes and workplaces, including rugs, drying time and how furniture cleaning is quoted separately.",
    published: "2026-10-18",
    keywords: [
      "carpet cleaning Melbourne",
      "rug cleaning Melbourne",
      "carpet cleaners Melbourne",
    ],
    image: "/images/service-carpet.jpg",
    imageAlt: "A freshly cleaned carpeted room with soft light across the floor.",
    serviceHref: "/services/carpet-rug-cleaning",
    serviceLabel: "Carpet and rug cleaning",
    sections: [
      {
        heading: "When a carpet clean is worth booking",
        paragraphs: [
          "[Carpet cleaning in Melbourne](/services/carpet-rug-cleaning) is worth booking when traffic lanes have darkened, a room smells stale, or a lease inspection is coming up. Offices and clinics also need carpets kept on a planned cycle so reception and corridors stay presentable.",
          "[Rug cleaning](/services/carpet-rug-cleaning) is its own job. A loose rug may need to be cleaned differently from wall-to-wall carpet. Say if the rug can be moved, and what it is made from, when you ask for a quote.",
        ],
      },
      {
        heading: "Drying, furniture and what is not included",
        paragraphs: [
          "Allow time for carpets to dry before furniture goes back and before an inspection. Heavy lounges and beds change the time on site. Tell us what must be moved and what must stay.",
          "[Steam cleaning for upholstered furniture](/services/steam-furniture-cleaning) is a separate service from [carpet and rug cleaning](/services/carpet-rug-cleaning). If you want both, ask for both so the quote covers each one.",
        ],
      },
      {
        heading: "Ask for a scope, not a guess",
        paragraphs: [
          "Room count, carpet type and the reason for the clean (lease, office cycle, or a spill history) help us price the work properly. Photos of a stain help, but they do not replace a look at the room.",
          "Universal Sparkle Solution quotes [carpet cleaners in Melbourne](/services/carpet-rug-cleaning) and Regional Victoria. [Add the suburb and room count to your enquiry](/contact#quote).",
        ],
      },
    ],
  },
  {
    slug: "medical-clinic-cleaning-melbourne",
    title: "Medical clinic cleaning in Melbourne for reception and treatment rooms",
    description:
      "Medical clinic cleaning in Melbourne for consulting rooms, waiting areas and high-touch surfaces, with a scope agreed for each practice.",
    published: "2026-10-20",
    keywords: [
      "medical clinic cleaning Melbourne",
      "healthcare cleaning Melbourne",
      "clinic cleaners Melbourne",
    ],
    image: "/images/service-healthcare.jpg",
    imageAlt: "A clean medical treatment room with an examination table and clinical lighting.",
    serviceHref: "/services/medical-healthcare-cleaning",
    serviceLabel: "Medical and healthcare cleaning",
    sections: [
      {
        heading: "What clinic cleaning needs to cover",
        paragraphs: [
          "[Medical clinic cleaning in Melbourne](/services/medical-healthcare-cleaning) has to be consistent. Waiting rooms, reception desks, consulting rooms, washrooms and staff kitchens are used all day. High-touch surfaces such as handles, taps and counter edges should be named in the routine, not left as an extra.",
          "Allied health rooms have the same need for a calm, orderly finish. Our [healthcare cleaning](/services/medical-healthcare-cleaning) should follow the practice’s hours so patients are not walking through a visit.",
        ],
      },
      {
        heading: "Agree the method with the practice",
        paragraphs: [
          "A clinic should tell the cleaning team which products are acceptable, where waste goes, and which rooms have a set order. Quality checks and simple reporting can be part of the agreement when the practice wants them.",
          "This is premises cleaning for clinics and allied health centres. It is not a claim of hospital accreditation or a clinical service.",
        ],
      },
      {
        heading: "Quoting a Melbourne or regional clinic",
        paragraphs: [
          "Share the number of rooms, the days you are open, and whether the clean is before opening or after the last patient. That is enough to start a practical quote.",
          "Universal Sparkle Solution supports [clinic cleaners in Melbourne](/services/medical-healthcare-cleaning) and Regional Victoria. [Call or send an enquiry](/contact#quote) and we will confirm what the first visit would include.",
        ],
      },
    ],
  },
  {
    slug: "builders-cleaning-melbourne",
    title: "Builders cleaning in Melbourne before handover and inspection",
    description:
      "Builders cleaning in Melbourne for the final clean on a completed build, including dust, glass, floors and what to confirm before handover.",
    published: "2026-10-22",
    keywords: [
      "builders cleaning Melbourne",
      "construction cleaning Melbourne",
      "handover cleaning Melbourne",
    ],
    image: "/images/service-builders.jpg",
    imageAlt: "A completed interior ready for builders cleaning before handover.",
    serviceHref: "/services/construction-builders-cleaning",
    serviceLabel: "Construction and builders cleaning",
    sections: [
      {
        heading: "What a builders clean is",
        paragraphs: [
          "[Builders cleaning in Melbourne](/services/construction-builders-cleaning) is the detailed clean after construction work is finished and before inspection or handover. It deals with fine dust, marks on glass, floors, fittings and the mess that a broom leaves behind.",
          "It is not a substitute for builders removing rubble, paint tins and offcuts. The site should be ready for a [construction cleaning](/services/construction-builders-cleaning) visit, with power and water available, before the team arrives.",
        ],
      },
      {
        heading: "Handover dates and the scope",
        paragraphs: [
          "Tell us the handover or inspection date, the type of building, and whether internal glass, wet areas and floors are all in the scope. A house, an apartment and a commercial fit-out do not take the same time.",
          "If windows or high ceilings need separate attention, ask for [glass cleaning](/services/glass-cleaning) or [ceiling cleaning](/services/ceiling-cleaning) as their own items. They can be quoted with the builders clean when you need them.",
        ],
      },
      {
        heading: "Melbourne builds and regional sites",
        paragraphs: [
          "We quote [handover cleaning in Melbourne](/services/construction-builders-cleaning) and Regional Victoria. Availability is confirmed when we reply. Sending the form does not book the day by itself.",
          "Include the suburb, the stage of the build and the date you need the site presented. [Request a free quote](/contact#quote) and we will come back with what the clean can cover.",
        ],
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function formatPostDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Australia/Melbourne",
  }).format(new Date(`${value}T00:00:00+11:00`));
}

export function parseBlogText(text: string) {
  const parts: Array<{ type: "text" | "link"; value: string; href?: string }> = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) {
      parts.push({ type: "text", value: text.slice(last, match.index) });
    }
    parts.push({ type: "link", value: match[1], href: match[2] });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    parts.push({ type: "text", value: text.slice(last) });
  }
  return parts;
}
