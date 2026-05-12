import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Wallet, BookOpen, ShoppingBag, Sparkles, PenLine } from 'lucide-react';
import MossimoLinkBox from '@/components/MossimoLinkBox';

// ── もしもアフィリエイト設定 ─────────────────────────────────────
// Amazon
const MOSHIMO_AMAZON_A_ID = '5519449';
// 楽天市場
const MOSHIMO_RAKUTEN_A_ID = '5519447';
// Yahoo!ショッピング
const MOSHIMO_YAHOO_A_ID   = '5519448';

// Amazon：もしもアフィリエイト経由（ASINがあれば商品へ、なければ検索へ）
const getAmazonUrl = (asin: string, keyword: string) => {
  const baseUrl = asin 
    ? `https://www.amazon.co.jp/dp/${asin}/`
    : `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword)}`;
  return `https://af.moshimo.com/af/c/click?a_id=${MOSHIMO_AMAZON_A_ID}&p_id=170&pc_id=185&pl_id=27060&url=${encodeURIComponent(baseUrl)}`;
};

// 楽天市場：もしもアフィリエイト経由
const getRakutenUrl = (keyword: string) => {
  const targetUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;
  return `https://af.moshimo.com/af/c/click?a_id=${MOSHIMO_RAKUTEN_A_ID}&p_id=54&pc_id=54&pl_id=27059&url=${encodeURIComponent(targetUrl)}`;
};

// Yahoo!ショッピング：もしもアフィリエイト経由
const getYahooUrl = (keyword: string) => {
  const targetUrl = `https://shopping.yahoo.co.jp/search?p=${encodeURIComponent(keyword)}`;
  return `https://af.moshimo.com/af/c/click?a_id=${MOSHIMO_YAHOO_A_ID}&p_id=1225&pc_id=1925&pl_id=27061&url=${encodeURIComponent(targetUrl)}`;
};

// ── マルチリンクボックス（自作コンポーネント） ─────────────────────────────────────────
function MultiLinkBox({
  name,
  amazonTitle,
  asin,
  imageUrl,
}: {
  name: string;
  amazonTitle?: string;
  asin?: string;
  imageUrl?: string;
}) {
  const displayTitle = amazonTitle || name;
  const searchKeyword = amazonTitle || name;

  return (
    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden flex flex-col sm:flex-row gap-4 p-4 hover:shadow-md transition-shadow">
      {/* 画像部分 */}
      <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-cream/30 rounded-xl overflow-hidden border border-border-light/50 flex items-center justify-center p-2">
        {imageUrl ? (
          <img src={imageUrl} alt={displayTitle} className="max-w-full max-h-full object-contain" />
        ) : (
          <ShoppingBag className="w-8 h-8 text-border-light" />
        )}
      </div>

      {/* テキスト＋ボタン */}
      <div className="flex-1 flex flex-col justify-between gap-3 text-left">
        <div>
          <p className="text-sm font-bold text-ink leading-snug">{displayTitle}</p>
          <p className="text-[10px] text-ink-light/50 mt-0.5">posted with HobbyFlow</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={getAmazonUrl(asin || '', searchKeyword)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 min-w-[80px] text-center py-2 px-3 rounded-lg text-[11px] font-bold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#FF9900' }}
          >
            Amazon
          </a>
          <a
            href={getRakutenUrl(searchKeyword)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 min-w-[80px] text-center py-2 px-3 rounded-lg text-[11px] font-bold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#BF0000' }}
          >
            楽天市場
          </a>
          <a
            href={getYahooUrl(searchKeyword)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 min-w-[80px] text-center py-2 px-3 rounded-lg text-[11px] font-bold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#4192D9' }}
          >
            Yahoo!
          </a>
        </div>
      </div>
    </div>
  );
}

// ── メインページコンポーネント ───────────────────────────────────────────────────
export default async function HobbyDetailPage({ params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), 'src/data/hobbies.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const hobbies = JSON.parse(fileContents);
  const hobby = hobbies.find((h: any) => h.id === params.id);

  if (!hobby) notFound();

  const getHobbyImageUrl = (id: string): string => {
    const index = hobbies.findIndex((h: any) => h.id === id);
    const num = String(index + 1).padStart(3, '0');
    return `/hobby_image_${num}.jpg`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case '低': return 'text-green-600 bg-green-50 border-green-100';
      case '中': return 'text-orange-600 bg-orange-50 border-orange-100';
      case '高': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-ink-light bg-cream border-border-light';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 pt-6 animate-in fade-in duration-700">
      <Link href=\"/\" className=\"inline-flex items-center gap-2 text-sm text-ink-light hover:text-ink transition-colors mb-8\">
        <ArrowLeft className=\"w-4 h-4\" /> 趣味一覧に戻る
      </Link>

      <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12\">
        <div className=\"relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border border-border-light\">
          <Image src={getHobbyImageUrl(hobby.id)} alt={hobby.name} fill className=\"object-cover\" priority />
          <div className=\"absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent\" />
          <div className=\"absolute bottom-8 left-8\">
            <h1 className=\"text-4xl font-black text-white tracking-tighter drop-shadow-lg\">{hobby.name}</h1>
          </div>
        </div>

        <div className=\"flex flex-col justify-center space-y-8\">
          <div className=\"inline-flex flex-wrap gap-2\">
            {hobby.tags.map((tag: string) => (
              <span key={tag} className=\"px-4 py-1.5 bg-white border border-border-light text-ink-light text-xs font-bold rounded-full shadow-sm\">
                #{tag}
              </span>
            ))}
          </div>

          <div className=\"p-8 bg-white rounded-3xl border border-border-light shadow-sm relative overflow-hidden\">
            <div className=\"absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-12 -mt-12\" />
            <p className=\"text-ink leading-relaxed text-lg font-medium relative z-10\" 
               dangerouslySetInnerHTML={{ __html: hobby.pitch.replace(/<<(.*?)>>/g, '<span class=\"text-accent font-bold\">$1</span>') }} />
          </div>

          <div className=\"grid grid-cols-3 gap-4\">
            <div className=\"flex flex-col items-center p-4 bg-cream rounded-2xl border border-border-light shadow-inner\">
              <Clock className=\"w-5 h-5 text-accent mb-2\" />
              <span className=\"text-[10px] text-ink-light font-bold uppercase tracking-widest\">Time</span>
              <span className=\"text-sm font-black text-ink\">{hobby.stats.time}</span>
            </div>
            <div className=\"flex flex-col items-center p-4 bg-cream rounded-2xl border border-border-light shadow-inner\">
              <Wallet className=\"w-5 h-5 text-accent mb-2\" />
              <span className=\"text-[10px] text-ink-light font-bold uppercase tracking-widest\">Cost</span>
              <span className=\"text-sm font-black text-ink\">{hobby.stats.cost}</span>
            </div>
            <div className={`flex flex-col items-center p-4 rounded-2xl border shadow-inner ${getDifficultyColor(hobby.stats.difficulty)}`}>
              <Sparkles className=\"w-5 h-5 mb-2\" />
              <span className=\"text-[10px] font-bold uppercase tracking-widest\">Difficulty</span>
              <span className=\"text-sm font-black\">{hobby.stats.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      <div className=\"bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-border-light mb-12\">
        <div className=\"flex items-center gap-3 mb-8\">
          <div className=\"w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white\">
            <BookOpen className=\"w-6 h-6\" />
          </div>
          <h3 className=\"text-2xl font-bold text-ink\">おすすめの入門書・漫画</h3>
        </div>

        <div className=\"grid grid-cols-1 md:grid-cols-2 gap-10 items-start\">
          <div className=\"space-y-6\">
            <h4 className=\"text-xl font-bold text-ink leading-tight underline decoration-accent/30 decoration-4 underline-offset-8\">
              『{hobby.comic.title}』
            </h4>
            <p className=\"text-ink-light leading-loose\" 
               dangerouslySetInnerHTML={{ __html: hobby.comic.description.replace(/<<(.*?)>>/g, '<span class=\"font-bold text-ink\">$1</span>') }} />
          </div>

          <div className=\"space-y-6\">
            <div className=\"flex flex-col gap-4\">
              {hobby.comic.msmaflink_html ? (
                <>
                  <MossimoLinkBox html={hobby.comic.msmaflink_html} />
                  {hobby.comic.asin && (
                    <a
                      href={getAmazonUrl(hobby.comic.asin, hobby.comic.amazon_title || hobby.comic.title)}
                      target=\"_blank\"
                      rel=\"noopener noreferrer sponsored\"
                      className=\"w-full text-center py-2.5 px-4 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity\"
                      style={{ backgroundColor: '#FF9900' }}
                    >
                      Amazonで見る
                    </a>
                  )}
                </>
              ) : (
                <MultiLinkBox
                  name={hobby.comic.title}
                  amazonTitle={hobby.comic.amazon_title}
                  asin={hobby.comic.asin}
                  imageUrl={hobby.comic.image_url}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className=\"bg-cream/50 rounded-[2.5rem] p-8 sm:p-12 border border-border-light mb-12\">
        <div className=\"flex items-center gap-3 mb-8\">
          <div className=\"w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white\">
            <ShoppingBag className=\"w-6 h-6\" />
          </div>
          <h3 className=\"text-2xl font-bold text-ink\">「形から入る」ための三種の神器</h3>
        </div>

        {hobby.recommend_items && (
          <div className=\"flex flex-col gap-4\">
            {hobby.recommend_items.map((item: any, i: number) => (
              item.msmaflink_html
                ? (
                  <div key={i} className=\"flex flex-col gap-2\">
                    <MossimoLinkBox html={item.msmaflink_html} />
                    {item.asin && (
                      <a
                        href={getAmazonUrl(item.asin, item.amazon_title || item.name)}
                        target=\"_blank\"
                        rel=\"noopener noreferrer sponsored\"
                        className=\"w-full text-center py-2.5 px-4 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity\"
                        style={{ backgroundColor: '#FF9900' }}
                      >
                        Amazonで見る
                      </a>
                    )}
                  </div>
                )
                : <MultiLinkBox
                    key={i}
                    name={item.name}
                    amazonTitle={item.amazon_title}
                    asin={item.asin}
                    imageUrl={item.image_url}
                  />
            ))}
          </div>
        )}
      </div>

      <div className=\"p-8 bg-ink text-cream rounded-3xl relative overflow-hidden shadow-2xl\">
        <Sparkles className=\"absolute top-4 right-4 w-12 h-12 text-accent/20\" />
        <h4 className=\"font-bold mb-3 flex items-center gap-2\">
          <Sparkles className=\"w-5 h-5 text-accent\" />
          AIパートナーからのひとこと
        </h4>
        <p className=\"text-cream/80 italic leading-relaxed\">
          「{hobby.name}の世界へようこそ。まずは形から入るのも一つの楽しみです。あなたのペースで、新しい景色を見つけに行きましょう。」
        </p>
      </div>

      <div className=\"mt-12 flex justify-center pb-8\">
        <Link
          href={`/records/new?hobbyId=${hobby.id}`}
          className=\"flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all\"
        >
          <PenLine className=\"w-5 h-5\" />
          この趣味の第一歩を記録する
        </Link>
      </div>
    </div>
  );
}