import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { PropertyProvider } from '@/contexts/PropertyContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Propify Real Estate - Properties in India',
  description: 'Find your dream property in India with Propify Real Estate',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./icon.png" sizes="any" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <PropertyProvider>
            {children}
            <Toaster />
          </PropertyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}