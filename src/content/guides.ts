/**
 * Guide pages for the comment keywords. Each one is served at /<slug>
 * (thatvibecoder.com/bug, /agent, /buddy, /mcp) by src/app/[guide]/page.tsx.
 */
export type Guide = {
  slug: string;
  keyword: string;
  title: string;
  intro: string;
  steps: { title: string; body: string }[];
};

export const guides: Guide[] = [
  {
    slug: "bug",
    keyword: "BUG",
    title: "AI bug-triage agent setup",
    intro: "How the agent from EP02 reads a tester's bug and hands me the root cause.",
    steps: [
      { title: "Capture the bug", body: "Power Automate saves only the tester's Teams messages to a OneDrive folder." },
      { title: "Watch the folder", body: "A small watcher notices each new bug file and starts the agent." },
      { title: "Trace the code", body: "The agent works out whether it is a backend or webapp bug and traces it, read-only." },
      { title: "Get the report", body: "A notification arrives with the bug, the file, the line and a suggested fix. You decide." },
    ],
  },
  {
    slug: "agent",
    keyword: "AGENT",
    title: "Agents and skills",
    intro: "The chef and the recipe card from EP01, and the agent I built to make my own work easier.",
    steps: [
      { title: "Agent", body: "Plans, uses tools, checks the result and fixes it on its own, like the chef." },
      { title: "Skill", body: "A written recipe the agent follows for one kind of job, so the result is the same every time." },
    ],
  },
  {
    slug: "buddy",
    keyword: "BUDDY",
    title: "Get Hey Buddy",
    intro: "The desktop reminder buddy from the intro reel. Download and setup steps go here.",
    steps: [
      { title: "Download", body: "Coming soon: a single Windows .exe you can double-click." },
      { title: "Add a reminder", body: "Type the task, pick In 15 min, In 1 hour, Tomorrow 9 AM or a custom time." },
      { title: "Meet Buddy", body: "When it is due, Buddy walks in and asks if it is done. No brings him back in five minutes." },
    ],
  },
  {
    slug: "mcp",
    keyword: "MCP",
    title: "Connect Claude to your apps (MCP)",
    intro: "Model Context Protocol: the kitchen's supplier phone from EP03.",
    steps: [
      { title: "Open connectors", body: "In Claude, go to Settings and open Connectors." },
      { title: "Connect", body: "Turn on Gmail, Google Calendar or Drive and sign in." },
      { title: "Ask", body: 'Try "What meetings do I have tomorrow?"' },
    ],
  },
];

export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
