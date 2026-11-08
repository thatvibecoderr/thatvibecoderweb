import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { getGuide, guides } from "@/content/guides";

type Props = { params: Promise<{ guide: string }> };

// only the slugs in src/content/guides.ts exist; anything else is a 404
export const dynamicParams = false;
export const generateStaticParams = () => guides.map((g) => ({ guide: g.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = getGuide((await params).guide);
  return { title: guide?.title };
}

export default async function GuidePage({ params }: Props) {
  const guide = getGuide((await params).guide);
  if (!guide) notFound();
  return (
    <PageShell eyebrow={`You commented ${guide.keyword}`} title={guide.title}>
      <p className="lead">{guide.intro}</p>
      <ol className="list">
        {guide.steps.map((s, i) => (
          <li key={s.title}>
            <small>Step {i + 1}</small>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
