/**
 * Convertit une chaîne en slug URL-friendly (minuscules, tirets, ASCII).
 * Utilisé pour générer des identifiants stables à partir de titres.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
