import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { CustomTripForm } from '@/components/forms/custom-trip-form';
import { Footer } from '@/components/layout/footer';

interface Params {
  locale: 'en' | 'ko' | 'mn';
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'forms.customTrip' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function CustomTripPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('forms.customTrip');
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <main className="relative min-h-screen bg-[#0B0D10] text-[#F4F1EA]">
      <section className="px-[7vw] pt-[28vh] pb-[10vh]">
        <div className="mx-auto max-w-4xl">
          <span className="eyebrow">{t('eyebrow')}</span>
          <h1 className="mt-6 font-serif text-5xl lg:text-6xl">{t('title')}</h1>
          <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-[#F4F1EA]/70">
            {t('intro')}
          </p>
          <div className="mt-16 bg-[#F4F1EA] p-8 lg:p-12">
            <CustomTripForm locale={locale} siteKey={siteKey} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
