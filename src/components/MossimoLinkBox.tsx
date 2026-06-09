'use client';

import { useEffect, useRef } from 'react';

const AMAZON_TRACKING_ID = 'hobbyflow-22';

export default function MossimoLinkBox({ html, asin }: { html: string; asin?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // もしもアフィリエイトのスクリプトを実行
    const runMoshimo = () => {
      try {
        if ((window as any).msmaflink) {
          (window as any).msmaflink();
        } else {
          if (!document.getElementById('moshimo-bundle')) {
            const script = document.createElement('script');
            script.src = '//dn.msmstatic.com/site/cardlink/bundle.js?20220329';
            script.id = 'moshimo-bundle';
            script.async = true;
            document.body.appendChild(script);
          }
        }
      } catch (e) {
        console.error('Moshimo script error:', e);
      }
    };

    runMoshimo();

    if (!asin || !containerRef.current) return;

    const injectAmazonBtn = () => {
      const container = containerRef.current;
      if (!container) return;

      // すでに挿入済みならスキップ
      if (container.querySelector('.amazon-inject-btn')) return;

      // もしもが生成するボタンラッパーを探す
      const btnArea =
        container.querySelector('.buttons') ||        // もしも標準クラス
        container.querySelector('.link-buttons') ||
        container.querySelector('[class*="button"]');

      if (!btnArea) return;

      // もしもの親要素（.buttons）がフレックスボックスになっているため、
      // 他のボタンと同じように等幅で並ぶようスタイルを設定します
      const amazonBtn = document.createElement('a');
      amazonBtn.href = `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_TRACKING_ID}`;
      amazonBtn.target = '_blank';
      amazonBtn.rel = 'noopener noreferrer sponsored';
      amazonBtn.className = 'amazon-inject-btn';
      amazonBtn.textContent = 'Amazonで見る';
      
      // もしもボタン（縦横サイズ・文字、および flex 子要素としての挙動）に合わせるスタイル
      amazonBtn.style.cssText = `
        display: block;
        flex: 1 1 0%;
        min-width: 80px;
        padding: 10px 12px;
        border-radius: 6px;
        background-color: #FF9900;
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
        text-decoration: none;
        box-sizing: border-box;
        margin: 0; /* もしもの既存marginとの競合を防ぐ */
      `;

      // 既存のボタンエリアの最初（左側）に挿入して3つ並びにします
      btnArea.insertBefore(amazonBtn, btnArea.firstChild);
    };

    // もしもスクリプトの描画を待ってから挿入（MutationObserver で監視）
    const observer = new MutationObserver(() => {
      injectAmazonBtn();
    });

    observer.observe(containerRef.current, { childList: true, subtree: true });

    // 念のため遅延でも試みる
    const timer = setTimeout(injectAmazonBtn, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [html, asin]);

  return (
    <div ref={containerRef} className="moshimo-container my-4 min-h-[150px]">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}