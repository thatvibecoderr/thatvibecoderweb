export type Project = {
  slug: string;
  name: string;
  kind: string;
  summary: string;
  guide?: string; // a guide page in src/content/guides.ts
  /** A file in public/ people can download. Only projects with one are listed on /projects. */
  download?: { href: string; label: string; note: string };
};

export const projects: Project[] = [
  {
    slug: "hey-buddy",
    name: "Hey Buddy",
    kind: "Desktop app",
    summary:
      'A pixel version of me walks onto your screen when a reminder is due and asks, "Is this done?" Say no and he comes back in five minutes.',
    guide: "buddy",
    download: {
      href: "/downloads/HeyBuddy-Setup-1.0.0.exe",
      label: "Download for Windows",
      note: "Windows 10 / 11 · 17 MB · v1.0.0",
    },
  },
  {
    slug: "bug-triage-agent",
    name: "Bug-triage agent",
    kind: "AI agent",
    summary:
      "A tester posts a bug on Teams. The agent traces it through the code and sends me the root cause: which file, which line, what fix. Read-only, and I decide the fix.",
    guide: "bug",
  },
];
