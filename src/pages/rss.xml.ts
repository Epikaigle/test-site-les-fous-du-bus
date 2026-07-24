import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const site = context.site?.toString().replace(/\/$/, '') || 'https://lesfousdubus.sbs';
  const articles = await getCollection('articles', ({ data }) => data.status === 'published');

  const sortedArticles = articles.sort((a, b) => {
    const dateA = a.data.lastUpdatedChapter ?? 0;
    const dateB = b.data.lastUpdatedChapter ?? 0;
    return dateB - dateA;
  });

  const rssItems = sortedArticles.map((article) => {
    const url = `${site}/theorie/${article.id}`;
    const pubDate = new Date(2025, 0, article.data.lastUpdatedChapter ?? 1188).toUTCString();

    return `
    <item>
      <title><![CDATA[${article.data.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${article.data.summary}]]></description>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${article.data.category}]]></category>
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Les Fous du Bus</title>
    <link>${site}</link>
    <description>Wiki éditorial sur la théorie du Siècle oublié dans One Piece</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
