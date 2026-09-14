export type StoryChapter = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  position: "left" | "right";
  range: [number, number];
};

export const siteConfig = {
  name: "Coffee Legacy",
  navigation: [
    { label: "Story", href: "#story" },
    { label: "Legacy", href: "#legacy" },
    { label: "Contact", href: "#contact" },
  ],
  footerLinks: ["Email", "Instagram", "LinkedIn"],
};

export const intro = {
  eyebrow: "ETHIOPIAN COFFEE • A FAMILY LEGACY",
  title: "Three Generations.\nOne Coffee Journey.",
  description:
    "A story rooted in the land, carried through generations, and continuing into the future.",
  range: [0, 0.18] as [number, number],
};

export const generations: StoryChapter[] = [
  {
    number: "01",
    eyebrow: "THE BEGINNING",
    title: "It began with the land.",
    description:
      "Before there was a company, there was a relationship with coffee — with the soil, the harvest, and the patience required to grow something worth passing on.",
    position: "left",
    range: [0.08, 0.33],
  },
  {
    number: "02",
    eyebrow: "THE LEGACY",
    title: "The journey was carried forward.",
    description:
      "The next generation inherited more than coffee. It inherited responsibility — to protect what had been built while finding new ways to move it forward.",
    position: "right",
    range: [0.37, 0.67],
  },
  {
    number: "03",
    eyebrow: "THE FUTURE",
    title: "And the story continues.",
    description:
      "Today, a new generation carries the same foundation forward — honoring where the journey began while building what comes next.",
    position: "left",
    range: [0.71, 1],
  },
];

export const legacyCopy = {
  eyebrow: "OUR STORY",
  title: "Coffee is more than what we produce.\nIt is what connects one generation to the next.",
  paragraphs: [
    "Our journey is a story of continuity — of knowledge learned from those before us, responsibility carried by each generation, and a commitment to coffee that continues to evolve.",
    "From the farm to the future, we remain connected to the values that started the journey: care for the coffee, respect for the people behind it, and the responsibility to leave something meaningful for the next generation.",
  ],
  generations: [
    { name: "GRANDFATHER", value: "ROOTS" },
    { name: "FATHER", value: "RESPONSIBILITY" },
    { name: "NEW GENERATION", value: "FUTURE" },
  ],
};
