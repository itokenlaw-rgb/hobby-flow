'use client';

import { useEffect } from 'react';

export default function MossimoLinkBox({ html }: { html: string }) {
  useEffect(() => {
    // 1. もしもアフィリエイトのスクリプト本体を読み込む
    const scriptId = 'moshimo-js-sdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "//dn.msmstatic.com/site/cardlink/bundle.js?20220329";
      script.async = true;
      document.body.appendChild(script);
    }

    // 2. スクリプトが読み込まれた後、またはページ遷移後に、
    // 貼り付けられたHTMLをカード形式に書き換える関数を強制実行する
    const renderMoshimo = () => {
      if (typeof (window as any).msmaflink === 'function') {
        (window as any).msmaflink();
      }
    };

    // 少し時間を置いて実行（HTMLがDOMに反映されるのを待つため）
    const timer = setTimeout(renderMoshimo, 100);
    const timerLong = setTimeout(renderMoshimo, 500); // 念のための予備実行

    return () => {
      clearTimeout(timer);
      clearTimeout(timerLong);
    };
  }, [html]);

  return (
    <div 
      className="moshimo-link-wrapper my-6 overflow-hidden rounded-2xl border border-border-light shadow-sm bg-white p-2 min-h-[150px]"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}