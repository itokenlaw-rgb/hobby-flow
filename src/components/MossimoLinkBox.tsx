'use client';

import { useEffect } from 'react';

export default function MossimoLinkBox({ html }: { html: string }) {
  useEffect(() => {
    // msmaflinkを呼び出す共通関数
    const triggerMoshimo = () => {
      if (typeof (window as any).msmaflink === 'function') {
        (window as any).msmaflink();
      }
    };

    const scriptId = 'moshimo-js-sdk';
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
      // 1. スクリプトが存在しない場合（初回読み込み時）
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "//dn.msmstatic.com/site/cardlink/bundle.js?20220329";
      script.async = true;
      script.onload = triggerMoshimo;
      document.body.appendChild(script);
    } else {
      // 2. スクリプトがすでに存在する場合（SPA遷移時）
      // DOMが更新されるのを待ってから関数を直接叩く
      triggerMoshimo();
    }

    // ── SPA遷移対策の決定打 ──
    // Next.jsのレンダリング直後はDOMがまだ準備できていない場合があるため、
    // タイマーを重ねて実行し、確実に関数を呼び出す
    const timers = [
      setTimeout(triggerMoshimo, 50),
      setTimeout(triggerMoshimo, 200),
      setTimeout(triggerMoshimo, 500),
    ];

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [html]); // html（商品データ）が切り替わるたびに再実行

  return (
    <div 
      className="moshimo-link-wrapper my-6 clear-both" 
      // 既存のコンテンツ（「リンク」という文字など）を一度空にするため、keyをhtmlに設定
      key={html.substring(0, 50)} 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}