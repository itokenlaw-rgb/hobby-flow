import { blogPosts } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Edit3 } from 'lucide-react';
import hobbiesData from '@/data/hobbies.json';

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === params.id);

  if (!post) notFound();

  // 趣味の画像を流用するためのロジック（型エラーを修正）
  const getHobbyImageUrl = (hobbyId: string): string => {
    const index = (hobbiesData as any[]).findIndex((h) => h.id === hobbyId);
    // nullではなく、必ずstringを返すようにフォールバックを設定
    if (index < 0) return `/hobby_image_001.jpg`; 
    const num = String(index + 1).padStart(3, '0');
    return `/hobby_image_${num}.jpg`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-in fade-in duration-700">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-ink-light hover:text-ink mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> トップページに戻る
      </Link>

      <article className="bg-white rounded-3xl shadow-sm border border-border-light overflow-hidden">
        {/* ヘッダー画像 */}
        <div className="h-64 bg-ink relative">
          <img 
            src={getHobbyImageUrl(post.hobbyId)}
            alt={post.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-md">
              {post.title}
            </h1>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          {/* 記事情報：人間味を出すために「執筆者」を強調 */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-light mb-10 pb-6 border-b border-border-light">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-accent" />
              </div>
              <span>執筆者: ハル</span>
            </div>
            <div className="text-xs px-2 py-0.5 bg-cream rounded border border-border-light">体験記</div>
          </div>

          {/* 記事本文 */}
          <div className="space-y-12 text-left">
            {post.content.map((section, i) => (
              <section key={i} className="space-y-4">
                <h2 className="text-xl font-bold text-ink flex items-center gap-3">
                  <span className="flex-shrink-0 w-1.5 h-6 bg-accent rounded-full" />
                  {section.sectionTitle}
                </h2>
                <div className="text-ink-light leading-loose tracking-wide whitespace-pre-wrap pl-4">
                  {section.text}
                </div>
              </section>
            ))}
          </div>

          {/* おわりに：運営者の想いを込める */}
          <div className="mt-16 p-8 bg-cream/30 rounded-2xl border border-dashed border-border-light relative overflow-hidden">
            <Edit3 className="absolute -top-2 -right-2 w-16 h-16 text-accent/5 rotate-12" />
            <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              おわりに
            </h3>
            <p className="text-ink-light italic leading-relaxed relative z-10">
              {post.conclusion}
            </p>
          </div>
        </div>
      </article>

      {/* ページ下部のお問い合わせへの誘導（信頼性向上） */}
      <div className="mt-12 text-center">
        <p className="text-xs text-ink-light">
          この記事や趣味に関するご感想は
          <Link href="/policy" className="mx-1 text-accent underline underline-offset-4">お問い合わせフォーム</Link>
          からお寄せください。
        </p>
      </div>
    </div>
  );
}

// 共通アイコンのインポート漏れ防止
function Sparkles(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
  );
}