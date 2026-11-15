import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Projects" };

// Only projects with a download are listed; the rest stay in src/content/projects.ts until they're ready.
export default function ProjectsPage() {
  const ready = projects.filter((p) => p.download);
  return (
    <PageShell eyebrow="Things I built" title="Projects">
      <ul className="list">
        {ready.map((p) => (
          <li key={p.slug}>
            <small>{p.kind}</small>
            <h2>{p.name}</h2>
            <p>{p.summary}</p>
            {p.download && (
              <div className="download">
                <a className="button" href={p.download.href} download>
                  {p.download.label}
                </a>
                <span>{p.download.note}</span>
              </div>
            )}
            <p className="hint">
              On your phone? Open this page on your PC to install it. If Windows shows &ldquo;Windows protected your
              PC&rdquo;, click <b>More info</b> then <b>Run anyway</b>. It shows that for small apps that aren&rsquo;t
              signed yet.
            </p>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
