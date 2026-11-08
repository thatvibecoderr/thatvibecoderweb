export const site = {
  name: "thatvibecoder",
  title: "That Vibe Coder",
  description:
    "Software engineer building with AI. Small AI tools, real builds and AI explained in Malayalam.",
  // `says` is what Buddy says beside his head when the icon is hovered on the home page
  socials: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/thatvibecoderr",
      says: "My reels live here: AI explained in Malayalam, and the stuff I build with it.",
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@thatvibecoderr",
      says: "Longer videos, where I walk through the builds properly.",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/thatvibecoderr",
      says: "Same reels, if Facebook is more your place.",
    },
  ],
} as const;

export type NavItem = {
  label: string;
  href: string;
  side: "left" | "right";
  /** What Buddy says beside his head when this button is hovered. */
  says: string;
};

/** The buttons that float beside Buddy on the home page. */
export const nav: NavItem[] = [
  { label: "Projects", href: "/projects", side: "left", says: "The things I've built. Still polishing them, coming soon!" },
  { label: "Guides", href: "/guides", side: "right", says: "Commented a keyword on my reel? Your step-by-step guide is in here." },
];
