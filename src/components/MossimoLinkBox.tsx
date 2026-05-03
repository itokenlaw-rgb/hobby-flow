'use client';

import { useEffect, useRef } from 'react';

/**
 * MossimoLinkBox
 * もしもアフィリエイトの「かんたんリンク」HTMLを表示するクライアントコンポーネント。
 * dangerouslySetInnerHTMLだけではscriptが実行されないため、
 * useEffect内でscriptを動的に再生成・実行する。
 */
export default function MossimoLinkBox({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !html) return;

    // ① HTMLを挿入
    container.innerHTML = html;

    // ② script タグを取り出して再実行（dangerouslySetInnerHTMLではscriptが実行されないため）
    const scripts = container.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      // src 属性があれば外部スクリプト
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = true;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      // type属性を引き継ぐ
      if (oldScript.type) newScript.type = oldScript.type;
      // 古いscriptを新しいものに置き換え
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="moshimo-link-box"
      // SSR時のフォールバック表示（scriptが未実行の状態）
      // hydration後にuseEffectが実行されてもしもリンクが描画される
    />
  );
}
