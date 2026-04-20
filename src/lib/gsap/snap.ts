'use client';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function setupGlobalPinnedSnap(): () => void {
  const timer = window.setTimeout(() => {
    const pinned = ScrollTrigger.getAll()
      .filter((st) => st.vars.pin)
      .sort((a, b) => a.start - b.start);

    const maxScroll = ScrollTrigger.maxScroll(window);
    if (!maxScroll || pinned.length === 0) return;

    const ranges = pinned.map((st) => ({
      start: st.start / maxScroll,
      end: (st.end ?? st.start) / maxScroll,
      center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
    }));

    ScrollTrigger.create({
      snap: {
        snapTo: (value: number) => {
          const inPinned = ranges.some((r) => value >= r.start - 0.02 && value <= r.end + 0.02);
          if (!inPinned) return value;
          return ranges.reduce(
            (closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
            ranges[0]?.center ?? 0,
          );
        },
        duration: { min: 0.15, max: 0.35 },
        delay: 0,
        ease: 'power2.out',
      },
    });
  }, 500);

  return () => {
    window.clearTimeout(timer);
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}
