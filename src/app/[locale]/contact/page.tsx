import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/forms/contact-form';
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
  const t = await getTranslations({ locale, namespace: 'forms.contact' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('forms.contact');
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <main className="relative min-h-screen bg-[#0B0D10] text-[#F4F1EA]">
      <section className="px-[7vw] pt-[28vh] pb-[10vh]">
        <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="eyebrow">{t('eyebrow')}</span>
            <h1 className="mt-6 font-serif text-5xl lg:text-6xl">{t('title')}</h1>
            <p className="mt-8 max-w-xl text-[16px] leading-relaxed text-[#F4F1EA]/70">
              {t('intro')}
            </p>
            <div className="mt-16 space-y-4 border-l border-[#D4A23A] pl-6 text-[14px] text-[#F4F1EA]/70">
              <p className="eyebrow text-[#D4A23A]">{t('office.title')}</p>
              <p>{t('office.city')}</p>
              <p>{t('office.hours')}</p>
              <p>
                {t('office.emailLabel')}:{' '}
                <a
                  className="underline decoration-[#D4A23A] underline-offset-4"
                  href={`mailto:${t('office.emailValue')}`}
                >
                  {t('office.emailValue')}
                </a>
              </p>
            </div>
          </div>
          <div className="bg-[#F4F1EA] p-8 lg:p-12">
            <ContactForm locale={locale} siteKey={siteKey} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
