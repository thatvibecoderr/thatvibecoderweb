import Link from "next/link";
import SocialLinks from "./SocialLinks";
import styles from "./PageShell.module.css";

/** Frame for the inner pages: back to Buddy, a title, the content, and socials. */
export default function PageShell({ eyebrow, title, children }: { eyebrow?: string; title: string; children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.home}>
          ← that<b>vibe</b>coder
        </Link>
      </header>
      <main className={styles.main}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {children}
      </main>
      <footer className={styles.footer}>
        <SocialLinks />
      </footer>
    </div>
  );
}
