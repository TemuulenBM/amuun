'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-[7vw]">
      <div className="text-center">
        <p className="eyebrow mb-6">500</p>
        <h1 className="headline-section font-serif font-semibold text-[#F7F7F5]">The caravan halted</h1>
        <button onClick={reset} className="cta-link mt-12 inline-flex">Try again</button>
      </div>
    </main>
  );
}
