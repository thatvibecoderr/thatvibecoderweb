import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Guides" };

// The guide list lives in src/content/guides.ts, ready for when this page goes live.
export default function GuidesPage() {
  return (
    <PageShell eyebrow="Step by step" title="Coming soon">
      <p className="lead">
        Guides are on their way. Until then, catch the reels on Instagram for the walkthroughs.
      </p>
    </PageShell>
  );
}
