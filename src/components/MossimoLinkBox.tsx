'use client';

import { useEffect } from 'react';

const AMAZON_TRACKING_ID = 'hobbyflow-22';

export default function MossimoLinkBox({ html, asin }: { html: string; asin?: string }) {
  useEffect(() => {
    // もしもアフィリエイトのスクリプトを再実行するための処理
    try {
      // 既存の msmaflink オブジェクトがあれば、それを使って再スキャンを試みる
      if (window && (window as any).msmaflink) {
        (window as any).msmaflink();
      } else {
        // スクリプトがまだ読み込まれていない場合は新しく作成
        const script = document.createElement('script');
        script.src = "//dn.msmstatic.com/site/cardlink/bundle.js?20220329";
        script.id = "moshimo-bundle";
        script.async = true;
        document.body.appendChild(script);
      }
    } catch (e) {
      console.error("Moshimo script error:", e);
    }
  }, [html]); // htmlが変わるたびに実行

  return (
    <div className="my-4">
      {/* Amazonボタンだけ自前で追加 */}
      {asin && (
        <a
          href={`https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_TRACKING_ID}`}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center justify-center w-full py-2 px-3 rounded-lg text-[11px] font-bold text-white mb-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#FF9900' }}
        >
          Amazonで見る
        </a>
      )}
      {/* 楽天・Yahoo! はもしもHTMLのまま */}
      <div
        className="moshimo-container min-h-[150px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}