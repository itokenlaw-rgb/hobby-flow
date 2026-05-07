'use client';

import { useEffect, useRef } from 'react';

const BUNDLE_URL = '//dn.msmstatic.com/site/cardlink/bundle.js?20220329';
const BUNDLE_ID  = 'moshimo-js-sdk';

/**
 * MossimoLinkBox - 決定版
 *
 * 【問題】
 * Next.js SPA遷移時、bundle.jsは読み込み済みのため script.onload が発火しない。
 * dangerouslySetInnerHTML 内の <script> も実行されない。
 * msmaflink() を引数なしで呼んでも何も起きない（商品ごとの引数が必要）。
 *
 * 【解決策】
 * 1. html文字列から msmaflink({...}) の引数JSONを正規表現で抽出
 * 2. <div id="msmaflink-XXXX"> だけを先にDOMに挿入
 * 3. bundle.js 読み込み済み → 直接 window.msmaflink(args) を呼ぶ
 *    bundle.js 未読み込み → 読み込み後に呼ぶ
 */
export default function MossimoLinkBox({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!html || !containerRef.current) return;

    const container = containerRef.current;

    // ── Step 1: html から msmaflink({...}) の引数部分を抽出 ──────
    // "msmaflink({...});" の {...} 部分をまるごと取り出す
    const argsMatch = html.match(/msmaflink\((\{[\s\S]*?\})\);/);
    if (!argsMatch) {
      // 引数が見つからない場合はそのまま表示してフォールバック
      container.innerHTML = html;
      return;
    }
    const argsStr = argsMatch[1];

    // ── Step 2: <div id="msmaflink-XXXX">リンク</div> を挿入 ────
    // bundle.js はこのdivを探して商品カードに書き換える
    const divMatch = html.match(/<div[^>]*id="msmaflink-[^"]*"[^>]*>[\s\S]*?<\/div>/);
    container.innerHTML = divMatch ? divMatch[0] : '<div>リンク</div>';

    // ── Step 3: 引数をパースして msmaflink(args) を実行 ──────────
    const execWithArgs = () => {
      try {
        const win = window as any;
        if (typeof win.msmaflink !== 'function') return false;
        // JSON.parseではなくFunctionでパース（\/ などのエスケープに対応）
        // eslint-disable-next-line no-new-func
        const args = new Function(`return ${argsStr}`)();
        win.msmaflink(args);
        return true;
      } catch (e) {
        console.warn('[MossimoLinkBox] msmaflink実行エラー:', e);
        return true;
      }
    };

    // ── Step 4: bundle.js の状態で分岐 ─────────────────────────
    const existingBundle = document.getElementById(BUNDLE_ID);
    let retryInterval: NodeJS.Timeout | null = null;

    const startPolling = (maxAttempts: number) => {
      let attempts = 0;
      if (execWithArgs()) return;
      
      retryInterval = setInterval(() => {
        attempts++;
        if (execWithArgs() || attempts >= maxAttempts) {
          if (retryInterval) clearInterval(retryInterval);
        }
      }, 100);
    };

    if (existingBundle) {
      // SPA遷移時：すでにscriptタグが存在する場合は、ロード済みかロード中。
      // 最大10秒間、msmaflink関数が定義されるのを待機して実行する。
      startPolling(100);
    } else {
      // 初回アクセス：bundle.jsをロードしてから実行
      const script = document.createElement('script');
      script.id  = BUNDLE_ID;
      script.src = BUNDLE_URL;
      script.async = true;
      script.onload = () => {
        // ロード完了後も初期化にラグがある可能性を考慮して最大5秒待機
        startPolling(50);
      };
      document.body.appendChild(script);
    }

    return () => {
      if (retryInterval) clearInterval(retryInterval);
    };
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="moshimo-link-wrapper my-4"
    />
  );
}
