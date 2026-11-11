import { services } from "@/lib/site";

export type Location = {
  slug: string;
  name: string;
  region: string;
  /** Short meta / intro line for search snippets. */
  summary: string;
  /** Opening paragraphs unique to the suburb. */
  intro: string[];
  /** Local context: housing, workplaces, travel notes. */
  coverage: string[];
  /** Nearby suburb slugs for internal linking. */
  nearby: string[];
  /** Featured service slugs shown on the page. */
  featuredServices: string[];
};

const featuredDefaults = [
  "residential-house-cleaning",
  "end-of-lease-cleaning",
  "commercial-cleaning",
  "carpet-rug-cleaning",
  "construction-builders-cleaning",
  "last-minute-cleaning",
] as const;

export const locations: Location[] = [
  {
    slug: "point-cook",
    name: "Point Cook",
    region: "Wyndham",
    summary:
      "House, end of lease, carpet and commercial cleaning in Point Cook and nearby Wyndham suburbs.",
    intro: [
      "Point Cook is one of Melbourne’s larger western growth suburbs, with family homes, townhouses and local retail centres that need regular or one-off cleaning. Universal Sparkle Solution quotes house cleans, end of lease presentation, carpet work and commercial cleans for premises across Point Cook.",
      "We are based in Tarneit and travel through Point Cook for scheduled and one-off visits. Tell us the property type, suburb and the result you need when you enquire.",
    ],
    coverage: [
      "Family homes, rentals and townhouses across Point Cook estates",
      "Local shops, offices and small commercial suites",
      "Carpet, steam furniture, glass and builders cleans on request",
    ],
    nearby: ["williams-landing", "werribee", "hoppers-crossing", "altona-meadows"],
    featuredServices: [...featuredDefaults],
  },
  {
    slug: "williams-landing",
    name: "Williams Landing",
    region: "Wyndham",
    summary:
      "Cleaning for homes, apartments and workplaces in Williams Landing, western Melbourne.",
    intro: [
      "Williams Landing sits beside the freeway and rail corridor, with apartments, newer homes and business premises that need a reliable clean. We support residential schedules, end of lease presentation and commercial cleaning for local sites.",
      "From our Tarneit base we cover Williams Landing alongside Point Cook, Truganina and Hoppers Crossing. Share access notes and preferred timing with your quote request.",
    ],
    coverage: [
      "Apartments and townhouses near the station and town centre",
      "Homes and rental presentations before inspection",
      "Offices and small business suites in the local precinct",
    ],
    nearby: ["point-cook", "truganina", "hoppers-crossing", "tarneit"],
    featuredServices: [...featuredDefaults],
  },
  {
    slug: "truganina",
    name: "Truganina",
    region: "Wyndham",
    summary:
      "House, end of lease and commercial cleaning across Truganina and surrounding west Melbourne suburbs.",
    intro: [
      "Truganina mixes new estates, warehouses and light industrial sites. Universal Sparkle Solution provides house cleaning, end of lease cleans, carpet care and builders cleaning for homes and workplaces in Truganina.",
      "Crews travel from Tarneit through Truganina regularly. Include the premises type, room count or floor area, and any access restrictions when you request a quote.",
    ],
    coverage: [
      "Residential estates and rental handover cleans",
      "Warehouses, offices and mixed-use sites",
      "Post-build dust and presentation cleans where agreed",
    ],
    nearby: ["tarneit", "williams-landing", "hoppers-crossing", "werribee"],
    featuredServices: [...featuredDefaults],
  },
  {
    slug: "werribee",
    name: "Werribee",
    region: "Wyndham",
    summary:
      "Professional cleaning services in Werribee for homes, rentals, clinics and commercial premises.",
    intro: [
      "Werribee is a major western Melbourne centre with established homes, new developments, clinics and retail strips. We quote routine house cleaning, deep cleans, end of lease presentation and commercial cleaning for Werribee premises.",
      "Based nearby in Tarneit, we can discuss weekly, fortnightly or one-off visits. A quote request starts the conversation — it is not a confirmed booking.",
    ],
    coverage: [
      "Houses, units and end of lease presentation cleans",
      "Clinics, offices and local retail spaces",
      "Carpet, glass and specialist interiors as scoped",
    ],
    nearby: ["hoppers-crossing", "point-cook", "tarneit", "truganina"],
    featuredServices: [...featuredDefaults, "medical-healthcare-cleaning"],
  },
  {
    slug: "hoppers-crossing",
    name: "Hoppers Crossing",
    region: "Wyndham",
    summary:
      "House, end of lease and workplace cleaning in Hoppers Crossing, western Melbourne.",
    intro: [
      "Hoppers Crossing has a mix of family homes, units and local business premises. Universal Sparkle Solution supports regular house cleaning, end of lease cleans, carpet cleaning and commercial work across the suburb.",
      "We cover Hoppers Crossing from Tarneit with the same scope process used elsewhere in Wyndham: premises details first, then a clear quote before any visit is booked.",
    ],
    coverage: [
      "Residential cleans and rental handovers",
      "Shops, offices and community facilities as agreed",
      "Last-minute visits when a crew is available",
    ],
    nearby: ["werribee", "williams-landing", "truganina", "point-cook"],
    featuredServices: [...featuredDefaults],
  },
  {
    slug: "altona",
    name: "Altona",
    region: "Hobsons Bay",
    summary:
      "Cleaning services in Altona for homes, coastal rentals and local commercial premises.",
    intro: [
      "Altona’s coastal streets, period homes and local shops need cleaning that matches how each property is used. We quote house cleans, end of lease presentation, carpet work and commercial cleaning for Altona premises.",
      "From Tarneit we travel into Hobsons Bay for scheduled and one-off work. Mention parking, access and preferred timing when you enquire.",
    ],
    coverage: [
      "Houses, units and holiday-style rentals near the foreshore",
      "Cafés, offices and small commercial sites",
      "Carpet and steam furniture cleaning on request",
    ],
    nearby: ["altona-north", "altona-meadows", "williamstown", "footscray"],
    featuredServices: [...featuredDefaults],
  },
  {
    slug: "altona-north",
    name: "Altona North",
    region: "Hobsons Bay",
    summary:
      "House, industrial-adjacent and commercial cleaning in Altona North, western Melbourne.",
    intro: [
      "Altona North sits between residential streets and industrial corridors. Universal Sparkle Solution cleans homes, rentals and commercial premises in Altona North, including carpet care and builders presentation where needed.",
      "Tell us whether the site is a house, warehouse, office or mixed premises so the quote matches access and floor care requirements.",
    ],
    coverage: [
      "Residential homes and end of lease cleans",
      "Warehouses, workshops and office suites",
      "Glass, floors and post-build cleans as scoped",
    ],
    nearby: ["altona", "altona-meadows", "williamstown", "footscray"],
    featuredServices: [...featuredDefaults],
  },
  {
    slug: "altona-meadows",
    name: "Altona Meadows",
    region: "Hobsons Bay",
    summary:
      "Residential and commercial cleaning in Altona Meadows and surrounding Hobsons Bay suburbs.",
    intro: [
      "Altona Meadows is a family suburb with townhouses, freestanding homes and local centres. We provide house cleaning, deep cleans, end of lease presentation and carpet cleaning for Altona Meadows properties.",
      "Coverage extends from our Tarneit base through Point Cook and into Hobsons Bay. Include suburb, bedrooms and preferred frequency in your quote request.",
    ],
    coverage: [
      "Family homes and townhouses",
      "Rental presentation before final inspection",
      "Local shops and small commercial spaces",
    ],
    nearby: ["point-cook", "altona", "altona-north", "williams-landing"],
    featuredServices: [...featuredDefaults],
  },
  {
    slug: "williamstown",
    name: "Williamstown",
    region: "Hobsons Bay",
    summary:
      "House, end of lease and commercial cleaning in Williamstown, Hobsons Bay.",
    intro: [
      "Williamstown’s heritage homes, apartments and waterfront businesses need careful, agreed scopes. Universal Sparkle Solution quotes residential cleaning, end of lease presentation, carpet care and commercial cleans for Williamstown premises.",
      "We travel from Tarneit into Williamstown for one-off and ongoing work. Share any heritage, parking or access notes when you enquire so the quote is practical.",
    ],
    coverage: [
      "Period homes, apartments and rental handovers",
      "Hospitality, retail and office interiors",
      "Carpet, glass and specialist cleaning as agreed",
    ],
    nearby: ["altona", "altona-north", "footscray", "maribyrnong"],
    featuredServices: [...featuredDefaults],
  },
  {
    slug: "north-melbourne",
    name: "North Melbourne",
    region: "City of Melbourne",
    summary:
      "Apartment, house and commercial cleaning in North Melbourne and nearby inner-west suburbs.",
    intro: [
      "North Melbourne combines terrace homes, apartments and workplaces close to the CBD. We quote house and apartment cleans, end of lease presentation, carpet cleaning and commercial cleaning for North Melbourne sites.",
      "Access, lifts and parking matter in denser streets — include those details with your suburb when you request a quote. A request is not a confirmed booking.",
    ],
    coverage: [
      "Apartments, terraces and rental presentation cleans",
      "Offices, clinics and mixed-use buildings",
      "Carpet and steam furniture cleaning on request",
    ],
    nearby: ["footscray", "maribyrnong", "williamstown"],
    featuredServices: [...featuredDefaults, "medical-healthcare-cleaning"],
  },
  {
    slug: "footscray",
    name: "Footscray",
    region: "Maribyrnong",
    summary:
      "Cleaning for homes, apartments and businesses in Footscray, western Melbourne.",
    intro: [
      "Footscray is a busy inner-west hub with apartments, houses, clinics and commercial premises. Universal Sparkle Solution supports residential schedules, end of lease cleans, carpet work and commercial cleaning across Footscray.",
      "We cover Footscray from Tarneit alongside Maribyrnong and Williamstown. Tell us the premises type and frequency so we can reply with a practical plan.",
    ],
    coverage: [
      "Apartments, houses and end of lease presentation",
      "Offices, clinics and retail interiors",
      "Builders and specialist cleans where scoped",
    ],
    nearby: ["maribyrnong", "north-melbourne", "williamstown", "altona-north"],
    featuredServices: [...featuredDefaults, "medical-healthcare-cleaning"],
  },
  {
    slug: "maribyrnong",
    name: "Maribyrnong",
    region: "Maribyrnong",
    summary:
      "House, apartment and commercial cleaning in Maribyrnong and the surrounding west.",
    intro: [
      "Maribyrnong has riverside apartments, family homes and local workplaces. We quote house cleaning, end of lease presentation, carpet cleaning and commercial cleans for Maribyrnong premises.",
      "Coverage links Maribyrnong with Footscray, North Melbourne and Hobsons Bay suburbs. Include property size, access and preferred timing in your enquiry.",
    ],
    coverage: [
      "Apartments and freestanding homes",
      "Rental presentation before inspection",
      "Offices and local commercial spaces",
    ],
    nearby: ["footscray", "north-melbourne", "williamstown", "altona-north"],
    featuredServices: [...featuredDefaults],
  },
  {
    slug: "tarneit",
    name: "Tarneit",
    region: "Wyndham",
    summary:
      "Local cleaning from our Tarneit base — house, end of lease, carpet and commercial cleans.",
    intro: [
      "Universal Sparkle Solution is based at 17 Arrowsmith Street, Tarneit. From here we support house cleaning, end of lease presentation, carpet care, commercial cleaning and builders cleans across Tarneit and the wider western Melbourne area.",
      "Tarneit homes, townhouses and local workplaces can be quoted for weekly, fortnightly or one-off visits. Contact the team with the premises details to start a quote.",
    ],
    coverage: [
      "Local Tarneit homes and rental handovers",
      "Offices, shops and nearby commercial sites",
      "Western Melbourne suburbs listed on our service areas page",
    ],
    nearby: ["truganina", "hoppers-crossing", "werribee", "williams-landing"],
    featuredServices: [...featuredDefaults],
  },
];

export function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug);
}

export function getLocationServices(location: Location) {
  return location.featuredServices
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is (typeof services)[number] => Boolean(service));
}

export function getNearbyLocations(location: Location) {
  return location.nearby
    .map((slug) => getLocation(slug))
    .filter((item): item is Location => Boolean(item));
}

export const westernMelbourneFocus =
  "Point Cook, Williams Landing, Truganina, Tarneit, Werribee, Hoppers Crossing, Altona, Altona North, Altona Meadows, Williamstown, North Melbourne, Footscray and Maribyrnong";
