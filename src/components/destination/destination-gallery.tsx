'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { urlFor } from '@/sanity/lib/image';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import type { ImageWithAlt } from '@/types/sanity';
import { TourGalleryLightbox } from '@/components/tour/tour-gallery-lightbox';

interface DestinationGalleryProps {
  images: ImageWithAlt[];
  locale: Locale;
}

export function DestinationGallery({ images, locale }: DestinationGalleryProps) {
  const t = useTranslations('destinations.detail');
  const tTour = useTranslations('tour');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const lightboxImages = images.map((img) => ({
    url: urlFor(img).width(2000).quality(90).url(),
    alt: resolveLocaleField(img.alt, locale) ?? '',
    caption: resolveLocaleField(img.caption, locale),
  }));

  return (
    <section className="border-t border-[#1E2128] bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow block text-[#D4A23A]">{t('gallery')}</span>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((img, idx) => {
            const alt = resolveLocaleField(img.alt, locale) ?? '';
            const src = urlFor(img).width(1000).quality(80).url();
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className="relative aspect-[4/5] overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4A23A]"
                aria-label={alt || `Open image ${idx + 1}`}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                />
              </button>
            );
          })}
        </div>
      </div>

      {activeIndex !== null ? (
        <TourGalleryLightbox
          images={lightboxImages}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onPrev={() =>
            setActiveIndex((i) => (i === null ? 0 : (i - 1 + images.length) % images.length))
          }
          onNext={() =>
            setActiveIndex((i) => (i === null ? 0 : (i + 1) % images.length))
          }
          labels={{
            close: tTour('galleryClose'),
            prev: tTour('galleryPrev'),
            next: tTour('galleryNext'),
          }}
        />
      ) : null}
    </section>
  );
}
