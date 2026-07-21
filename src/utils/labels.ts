/**
 * Libellés et couleurs partagés pour les badges de certitude, d'effet,
 * de catégorie et de statut. Centralise les libellés français utilisés
 * dans l'interface afin d'éviter la dispersion des chaînes.
 */

export type Certainty = 'central' | 'elevee' | 'moyenne' | 'hypothese';
export type BadgeColor = 'cyan' | 'gold' | 'violet' | 'textSecondary' | 'alert';

export const certaintyLabels: Record<Certainty, { label: string; color: BadgeColor }> = {
  central: { label: 'Centrale', color: 'cyan' },
  elevee: { label: 'Élevée', color: 'gold' },
  moyenne: { label: 'Moyenne', color: 'violet' },
  hypothese: { label: 'Hypothèse', color: 'textSecondary' },
};

export const effectLabels: Record<string, string> = {
  renforcement: 'Renforcement',
  'nouvelle-piste': 'Nouv. piste',
  modification: 'Modification',
  contradiction: 'Contradiction',
  refutation: 'Réfutation',
  'aucun-apport': 'Aucun apport',
};

export const categoryLabels: Record<string, string> = {
  fondations: 'Fondations',
  'figures-identites': 'Figures et identités',
  'armes-antiques': 'Armes antiques',
  'science-energie': 'Science, énergie et pouvoirs',
  'monde-peuples': 'Monde, peuples et témoins',
  'gouvernement-guerre': 'Gouvernement et guerre finale',
  'transmission-memoire': 'Transmission, voix et mémoire',
};

export const predictionStatusLabels: Record<string, string> = {
  'en-cours': 'En cours',
  confirmee: 'Confirmée',
  refutee: 'Réfutée',
  'en-attente': 'En attente',
};

export const objectionStrengthLabels: Record<string, string> = {
  mineure: 'Mineure',
  moderee: 'Modérée',
  majeure: 'Majeure',
};

export function certaintyLabel(c: Certainty): string {
  return certaintyLabels[c]?.label ?? c;
}

export function certaintyColor(c: Certainty): BadgeColor {
  return certaintyLabels[c]?.color ?? 'textSecondary';
}

export function effectLabel(e: string): string {
  return effectLabels[e] ?? e;
}

export function categoryLabel(c: string): string {
  return categoryLabels[c] ?? c;
}

export function predictionStatusLabel(s: string): string {
  return predictionStatusLabels[s] ?? s;
}

export function objectionStrengthLabel(s: string): string {
  return objectionStrengthLabels[s] ?? s;
}
