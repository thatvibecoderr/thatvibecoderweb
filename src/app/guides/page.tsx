import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { guides } from "@/content/guides";

export const metadata: Metadata = { title: "Guides" };

export default function GuidesPage() {
  return (
    <PageShell eyebrow="Step by step" title="Guides">
      <ul className="list">
        {guides.map((g) => (
          <li key={g.slug}>
            <small>Comment {g.keyword}</small>
            <h2>
              <Link href={`/${g.slug}`}>{g.title}</Link>
            </h2>
            <p>{g.intro}</p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
