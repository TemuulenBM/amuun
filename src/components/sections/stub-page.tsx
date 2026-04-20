import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

interface StubPageProps {
  title: string;
}

export async function StubPage({ title }: StubPageProps) {
  const t = await getTranslations('stub');
  return (
    <main className="flex min-h-screen items-center justify-center px-[7vw]">
      <div className="text-center">
        <p className="eyebrow mb-6">{t('comingSoon')}</p>
        <h1 className="headline-section font-serif font-semibold text-[#F7F7F5]">{title}</h1>
        <Link href="/" className="cta-link mt-12 inline-flex">
          {t('backHome')}
        </Link>
      </div>
    </main>
  );
}
