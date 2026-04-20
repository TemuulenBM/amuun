'use client';

import { useEffect } from 'react';
import { setupGlobalPinnedSnap } from '@/lib/gsap/snap';

export function GlobalSnap() {
  useEffect(() => {
    const cleanup = setupGlobalPinnedSnap();
    return cleanup;
  }, []);
  return null;
}
