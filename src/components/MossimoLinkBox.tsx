'use client';

import { useEffect } from 'react';

export default function MossimoLinkBox({ html }: { html: string }) {
  useEffect(() => {
    // 既存のスクリプトを一旦削除して、確実に再実行させる
    const scriptId = 'moshimo-js-sdk';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = "//dn.msmstatic.com/site/cardlink/bundle.js?20220329";
    script.async = true;
    
    // スクリプトが読み込まれたら即座に実行する命令
    script.onload = () => {
      if (typeof (window as any).msmaflink === 'function') {
        (window as any).msmaflink();
      }
    };

    document.body.appendChild(script);

    // 画面遷移後、メモリ上に残っている関数を直接叩く（予備）
    const timer = setTimeout(() => {
      if (typeof (window as any).msmaflink === 'function') {
        (window as any).msmaflink();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [html]); // HTMLの中身（商品）が変わるたびに実行

  return (
    <div 
      className="moshimo-link-wrapper my-6 clear-both" 
      // ★ 枠線（border）や影（shadow）を削除し、もしも側のデザインに任せる
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}