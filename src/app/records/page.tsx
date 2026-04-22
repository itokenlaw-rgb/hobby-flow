'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, LogOut, Image as ImageIcon, Calendar } from 'lucide-react';

export default function RecordsPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    // クライアントサイドでのみlocalStorageにアクセス
    const savedUsername = localStorage.getItem('hobbyflow_username');
    if (savedUsername) {
      setUsername(savedUsername);
      loadRecords(savedUsername);
    }
    setIsLoaded(true);
  }, []);

  const loadRecords = (user: string) => {
    const allRecords = JSON.parse(localStorage.getItem('hobbyflow_records') || '[]');
    // ユーザー名が一致する記録だけを抽出
    const userRecords = allRecords.filter((r: any) => r.username === user);
    setRecords(userRecords);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) return;
    localStorage.setItem('hobbyflow_username', loginInput.trim());
    setUsername(loginInput.trim());
    loadRecords(loginInput.trim());
  };

  const handleLogout = () => {
    if (confirm('ログアウトしますか？')) {
      localStorage.removeItem('hobbyflow_username');
      setUsername(null);
      setRecords([]);
      setLoginInput('');
    }
  };

  if (!isLoaded) return null; // 初期レンダリング完了まで待つ

  if (!username) {
    // ── ログイン画面 ──
    return (
      <div className="max-w-md mx-auto mt-20 px-4 animate-in fade-in zoom-in duration-500">
        <Link href="/" className="inline-flex items-center text-sm text-ink-light hover:text-ink transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" /> サービストップへ戻る
        </Link>
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-border-light text-center">
          <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-2">ログイン</h1>
          <p className="text-sm text-ink-light mb-8">ユーザー名を入力して記録の保管庫にアクセスしましょう。</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              placeholder="ユーザー名を入力"
              className="w-full px-4 py-3 rounded-2xl bg-cream border border-border-light text-ink focus:outline-none focus:ring-2 focus:ring-accent/50"
              autoFocus
            />
            <button
              type="submit"
              disabled={!loginInput.trim()}
              className="w-full py-3 rounded-full bg-ink text-white font-bold hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ログインして進む
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── 記録一覧画面 ──
  return (
    <div className="max-w-3xl mx-auto px-4 pb-24 pt-8 animate-in fade-in duration-700">
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <Link href="/" className="inline-flex items-center text-sm text-ink-light hover:text-ink transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> 戻る
          </Link>
          <h1 className="text-3xl font-bold text-ink tracking-wide">{username}さんの記録</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream text-ink-light hover:bg-border-light/30 transition-colors text-sm font-medium border border-border-light"
        >
          <LogOut className="w-4 h-4" /> ログアウト
        </button>
      </div>

      <div className="space-y-6">
        {records.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-border-light border-dashed">
            <p className="text-ink mb-4 font-bold">まだ記録がありません。</p>
            <p className="text-sm text-ink-light mb-8">体験したことをHobbyFlowに保存しましょう！</p>
            <Link
              href="/"
              className="inline-flex px-8 py-3 rounded-full bg-ink text-white font-bold shadow-md hover:scale-105 transition-all text-sm"
            >
              趣味を探して記録をつける
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {records.map((record, idx) => (
              <div key={record.id || idx} className="bg-white rounded-3xl p-6 shadow-sm border border-border-light flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-ink">{record.hobbyName}</span>
                      {record.hasPhoto && (
                        <span className="px-2 py-0.5 bg-cream rounded text-ink-light text-xs flex items-center gap-1 border border-border-light">
                          <ImageIcon className="w-3 h-3" /> 写真あり
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-ink-light">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(record.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div className="bg-cream/50 rounded-2xl p-4 border border-border-light whitespace-pre-wrap text-sm text-ink leading-relaxed">
                  {record.memo || '（メモはありません）'}
                </div>
                
                <div className="flex items-center gap-2 text-xs text-ink-light flex-wrap">
                  {record.triggers?.map((t: string) => <span key={`tr-${t}`} className="px-2 py-1 bg-cream rounded border border-border-light">き: {t}</span>)}
                  {record.impressions?.map((t: string) => <span key={`im-${t}`} className="px-2 py-1 bg-white rounded border border-border-light">感: {t}</span>)}
                  {record.futures?.map((t: string) => <span key={`fu-${t}`} className="px-2 py-1 bg-ink text-white rounded border border-ink">次: {t}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
