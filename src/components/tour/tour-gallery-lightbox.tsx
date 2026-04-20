'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxImage {
  url: string;
  alt: string;
  caption?: string;
}

interface TourGalleryLightboxProps {
  images: LightboxImage[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  labels: { close: string; prev: string; next: string };
}

export function TourGalleryLightbox({
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
  labels,
}: TourGalleryLightboxProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, onPrev, onNext]);

  const image = images[activeIndex];
  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0B0D10]/95 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 text-[#F7F7F5] hover:text-[#D4A23A]"
        aria-label={labels.close}
      >
        <X size={28} />
      </button>
      <button
        type="button"
        onClick={onPrev}
        className="absolute left-6 text-[#F7F7F5] hover:text-[#D4A23A]"
        aria-label={labels.prev}
      >
        <ChevronLeft size={32} />
      </button>
      <button
        type="button"
        onClick={onNext}
        className="absolute right-6 text-[#F7F7F5] hover:text-[#D4A23A]"
        aria-label={labels.next}
      >
        <ChevronRight size={32} />
      </button>

      <figure className="relative max-h-[80vh] max-w-[80vw]">
        <Image
          src={image.url}
          alt={image.alt}
          width={1800}
          height={1200}
          className="max-h-[80vh] w-auto object-contain"
          priority
        />
        {image.caption ? (
          <figcaption className="mt-4 text-center font-mono text-xs uppercase tracking-[0.12em] text-[#A7ACB4]">
            {image.caption}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}
