import { blogPosts } from '@/data/blogPosts'; // パスが正しいか確認してください
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import hobbiesData from '@/data/hobbies.json';

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === params.id);

  if (!post) notFound();

  // 趣味の画像を流用するためのロジック
  const getHobbyImageUrl = (hobbyId: string): string | null => {
    const index = (hobbiesData as any[]).findIndex((h) => h.id === hobbyId);
    if (index < 0) return `/hobby_image_001.jpg`; // 見つからない時のフォールバック
    const num = String(index + 1).padStart(3, '0');
    return `/hobby_image_${num}.jpg`;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-in fade-in duration-700">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-ink-light hover:text-ink mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> トップページに戻る
      </Link>

      <article className="bg-white rounded-3xl shadow-sm border border-border-light overflow-hidden">
        <div className="h-64 bg-ink relative">
          <img 
            src={getHobbyImageUrl(post.hobbyId)}
            alt={post.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute bottom-8 left-8 right-8 text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{post.title}</h1>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <div className="flex items-center gap-6 text-sm text-ink-light mb-10 pb-6 border-b border-border-light">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</div>
            <div className="flex items-center gap-2"><User className="w-4 h-4" /> ハル</div>
          </div>

          <div className="space-y-12 text-left">
            {post.content.map((section, i) => (
              <section key={i} className="space-y-4">
                <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-accent rounded-full" />
                  {section.sectionTitle}
                </h2>
                <p className="text-ink-light leading-relaxed whitespace-pre-wrap">{section.text}</p>
              </section>
            ))}
          </div>

          <div className="mt-16 p-8 bg-cream/30 rounded-2xl border border-dashed border-border-light">
            <h3 className="font-bold text-ink mb-2">おわりに</h3>
            <p className="text-ink-light italic">{post.conclusion}</p>
          </div>
        </div>
      </article>
    </div>
  );
}