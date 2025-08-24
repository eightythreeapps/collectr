import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import Header from '../components/layout/Header';
import { AuthProvider } from '../contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Collectr - Physical Game Collection Tracker',
  description: 'Track and showcase your physical game collection with the collector-first platform.',
  keywords: ['games', 'collection', 'tracking', 'retro gaming', 'physical games'],
  authors: [{ name: 'Collectr Team' }],
  openGraph: {
    title: 'Collectr - Physical Game Collection Tracker',
    description: 'Track and showcase your physical game collection with the collector-first platform.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div id="root">
            <Header />
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}