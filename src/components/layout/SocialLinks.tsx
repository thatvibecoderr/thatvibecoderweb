import { site } from "@/content/site";
import styles from "./SocialLinks.module.css";

const icons: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21z" />
    </svg>
  ),
};

export type Social = (typeof site.socials)[number];

/** Optional hover hooks, used on the home page so Buddy can talk about each link. */
type Props = {
  onHover?: (s: Social, el: HTMLElement) => void;
  onLeave?: (s: Social) => void;
};

export default function SocialLinks({ onHover, onLeave }: Props) {
  return (
    <nav className={styles.row} aria-label="Social links">
      {site.socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className={styles.link}
          onPointerEnter={onHover && ((e) => onHover(s, e.currentTarget))}
          onPointerLeave={onLeave && (() => onLeave(s))}
          onFocus={onHover && ((e) => onHover(s, e.currentTarget))}
          onBlur={onLeave && (() => onLeave(s))}
        >
          {icons[s.label]}
        </a>
      ))}
    </nav>
  );
}
