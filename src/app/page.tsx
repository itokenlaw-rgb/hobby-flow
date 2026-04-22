'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Search, Sparkles, Coffee, Map, Palette, Dumbbell } from 'lucide-react';
import hobbiesData from '@/data/hobbies.json';

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

// hobbies内インデックスから画像URLを生成
const getHobbyImageUrl = (hobbyId: string): string | null => {
  const index = (hobbiesData as any[]).findIndex((h) => h.id === hobbyId);
  if (index < 0 || index >= 99) return null; 
  const num = String(index + 1).padStart(3, '0');
  return `/hobby_image_${num}.jpg`;
};


function ComingSoonModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl px-8 py-10 sm:px-12 sm:py-12 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
        <span className="text-4xl mb-2">🚧</span>
        <p className="text-2xl font-bold text-ink tracking-wide">Coming Soon...</p>
        <p className="text-sm text-ink-light">この機能は現在準備中です。<br />公開を楽しみにお待ちください！</p>
        <button onClick={onClose} className="mt-4 px-8 py-2.5 rounded-full bg-ink text-white text-sm font-bold hover:opacity-80 transition-opacity">閉じる</button>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [hasSearched, setHasSearched] = useState(false);
  const [location, setLocation] = useState<'indoor' | 'outdoor' | null>(null);
  const [cost, setCost] = useState<'low' | 'high' | null>(null);
  const [time, setTime] = useState<'short' | 'long' | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleSearch = () => {
    const TARGET = 8;
    const all = hobbiesData as any[];

    // ── 場所マッチ ──
    const matchesLocation = (hobby: any) => {
      const tags = hobby.tags || [];
      // ★ 正しいタグ名「アウトドア」「インドア」を使用
      if (location === 'indoor'  && !tags.includes('インドア'))  return false;
      if (location === 'outdoor' && !tags.includes('アウトドア')) return false;
      return true;
    };

    // ── 時間スコア ──
    // サクッと: 時間小=2, 時間中=1, 時間大=除外
    // じっくり: 時間大=2, 時間中=1, 時間小=除外
    // 未選択:   全て=1
    const getTimeScore = (tags: string[]): number => {
      if (time === 'short') {
        if (tags.includes('時間小')) return 2;
        if (tags.includes('時間中')) return 1;
        return -1;
      }
      if (time === 'long') {
        if (tags.includes('時間大')) return 2;
        if (tags.includes('時間中')) return 1;
        return -1;
      }
      return 1;
    };

    // ── 費用スコア ──
    // お手軽:   費用小=2, 費用中=1, 費用大=除外
    // ゴージャス: 費用大=2, 費用中=1, 費用小=除外
    // 未選択:   全て=1
    const getCostScore = (tags: string[]): number => {
      if (cost === 'low') {
        if (tags.includes('費用小')) return 2;
        if (tags.includes('費用中')) return 1;
        return -1;
      }
      if (cost === 'high') {
        if (tags.includes('費用大')) return 2;
        if (tags.includes('費用中')) return 1;
        return -1;
      }
      return 1;
    };

    // ── STEP 1: 場所＋時間＋費用すべてスコア計算（-1は除外） ──
    let scored = shuffleArray(all)
      .filter(matchesLocation)
      .map((hobby: any) => ({
        hobby,
        score: getTimeScore(hobby.tags || []) + getCostScore(hobby.tags || []),
      }))
      .filter(({ score }) => score >= 0);

    // スコア降順ソート
    scored.sort((a, b) => b.score - a.score);
    let finalList = scored.map(({ hobby }) => hobby);

    // ── STEP 2: 件数が TARGET 未満なら場所だけ残して時間・費用の「中」制約を外す ──
    if (finalList.length < TARGET) {
      const usedIds = new Set(finalList.map((h: any) => h.id));
      const supplement = shuffleArray(
        all.filter((h: any) => matchesLocation(h) && !usedIds.has(h.id))
      );
      finalList = [...finalList, ...supplement];
    }

    // ── STEP 3: それでも足りなければ場所制約も外す ──
    if (finalList.length < TARGET) {
      const usedIds = new Set(finalList.map((h: any) => h.id));
      const supplement = shuffleArray(
        all.filter((h: any) => !usedIds.has(h.id))
      );
      finalList = [...finalList, ...supplement];
    }

    setResults(finalList.slice(0, TARGET));
    setHasSearched(true);

    setTimeout(() => {
      const el = document.getElementById('results-area');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const renderFirstLineWithBold = (text: string) => {
    if (!text) return '';
    const sentence = text.split(/[。.]/)[0] + '。';
    return sentence.split(/(<<.*?>>)/g).map((part, i) => {
      if (part.startsWith('<<') && part.endsWith('>>')) {
        return <strong key={i} className="font-bold text-ink">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in duration-700 transition-all">
      {showComingSoon && <ComingSoonModal onClose={() => setShowComingSoon(false)} />}

      <div className={`w-full max-w-2xl transition-all duration-700 ease-in-out flex flex-col items-center ${hasSearched ? '-translate-y-8 opacity-90' : 'translate-y-12'}`}>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ink mb-12 tracking-widest text-center">今日はなにする？</h2>

        <div className="w-full space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-border-light relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* 場所 */}
            <div className="flex flex-col gap-3">
              <label className="text-xs text-ink-light text-center font-bold">場所</label>
              <div className="flex rounded-full border border-border-light overflow-hidden">
                <button
                  onClick={() => setLocation(location === 'indoor' ? null : 'indoor')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all ${location === 'indoor' ? 'bg-ink text-white' : 'bg-white text-ink-light'}`}
                >インドア</button>
                <div className="w-px bg-border-light" />
                <button
                  onClick={() => setLocation(location === 'outdoor' ? null : 'outdoor')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all ${location === 'outdoor' ? 'bg-ink text-white' : 'bg-white text-ink-light'}`}
                >アウトドア</button>
              </div>
            </div>

            {/* 費用 */}
            <div className="flex flex-col gap-3">
              <label className="text-xs text-ink-light text-center font-bold">費用</label>
              <div className="flex rounded-full border border-border-light overflow-hidden">
                <button
                  onClick={() => setCost(cost === 'low' ? null : 'low')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all ${cost === 'low' ? 'bg-ink text-white' : 'bg-white text-ink-light'}`}
                >お手軽</button>
                <div className="w-px bg-border-light" />
                <button
                  onClick={() => setCost(cost === 'high' ? null : 'high')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all ${cost === 'high' ? 'bg-ink text-white' : 'bg-white text-ink-light'}`}
                >ゴージャス</button>
              </div>
            </div>

            {/* 時間 */}
            <div className="flex flex-col gap-3">
              <label className="text-xs text-ink-light text-center font-bold">時間</label>
              <div className="flex rounded-full border border-border-light overflow-hidden">
                <button
                  onClick={() => setTime(time === 'short' ? null : 'short')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all ${time === 'short' ? 'bg-ink text-white' : 'bg-white text-ink-light'}`}
                >サクッと</button>
                <div className="w-px bg-border-light" />
                <button
                  onClick={() => setTime(time === 'long' ? null : 'long')}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all ${time === 'long' ? 'bg-ink text-white' : 'bg-white text-ink-light'}`}
                >じっくり</button>
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleSearch}
              className="px-10 py-4 bg-ink text-cream rounded-full font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2 group text-lg"
            >
              <Search className="w-5 h-5 text-accent" />趣味を探す！
            </button>
          </div>
        </div>
      </div>

      {/* 検索結果 */}
      {hasSearched && (
        <div id="results-area" className="w-full mt-16 animate-in slide-in-from-bottom-8 fade-in duration-1000 scroll-mt-10">
          <div className="text-center mb-10">
            <h3 className="text-xl font-bold text-ink font-serif">あなたにぴったりの過ごし方</h3>
            <p className="text-sm text-ink-light mt-2">{results.length}個のアイデアが見つかりました</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 w-full pb-16 px-4 max-w-5xl mx-auto">
            {results.map((hobby: any, index: number) => {
              const imageUrl = getHobbyImageUrl(hobby.id);
              return (
                <Link href={`/hobbies/${hobby.id}`} key={hobby.id} className="block group" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative p-6 bg-white rounded-2xl shadow-sm border border-border-light transition-all hover:shadow-md hover:-translate-y-2 flex flex-col h-full overflow-hidden">

                    {/* 背景画像（薄く） */}
                    {imageUrl && (
                      <div
                        className="absolute inset-0 rounded-2xl bg-cover bg-center pointer-events-none"
                        style={{ backgroundImage: `url(${imageUrl})`, opacity: 0.12 }}
                      />
                    )}

                    {/* カードコンテンツ */}
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-accent border border-border-light">
                          {getHobbyIcon(hobby.tags || [])}
                        </div>
                        <h4 className="text-lg font-bold text-ink group-hover:text-accent">{hobby.name}</h4>
                      </div>

                      <p className="text-sm text-ink-light leading-relaxed mb-6 flex-1 italic">
                        「{renderFirstLineWithBold(hobby.pitch)}」
                      </p>

                      <div className="flex items-center gap-2 mb-4 text-xs">
                        {hobby.tags?.map((t: string) => (
                          <span key={t} className="px-2 py-1 bg-cream rounded border border-border-light/50 text-ink-light">{t}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-light border-dashed">
                        <div className="flex items-center gap-1.5 text-xs text-ink-light">
                          <Users className="w-3.5 h-3.5" />
                          <span>約 {(hobby.global_active_users || 12000).toLocaleString()}人が楽しんでいます</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <footer className="w-full mt-20 pb-10 flex justify-center border-t border-border-light/30 pt-10">
        <Link href="/policy" className="text-xs text-ink-light hover:text-accent transition-colors underline underline-offset-4">
          プライバシーポリシー・アマゾンアソシエイトについて
        </Link>
      </footer>
    </div>
  );
}
