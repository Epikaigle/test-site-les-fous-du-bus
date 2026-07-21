/**
 * Arborescence de navigation du site (sidebar gauche).
 * Une entrée sans `href` est affichée comme « bientôt » : la page n'existe pas
 * encore dans la maquette d'interface.
 */

export interface NavItem {
  label: string;
  href?: string;
}

export interface NavSection {
  label: string;
  href?: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  { label: 'Accueil', href: '/', items: [] },
  {
    label: 'La théorie',
    href: '/la-theorie',
    items: [
      { label: 'Fondations' },
      { label: 'Figures et identités', href: '/la-theorie/figures-et-identites' },
      { label: 'Armes antiques' },
      { label: 'Science, énergie et pouvoirs' },
      { label: 'Monde, peuples et témoins' },
      { label: 'Transmission, voix et mémoire' },
      { label: 'Gouvernement et guerre finale' },
    ],
  },
  {
    label: 'Explorer',
    items: [
      { label: 'Frises chronologiques' },
      { label: 'Carte du monde' },
      { label: 'Carte des personnages' },
      { label: 'Schémas temporels' },
      { label: 'Fresque d’Elbaf' },
      { label: 'Globe 3D' },
    ],
  },
  {
    label: 'Évolution',
    items: [
      { label: 'Chapitre par chapitre', href: '/evolution/chapitre-par-chapitre' },
      { label: 'Dernière mise à jour' },
      { label: 'Prédictions' },
      { label: 'Historique des articles' },
      { label: 'Hypothèses abandonnées' },
    ],
  },
  {
    label: 'Vérifier',
    items: [
      { label: 'Pièces du puzzle' },
      { label: 'Citations et scènes' },
      { label: 'Parallèles visuels' },
      { label: 'Objections' },
      { label: 'Contradictions' },
      { label: 'Sources et méthode', href: '/verifier/sources' },
    ],
  },
  {
    label: 'Aide',
    items: [
      { label: 'FAQ', href: '/aide/faq' },
      { label: 'Glossaire', href: '/aide/glossaire' },
      { label: 'À propos', href: '/aide/a-propos' },
      { label: 'Crédits' },
      { label: 'Proposer une correction' },
    ],
  },
];

/** Dernier chapitre analysé — source unique utilisée par la navbar et l'accueil. */
export const lastChapter = {
  number: 1188,
  title: 'Une communication à travers le temps',
  effect: 'nouvelle-piste' as const,
  href: '/evolution/chapitre-par-chapitre',
};

export const siteIdentity = {
  name: 'Les Fous du Bus',
  title: 'Le Siècle oublié est le présent',
  subtitle: 'Une théorie sur la véritable chronologie de One Piece',
  domain: 'https://lesfousdubus.sbs',
  repo: 'https://github.com/lesfousdubus-theorie/lesfousdubus',
  video: 'https://youtu.be/SgJ25zjMJyo',
  x: 'https://x.com/FoudubusTV_',
};
