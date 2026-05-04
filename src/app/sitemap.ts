import { MetadataRoute } from 'next';
import hobbiesData from '@/data/hobbies.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseURL = 'https://hobby-flow.vercel.app';

  // 1. 固定の静的ページ
  const staticRoutes = [
    '',           // ホーム
    '/records',    // 記録一覧
    '/policy',     // プライバシーポリシー
  ].map((route) => ({
    url: `${baseURL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. hobbies.json から動的に趣味詳細ページを生成
  const hobbyRoutes = (hobbiesData as any[]).map((hobby) => ({
    url: `${baseURL}/hobbies/${hobby.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...hobbyRoutes];
}