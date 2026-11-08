"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { HeadAnchors } from "@/components/buddy/VoxelBuddy";
import SocialLinks, { type Social } from "@/components/layout/SocialLinks";
import { nav, type NavItem } from "@/content/site";
import styles from "./Hero.module.css";

// three.js only runs in the browser
const VoxelBuddy = dynamic(() => import("@/components/buddy/VoxelBuddy"), { ssr: false });

/** What Buddy is saying, and on which side of his head. */
type Talk = { key: string; side: "left" | "right"; says: string };

export default function Hero() {
  const [talk, setTalk] = useState<Talk | null>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const anchors = useRef<HeadAnchors | null>(null);

  // Buddy reports his head position every frame; move the bubble without re-rendering
  const place = useCallback(() => {
    const el = bubble.current;
    const a = anchors.current;
    if (!el || !a) return;
    const p = el.dataset.side === "left" ? a.left : a.right;
    el.style.left = `${p.x}px`;
    el.style.top = `${p.y}px`;
  }, []);

  const onHeadMove = useCallback(
    (a: HeadAnchors) => {
      anchors.current = a;
      place();
    },
    [place],
  );

  const say = (t: Talk) => setTalk(t);
  const stop = (key: string) => setTalk((t) => (t?.key === key ? null : t));
  const show = (n: NavItem) => () => say({ key: n.href, side: n.side, says: n.says });
  const hide = (n: NavItem) => () => stop(n.href);

  // socials sit in a row under the name: the bubble opens on whichever side of Buddy the icon is
  const showSocial = (s: Social, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    say({ key: s.href, side: r.left + r.width / 2 < innerWidth / 2 ? "left" : "right", says: s.says });
  };
  const hideSocial = (s: Social) => stop(s.href);

  return (
    <main className={styles.stage}>
      <div className={styles.canvas}>
        <VoxelBuddy onHeadMove={onHeadMove} />
      </div>

      <nav className={styles.nav} aria-label="Main">
        {(["left", "right"] as const).map((side) => (
          <div key={side} className={`${styles.side} ${styles[side]}`}>
            {nav
              .filter((n) => n.side === side)
              .map((n, i) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={styles.button}
                  style={{ animationDelay: `${i * -1.7}s` }}
                  onPointerEnter={show(n)}
                  onPointerLeave={hide(n)}
                  onFocus={show(n)}
                  onBlur={hide(n)}
                >
                  {n.label}
                </Link>
              ))}
          </div>
        ))}
      </nav>

      <div className={styles.who}>
        <h1>
          that<b>vibe</b>coder
        </h1>
        <SocialLinks onHover={showSocial} onLeave={hideSocial} />
      </div>

      {talk && (
        <div
          key={talk.key}
          ref={(el) => {
            bubble.current = el;
            place();
          }}
          data-side={talk.side}
          className={`${styles.bubble} ${styles[`bubble_${talk.side}`]}`}
          role="status"
        >
          {talk.says}
        </div>
      )}
    </main>
  );
}
