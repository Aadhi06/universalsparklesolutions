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
    serviceHref: "/services/commercial-cleaning",
    serviceLabel: "Commercial cleaning",
    sections: [
      {
        heading: "What office cleaning in Melbourne usually includes",
        paragraphs: [
          "Office cleaning in Melbourne is more than a vacuum at the end of the day. A useful commercial clean follows how the workplace is actually used: reception, workstations, meeting rooms, kitchens, washrooms and the paths people walk all day.",
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
          "Universal Sparkle Solution cleans offices and warehouses across Melbourne Metropolitan Area and Regional Victoria. Request a quote and we will talk through the rooms, the hours and the frequency before any visit is booked.",
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
    serviceHref: "/services/end-of-lease-cleaning",
    serviceLabel: "End of lease cleaning",
    sections: [
      {
        heading: "What an end of lease clean is for",
        paragraphs: [
          "End of lease cleaning in Melbourne is a presentation clean before the final inspection. It is there so the property can be handed back in a careful, finished condition. It is not a promise that a bond will be refunded. The property manager or landlord decides that against the condition report.",
          "A proper scope names the kitchen, bathrooms, floors, internal glass, skirting and the fittings that collect grease and dust. Ovens, rangehoods and shower screens are the areas people notice first.",
        ],
      },
      {
        heading: "What to have ready on the day",
        paragraphs: [
          "The clean is easier when the home is empty, power and water are on, and any agreed carpet or wall work is already booked. Tell the cleaner about pets, stairs, a second bathroom, or a balcony so the quote matches the property.",
          "If you also need carpets or upholstery treated, ask for those as separate services. They are not automatically part of a general end of lease clean.",
        ],
      },
      {
        heading: "Booking across Melbourne and regional Victoria",
        paragraphs: [
          "Timing matters near the end of a lease. Share the inspection date when you enquire so the visit can be planned around it. Availability is confirmed when we reply. It is not booked by the enquiry form alone.",
          "Universal Sparkle Solution quotes end of lease cleaning across Melbourne Metropolitan Area and Regional Victoria. Send the suburb, the property type and the inspection date with your request.",
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
    serviceHref: "/services/residential-house-cleaning",
    serviceLabel: "House cleaning",
    sections: [
      {
        heading: "Regular house cleaning and one-off cleans",
        paragraphs: [
          "House cleaning in Melbourne can be a repeating visit or a single reset. Weekly and fortnightly cleans keep kitchens, bathrooms and floors in order. A one-off clean suits a busy week, guests, or a home that has fallen behind.",
          "The useful quote lists the rooms, whether the clean includes inside the oven or fridge, and how often you want the team back. A vague “whole house” line leads to mismatched expectations.",
        ],
      },
      {
        heading: "Homes that need a careful routine",
        paragraphs: [
          "Some homes need a quieter, more methodical clean, including residences where a person receives support. We can quote that as residential house cleaning. That is premises cleaning. It is not a claim of NDIS registration.",
          "Tell us about access, pets, products you prefer, and any rooms that should be left alone. Those details belong in the first conversation, not on the day.",
        ],
      },
      {
        heading: "Melbourne suburbs and regional Victoria",
        paragraphs: [
          "We quote house cleaning across Melbourne Metropolitan Area and Regional Victoria. Suburb, home size and frequency change the time on site, so include them when you enquire.",
          "A request on the website is a quote enquiry. The visit is confirmed when our team contacts you.",
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
    serviceHref: "/services/carpet-rug-cleaning",
    serviceLabel: "Carpet and rug cleaning",
    sections: [
      {
        heading: "When a carpet clean is worth booking",
        paragraphs: [
          "Carpet cleaning in Melbourne is worth booking when traffic lanes have darkened, a room smells stale, or a lease inspection is coming up. Offices and clinics also need carpets kept on a planned cycle so reception and corridors stay presentable.",
          "Rugs are their own job. A loose rug may need to be cleaned differently from wall-to-wall carpet. Say if the rug can be moved, and what it is made from, when you ask for a quote.",
        ],
      },
      {
        heading: "Drying, furniture and what is not included",
        paragraphs: [
          "Allow time for carpets to dry before furniture goes back and before an inspection. Heavy lounges and beds change the time on site. Tell us what must be moved and what must stay.",
          "Steam cleaning for upholstered furniture is a separate service from carpet and rug cleaning. If you want both, ask for both so the quote covers each one.",
        ],
      },
      {
        heading: "Ask for a scope, not a guess",
        paragraphs: [
          "Room count, carpet type and the reason for the clean (lease, office cycle, or a spill history) help us price the work properly. Photos of a stain help, but they do not replace a look at the room.",
          "Universal Sparkle Solution quotes carpet and rug cleaning across Melbourne and Regional Victoria. Add the suburb and the number of rooms to your enquiry.",
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
    serviceHref: "/services/medical-healthcare-cleaning",
    serviceLabel: "Medical and healthcare cleaning",
    sections: [
      {
        heading: "What clinic cleaning needs to cover",
        paragraphs: [
          "Medical clinic cleaning in Melbourne has to be consistent. Waiting rooms, reception desks, consulting rooms, washrooms and staff kitchens are used all day. High-touch surfaces such as handles, taps and counter edges should be named in the routine, not left as an extra.",
          "Allied health rooms have the same need for a calm, orderly finish. The clean should follow the practice’s hours so patients are not walking through a visit.",
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
          "Universal Sparkle Solution supports medical and healthcare cleaning across Melbourne Metropolitan Area and Regional Victoria. Call or send an enquiry and we will confirm what the first visit would include.",
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
    serviceHref: "/services/construction-builders-cleaning",
    serviceLabel: "Construction and builders cleaning",
    sections: [
      {
        heading: "What a builders clean is",
        paragraphs: [
          "Builders cleaning in Melbourne is the detailed clean after construction work is finished and before inspection or handover. It deals with fine dust, marks on glass, floors, fittings and the mess that a broom leaves behind.",
          "It is not a substitute for builders removing rubble, paint tins and offcuts. The site should be ready for a clean, with power and water available, before the team arrives.",
        ],
      },
      {
        heading: "Handover dates and the scope",
        paragraphs: [
          "Tell us the handover or inspection date, the type of building, and whether internal glass, wet areas and floors are all in the scope. A house, an apartment and a commercial fit-out do not take the same time.",
          "If windows or high ceilings need separate attention, ask for glass cleaning or ceiling cleaning as their own items. They can be quoted with the builders clean when you need them.",
        ],
      },
      {
        heading: "Melbourne builds and regional sites",
        paragraphs: [
          "We quote construction and builders cleaning across Melbourne Metropolitan Area and Regional Victoria. Availability is confirmed when we reply. Sending the form does not book the day by itself.",
          "Include the suburb, the stage of the build and the date you need the site presented. We will come back with what the clean can cover.",
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
