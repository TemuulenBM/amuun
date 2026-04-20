'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from '@/lib/gsap/register';

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('contact');
  const exp = useTranslations('experiences');

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-light relative min-h-screen px-[7vw] py-[10vh]"
      style={{ zIndex: 100 }}
    >
      <div ref={contentRef} className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h2 className="headline-section font-serif font-semibold text-[#0B0D10]">
              {t('heading_1')}<br />{t('heading_2')}
            </h2>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-[#0B0D10]/70">{t('intro')}</p>

            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-32 font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50">
                  {t('emailLabel')}
                </span>
                <span className="text-[#0B0D10]">{t('emailValue')}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-32 font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50">
                  {t('responseLabel')}
                </span>
                <span className="text-[#0B0D10]">{t('responseValue')}</span>
              </div>
            </div>
          </div>

          <div className="border border-[#0B0D10]/10 bg-white/50 p-8 backdrop-blur-sm md:p-12">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <Field label={t('form.name')} type="text" placeholder={t('form.namePlaceholder')} />
              <Field label={t('form.email')} type="email" placeholder={t('form.emailPlaceholder')} />

              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50">
                  {t('form.interest')}
                </label>
                <select className="w-full border-b border-[#0B0D10]/20 bg-transparent py-2 text-[#0B0D10] transition-colors focus:border-[#D4A23A] focus:outline-none">
                  <option>{t('form.selectExpedition')}</option>
                  <option>{exp('gobi.headline')}</option>
                  <option>{exp('taiga.headline')}</option>
                  <option>{exp('altai.headline')}</option>
                  <option>{t('form.customJourney')}</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50">
                  {t('form.message')}
                </label>
                <textarea
                  rows={3}
                  className="w-full resize-none border-b border-[#0B0D10]/20 bg-transparent py-2 text-[#0B0D10] transition-colors focus:border-[#D4A23A] focus:outline-none"
                  placeholder={t('form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                className="mt-8 w-full bg-[#0B0D10] py-4 font-mono text-xs uppercase tracking-[0.12em] text-[#F7F7F5] transition-colors hover:bg-[#D4A23A] hover:text-[#0B0D10]"
              >
                {t('form.submit')}
              </button>
            </form>

            <a href="#" className="mt-6 block text-center font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50 transition-colors hover:text-[#D4A23A]">
              {t('form.downloadItinerary')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type, placeholder }: { label: string; type: string; placeholder: string }) {
  return (
    <div>
      <label className="mb-2 block font-mono text-xs uppercase tracking-[0.12em] text-[#0B0D10]/50">
        {label}
      </label>
      <input
        type={type}
        className="w-full border-b border-[#0B0D10]/20 bg-transparent py-2 text-[#0B0D10] transition-colors focus:border-[#D4A23A] focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}
