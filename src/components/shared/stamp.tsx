'use client';

import { useEffect, useRef } from 'react';

interface StampProps {
  className?: string;
}

const STAMP_STYLE = { transition: 'transform 0.1s ease-out' } as const;

export function Stamp({ className = '' }: StampProps) {
  const stampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stampRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const centerX = window.innerWidth / 2;
      const rotate = ((e.clientX - centerX) / centerX) * 15;
      el.style.transform = `rotate(${rotate}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={stampRef}
      className={`relative w-[110px] h-[110px] md:w-[140px] md:h-[140px] ${className}`}
      style={STAMP_STYLE}
    >
      <svg viewBox="0 0 140 140" className="w-full h-full">
        <circle
          cx="70" cy="70" r="68"
          fill="none" stroke="#D4A23A" strokeWidth="1" strokeDasharray="4 4"
        />
        <defs>
          <path id="circlePath" d="M 70, 70 m -55, 0 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0" />
        </defs>
        <text fill="#D4A23A" fontSize="10" fontFamily="IBM Plex Mono" letterSpacing="0.15em">
          <textPath href="#circlePath">EXPEDITION · TREK · MONGOLIA ·</textPath>
        </text>
        <circle cx="70" cy="70" r="20" fill="none" stroke="#D4A23A" strokeWidth="1" />
        <text x="70" y="75" textAnchor="middle" fill="#D4A23A" fontSize="16" fontFamily="Cormorant Garamond">
          A
        </text>
      </svg>
    </div>
  );
}
