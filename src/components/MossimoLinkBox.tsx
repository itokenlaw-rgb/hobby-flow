'use client';

const AMAZON_TRACKING_ID = 'hobbyflow-22';

// msmaflink_html の中の JSON パラメータを解析する
function parseMsmHtml(html: string, asin?: string) {
  try {
    const match = html.match(/msmaflink\((\{[\s\S]*?\})\);/);
    if (!match) return null;
    const data = JSON.parse(match[1]);

    // 商品名
    const title: string = data.n || '';

    // 画像URL：d（ドメイン）+ c_p（共通パス）+ p[0]（最初の画像）
    let imageUrl = '';
    if (data.d && data.c_p && data.p?.[0]) {
      imageUrl = data.d + data.c_p + data.p[0];
    }

    // ショップボタン一覧（楽天・Yahoo など）
    const buttons: { label: string; url: string; color: string }[] =
      (data.b_l || []).map((b: any) => ({
        label: b.u_tx,
        url: b.u_url,
        color: b.u_bc,
      }));

    // Amazon ボタンを先頭に追加
    if (asin) {
      buttons.unshift({
        label: 'Amazonで見る',
        url: `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_TRACKING_ID}`,
        color: '#FF9900',
      });
    }

    return { title, imageUrl, buttons };
  } catch {
    return null;
  }
}

export default function MossimoLinkBox({ html, asin }: { html: string; asin?: string }) {
  const parsed = parseMsmHtml(html, asin);

  // パース失敗時はフォールバック（従来のHTML埋め込み）
  if (!parsed) {
    return (
      <div
        className="moshimo-container my-4 min-h-[150px]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const { title, imageUrl, buttons } = parsed;

  return (
    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden flex flex-col sm:flex-row gap-4 p-4 hover:shadow-md transition-shadow my-4">
      {/* 商品画像 */}
      <div className="flex-shrink-0 flex items-center justify-center w-full sm:w-28 bg-cream/40 rounded-xl p-2">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="max-h-28 object-contain"
          />
        ) : (
          <div className="text-[10px] text-ink-light/40 italic w-28 h-28 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>

      {/* タイトル＋ボタン */}
      <div className="flex-1 flex flex-col justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink leading-snug">{title}</p>
          <p className="text-[10px] text-ink-light/50 mt-0.5">posted with HobbyFlow</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {buttons.map((btn, i) => (
            <a
              key={i}
              href={btn.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex-1 text-center py-2 px-3 rounded-lg text-[11px] font-bold text-white hover:opacity-90 transition-opacity whitespace-nowrap"
              style={{ backgroundColor: btn.color }}
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
