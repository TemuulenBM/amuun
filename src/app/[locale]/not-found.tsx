import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const [stub, errors] = await Promise.all([
    getTranslations('stub'),
    getTranslations('errors'),
  ]);
  return (
    <main className="flex min-h-screen items-center justify-center px-[7vw]">
      <div className="text-center">
        <p className="eyebrow mb-6">404</p>
        <h1 className="headline-section font-serif font-semibold text-[#F7F7F5]">{errors('notFoundTitle')}</h1>
        <Link href="/" className="cta-link mt-12 inline-flex">{stub('backHome')}</Link>
      </div>
    </main>
  );
}
