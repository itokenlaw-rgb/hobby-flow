'use client';

import { useEffect } from 'react';

export default function MossimoLinkBox({ html }: { html: string }) {
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
    <div 
      className="moshimo-container my-4 min-h-[150px]" 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}