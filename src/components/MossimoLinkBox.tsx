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

    // もしもHTMLが描画されてボタンが出たあと、Amazonボタンを先頭に挿入する
    if (!asin || !containerRef.current) return;

    const injectAmazonBtn = () => {
      const container = containerRef.current;
      if (!container) return;

      // すでに挿入済みならスキップ
      if (container.querySelector('.amazon-inject-btn')) return;

      // もしもが生成するボタンラッパーを探す（複数パターン対応）
      const btnArea =
        container.querySelector('.buttons') ||        // もしも標準クラス
        container.querySelector('.link-buttons') ||
        container.querySelector('[class*="button"]');

      const amazonBtn = document.createElement('a');
      amazonBtn.href = `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_TRACKING_ID}`;
      amazonBtn.target = '_blank';
      amazonBtn.rel = 'noopener noreferrer sponsored';
      amazonBtn.className = 'amazon-inject-btn';
      amazonBtn.textContent = 'Amazonで見る';
      // もしもボタンと同じ見た目に合わせるスタイル
      amazonBtn.style.cssText = `
        display: block;
        width: 100%;
        padding: 10px 12px;
        margin-bottom: 8px;
        border-radius: 6px;
        background-color: #FF9900;
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
        text-decoration: none;
        box-sizing: border-box;
      `;

      if (btnArea) {
        // ボタンエリアの最初の子として挿入
        btnArea.insertBefore(amazonBtn, btnArea.firstChild);
      } else {
        // ボタンエリアが見つからない場合はコンテナ末尾に追加
        container.appendChild(amazonBtn);
      }
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
