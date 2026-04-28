import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-20 pt-6 animate-in fade-in duration-700">

      {/* 戻るリンク */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-ink-light hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        トップページに戻る
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-border-light overflow-hidden">

        {/* ヘッダー */}
        <div className="bg-ink px-8 py-8">
          <h1 className="text-2xl font-bold text-white tracking-wide">プライバシーポリシー・免責事項</h1>
          <p className="text-white/60 text-sm mt-2">HobbyFlow — hobby-flow.vercel.app</p>
        </div>

        <div className="px-8 py-10 space-y-10 text-sm leading-relaxed text-ink-light">

          {/* ─── 1. 広告・アフィリエイトについて ─── */}
          <section>
            <h2 className="text-base font-bold text-ink mb-4 pb-2 border-b border-border-light flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">1</span>
              広告・アフィリエイトについて
            </h2>
            <p className="mb-4">
              当サイト「HobbyFlow」は、以下のアフィリエイトプログラムに参加しており、紹介料を得る場合があります。
              商品リンクには広告が含まれますが、紹介料がユーザーの購入価格に影響することはありません。
            </p>

            {/* Amazon */}
            <div className="bg-[#fff8f0] border border-[#fde8c0] rounded-2xl p-5 mb-4">
              <h3 className="font-bold text-ink mb-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: '#FF9900' }}>Amazon</span>
                Amazonアソシエイト・プログラム
              </h3>
              <p className="mb-2">
                「HobbyFlow」は、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、<strong className="text-ink">Amazonアソシエイト・プログラムの参加者です。</strong>
              </p>
              <p>
                Amazonのアソシエイトとして、HobbyFlowの運営者は適格販売により収入を得ています。
              </p>
            </div>

            {/* もしもアフィリエイト経由（楽天・Yahoo） */}
            <div className="bg-cream/50 border border-border-light rounded-2xl p-5">
              <h3 className="font-bold text-ink mb-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-[#BF0000]">楽天</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white bg-[#4192D9]">Yahoo!</span>
                もしもアフィリエイト（楽天市場・Yahoo!ショッピング）
              </h3>
              <p className="mb-2">
                当サイトは、<strong className="text-ink">もしもアフィリエイト</strong>（運営：株式会社もしも）を通じて、楽天市場およびYahoo!ショッピングのアフィリエイトプログラムに参加しています。
              </p>
              <p>
                商品リンクをクリック後、対象サービスでご購入いただいた場合に紹介料が発生することがあります。
                リンク先での購入金額・ご利用条件は各サービスの規約に準拠します。
              </p>
            </div>
          </section>

          {/* ─── 2. Cookieの使用について ─── */}
          <section>
            <h2 className="text-base font-bold text-ink mb-4 pb-2 border-b border-border-light flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">2</span>
              Cookieの使用について
            </h2>
            <p className="mb-3">
              当サイトおよびリンク先のアフィリエイトサービス（Amazon・楽天市場・Yahoo!ショッピング）では、
              Cookieを使用してユーザーの閲覧情報を収集・記録することがあります。
              収集された情報は、広告配信の最適化や成果計測のために利用されます。
            </p>
            <p>
              Cookieの使用を望まない場合は、ブラウザの設定から無効化することができます。
              ただし、無効化した場合、一部のサービスが正常に機能しないことがあります。
            </p>
          </section>

          {/* ─── 3. 個人情報の取り扱い ─── */}
          <section>
            <h2 className="text-base font-bold text-ink mb-4 pb-2 border-b border-border-light flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">3</span>
              個人情報の取り扱い
            </h2>
            <p className="mb-3">
              当サイトの「記録」機能では、ユーザーが入力したユーザー名・パスワード（ハッシュ化済み）・趣味の記録データを、
              <strong className="text-ink">お使いのデバイスのブラウザ（localStorage）内にのみ</strong>保存します。
              これらのデータは外部サーバーに送信・保存されることはなく、当サイト運営者がアクセスすることもありません。
            </p>
            <p>
              収集した個人情報は、法令に基づく場合を除き、第三者に提供することはありません。
            </p>
          </section>

          {/* ─── 4. 免責事項 ─── */}
          <section>
            <h2 className="text-base font-bold text-ink mb-4 pb-2 border-b border-border-light flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">4</span>
              免責事項
            </h2>
            <ul className="space-y-3 list-none">
              {[
                '当サイトのコンテンツ・情報について、できる限り正確な情報を提供するよう努めておりますが、正確性・安全性を保証するものではありません。情報が古くなっている場合もございます。',
                '当サイトに掲載された商品・サービスの価格・在庫・仕様は予告なく変更される場合があります。最新の情報は各販売サイトにてご確認ください。',
                '当サイトのリンクから移動した外部サイト（Amazon・楽天市場・Yahoo!ショッピング等）において提供される情報・サービス等について、一切の責任を負いません。',
                '当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/50 flex-shrink-0 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ─── 5. 著作権 ─── */}
          <section>
            <h2 className="text-base font-bold text-ink mb-4 pb-2 border-b border-border-light flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">5</span>
              著作権
            </h2>
            <p>
              当サイトに掲載されているコンテンツ（テキスト・画像・構成等）の著作権は、運営者または正当な権利者に帰属します。
              無断転載・複製・改変等はご遠慮ください。
              なお、引用の際は出典元として当サイトURL（hobby-flow.vercel.app）を明記してください。
            </p>
          </section>

          {/* ─── 6. プライバシーポリシーの変更 ─── */}
          <section>
            <h2 className="text-base font-bold text-ink mb-4 pb-2 border-b border-border-light flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">6</span>
              プライバシーポリシーの変更
            </h2>
            <p>
              当サイトは、法令の改正・サービス内容の変更等に伴い、本プライバシーポリシーを予告なく変更することがあります。
              変更後のポリシーは、本ページに掲載した時点で効力を生じるものとします。
              定期的にご確認いただくことをお勧めします。
            </p>
          </section>

          {/* 制定日 */}
          <div className="pt-4 border-t border-border-light text-xs text-ink-light/60 text-right">
            制定：2026年4月　／　HobbyFlow 運営者
          </div>

        </div>
      </div>
    </div>
  );
}
