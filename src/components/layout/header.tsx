'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from './language-switcher';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const brand = useTranslations('brand');

  const navItems = [
    { key: 'expeditions', href: '/tours' },
    { key: 'destinations', href: '/destinations' },
    { key: 'about', href: '/about' },
    { key: 'journal', href: '/journal' },
    { key: 'contact', href: '/contact' },
  ] as const;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-[3vw] py-[3vh]">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-[#F7F7F5] md:text-3xl">
          {brand('name')}
        </Link>

        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-[#F7F7F5] hover:text-[#D4A23A] transition-colors"
            aria-label="Open menu"
          >
            <Menu size={18} />
            <span className="hidden sm:inline">{t('menu')}</span>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-50 bg-[#0B0D10]/50 backdrop-blur-md transition-opacity duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute right-[3vw] top-[3vh] text-[#F7F7F5] hover:text-[#D4A23A] transition-colors"
            aria-label="Close menu"
          >
            <X size={28} />
          </button>
          <nav className="flex flex-col items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-4xl text-[#F7F7F5] hover:text-[#D4A23A] transition-colors md:text-6xl"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
