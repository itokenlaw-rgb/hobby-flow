// src/types/blog.ts (または直接ファイル内へ)
export interface BlogPost {
  id: string;
  hobbyId: string;       // 紐づける趣味のID
  title: string;
  date: string;
  excerpt: string;
  imageOverride?: string; // 個別画像を使いたい時用（空なら趣味画像を流用）
  content: {
    sectionTitle: string;
    text: string;
  }[];
  conclusion: string;
}

// データの例（寺社巡り）
export const blogPosts: BlogPost[] = [
  {
    id: "blog-jisha",
    hobbyId: "new-09-jisha-meguri",
    title: "坂道のある街で、深呼吸。HobbyFlowで始めた「寺社巡りリトリート」",
    date: "2026.05.03",
    excerpt: "デジタル漬けの毎日から一旦ログアウト。新しい靴で歩き出した先で見つけた景色とは...",
    content: [
      { sectionTitle: "1. 週末の「ログアウト」ボタンを探して", text: "平日はIT企業で事務の仕事。毎日PCの画面とにらめっこして、週末も気づけばスマホで動画を流しっぱなし……。..." },
      { sectionTitle: "2. 形から入る、私なりの「準備運動」", text: "私は少し自信が持てない時、道具を揃えることで自分を鼓舞する癖があります。今回用意したのは、真っ白なキャンバススニーカーと..." },
      // ... 他のセクションも同様に ...
    ],
    conclusion: "美味しい紅茶を飲んで寝る権利を行使して、今日は早めに布団に入ります。おやすみなさい。"
  }
];