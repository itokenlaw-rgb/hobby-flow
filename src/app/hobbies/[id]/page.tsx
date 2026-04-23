import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Wallet, BookOpen, ShoppingBag, Sparkles, ExternalLink, PenLine } from 'lucide-react';

const AMAZON_TRACKING_ID = 'hobbyflow-22';

const getAmazonUrl = (asin: string) => `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_TRACKING_ID}`;

const getAmazonCoverUrl = (asin: string) => {
  return `https://m.media-amazon.com/images/I/${asin}._AC_SS200_.jpg`;
};


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
  const hobbyIndex = hobbiesData.findIndex((h: any) => h.id === id);
  const hobby = hobbiesData[hobbyIndex];

  if (!hobby) notFound();

  const imageNumber = String(hobbyIndex + 1).padStart(3, '0');
  const imageUrl = `/hobby_image_${imageNumber}.jpg`;

  const formatTextWithBold = (text: string, color: string) => {
    if (!text) return null;
    return text.split(/(<<.*?>>)/g).map((part, i) => {
      if (part.startsWith('<<') && part.endsWith('>>')) {
        return <strong key={i} className={`${color} font-bold mx-0.5`}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const formatParagraphsDark = (text: string) => {
    if (!text) return null;
    return text.split('\n').filter(line => line.trim() !== '').map((line, i) => (
      <p key={i} className="mb-4 leading-loose tracking-wide">{formatTextWithBold(line, 'text-ink')}</p>
    ));
  };

  const fullPitch = hobby.pitch || '';
  const firstKutenIndex = fullPitch.indexOf('。');
  const catchphrase = firstKutenIndex !== -1 ? fullPitch.slice(0, firstKutenIndex + 1) : fullPitch;
  const remainingPitch = firstKutenIndex !== -1 ? fullPitch.slice(firstKutenIndex + 1).trim() : '';

  let youtube = hobby.youtube;
  if (!youtube) {
    const query = `${hobby.name} 初心者 おすすめ 始め方`;
    youtube = {
      search_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      search_query: query
    };
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 animate-in fade-in duration-700">

      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl mb-8" style={{ minHeight: '420px' }}>
        <Image src={imageUrl} alt={hobby.name} fill className="object-cover" unoptimized priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute top-3 left-4">
          <Link href="/" className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4 mr-1" />TOPに戻る</Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">{hobby.name}</h1>
          <p className="text-base text-white/80 italic drop-shadow">{formatTextWithBold(catchphrase, 'text-white')}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {hobby.tags?.map((t: string) => (<span key={t} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-xs text-white shadow-sm">{t}</span>))}
          </div>
        </div>
      </div>

      {remainingPitch && <div className="text-ink text-lg leading-relaxed italic mb-10 px-1 border-b border-border-light pb-8">{formatParagraphsDark(remainingPitch)}</div>}

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-ink mb-4"><Clock className="w-5 h-5 text-accent" />自分の時間</h3>
          <div className="text-sm text-ink-light">{formatParagraphsDark(hobby.duration)}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border-light shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-ink mb-4"><Wallet className="w-5 h-5 text-accent" />必要予算</h3>
          <div className="text-sm text-ink-light">{formatParagraphsDark(hobby.budget)}</div>
        </div>
      </div>

      {hobby.comic?.title && (
        <div className="bg-white p-8 rounded-2xl border-l-8 border-l-accent border border-border-light shadow-sm mb-10">
          <h3 className="flex items-center gap-2 font-bold text-ink mb-6"><BookOpen className="w-5 h-5 text-accent" />インスピレーション：『{hobby.comic.title}』</h3>
          <div className="flex gap-6 items-start">
            {hobby.comic.asin && (
              <a href={getAmazonUrl(hobby.comic.asin)} target="_blank" rel="noopener noreferrer sponsored" className="flex-shrink-0 flex flex-col items-center gap-2 group">
                {hobby.comic.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={hobby.comic.image_url}
                    alt={hobby.comic.title}
                    width={90}
                    height={128}
                    referrerPolicy="no-referrer"
                    className="rounded-lg shadow-md border border-border-light object-cover w-[90px] h-[128px]"
                  />
                ) : (
                  <div className="w-[90px] h-[128px] rounded-lg border border-dashed border-border-light bg-cream/50 flex items-center justify-center text-ink-light/40 text-xs text-center p-2">
                    画像準備中
                  </div>
                )}
                <span className="text-xs text-accent flex items-center gap-0.5 group-hover:underline">Amazonで見る <ExternalLink className="w-3 h-3" /></span>
                <span className="text-[10px] text-ink-light/60">PR</span>
              </a>
            )}
            <div className="flex-1 text-sm text-ink-light leading-relaxed">{formatParagraphsDark(hobby.comic.description)}</div>
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

      {/* 準備するもの & おすすめグッズ */}
      <div className="mb-16">
        <h3 className="flex items-center gap-2 font-bold text-ink mb-6">
          <ShoppingBag className="w-5 h-5 text-accent" />
          おすすめグッズ
        </h3>

        <div className="text-sm text-ink-light leading-relaxed bg-white/50 p-6 rounded-2xl border border-dashed border-border-light mb-8">
          {formatParagraphsDark(hobby.goods)}
        </div>

        {hobby.recommend_items && hobby.recommend_items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {hobby.recommend_items.map((item: any, i: number) => (
              <div key={i} className="flex flex-col items-center group">
                <a
                  href={getAmazonUrl(item.asin)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex-shrink-0 mb-3 block"
                >
                  {item.image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.image_url}
                      alt={item.name}
                      width={160}
                      height={160}
                      referrerPolicy="no-referrer"
                      className="rounded-lg shadow-md border border-border-light object-contain w-40 h-40 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    /* 画像URLが未登録の場合はプレースホルダー */
                    <div className="w-40 h-40 rounded-lg border border-dashed border-border-light bg-cream/50 flex items-center justify-center text-ink-light/40 text-xs text-center p-2">
                      画像準備中
                    </div>
                  )}
                </a>
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="text-[12px] font-bold text-ink line-clamp-2 leading-snug h-9 px-2">
                    {item.name}
                  </span>
                  <a
                    href={getAmazonUrl(item.asin)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="text-xs text-accent flex items-center gap-0.5 hover:underline"
                  >
                    Amazonで見る <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AIパートナーセクション */}
      <div className="p-8 bg-ink text-cream rounded-3xl relative overflow-hidden shadow-2xl">
        <Sparkles className="absolute top-4 right-4 w-12 h-12 text-accent/20" />
        <h4 className="font-bold mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent" />AIパートナーからのひとこと</h4>
        <p className="text-cream/80 italic leading-relaxed">「{hobby.name}の世界へようこそ。まずは形から入るのも一つの楽しみです。あなたのペースで、新しい景色を見つけに行きましょう。」</p>
      </div>

      <div className="mt-12 flex justify-center pb-8">
        <Link 
          href={`/records/new?hobbyId=${hobby.id}`}
          className="flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 transform"
        >
          <PenLine className="w-6 h-6" />
          この趣味を記録する
        </Link>
      </div>

    </div>
  );
}