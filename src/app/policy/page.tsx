import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-cream p-8 sm:p-20 font-sans text-ink">
      <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-sm border border-border-light">
        <Link href="/" className="inline-flex items-center gap-2 text-ink-light hover:text-accent mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          トップページに戻る
        </Link>
        
        <h1 className="text-2xl font-bold mb-8 border-b pb-4">プライバシーポリシー</h1>
        
        <section className="space-y-6 text-sm leading-relaxed">
          <div>
            <h2 className="font-bold text-lg mb-3">Amazonアソシエイト・プログラムについて</h2>
            <p>
              「趣味探しアプリ（仮）※ここをあなたのサイト名に変更」は、Amazon.co.jpを宣伝しリンクすることによって紹介料を獲得できる手段を提供することを目的に設定されたアフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。
            </p>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-3">免責事項</h2>
            <p>
              当サイトのコンテンツ・情報について、できる限り正確な情報を提供するよう努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}