'use client';

import { useState, useRef, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Camera, Save, Sparkles, X, Share2, Mail, MessageCircle } from 'lucide-react';
import { aiReactions } from '@/data/aiReactions';
import hobbiesData from '@/data/hobbies.json';

// ── SNSボタン用 SVGアイコン ──────────────────
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

function RecordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hobbyId = searchParams.get('hobbyId');
  const targetHobby = (hobbiesData as any[]).find((h) => h.id === hobbyId);
  const hobbyName = targetHobby?.name ?? '新しいこと';

  const triggerOptions = [
    targetHobby?.comic?.title ? `『${targetHobby.comic.title}』を読んで` : 'アプリを見て',
    'ふと思い立って',
    'ずっと気になっていた',
  ];

  const impressionOptions = [
    'めちゃくちゃ楽しかった！',
    'これ、ハマっちゃう予感…',
    'もっと早く始めればよかった！',
    'むずかしかったけど、そこが面白い！',
    '自分を更新できた気がする！',
    '新しい世界の扉が開いた感じ！',
  ];

  const futureOptions = [
    'もっと深めたい。まだまだこれから！',
    '次は道具にもこだわってみようかな！',
    '一緒にやれる仲間を探したい！',
    'うまくなったらまた報告します！',
    '今度は誰かを誘ってやってみたい！',
    'しばらくいろいろやってみる！',
  ];

  const [triggers, setTriggers] = useState<string[]>([]);
  const [impressions, setImpressions] = useState<string[]>([]);
  const [futures, setFutures] = useState<string[]>([]);
  
  const [memo, setMemo] = useState('');
  const [isMemoEdited, setIsMemoEdited] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showSnsModal, setShowSnsModal] = useState(false);
  const [currentAiReaction, setCurrentAiReaction] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const toggleOption = (list: string[], setList: (val: string[]) => void, option: string) => {
    if (list.includes(option)) {
      setList(list.filter(i => i !== option));
    } else {
      setList([...list, option]);
    }
  };

  // ── ★ 改行ルールの修正 ──
  useEffect(() => {
    if (!isMemoEdited) {
      const contentParts = [];
      
      // 1. きっかけグループ（スペースで繋ぎ、末尾に【やったみた！】を直結させる）
      const triggerPart = triggers.length > 0 ? triggers.join(' ') + ' ' : '';
      contentParts.push(`${triggerPart}【${hobbyName}をやってみた！】`);

      // 2. 感想グループ（グループ内は改行せず繋げる）
      if (impressions.length > 0) {
        contentParts.push(impressions.join(''));
      }

      // 3. 今後グループ（グループ内は改行せず繋げる）
      if (futures.length > 0) {
        contentParts.push(futures.join(''));
      }

      // 各グループの間を改行（\n）で結合する
      const fullContent = contentParts.join('\n');
      setMemo(`${fullContent}\n\n#${hobbyName} #HobbyFlow`);
    }
  }, [triggers, impressions, futures, isMemoEdited, hobbyName]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToHobbyFlow = () => {
    let username = localStorage.getItem('hobbyflow_username');
    if (!username) {
      username = prompt('記録を保存するためのユーザー名を入力してください（次回以降もログインに使います）');
      if (!username) return;
      localStorage.setItem('hobbyflow_username', username);
    }

    const newRecord = {
      id: Date.now(),
      hobbyId,
      hobbyName,
      triggers,
      impressions,
      futures,
      memo,
      hasPhoto: !!photoPreview,
      date: new Date().toISOString(),
      username: username,
    };
    const existing = JSON.parse(localStorage.getItem('hobbyflow_records') || '[]');
    localStorage.setItem('hobbyflow_records', JSON.stringify([newRecord, ...existing]));

    const randomIdx = Math.floor(Math.random() * aiReactions.length);
    const reaction = (aiReactions as any)[randomIdx];
    const reactionText = typeof reaction === 'object' && reaction !== null ? reaction.text : reaction;

    setCurrentAiReaction(reactionText);
    setShowAiModal(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-8 animate-in fade-in duration-700">
      <Link href={hobbyId ? `/hobbies/${hobbyId}` : '/'} className="inline-flex items-center text-sm text-ink-light hover:text-ink transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> 戻る
      </Link>

      <h1 className="text-3xl font-bold text-ink mb-2">記録をつける</h1>
      <p className="text-ink-light mb-8 text-sm">{hobbyName} を体験した記録を残しましょう。</p>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-border-light space-y-8">
        <section>
          <label className="block text-sm font-bold text-ink mb-3">きっかけ</label>
          <div className="flex flex-wrap gap-3">
            {triggerOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => toggleOption(triggers, setTriggers, opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  triggers.includes(opt) ? 'bg-ink text-white shadow-md' : 'bg-cream text-ink-light border border-border-light'
                }`}
              >{opt}</button>
            ))}
          </div>
        </section>

        <div className="mt-4 p-4 bg-cream/50 rounded-xl text-center text-ink font-bold">
          「{hobbyName}をやってみた！」
        </div>

        <section>
          <label className="block text-sm font-bold text-ink mb-3">感想</label>
          <div className="flex flex-wrap gap-3">
            {impressionOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => toggleOption(impressions, setImpressions, opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  impressions.includes(opt) ? 'bg-accent text-white shadow-md' : 'bg-cream text-ink-light border border-border-light'
                }`}
              >{opt}</button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-sm font-bold text-ink mb-3">今後</label>
          <div className="flex flex-wrap gap-3">
            {futureOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => toggleOption(futures, setFutures, opt)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  futures.includes(opt) ? 'bg-ink text-white shadow-md' : 'bg-cream text-ink-light border border-border-light'
                }`}
              >{opt}</button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-sm font-bold text-ink mb-3">写真</label>
          <div className="flex items-start gap-4">
            <button
              onClick={() => photoInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 border-dashed border-border-light bg-cream hover:bg-border-light/30 text-ink-light transition-colors"
            >
              <Camera className="w-8 h-8 mb-1" />
              <span className="text-xs">写真を追加</span>
            </button>
            <input type="file" accept="image/*" hidden ref={photoInputRef} onChange={handlePhotoChange} />
            {photoPreview && (
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border-light">
                <img src={photoPreview} alt="プレビュー" className="w-full h-full object-cover" />
                <button onClick={() => setPhotoPreview(null)} className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white hover:bg-black/70">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </section>

        <section>
          <label className="block text-sm font-bold text-ink mb-1">投稿文</label>
          <p className="text-xs text-ink-light mb-3">ボタンを選ぶと自動で作成されます。自由に編集してもOKです。</p>
          <textarea
            value={memo}
            onChange={(e) => {
              setMemo(e.target.value);
              setIsMemoEdited(true);
            }}
            placeholder={`「${hobbyName}をやってみた！」\n\n#${hobbyName} #HobbyFlow`}
            className="w-full p-4 rounded-2xl bg-cream border border-border-light text-ink placeholder:text-ink-light/40 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-accent/50 leading-relaxed text-sm"
          />
          {isMemoEdited && (
            <button onClick={() => setIsMemoEdited(false)} className="mt-2 text-xs text-accent hover:underline">↩ 自動生成に戻す</button>
          )}
        </section>

        <div className="pt-6 flex flex-col gap-4 border-t border-border-light border-dashed">
          <button onClick={() => setShowSnsModal(true)} className="w-full py-4 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-600">
            <Share2 className="w-5 h-5" /> SNSで共有する
          </button>
          <button onClick={handleSaveToHobbyFlow} className="w-full py-4 rounded-full bg-ink text-white font-bold flex items-center justify-center gap-2 hover:bg-ink/90">
            <Save className="w-5 h-5" /> HobbyFlowに記録する
          </button>
        </div>
      </div>

      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-in zoom-in duration-300 shadow-2xl">
            <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-bold text-ink mb-6">AIパートナーから</h3>
            <p className="text-base text-ink font-serif leading-relaxed italic mb-8">「{currentAiReaction}」</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setShowAiModal(false); router.push('/records'); }} className="w-full py-3 rounded-full bg-ink text-white font-bold">一覧を見る</button>
              <button onClick={() => { setShowAiModal(false); setShowSnsModal(true); }} className="w-full py-3 rounded-full border border-blue-400 text-blue-500 font-bold hover:bg-blue-50">SNSにも発信する</button>
            </div>
          </div>
        </div>
      )}

      {showSnsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={() => setShowSnsModal(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-in zoom-in shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-ink">SNSで共有する</h3>
              <button onClick={() => setShowSnsModal(false)} className="p-1 rounded-full hover:bg-black/10"><X className="w-5 h-5 text-ink-light" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(memo)}`)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black text-white"><XIcon /><span className="text-xs font-bold mt-2">X</span></button>
              <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(memo)}`)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#1877F2] text-white"><FacebookIcon /><span className="text-xs font-bold mt-2">Facebook</span></button>
              <button onClick={async () => { await navigator.clipboard.writeText(memo); alert('コピーしました！'); window.open('https://www.instagram.com/'); }} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white"><InstagramIcon /><span className="text-xs font-bold mt-2">Instagram</span></button>
              <button onClick={() => window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(memo)}`)} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#06C755] text-white"><MessageCircle className="w-6 h-6" /><span className="text-xs font-bold mt-2">LINE</span></button>
            </div>
            <div className="mt-6 p-4 bg-cream rounded-2xl text-left text-xs text-ink-light whitespace-pre-wrap border border-border-light">{memo}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-ink-light">読み込み中...</div>}>
      <RecordForm />
    </Suspense>
  );
}

      <footer className="w-full mt-20 pb-10 flex justify-center border-t border-border-light/30 pt-10">
        <Link href="/policy" className="text-xs text-ink-light hover:text-accent transition-colors underline underline-offset-4">
          プライバシーポリシー・アマゾンアソシエイトについて
        </Link>
      </footer>
    </div>
  );
}
