'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Info, Scale, Mail, Copyright } from 'lucide-react';

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
              <ShieldCheck className="w-5 h-5 text-accent" />
              広告・アフィリエイトについて
            </h2>
            <div className="space-y-4">
              <p>
                当サイト「HobbyFlow」は、もしもアフィリエイト等のアフィリエイト宣伝プログラムを利用しています。また、Amazonアソシエイト・プログラムを利用することを予定しています。
              </p>
              <div className="bg-cream/50 p-4 rounded-2xl border border-border-light">
                <p className="font-bold text-ink mb-2">【Amazonアソシエイトに関する表示】</p>
                <p>
                  HobbyFlowは、Amazon.co.jpを宣伝しリンクすることによってサイトが紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者となることを予定しています。
                </p>
                <p className="mt-2 text-ink">
                  第三者（Amazonや他の広告掲載者）がコンテンツおよび宣伝を提供し、訪問者から直接情報を収集し、訪問者のブラウザにクッキー（Cookie）を設定したり、これを認識したりする場合があります。
                </p>
              </div>
              <p>
                また、当サイトは「もしもアフィリエイト」を通じて、楽天市場、Yahoo!ショッピング等の商品を紹介しております。これらの広告プログラムにより、当サイトの運営者は適格販売により収入を得ています。
              </p>
            </div>
          </section>

          {/* ─── 2. 免責事項 ─── */}
          <section>
            <h2 className="text-base font-bold text-ink mb-4 pb-2 border-b border-border-light flex items-center gap-2">
              <Info className="w-5 h-5 text-accent" />
              免責事項
            </h2>
            <p>
              当サイトで掲載している商品・サービス等の情報は、アフィリエイトプログラムを利用してご紹介しております。商品の詳細な購入方法、支払い方法、在庫状況等については、リンク先の各ショップにてご確認ください。
            </p>
            <p className="mt-2">
              掲載情報については正確を期すよう努めておりますが、その内容を保証するものではありません。当サイトの利用により生じたトラブルや損害等について、運営者は一切の責任を負いかねますので、あらかじめご了承ください。
            </p>
          </section>

          {/* ─── 3. クッキー（Cookie）の利用 ─── */}
          <section>
            <h2 className="text-base font-bold text-ink mb-4 pb-2 border-b border-border-light flex items-center gap-2">
              <Scale className="w-5 h-5 text-accent" />
              アクセス解析・Cookieについて
            </h2>
            <p>
              当サイトでは、利便性の向上や利用状況の把握のためにクッキー（Cookie）を使用することがあります。Cookieはブラウザの設定により無効にすることが可能ですが、その際、サイトの一部の機能が正しく動作しない場合があります。
            </p>
          </section>

          {/* ─── 4. 著作権 ─── */}
          <section>
            <h2 className="text-base font-bold text-ink mb-4 pb-2 border-b border-border-light flex items-center gap-2">
              <Copyright className="w-5 h-5 text-accent" />
              著作権について
            </h2>
            <p>
              当サイトに掲載されているテキスト、画像、構成等の著作権は運営者に帰属します（商品画像等、各権利者が保有するものを除く）。
              無断転載・複製・改変等は固くお断りいたします。引用の際は、著作権法に基づき、出典元として当サイト名を明記してください。
            </p>
          </section>

{/* ─── 5. お問い合わせ ─── */}
<section>
  <h2 className="text-base font-bold text-ink mb-4 pb-2 border-b border-border-light flex items-center gap-2">
    <Mail className="w-5 h-5 text-accent" />
    お問い合わせ
  </h2>
  <div className="space-y-4">
    <p>
      当サイト「HobbyFlow」に関するご意見・ご質問、または著作権等に関するお問い合わせは、以下の「お問い合わせフォーム」よりご連絡ください。
    </p>
    <div className="pt-2">
      <a 
        href="https://forms.gle/LuhHqKe4ibvTFzKM9" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-white rounded-full font-bold text-sm hover:bg-ink/80 transition-all shadow-sm"
      >
        <Mail className="w-4 h-4" />
        お問い合わせフォームを開く
      </a>
    </div>
  </div>
</section>


        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-ink-light">策定日：2024年5月2日</p>
      </div>
    </div>
  );
}