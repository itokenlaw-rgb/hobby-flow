'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Search, Coffee, Map, Palette, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import hobbiesData from '@/data/hobbies.json';
import { blogPosts } from '@/data/blogPosts';
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

  const handleViewAll = (type: 'indoor' | 'outdoor') => {
    const tagName = type === 'indoor' ? 'インドア' : 'アウトドア';
    const filtered = hobbiesData.filter(h => h.tags?.includes(tagName));
    setLocation(type);
    setCost(null);
    setTime(null);
    setResults(shuffleArray(filtered));
    setHasSearched(true);
    setTimeout(() => document.getElementById('results-area')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

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
      
      {/* ヒーローセクション */}
      <div className={`w-full max-w-2xl transition-all duration-700 flex flex-col items-center ${hasSearched ? '-translate-y-8 opacity-90' : 'translate-y-12'}`}>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ink mb-12 tracking-widest text-center">今日はなにする？</h2>

        <div className="w-full space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-border-light relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col gap-3 text-center">
              <label className="text-xs text-ink-light font-bold">場所</label>
              <div className="flex rounded-full border border-border-light overflow-hidden">
                <button onClick={() => setLocation(location === 'indoor' ? null : 'indoor')} className={`flex-1 py-2 text-sm ${location === 'indoor' ? 'bg-ink text-white' : 'text-ink-light'}`}>インドア</button>
                <button onClick={() => setLocation(location === 'outdoor' ? null : 'outdoor')} className={`flex-1 py-2 text-sm ${location === 'outdoor' ? 'bg-ink text-white' : 'text-ink-light'}`}>アウトドア</button>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-center">
              <label className="text-xs text-ink-light font-bold">費用</label>
              <div className="flex rounded-full border border-border-light overflow-hidden">
                <button onClick={() => setCost(cost === 'low' ? null : 'low')} className={`flex-1 py-2 text-sm ${cost === 'low' ? 'bg-ink text-white' : 'text-ink-light'}`}>お手軽</button>
                <button onClick={() => setCost(cost === 'high' ? null : 'high')} className={`flex-1 py-2 text-sm ${cost === 'high' ? 'bg-ink text-white' : 'text-ink-light'}`}>豪華</button>
              </div>
            </div>
            <div className="flex flex-col gap-3 text-center">
              <label className="text-xs text-ink-light font-bold">時間</label>
              <div className="flex rounded-full border border-border-light overflow-hidden">
                <button onClick={() => setTime(time === 'short' ? null : 'short')} className={`flex-1 py-2 text-sm ${time === 'short' ? 'bg-ink text-white' : 'text-ink-light'}`}>サクッと</button>
                <button onClick={() => setTime(time === 'long' ? null : 'long')} className={`flex-1 py-2 text-sm ${time === 'long' ? 'bg-ink text-white' : 'text-ink-light'}`}>じっくり</button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-6">
            <button onClick={handleSearch} className="px-10 py-4 bg-ink text-cream rounded-full font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2 group text-lg">
              <Search className="w-5 h-5 text-accent" />趣味を探す！
            </button>
            <div className="flex gap-3 mt-2">
              <button onClick={() => handleViewAll('indoor')} className="px-4 py-1.5 text-[11px] text-ink-light hover:text-ink hover:bg-cream border border-border-light rounded-full transition-all">インドアを全部みる</button>
              <button onClick={() => handleViewAll('outdoor')} className="px-4 py-1.5 text-[11px] text-ink-light hover:text-ink hover:bg-cream border border-border-light rounded-full transition-all">アウトドアを全部みる</button>
            </div>
          </div>
        </div>
      </div>

      {/* 検索結果エリア */}
      {hasSearched && (
        <div id="results-area" className="w-full mt-16 animate-in slide-in-from-bottom-8 fade-in duration-1000 scroll-mt-10">
          <div className="text-center mb-10">
            <h3 className="text-xl font-bold text-ink font-serif">あなたにぴったりの過ごし方</h3>
            <p className="text-sm text-ink-light mt-2">{results.length}個のアイデアが見つかりました</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 w-full pb-16 px-4 max-w-5xl mx-auto">
            {results.map((hobby: any) => {
              const imageUrl = getHobbyImageUrl(hobby.id);
              return (
                <Link href={`/hobbies/${hobby.id}`} key={hobby.id} className="block group">
                  <div className="relative p-6 bg-white rounded-2xl shadow-sm border border-border-light transition-all hover:shadow-md hover:-translate-y-2 flex flex-col h-64 overflow-hidden">
                    
                    {/* 背景画像：お洒落な薄い画像 */}
                    {imageUrl && (
                      <div className="absolute inset-0 z-0 overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt="" 
                          className="w-full h-full object-cover opacity-[0.12] group-hover:scale-110 transition-transform duration-700 group-hover:opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-accent border border-border-light shadow-inner">
                          {getHobbyIcon(hobby.tags || [])}
                        </div>
                        <h4 className="text-lg font-bold text-ink group-hover:text-accent transition-colors">{hobby.name}</h4>
                      </div>

                      <p className="text-sm text-ink-light leading-relaxed line-clamp-3 mb-4 italic">
                        {hobby.pitch?.replace(/<<|>>/g, '')}
                      </p>

                      <div className="flex items-center gap-2 mb-4 text-[10px]">
                        {hobby.tags?.map((t: string) => (
                          <span key={t} className="px-2 py-0.5 bg-white/60 backdrop-blur-sm rounded border border-border-light text-ink-light">{t}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light/50 border-dashed">
                        <div className="flex items-center gap-1.5 text-[10px] text-ink-light/80 font-medium">
                          <Users className="w-3 h-3" />
                          <span>約 {(hobby.global_active_users || 12000).toLocaleString()}人が参加中</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-accent transform translate-x-0 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ブログ記事セクション（HobbyLog） */}
      {!hasSearched && (
        <div className="w-full max-w-4xl mt-24 px-4 pb-20">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="w-6 h-6 text-accent" />
            <h3 className="text-2xl font-serif font-bold text-ink">HobbyLog — 趣味の記録</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {blogPosts.map((post) => {
              const imageUrl = post.imageOverride || getHobbyImageUrl(post.hobbyId);
              return (
                <Link href={`/blog/${post.id}`} key={post.id} className="group flex flex-col bg-white rounded-3xl shadow-sm border border-border-light overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* カード上部：画像＋タイトルオーバーレイ */}
                  <div className="relative h-52 overflow-hidden flex-shrink-0">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                    {/* グラデーションオーバーレイ */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    {/* 日付バッジ */}
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-bold text-white/70 tracking-widest uppercase bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                        {post.date}
                      </span>
                    </div>
                    {/* タイトル（画像上に重ねて表示） */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h4 className="text-base font-bold text-white leading-snug drop-shadow-md group-hover:text-accent/90 transition-colors">
                        {post.title}
                      </h4>
                    </div>
                  </div>

                  {/* カード下部：抜粋＋リンク */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <p className="text-sm text-ink-light line-clamp-2 leading-relaxed">{post.excerpt}</p>
                    <div className="mt-auto pt-3 border-t border-border-light/50 flex items-center gap-1 text-xs font-bold text-ink-light group-hover:text-accent transition-colors">
                      この記事を読む
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" />
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