'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, LogOut, Image as ImageIcon, Calendar, Eye, EyeOff, Lock } from 'lucide-react';

// ── パスワードをSHA-256でハッシュ化（ブラウザ標準WebCrypto API）─
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

type UserData = { passwordHash: string };

const USER_STORE_KEY = 'hobbyflow_users';
const SESSION_KEY    = 'hobbyflow_username';

function getUsers(): Record<string, UserData> {
  try { return JSON.parse(localStorage.getItem(USER_STORE_KEY) || '{}'); }
  catch { return {}; }
}

export default function RecordsPage() {
  const [username,  setUsername]  = useState<string | null>(null);
  const [isLoaded,  setIsLoaded]  = useState(false);
  const [records,   setRecords]   = useState<any[]>([]);

  // フォーム
  const [nameInput,      setNameInput]      = useState('');
  const [passwordInput,  setPasswordInput]  = useState('');
  const [confirmInput,   setConfirmInput]   = useState('');
  const [showPw,         setShowPw]         = useState(false);
  const [showCf,         setShowCf]         = useState(false);
  const [mode,           setMode]           = useState<'login' | 'register'>('login');
  const [error,          setError]          = useState('');
  const [isSubmitting,   setIsSubmitting]   = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) { setUsername(saved); loadRecords(saved); }
    setIsLoaded(true);
  }, []);

  const loadRecords = (user: string) => {
    const all = JSON.parse(localStorage.getItem('hobbyflow_records') || '[]');
    setRecords(all.filter((r: any) => r.username === user));
  };

  // ── ログイン ────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nameInput.trim() || !passwordInput) {
      setError('ユーザー名とパスワードを入力してください。'); return;
    }
    setIsSubmitting(true);
    const users = getUsers();
    const user  = users[nameInput.trim()];
    if (!user) {
      setError('ユーザー名が見つかりません。新規登録してください。');
      setIsSubmitting(false); return;
    }
    const hash = await hashPassword(passwordInput);
    if (hash !== user.passwordHash) {
      setError('パスワードが正しくありません。');
      setIsSubmitting(false); return;
    }
    localStorage.setItem(SESSION_KEY, nameInput.trim());
    setUsername(nameInput.trim());
    loadRecords(nameInput.trim());
    setIsSubmitting(false);
  };

  // ── 新規登録 ────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nameInput.trim() || !passwordInput || !confirmInput) {
      setError('すべての項目を入力してください。'); return;
    }
    if (passwordInput.length < 4) {
      setError('パスワードは4文字以上にしてください。'); return;
    }
    if (passwordInput !== confirmInput) {
      setError('パスワードが一致しません。'); return;
    }
    const users = getUsers();
    if (users[nameInput.trim()]) {
      setError('そのユーザー名はすでに使われています。'); return;
    }
    setIsSubmitting(true);
    const hash = await hashPassword(passwordInput);
    users[nameInput.trim()] = { passwordHash: hash };
    localStorage.setItem(USER_STORE_KEY, JSON.stringify(users));
    localStorage.setItem(SESSION_KEY, nameInput.trim());
    setUsername(nameInput.trim());
    loadRecords(nameInput.trim());
    setIsSubmitting(false);
  };

  const handleLogout = () => {
    if (!confirm('ログアウトしますか？')) return;
    localStorage.removeItem(SESSION_KEY);
    setUsername(null); setRecords([]);
    setNameInput(''); setPasswordInput(''); setConfirmInput(''); setError('');
  };

  const switchMode = (next: 'login' | 'register') => {
    setMode(next); setError(''); setPasswordInput(''); setConfirmInput('');
  };

  if (!isLoaded) return null;

  // ════════════════════════════════════════════════════════════
  // ログイン／新規登録 画面
  // ════════════════════════════════════════════════════════════
  if (!username) {
    return (
      <div className="max-w-md mx-auto mt-16 px-4 animate-in fade-in zoom-in duration-500">
        <Link href="/" className="inline-flex items-center text-sm text-ink-light hover:text-ink transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" /> サービストップへ戻る
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-border-light">

          {/* アイコン */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center">
              {mode === 'login'
                ? <User className="w-8 h-8 text-accent" />
                : <Lock className="w-8 h-8 text-accent" />}
            </div>
          </div>

          {/* タイトル */}
          <h1 className="text-2xl font-bold text-ink text-center mb-1">
            {mode === 'login' ? 'ログイン' : '新規登録'}
          </h1>
          <p className="text-sm text-ink-light text-center mb-8">
            {mode === 'login'
              ? 'ユーザー名とパスワードを入力してください。'
              : 'ユーザー名とパスワードを設定してください。'}
          </p>

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">

            {/* ユーザー名 */}
            <div>
              <label className="block text-xs font-bold text-ink-light mb-1">ユーザー名</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="例：hobbyflower"
                className="w-full px-4 py-3 rounded-2xl bg-cream border border-border-light text-ink focus:outline-none focus:ring-2 focus:ring-accent/50"
                autoComplete="username"
                autoFocus
              />
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-xs font-bold text-ink-light mb-1">パスワード</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={mode === 'register' ? '4文字以上' : 'パスワードを入力'}
                  className="w-full px-4 py-3 pr-11 rounded-2xl bg-cream border border-border-light text-ink focus:outline-none focus:ring-2 focus:ring-accent/50"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink" tabIndex={-1}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* パスワード確認（新規登録のみ） */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-ink-light mb-1">パスワード（確認）</label>
                <div className="relative">
                  <input
                    type={showCf ? 'text' : 'password'}
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder="もう一度入力"
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-cream border border-border-light text-ink focus:outline-none focus:ring-2 focus:ring-accent/50"
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowCf(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink" tabIndex={-1}>
                    {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* エラー */}
            {error && (
              <p className="text-sm text-red-500 font-medium bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-full bg-ink text-white font-bold hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? '処理中...' : mode === 'login' ? 'ログインして進む' : 'アカウントを作成する'}
            </button>
          </form>

          {/* モード切替 */}
          <div className="mt-6 pt-6 border-t border-border-light text-center text-sm text-ink-light">
            {mode === 'login' ? (
              <>はじめてですか？{' '}
                <button onClick={() => switchMode('register')} className="text-accent font-bold hover:underline">
                  新規登録
                </button>
              </>
            ) : (
              <>すでにアカウントをお持ちですか？{' '}
                <button onClick={() => switchMode('login')} className="text-accent font-bold hover:underline">
                  ログイン
                </button>
              </>
            )}
          </div>

          {/* 注意書き */}
          <p className="mt-4 text-[10px] text-ink-light/50 text-center leading-relaxed">
            ※ このログインはお使いのブラウザのみで有効です。<br />
            パスワードはハッシュ化してデバイス内に保存されます。
          </p>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // 記録一覧 画面
  // ════════════════════════════════════════════════════════════
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
            <Link href="/" className="inline-flex px-8 py-3 rounded-full bg-ink text-white font-bold shadow-md hover:scale-105 transition-all text-sm">
              趣味を探して記録をつける
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {records.map((record, idx) => (
              <div
                key={record.id || idx}
                className="bg-white rounded-3xl p-6 shadow-sm border border-border-light flex flex-col gap-4 animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
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
                      {new Date(record.date).toLocaleDateString('ja-JP', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                <div className="bg-cream/50 rounded-2xl p-4 border border-border-light whitespace-pre-wrap text-sm text-ink leading-relaxed">
                  {record.memo || '（メモはありません）'}
                </div>

                <div className="flex items-center gap-2 text-xs text-ink-light flex-wrap">
                  {record.triggers?.map((t: string) => (
                    <span key={`tr-${t}`} className="px-2 py-1 bg-cream rounded border border-border-light">き: {t}</span>
                  ))}
                  {record.impressions?.map((t: string) => (
                    <span key={`im-${t}`} className="px-2 py-1 bg-white rounded border border-border-light">感: {t}</span>
                  ))}
                  {record.futures?.map((t: string) => (
                    <span key={`fu-${t}`} className="px-2 py-1 bg-ink text-white rounded border border-ink">次: {t}</span>
                  ))}
</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="w-full mt-20 pb-10 flex justify-center border-t border-border-light/30 pt-10">
        <Link href="/policy" className="text-xs text-ink-light hover:text-accent transition-colors underline underline-offset-4">
          プライバシーポリシー・アマゾンアソシエイトについて
        </Link>
      </footer>
    </div>
  );
}
