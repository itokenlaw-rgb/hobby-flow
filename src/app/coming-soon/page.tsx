'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cream px-4 text-center">
      <div className="space-y-6 animate-in fade-in zoom-in duration-700">
        <span className="text-6xl">🚧</span>
        <h1 className="text-4xl font-serif font-bold text-ink tracking-widest">
          Coming Soon...
        </h1>
        <p className="text-ink-light max-w-md mx-auto leading-relaxed">
          このページは現在準備中です。<br />
          より良い体験をお届けできるよう、一生懸命開発しています。公開まで今しばらくお待ちください。
        </p>
        
        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-ink text-cream font-bold hover:opacity-80 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}