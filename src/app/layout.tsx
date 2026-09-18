import "./globals.css";
import Footer from "@/components/footer";
import { Toaster } from 'sonner'
import Providers from "./providers";
import { getSession } from "../../auth.config";
import { Metadata } from "next";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: {
    default: "asa",
    template: "asa — %s",
  },
  icons: {
    icon: '/pfp-paper.png',
    shortcut: '/pfp-paper.png',
    apple: '/pfp-paper.png',
  },
  description: "Alfisyahri Amrun A., also known as Asa, is a Software Engineering Technology student from Gorontalo, Indonesia, with a strong interest in software development, backend systems, web development, and data-related technologies. He enjoys building projects, exploring new technologies, and continuously improving his programming and problem-solving skills.",
  openGraph: {
    type: 'website',
    title: 'asa',
    description: "Alfisyahri Amrun A., also known as Asa, is a Software Engineering Technology student from Gorontalo, Indonesia, with a strong interest in software development, backend systems, web development, and data-related technologies. He enjoys building projects, exploring new technologies, and continuously improving his programming and problem-solving skills.",
    url: 'https://asa.my.id'
  }
}
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
