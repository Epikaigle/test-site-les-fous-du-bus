#!/usr/bin/env node
/**
 * Validation du contenu et des liens internes.
 *
 * Vérifie, pour chaque collection de `src/content` :
 *  - les champs obligatoires ;
 *  - la validité des énumérations (catégorie, certitude, effet, type, etc.) ;
 *  - l'absence de références vers des articles inexistants (`related`, `articles`, `updatedArticles`...) ;
 *  - l'absence de liens internes cassés dans le corps Markdown.
 *
 * Usage : `node scripts/validate.mjs` (ou `npm run validate`).
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const CONTENT_DIR = join(process.cwd(), 'src', 'content');

const CATEGORIES = [
  'fondations',
  'figures-identites',
  'armes-antiques',
  'science-energie',
  'monde-peuples',
  'gouvernement-guerre',
  'transmission-memoire',
];

const ENUMS = {
  'articles.category': CATEGORIES,
  'articles.certainty': ['central', 'elevee', 'moyenne', 'hypothese'],
  'articles.status': ['draft', 'published'],
  'chapters.effect': ['renforcement', 'nouvelle-piste', 'modification', 'contradiction', 'refutation', 'aucun-apport'],
  'evidence.type': ['dialogue', 'visuel', 'narratif', 'structure'],
  'evidence.strength': ['majeure', 'secondaire'],
  'characters.era': ['ancien', 'moderne', 'transversal'],
  'objections.strength': ['mineure', 'moderee', 'majeure'],
  'predictions.status': ['en-cours', 'confirmee', 'refutee', 'en-attente'],
  'timelines.period': ['siecle-oublie', 'present', 'futur', 'boucle'],
};

const SCHEMA = {
  articles: { required: ['title', 'summary', 'category'], refArrays: ['related'] },
  chapters: { required: ['chapter', 'title', 'effect'], refArrays: ['updatedArticles'] },
  evidence: { required: ['title', 'chapter', 'type', 'strength'], refArrays: ['articles'] },
  glossary: { required: ['term', 'definition'], refArrays: ['relatedArticles'] },
  characters: { required: ['name', 'summary'], refArrays: ['articles'] },
  locations: { required: ['name', 'summary'], refArrays: ['articles'] },
  objections: { required: ['title', 'argument', 'response'], refArrays: ['articles'] },
  predictions: { required: ['title', 'statement'], refArrays: ['articles'] },
  timelines: { required: ['title', 'summary'], refArrays: ['articles'] },
};

const KNOWN_PAGES = new Set([
  '/',
  '/theorie',
  '/theorie/chronologie',
  '/explorer',
  '/explorer/frises',
  '/explorer/carte',
  '/explorer/personnages',
  '/explorer/schemas',
  '/explorer/elbaf',
  '/explorer/globe',
  '/evolution',
  '/evolution/chapitres',
  '/evolution/previsions',
  '/evolution/historique',
  '/evolution/abandonnees',
  '/verifier',
  '/verifier/preuves',
  '/verifier/citations',
  '/verifier/paralleles',
  '/verifier/objections',
  '/verifier/contradictions',
  '/verifier/sources',
  '/aide',
  '/aide/faq',
  '/aide/glossaire',
  '/aide/a-propos',
  '/aide/credits',
  '/aide/correction',
  '/aide/index',
  '/404',
]);

const errors = [];
const articleIds = [];

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(md|mdx)$/.test(entry)) out.push(full);
  }
  return out;
}

function parseFrontmatter(raw) {
  const lines = raw.split(/\r?\n/);
  if (lines[0].trim() !== '---') return null;
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) return null;
  const fm = lines.slice(1, end).join('\n');
  const body = lines.slice(end + 1).join('\n');
  const data = {};
  const lineRe = /^([A-Za-z0-9_-]+):\s*(.*)$/;
  for (const line of fm.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const m = line.match(lineRe);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (/^\[.*\]$/.test(val)) {
      const inner = val.slice(1, -1).trim();
      data[key] = inner
        ? inner.split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
        : [];
    } else {
      data[key] = val;
    }
  }
  return { data, body };
}

const files = walk(CONTENT_DIR);

// First pass : collect article ids for reference checks.
for (const file of files) {
  const rel = relative(CONTENT_DIR, file);
  const parts = rel.split(sep);
  const collection = parts[0];
  if (collection === 'articles') {
    const id = parts[parts.length - 1].replace(/\.(md|mdx)$/, '');
    articleIds.push(id);
  }
}

// Second pass : validate.
for (const file of files) {
  const rel = relative(CONTENT_DIR, file).split(sep).join('/');
  const collection = rel.split('/')[0];
  const raw = readFileSync(file, 'utf8');
  const parsed = parseFrontmatter(raw);
  if (!parsed) {
    errors.push(`${rel} : frontmatter introuvable ou mal formé.`);
    continue;
  }
  const { data, body } = parsed;
  const schema = SCHEMA[collection];
  if (schema) {
    for (const field of schema.required) {
      if (data[field] === undefined || data[field] === '') {
        errors.push(`${rel} : champ obligatoire manquant : "${field}".`);
      }
    }
    for (const [path, allowed] of Object.entries(ENUMS)) {
      const [col, field] = path.split('.');
      if (col !== collection) continue;
      const value = data[field];
      if (value !== undefined && value !== '' && !allowed.includes(value)) {
        errors.push(`${rel} : "${field}"="${value}" invalide (attendu : ${allowed.join(', ')}).`);
      }
    }
    for (const arrField of schema.refArrays) {
      const refs = Array.isArray(data[arrField]) ? data[arrField] : [];
      for (const ref of refs) {
        if (!articleIds.includes(ref)) {
          errors.push(`${rel} : référence "${arrField}" -> article inexistant : "${ref}".`);
        }
      }
    }
  }

  // Internal link check (body).
  const linkRe = /\[[^\]]*\]\((\/[^)\s]+)\)/g;
  let match;
  while ((match = linkRe.exec(body)) !== null) {
    let path = match[1];
    path = path.replace(/[?#].*$/, '').replace(/\/$/, '') || '/';
    if (!KNOWN_PAGES.has(path)) {
      errors.push(`${rel} : lien interne cassé vers "${match[1]}".`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\n❌ Validation du contenu : ${errors.length} erreur(s)\n`);
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
} else {
  console.log(`\n✅ Validation du contenu : ${files.length} fichier(s) vérifié(s), aucune erreur.`);
}
