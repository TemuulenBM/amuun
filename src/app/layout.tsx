import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Amuun', template: '%s · Amuun' },
  description: "Private expeditions across the world's last wild horizon.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
