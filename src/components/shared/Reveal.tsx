"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms (keep small; animation is intentionally subtle). */
  delayMs?: number;
};

/**
 * Reveals children once when they scroll into view (fade + small translate).
 * Uses a lightweight IntersectionObserver + CSS transition because no
 * animation library (framer-motion) is a dependency, and this task forbids
 * adding a heavy one. Honours `prefers-reduced-motion` by showing content
 * immediately with no transition.
 */
export default function Reveal({
  children,
  className,
  delayMs = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setVisible(true);
    };

    // Fallback for fast/programmatic jumps (anchor links, scroll restoration)
    // where the observer may never report an intersection.
    const checkPosition = () => {
      if (done) return;
      // Reveal once the element has reached the trigger line, including when it
      // is already above the viewport (fast jump / restored scroll).
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        reveal();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) reveal();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(element);
    window.addEventListener("scroll", checkPosition, { passive: true });
    window.addEventListener("resize", checkPosition);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "reveal-visible", className)}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
