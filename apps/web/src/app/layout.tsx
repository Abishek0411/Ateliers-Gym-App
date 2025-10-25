import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavigationProvider } from '@/contexts/NavigationContext';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Atelier's Fitness",
  description: 'A modern gym app for fitness enthusiasts',
  icons: {
    icon: '/images/ateliers-gym-logo.jpg',
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
        <NavigationProvider>
          <ClientLayout>{children}</ClientLayout>
        </NavigationProvider>
      </body>
    </html>
  );
}
