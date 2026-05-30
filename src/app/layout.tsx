import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VidKnow - Knowledge Extraction & Reporting',
  description:
    'Extract knowledge from YouTube, X.com, and TikTok videos with insightful reports for individual learners',
  keywords: ['knowledge extraction', 'video learning', 'YouTube', 'TikTok', 'X.com'],
  authors: [{ name: 'VidKnow' }],
  openGraph: {
    title: 'VidKnow - Knowledge Extraction & Reporting',
    description:
      'Extract knowledge from YouTube, X.com, and TikTok videos with insightful reports',
    type: 'website',
    locale: 'en_US',
    siteName: 'VidKnow',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}