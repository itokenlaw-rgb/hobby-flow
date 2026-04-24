import type { Metadata } from "next";
import { Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { Compass, Book, UserCircle, Calendar } from 'lucide-react';

const notoSerif = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "HobbyFlow",
  description: "自分のための趣味記録帳",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSerif.variable} antialiased min-h-screen text-cream`}>
        <div className="max-w-3xl mx-auto min-h-screen bg-cream/95 shadow-sm border-x border-border-light relative flex flex-col">
          {/* Header */}
          <header className="px-8 py-6 border-b border-border-light flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-widest text-ink">HobbyFlow</h1>
              <p className="text-xs text-ink-light tracking-wider mt-1">新しい自分に、会いに行く</p>
            </div>
            <nav className="flex gap-6 text-ink-light text-sm">
              <Link href="/" className="flex flex-col items-center gap-1 hover:text-ink transition-colors">
                <Compass className="w-5 h-5" />
                <span>探す</span>
              </Link>

<Link href="/records" className="flex flex-col items-center gap-1 hover:text-ink transition-colors">
  <Calendar className="w-5 h-5" />
  <span>記録</span>
</Link>
            </nav>
          </header>
          
          {/* Main Content Area */}
          <main className="flex-1 px-8 py-10 pb-24">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
