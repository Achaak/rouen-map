import '~/styles/globals.css';

import { Inter } from 'next/font/google';
import { type Viewport, type Metadata } from 'next';
import { TRPCReactProvider } from '~/trpc/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const title = 'Rouen transport';
const description =
  'Rouen transport est une application qui permet de visualiser les transports en commun de la ville de Rouen.';
const appName = 'Rouen transport';

export const metadata: Metadata = {
  metadataBase: new URL('https://rouen-transport.vercel.app'),
  title,
  description,
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  applicationName: appName,
  category: 'portfolio',
  creator: 'Axel Lavoie & Christopher Yovanovitch',
  openGraph: {
    url: 'https:/rouen-transport.vercel.app',
    title,
    description,
    type: 'profile',
    countryName: 'France',
    locale: 'fr_FR',
    siteName: appName,
    determiner: 'the',
  },
  robots: 'index, follow',
  appleWebApp: {
    title,
    statusBarStyle: 'black-translucent',
    capable: true,
    startupImage: '/images/logo.png',
  },
  authors: {
    name: 'Axel Lavoie & Christopher Yovanovitch',
    url: 'https://rouen-transport.vercel.app',
  },
  generator: 'Next.js',
  publisher: 'Vercel',
};

export const viewport: Viewport = {
  themeColor: '#2dac5c',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
