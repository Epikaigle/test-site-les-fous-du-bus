/**
 * Libellés et styles des indicateurs éditoriaux (badges de certitude,
 * effets d'un chapitre sur la théorie…).
 */

export type Certainty = 'central' | 'elevee' | 'hypothese';

export const certaintyBadges: Record<Certainty, { label: string; className: string }> = {
  central: { label: 'Élément central de la théorie', className: 'badge badge--gold' },
  elevee: { label: 'Certitude élevée', className: 'badge badge--cyan' },
  hypothese: { label: 'Hypothèse de travail', className: 'badge badge--magenta' },
};

export type ChapterEffect =
  | 'renforcement'
  | 'nouvelle-piste'
  | 'modification'
  | 'contradiction'
  | 'refutation'
  | 'aucun-apport';

export const chapterEffects: Record<ChapterEffect, { label: string; className: string }> = {
  'renforcement': { label: 'Renforcement', className: 'badge badge--cyan' },
  'nouvelle-piste': { label: 'Nouvelle piste', className: 'badge badge--gold' },
  'modification': { label: 'Modification', className: 'badge badge--lilac' },
  'contradiction': { label: 'Contradiction', className: 'badge badge--alert' },
  'refutation': { label: 'Réfutation', className: 'badge badge--alert' },
  'aucun-apport': { label: 'Aucun apport majeur', className: 'badge' },
};
