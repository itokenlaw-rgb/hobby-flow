'use client';

import { useEffect, useRef } from 'react';

const AMAZON_TRACKING_ID = 'hobbyflow-22';

export default function MossimoLinkBox({ html, asin }: { html: string; asin?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if ((window as any).msmaflink) {
        (window as any).msmaflink();
      } else if (!document.getElementById('moshimo-bundle')) {
        const script = document.createElement('script');
        script.src = '//dn.msmstatic.com/site/cardlink/bundle.js?20220329';
        script.id = 'moshimo-bundle';
        script.async = true;
        document.body.appendChild(script);
      }
    } catch (e) {
      console.error('Moshimo script error:', e);
    }
  }, [html]);

  useEffect(() => {
    if (!asin || !containerRef.current) return;

    const injectBtn = () => {
      const container = containerRef.current;
      if (!container || container.querySelector('.amazon-inject-btn')) return;

      // もしもが生成するボタン（<a>タグ）を探す
      const existingBtns = container.querySelectorAll('a[href*="moshimo"], a[href*="rakuten"], a[href*="yahoo"], a[href*="af.moshimo"]');

      if (existingBtns.length === 0) return; // まだ描画されていない

      // 最初のボタンを基準にサイズ・スタイルを合わせる
      const refBtn = existingBtns[0] as HTMLElement;
      const refStyle = window.getComputedStyle(refBtn);

      const amazonBtn = document.createElement('a');
      amazonBtn.href = `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_TRACKING_ID}`;
      amazonBtn.target = '_blank';
      amazonBtn.rel = 'noopener noreferrer sponsored';
      amazonBtn.className = 'amazon-inject-btn';
      amazonBtn.textContent = 'Amazonで見る';
      amazonBtn.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: #FF9900;
        color: #fff;
        font-weight: ${refStyle.fontWeight || '700'};
        font-size: ${refStyle.fontSize || '12px'};
        font-family: ${refStyle.fontFamily};
        border-radius: ${refStyle.borderRadius || '6px'};
        padding: ${refStyle.padding || '10px 12px'};
        height: ${refStyle.height !== 'auto' ? refStyle.height : 'auto'};
        min-height: ${refStyle.minHeight || 'unset'};
        width: ${refStyle.width !== 'auto' ? refStyle.width : 'auto'};
        flex: ${refStyle.flex || '1'};
        text-decoration: none;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
      `;

      // ボタンの親（flex コンテナ）の先頭に挿入
      const btnParent = refBtn.parentElement;
      if (btnParent) {
        btnParent.insertBefore(amazonBtn, btnParent.firstChild);
      }
    };

    const observer = new MutationObserver(injectBtn);
    observer.observe(containerRef.current, { childList: true, subtree: true });
    const timer = setTimeout(injectBtn, 1500);

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
