'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Search, Coffee, Map, Palette, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import hobbiesData from '@/data/hobbies.json';
import { blogPosts } from '@/data/blogPosts'; // ブログデータを取り込み

// --- ヘルパー関数 ---
const shuffleArray = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const getHobbyIcon = (tags: string[]) => {
  if (tags.includes('インドア')) {
    if (tags.includes('時間大')) return <Palette className="w-5 h-5" />;
    return <Coffee className="w-5 h-5" />;
  }
  if (tags.includes('アウトドア')) return <Map className="w-5 h-5" />;
  return <Sparkles className="w-5 h-5" />;
};

const getHobbyImageUrl = (hobbyId: string): string | null => {
  const index = (hobbiesData as any[]).findIndex((h) => h.id === hobbyId);
  if (index < 0 || index >= 99) return null; 
  const num = String(index + 1).padStart(3, '0');
  return `/hobby_image_${num}.jpg`;
};

export default function ExplorePage() {
  const [hasSearched, setHasSearched] = useState(false);
  const [location, setLocation] = useState<'indoor' | 'outdoor' | null>(null);
  const [cost, setCost] = useState<'low' | 'high' | null>(null);
  const [time, setTime] = useState<'short' | 'long' | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = () => {
    const TARGET = 8;
    const all = hobbiesData as any[];
    const matchesLocation = (h: any) => {
      if (location === 'indoor' && !h.tags.includes('インドア')) return false;
      if (location === 'outdoor' && !h.tags.includes('アウトドア')) return false;
      return true;
    };
    const scored = shuffleArray(all).filter(matchesLocation).map(h => ({ hobby: h, score: 1 }));
    setResults(scored.map(s => s.hobby).slice(0, TARGET));
    setHasSearched(true);
    setTimeout(() => document.getElementById('results-area')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div className="flex flex-col items-center min-h-[70vh] animate-in fade-in duration-700">
      
      {/* 検索セクション（省略） */}
      <div className={`w-full max-w-2xl transition-all duration-700 flex flex-col items-center ${hasSearched ? '-translate-y-8 opacity-90' : 'translate-y-12'}`}>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ink mb-12 tracking-widest text-center">今日はなにする？</h2>
        <div className="w-full space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-border-light relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-ink">
            <div className="flex flex-col gap-3 text-center">
              <label className="text-xs text-ink-light font-bold">場所</label>
              <div className="flex rounded-full border border-border-light overflow-hidden">
                <button onClick={() => setLocation(location === 'indoor' ? null : 'indoor')} className={`flex-1 py-2 text-sm ${location === 'indoor' ? 'bg-ink text-white' : 'text-ink-light'}`}>インドア</button>
                <button onClick={() => setLocation(location === 'outdoor' ? null : 'outdoor')} className={`flex-1 py-2 text-sm ${location === 'outdoor' ? 'bg-ink text-white' : 'text-ink-light'}`}>アウトドア</button>
              </div>
            </div>
            {/* 費用・時間のボタンは同様のため略 */}
          </div>
          <div className="pt-4 flex flex-col items-center gap-6">
            <button onClick={handleSearch} className="px-10 py-4 bg-ink text-cream rounded-full font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2 group text-lg">
              <Search className="w-5 h-5 text-accent" />趣味を探す！
            </button>
          </div>
        </div>
      </div>

      {/* 検索結果（省略） */}
      {hasSearched && (
        <div id="results-area" className="w-full mt-16 px-4 max-w-5xl">
            {/* ...前回の趣味カードロジック... */}
        </div>
      )}

      {/* ブログ記事セクション（HobbyLog） */}
      {!hasSearched && (
        <div className="w-full max-w-4xl mt-24 px-4 pb-20 text-left">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-accent" />
            <h3 className="text-2xl font-serif font-bold text-ink text-left">HobbyLog — 趣味の記録</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {blogPosts.map((post) => {
              const imageUrl = getHobbyImageUrl(post.hobbyId);
              return (
                <Link 
                  href={`/blog/${post.id}`} 
                  key={post.id} 
                  className="group flex flex-col bg-white rounded-3xl shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-all text-left"
                >
                  {imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img src={imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 space-y-3">
                    <span className="text-[10px] font-bold text-accent tracking-widest uppercase">{post.date}</span>
                    <h4 className="text-lg font-bold text-ink leading-snug group-hover:text-accent transition-colors">{post.title}</h4>
                    <p className="text-sm text-ink-light line-clamp-2">{post.excerpt}</p>
                    <div className="pt-2 flex items-center text-xs font-bold text-ink group-hover:gap-2 transition-all">
                      この記事を読む <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}