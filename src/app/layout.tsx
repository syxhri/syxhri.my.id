import "./globals.css";
import Footer from "@/components/footer";
import { Toaster } from 'sonner'
import Providers from "./providers";
import { getSession } from "../../auth.config";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  metadataBase: new URL('https://syxhri.my.id'),
  title: {
    default: "asa",
    template: "asa — %s",
  },
  icons: {
    icon: '/pfp-paper.png',
    shortcut: '/pfp-paper.png',
    apple: '/pfp-paper.png',
  },
  description: "Alfisyahri Amrun A., also known as Asa, is a Software Engineering student from Gorontalo, Indonesia, with a strong interest in software development, backend systems, web development, and data-related technologies.",
  keywords: [
    "Alfisyahri Amrun A.",
    "Asa",
    "syxhri",
    "Software Engineer",
    "Portfolio",
    "Web Developer",
    "Backend Developer",
    "Gorontalo",
    "Indonesia",
    "Next.js"
  ],
  authors: [{ name: "Alfisyahri Amrun A.", url: "https://syxhri.my.id" }],
  creator: "Alfisyahri Amrun A.",
  publisher: "Alfisyahri Amrun A.",
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://syxhri.my.id',
    title: 'Alfisyahri Amrun A. (Asa) — Software Engineering Student & Developer',
    description: "Alfisyahri Amrun A., also known as Asa, is a Software Engineering student from Gorontalo, Indonesia, with a strong interest in software development, backend systems, web development, and data-related technologies.",
    siteName: 'asa',
    images: [
      {
        url: '/pfp-paper.png',
        width: 800,
        height: 800,
        alt: 'Alfisyahri Amrun A. (Asa)',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Alfisyahri Amrun A. (Asa) — Software Engineering Student & Developer',
    description: "Alfisyahri Amrun A., also known as Asa, is a Software Engineering student from Gorontalo, Indonesia, with a strong interest in software development, backend systems, web development, and data-related technologies.",
    creator: '@syxhri',
    images: ['/pfp-paper.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://syxhri.my.id/#person',
      name: 'Alfisyahri Amrun A.',
      alternateName: ['Asa', 'Alfi', 'Syahri'],
      url: 'https://syxhri.my.id',
      image: 'https://syxhri.my.id/pfp-paper.png',
      description:
        'Software Engineering student from Gorontalo, Indonesia, with a strong interest in software development, backend systems, web development, and data-related technologies.',
      sameAs: [
        'https://github.com/syxhri',
        'https://instagram.com/alfi.syahri',
        'https://www.linkedin.com/in/alfisyahri-asa',
      ],
      jobTitle: 'Software Engineering Student & Developer',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://syxhri.my.id/#website',
      url: 'https://syxhri.my.id',
      name: 'asa',
      description: 'Personal website and portfolio of Alfisyahri Amrun A. (Asa)',
      publisher: {
        '@id': 'https://syxhri.my.id/#person',
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession()
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/pfp-paper.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`font-geist antialiased max-w-4xl mx-auto px-6 md:px-4 pt-8 pb-4 bg-[#FEFEFF] dark:bg-shark-950`}
      >
        <Providers session={session}>
          <ThemeProvider attribute="data-theme">
            <Toaster richColors />
            {children}
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
