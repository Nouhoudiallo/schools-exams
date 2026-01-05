import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/src/components/AppHeader";
import { Container } from "@/src/components/Container";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Schools Exams",
  description: "Plateforme de devoirs et d'examens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-dvh">
          <AppHeader />
          <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
          <footer className="border-t border-white/10 py-10">
            <Container className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/60">© {new Date().getFullYear()} Schools Exams</p>
              <div className="flex items-center gap-4 text-xs text-white/60">
                <a href="/" className="hover:text-white">Accueil</a>
                <a href="/dashboard" className="hover:text-white">Tableau de bord</a>
              </div>
            </Container>
          </footer>
        </div>
      </body>
    </html>
  );
}
