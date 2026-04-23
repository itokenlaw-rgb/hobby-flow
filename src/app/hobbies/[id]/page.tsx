import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Wallet, BookOpen, ShoppingBag, Sparkles, PenLine } from 'lucide-react';

const AMAZON_TRACKING_ID = 'hobbyflow-22';

const getAmazonUrl = (asin: string) =>
  `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_TRACKING_ID}`;

// 商品名でそれぞれのショッピングサイトを検索するURL
const getRakutenUrl = (name: string) =>
  `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(name)}/`;

const getYahooUrl = (name: string) =>
  `https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(name)}`;

// ── マルチリンクボックス（共通コンポーネント） ──────────────────────────────
function MultiLinkBox({ 
  name,          // 内部管理用の短い名前（楽天・Yahoo検索キーワードにも使用）
  amazonTitle,   // Amazonの正式商品名（あればこちらを表示・Amazon検索にも使用）
  asin, 
  imageUrl 
}: { 
  name: string;
  amazonTitle?: string;
  asin: string; 
  imageUrl?: string; 
}) {
  // 表示用タイトル：amazon_title > name の順で優先
  const displayTitle = amazonTitle || name;
  // Amazon検索キーワード：amazon_title > name
  const amazonSearchKeyword = amazonTitle || name;

  return (
    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden p-4 sm:p-5 mb-6 flex flex-col sm:flex-row gap-5 hover:shadow-md transition-shadow">
      {/* 左：商品画像 */}
      <div className="w-full sm:w-32 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg p-2">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={displayTitle} 
            className="max-h-32 object-contain shadow-sm"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="text-[10px] text-ink-light/40 italic">No Image</div>
        )}
      </div>

      {/* 右：タイトルと各社ボタン */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="mb-4">
          <h4 className="text-sm font-bold text-ink leading-snug mb-1">{displayTitle}</h4>
          <p className="text-[10px] text-ink-light/50">posted with HobbyFlow</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {/* Amazon */}
          <a 
            href={getAmazonUrl(asin)} 
            target="_blank" 
            rel="noopener noreferrer sponsored" 
            className="flex-1 min-w-[90px] text-center py-2 px-3 bg-[#FF9900] text-white text-[11px] font-bold rounded hover:opacity-90 transition-opacity"
          >
            Amazon
          </a>
          {/* 楽天 */}
          <a 
            href={getRakutenUrl(amazonSearchKeyword)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 min-w-[90px] text-center py-2 px-3 bg-[#BF0000] text-white text-[11px] font-bold rounded hover:opacity-90 transition-opacity"
          >
            楽天市場
          </a>
          {/* Yahoo */}
          <a 
            href={getYahooUrl(amazonSearchKeyword)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 min-w-[90px] text-center py-2 px-3 bg-[#4192D9] text-white text-[11px] font-bold rounded hover:opacity-90 transition-opacity"
          >
            Yahoo!
          </a>
        </div>
      </div>
    </div>
  );
}

// ── ヘルパー関数 ──────────────────────────────────────────────────
function formatParagraphsDark(text: string) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const processedLine = line.replace(/<<(.*?)>>/g, '<strong class="text-accent">$1</strong>');
    return (
      <p key={i} className="mb-4 last:mb-0" dangerouslySetInnerHTML={{ __html: processedLine }} />
    );
  });
}

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'src/data/hobbies.json');
  if (!fs.existsSync(filePath)) return [];
  const hobbiesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return hobbiesData.map((hobby: any) => ({ id: hobby.id }));
}

export default async function HobbyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), 'src/data/hobbies.json');
  const hobbiesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const hobby = hobbiesData.find((h: any) => h.id === id);

  if (!hobby) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 animate-in fade-in duration-700">
      {/* 戻るボタン */}
      <div className="py-6">
        <Link href="/" className="inline-flex items-center text-sm text-ink-light hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> 趣味を探すに戻る
        </Link>
      </div>

      {/* ヒーローセクション */}
      <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden mb-8 shadow-xl">
        <Image src={hobby.image_url} alt={hobby.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="absolute bottom-8 left-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight">{hobby.name}</h1>
          <div className="flex gap-2">
            {hobby.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full border border-white/30">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>


      {/* 紹介文 */}
      <div className="bg-white p-8 rounded-3xl border border-border-light shadow-sm mb-10 leading-relaxed text-ink/90 italic text-lg">
        {formatParagraphsDark(hobby.pitch)}
      </div>

      {/* スペック（予算・時間） */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <div className="bg-cream p-6 rounded-2xl border border-border-light">
          <div className="flex items-center gap-2 text-accent font-bold mb-2">
            <Wallet className="w-5 h-5" /> 予算の目安
          </div>
          <div className="text-sm text-ink-light leading-relaxed">{formatParagraphsDark(hobby.budget)}</div>
        </div>
        <div className="bg-cream p-6 rounded-2xl border border-border-light">
          <div className="flex items-center gap-2 text-accent font-bold mb-2">
            <Clock className="w-5 h-5" /> 必要な時間
          </div>
          <div className="text-sm text-ink-light leading-relaxed">{formatParagraphsDark(hobby.duration)}</div>
        </div>
      </div>

      {/* 漫画セクション */}
      {hobby.comic?.title && (
        <div className="mb-10">
          <h3 className="flex items-center gap-2 font-bold text-ink mb-6 italic">
            <BookOpen className="w-5 h-5 text-accent" />
            {hobby.comic.title} を読んで、世界観に浸る。
          </h3>
          <MultiLinkBox 
            name={hobby.comic.title} 
            amazonTitle={hobby.comic.amazon_title}
            asin={hobby.comic.asin} 
            imageUrl={hobby.comic.image_url} 
          />
          <div className="text-sm text-ink-light leading-relaxed bg-cream/30 p-6 rounded-2xl border border-border-light">
            {formatParagraphsDark(hobby.comic.description)}
          </div>
        </div>
      )}


      {/* YouTube検索セクション */}
      <div className="bg-white p-8 rounded-2xl border border-border-light shadow-sm mb-10">
        <h3 className="flex items-center gap-2 font-bold text-ink mb-4">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#FF0000]"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          動画で学ぶ
        </h3>
        <p className="text-sm text-ink-light mb-5 leading-relaxed">はじめてでも安心。動画で{hobby.name}の始め方やコツをチェックしてみましょう。</p>
        <a href={youtube.search_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200" style={{ backgroundColor: '#FF0000' }}>
          動画を検索
        </a>
      </div>


      {/* グッズセクション */}
      <div className="mb-16">
        <h3 className="flex items-center gap-2 font-bold text-ink mb-6">
          <ShoppingBag className="w-5 h-5 text-accent" />
          おすすめのアイテム
        </h3>
        
        {/* アイテムカード一覧 */}
        {hobby.recommend_items && hobby.recommend_items.length > 0 && (
          <div className="flex flex-col gap-2">
            {hobby.recommend_items.map((item: any, i: number) => (
              <MultiLinkBox 
                key={i} 
                name={item.name}
                amazonTitle={item.amazon_title}
                asin={item.asin} 
                imageUrl={item.image_url} 
              />
            ))}
          </div>
        )}

        <div className="text-sm text-ink-light leading-relaxed bg-white/50 p-6 rounded-2xl border border-dashed border-border-light mt-6">
          {formatParagraphsDark(hobby.goods)}
        </div>
      </div>

      {/* AIパートナーセクション */}
      <div className="p-8 bg-ink text-cream rounded-3xl relative overflow-hidden shadow-2xl">
        <Sparkles className="absolute top-4 right-4 w-12 h-12 text-accent/20" />
        <h4 className="font-bold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          AIパートナーからのひとこと
        </h4>
        <p className="text-cream/80 italic leading-relaxed">
          「{hobby.name}の世界へようこそ。まずは形から入るのも一つの楽しみです。あなたのペースで、新しい景色を見つけに行きましょう。」
        </p>
      </div>

      {/* 記録ボタン固定フッター */}
      <div className="mt-12 flex justify-center pb-8">
        <Link 
          href={`/records/new?hobbyId=${hobby.id}`}
          className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-accent/40 transition-all active:scale-95"
        >
          <PenLine className="w-5 h-5" />
          この趣味を記録する
        </Link>
      </div>
    </div>
  );
}