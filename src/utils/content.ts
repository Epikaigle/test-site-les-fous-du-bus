import { getCollection, type CollectionEntry } from 'astro:content';

export type ArticleEntry = CollectionEntry<'articles'>;

/** Tous les articles publiés, triés par chapitre de mise à jour décroissant. */
export async function getPublishedArticles(): Promise<ArticleEntry[]> {
  const articles = await getCollection('articles', ({ data }) => data.status === 'published');
  return articles.sort(
    (a, b) => (b.data.lastUpdatedChapter ?? 0) - (a.data.lastUpdatedChapter ?? 0)
  );
}

/** Articles publiés d'une catégorie, triés par ordre décroissant. */
export async function getArticlesByCategory(category: string): Promise<ArticleEntry[]> {
  const articles = await getCollection(
    'articles',
    ({ data }) => data.category === category && data.status === 'published'
  );
  return articles.sort((a, b) => (b.data.order ?? 0) - (a.data.order ?? 0));
}

/** Filtre les articles liés à un article donné, en excluant l'article lui-même. */
export function getRelatedArticles(current: ArticleEntry, all: ArticleEntry[]): ArticleEntry[] {
  return all.filter((a) => current.data.related.includes(a.id) && a.id !== current.id);
}
