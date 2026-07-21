/**
 * Helpers de formatage pour l'affichage du contenu.
 */

/** Estimation du temps de lecture à partir du texte (en minutes). */
export function readingTime(text: string, wordsPerMinute = 200): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / wordsPerMinute));
  return `${minutes} min`;
}

/** Formate un numéro de chapitre. */
export function formatChapter(chapter: number): string {
  return `Chapitre ${chapter}`;
}

/**
 * Mappe la certitude interne (anglais) vers le libellé français attendu
 * par le composant ArticleMeta (Basse / Moyenne / Haute / Confirmée).
 */
export function certaintyToFrench(c: string): 'Basse' | 'Moyenne' | 'Haute' | 'Confirmée' {
  const map: Record<string, 'Basse' | 'Moyenne' | 'Haute' | 'Confirmée'> = {
    central: 'Confirmée',
    elevee: 'Haute',
    moyenne: 'Moyenne',
    hypothese: 'Basse',
  };
  return map[c] ?? 'Moyenne';
}
