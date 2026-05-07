'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, Search, Sparkles, Coffee, Map, Palette, X, ChevronRight, ArrowRight } from 'lucide-react';
import hobbiesData from '@/data/hobbies.json';
import { blogPosts, BlogPost } from '@/data/blogPosts';

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

function ComingSoonModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-xl font-bold text-ink mb-2">Coming Soon...</h3>
        <p className="text-sm text-ink-light mb-8 leading-relaxed">
          診断機能は現在ハルが一生懸命準備中です！<br />公開までもう少々お待ちください。
        </p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-ink text-white rounded-full font-bold hover:bg-accent transition-colors"
        >
          わかった！
        </button>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'indoor' | 'outdoor'>('all');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const filteredHobbies = (hobbiesData as any[]).filter((hobby) => {
    const matchesSearch = hobby.name.includes(searchQuery) || hobby.pitch.includes(searchQuery);
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'indoor' && hobby.tags?.includes('インドア')) ||
      (activeTab === 'outdoor' && hobby.tags?.includes('アウトドア'));
    return matchesSearch && matchesTab;
  });

  const renderFirstLineWithBold = (text: string) => {
    const firstSentence = text.split('。')[0] + '。';
    const parts = firstSentence.split(/<<(.*?)>>/);
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-accent not-italic">{part}</strong> : part);
  };

  // 画像取得の優先順位：独自画像 > 趣味のトップ画像
  const getBlogImage = (post: BlogPost) => {
    return post.imageOverride || getHobbyImageUrl(post.hobbyId) || '/default_blog.jpg';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ヒーローセクション */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cream rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream border border-border-light text-accent text-sm font-bold mb-8">
            <Sparkles className="w-4 h-4" /> Discover Your Next Passion
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-ink mb-8 leading-tight">
            次の休日、何して過ごす？
          </h1>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink-light w-5 h-5" />
            <input
              type="text"
              placeholder="興味のあるキーワードを入力（例：癒やし、アクティブ、集中）"
              className="w-full pl-14 pr-6 py-6 bg-white border-2 border-border-light rounded-full focus:border-accent outline-none text-lg shadow-lg shadow-ink/5 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* タブ切り替えと診断ボタン */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-border-light pb-8">
          <div className="flex gap-4 p-1.5 bg-cream rounded-2xl">
            {(['all', 'indoor', 'outdoor'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab ? 'bg-white text-ink shadow-md' : 'text-ink-light hover:text-ink'
                }`}
              >
                {tab === 'all' ? 'すべて' : tab === 'indoor' ? 'インドア' : 'アウトドア'}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setShowComingSoon(true)}
            className="flex items-center gap-3 px-8 py-4 bg-ink text-white rounded-full font-bold hover:bg-accent transition-all shadow-xl hover:shadow-accent/20 group"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            AIに趣味を診断してもらう
          </button>
        </div>
      </div>

      {/* 趣味一覧グリッド */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHobbies.map((hobby) => {
            const imageUrl = getHobbyImageUrl(hobby.id);
            return (
              <Link key={hobby.id} href={`/hobbies/${hobby.id}`}>
                <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-border-light hover:border-accent/30 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                  {imageUrl && (
                    <div className="relative h-56 overflow-hidden">
                      <img src={imageUrl} alt={hobby.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent" />
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-1">
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

      {/* --- ハルのHobbyFlow日記 セクション --- */}
      <section className="max-w-6xl mx-auto py-24 px-6 border-t border-border-light">
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream border border-accent/20 text-accent text-xs font-bold mb-4">
            <Sparkles className="w-3 h-3" /> OFFICIAL AMBASSADOR DIARY
          </div>
          <h2 className="text-3xl font-serif font-bold text-ink">ハルのHobbyFlow日記</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => setSelectedBlog(post)}
              className="group relative h-80 w-full rounded-[2rem] overflow-hidden text-left shadow-md hover:shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0">
                <img 
                  src={getBlogImage(post)} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/20 group-hover:via-ink/30 transition-colors" />
                <div className="absolute inset-0 backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all duration-500" />
              </div>

              <div className="relative h-full p-10 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold tracking-[0.3em] opacity-70 mb-3">{post.date}</span>
                <h3 className="text-2xl font-bold leading-tight mb-4 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-white/70 line-clamp-2 italic font-light max-w-sm mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-xs font-bold tracking-widest text-accent">
                  READ STORY <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* --- ブログ閲覧用モーダル --- */}
      {selectedBlog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-ink/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedBlog(null)} />
          
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            <button 
              onClick={() => setSelectedBlog(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all z-20"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="h-72 sm:h-96 w-full relative">
              <img src={getBlogImage(selectedBlog)} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
            </div>

            <div className="px-8 sm:px-16 pb-20 -mt-16 relative">
              <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-border-light">
                <span className="text-sm font-bold text-accent tracking-tighter mb-4 block">{selectedBlog.date}</span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ink mb-12 leading-snug">
                  {selectedBlog.title}
                </h2>

                <div className="space-y-16 text-ink-light leading-loose text-base sm:text-lg">
                  {selectedBlog.content.map((sec, i) => (
                    <div key={i} className="group">
                      <h4 className="font-bold text-ink text-xl mb-4 flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-accent/30" /> {sec.sectionTitle}
                      </h4>
                      <p className="whitespace-pre-wrap pl-11">{sec.text}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-20 p-10 bg-cream rounded-[2rem] border border-accent/10">
                  <p className="italic text-ink leading-relaxed font-serif text-lg">
                    「{selectedBlog.conclusion}」
                  </p>
                </div>

                <div className="mt-16 flex flex-col items-center border-t border-dashed border-border-light pt-12">
                  <p className="text-sm text-ink-light mb-6 font-bold">この趣味のアイテムや漫画をチェックする</p>
                  <Link 
                    href={`/hobbies/${selectedBlog.hobbyId}`}
                    className="group flex items-center gap-3 px-10 py-5 bg-ink text-white rounded-full font-bold hover:bg-accent transition-all shadow-xl hover:shadow-accent/30"
                  >
                    この趣味のページを見る
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showComingSoon && <ComingSoonModal onClose={() => setShowComingSoon(false)} />}
    </div>
  );
}