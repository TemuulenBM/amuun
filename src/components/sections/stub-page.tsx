import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

interface StubPageProps {
  titleKey: 'expeditions' | 'destinations' | 'about' | 'journal' | 'contact' | 'customTrip' | 'privacy' | 'terms';
}

export async function StubPage({ titleKey }: StubPageProps) {
  const [stub, nav] = await Promise.all([getTranslations('stub'), getTranslations('nav')]);
  return (
    <main className="flex min-h-screen items-center justify-center px-[7vw]">
      <div className="text-center">
        <p className="eyebrow mb-6">{stub('comingSoon')}</p>
        <h1 className="headline-section font-serif font-semibold text-[#F7F7F5]">{nav(titleKey)}</h1>
        <Link href="/" className="cta-link mt-12 inline-flex">
          {stub('backHome')}
        </Link>
      </div>
    </main>
  );
}
