import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Projects" };

// The project list lives in src/content/projects.ts, ready for when this page goes live.
export default function ProjectsPage() {
  return (
    <PageShell eyebrow="Things I built" title="Coming soon">
      <p className="lead">
        Projects are on their way. Until then, the <Link href="/guides">guides</Link> show how they work.
      </p>
    </PageShell>
  );
}
