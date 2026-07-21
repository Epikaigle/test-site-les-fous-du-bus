import { describe, it, expect } from 'vitest';
import { slugify } from '../src/utils/slugify';
import { readingTime, certaintyToFrench } from '../src/utils/format';

describe('slugify', () => {
  it('met en minuscules et convertit les accents en tirets', () => {
    expect(slugify('La Véritable Signification du D.')).toBe('la-veritable-signification-du-d');
  });

  it('supprime la ponctuation et les espaces superflus', () => {
    expect(slugify('  Joy Boy!  ')).toBe('joy-boy');
  });

  it('conserve les caractères ASCII', () => {
    expect(slugify('One Piece 101')).toBe('one-piece-101');
  });
});

describe('readingTime', () => {
  it('renvoie au moins 1 minute', () => {
    expect(readingTime('un deux trois')).toBe('1 min');
  });
});

describe('certaintyToFrench', () => {
  it('mappe central vers Confirmée', () => {
    expect(certaintyToFrench('central')).toBe('Confirmée');
  });

  it('mappe hypothese vers Basse', () => {
    expect(certaintyToFrench('hypothese')).toBe('Basse');
  });
});
