'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { ImageWithAlt } from '@/types/tour';
import { resolveLocaleField, type Locale } from '@/lib/locale/resolve-locale-field';
import { urlFor } from '@/sanity/lib/image';
import { TourGalleryLightbox } from './tour-gallery-lightbox';

interface TourGalleryProps {
  images: ImageWithAlt[];
  locale: Locale;
}

export function TourGallery({ images, locale }: TourGalleryProps) {
  const t = useTranslations('tour');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const lightboxImages = images.map((img) => ({
    url: urlFor(img).width(2000).quality(90).url(),
    alt: resolveLocaleField(img.alt, locale) ?? '',
    caption: resolveLocaleField(img.caption, locale),
  }));

  return (
    <section className="relative bg-[#0B0D10] px-[7vw] py-[14vh]">
      <div className="mx-auto max-w-6xl">
        <span className="eyebrow block">{t('galleryEyebrow')}</span>
        <h2 className="headline-subsection mt-6 font-serif text-[#F7F7F5]">{t('gallery')}</h2>

        <div className="mt-16 columns-1 gap-4 md:columns-2 lg:columns-3">
          {images.map((img, i) => {
            const thumb = urlFor(img).width(900).quality(80).url();
            const alt = resolveLocaleField(img.alt, locale) ?? '';
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className="image-card mb-4 block w-full break-inside-avoid overflow-hidden transition-transform hover:scale-[1.01]"
              >
                <Image
                  src={thumb}
                  alt={alt}
                  width={900}
                  height={600}
                  className="h-auto w-full object-cover"
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
          onPrev={() => setActiveIndex((i) => (i === null ? 0 : (i - 1 + images.length) % images.length))}
          onNext={() => setActiveIndex((i) => (i === null ? 0 : (i + 1) % images.length))}
          labels={{ close: t('galleryClose'), prev: t('galleryPrev'), next: t('galleryNext') }}
        />
      ) : null}
    </section>
  );
}
