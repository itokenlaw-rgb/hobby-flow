import { blogPosts } from '@/data/blogPosts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Calendar, Compass } from 'lucide-react';
import hobbiesData from '@/data/hobbies.json';

// ── 静的パスの生成 ───────────────────────────────────────────────
export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.id }));
}

// ── 趣味インデックスから画像URLを生成 ────────────────────────────
function getHobbyImageUrl(hobbyId: string): string {
  const index = (hobbiesData as any[]).findIndex((h) => h.id === hobbyId);
  if (index < 0) return '/hobby_image_001.jpg';
  return `/hobby_image_${String(index + 1).padStart(3, '0')}.jpg`;
}

// ── ページ本体 ───────────────────────────────────────────────────
export default function BlogDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const post = blogPosts.find((p) => p.id === params.id);
  if (!post) notFound();

  // 画像：imageOverride が設定されていればそちらを、なければ趣味画像を流用
  const heroImage = post.imageOverride || getHobbyImageUrl(post.hobbyId);

  // 関連する趣味データ
  const relatedHobby = (hobbiesData as any[]).find((h) => h.id === post.hobbyId);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 animate-in fade-in duration-700">

      {/* 戻るリンク */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-ink-light hover:text-ink mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> トップページに戻る
      </Link>

      <article className="bg-white rounded-3xl shadow-sm border border-border-light overflow-hidden">

        {/* ── ヒーロー画像 ── */}
        <div className="relative h-64 sm:h-80">
          <Image
            src={heroImage}
            alt={post.title}
            fill
            className="object-cover"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-2 text-white/60 text-xs mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-white/80">体験記</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug drop-shadow-md">
              {post.title}
            </h1>
          </div>
        </div>

        {/* ── 記事本文 ── */}
        <div className="p-8 sm:p-12">

          {/* 執筆者バッジ */}
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-border-light">
            <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent flex-shrink-0">
              ハ
            </div>
            <div>
              <p className="text-sm font-bold text-ink">ハル</p>
              <p className="text-xs text-ink-light">HobbyFlow アンバサダー</p>
            </div>
          </div>

          {/* 導入：excerpt */}
          <p className="text-base text-ink-light italic leading-loose mb-10 pl-4 border-l-4 border-accent/30">
            {post.excerpt}
          </p>

          {/* 各セクション */}
          <div className="space-y-12">
            {post.content.map((section, i) => (
              <section key={i} className="space-y-4">
                <h2 className="text-lg font-bold text-ink flex items-center gap-3">
                  <span className="flex-shrink-0 w-1.5 h-6 bg-accent rounded-full" />
                  {section.sectionTitle}
                </h2>
                <div className="text-sm text-ink-light leading-loose tracking-wide whitespace-pre-wrap pl-5">
                  {section.text}
                </div>
              </section>
            ))}
          </div>

          {/* おわりに */}
          <div className="mt-14 p-7 bg-cream/40 rounded-2xl border border-dashed border-border-light">
            <h3 className="font-bold text-ink mb-3 text-sm flex items-center gap-2">
              <span className="text-accent">✦</span> おわりに
            </h3>
            <p className="text-sm text-ink-light italic leading-loose">
              {post.conclusion}
            </p>
          </div>

          {/* ── 関連する趣味ページへのリンク ── */}
          {relatedHobby && (
            <div className="mt-12 pt-8 border-t border-border-light">
              <p className="text-xs font-bold text-ink-light tracking-widest uppercase mb-4">
                この記事の趣味を詳しく見る
              </p>
              <Link
                href={`/hobbies/${relatedHobby.id}`}
                className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-border-light hover:border-accent/40 hover:shadow-md transition-all"
              >
                {/* 趣味の画像サムネイル */}
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={heroImage}
                    alt={relatedHobby.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink group-hover:text-accent transition-colors">
                    {relatedHobby.name}
                  </p>
                  <p className="text-xs text-ink-light mt-1 line-clamp-2">
                    {relatedHobby.pitch?.replace(/<<|>>/g, '')}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-accent flex-shrink-0">
                  <Compass className="w-4 h-4" />
                  <span className="hidden sm:inline">趣味ページへ</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          )}

        </div>
      </article>

      {/* ページ下部リンク */}
      <div className="mt-10 text-center text-xs text-ink-light">
        この記事に関するご感想は
        <Link href="/policy" className="mx-1 text-accent underline underline-offset-4">
          プライバシーポリシー・お問い合わせ
        </Link>
        からお寄せください。
      </div>
    </div>
  );
}
