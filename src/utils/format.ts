/**
 * Helpers de formatage pour l'affichage du contenu.
 */

/** Formate un numéro de chapitre. */
export function formatChapter(chapter: number): string {
  return `Chapitre ${chapter}`;
}

/**
 * Mappe le statut éditorial vers le libellé français et la classe de badge.
 */
export function editorialStatusToFrench(s?: string): { label: string; badgeClass: string } {
  const map: Record<string, { label: string; badgeClass: string }> = {
    'canon': { label: 'Canon', badgeClass: 'meta-badge--cyan' },
    'fait-observe': { label: 'Fait observé', badgeClass: 'meta-badge--cyan' },
    'interpretation': { label: 'Interprétation', badgeClass: 'meta-badge--violet' },
    'hypothese-centrale': { label: 'Hypothèse centrale', badgeClass: 'meta-badge--gold' },
    'hypothese-secondaire': { label: 'Hypothèse secondaire', badgeClass: 'meta-badge--violet' },
    'nouvelle-piste': { label: 'Nouvelle piste', badgeClass: 'meta-badge--violet' },
    'contredite': { label: 'Contredite', badgeClass: 'meta-badge--muted' },
    'refutee': { label: 'Réfutée', badgeClass: 'meta-badge--muted' },
  };
  return map[s ?? ''] ?? { label: 'Hypothèse centrale', badgeClass: 'meta-badge--gold' };
}
