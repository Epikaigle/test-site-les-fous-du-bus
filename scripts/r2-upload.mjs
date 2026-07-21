#!/usr/bin/env node
/**
 * Envoi d'images vers Cloudflare R2.
 *
 * Parcourt un dossier local et upload chaque fichier vers le bucket R2 configuré,
 * en conservant l'arborescence relative comme clé d'objet.
 *
 * Prérequis :
 *  - `wrangler` installé (devDependency) et authentifié (`wrangler login`).
 *  - Variables d'environnement : R2_BUCKET_NAME, R2_ACCOUNT_ID (via .env).
 *
 * Variables d'environnement optionnelles :
 *  - R2_SRC_DIR  : dossier source (défaut : ./public/images)
 *  - R2_PREFIX   : préfixe de clé (ex. "articles/joy-boy")
 *
 * Usage :
 *  node scripts/r2-upload.mjs            # upload réel
 *  node scripts/r2-upload.mjs --dry-run  # liste les commandes sans envoyer
 */

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const bucket = process.env.R2_BUCKET_NAME || 'one-piece-media';
const srcDir = process.env.R2_SRC_DIR || join(root, 'public', 'images');
const prefix = process.env.R2_PREFIX || '';
const dryRun = process.argv.includes('--dry-run');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

if (!existsSync(srcDir)) {
  console.error(`Source introuvable : ${srcDir}`);
  process.exit(1);
}

const files = walk(srcDir);
if (files.length === 0) {
  console.log(`Aucun fichier à envoyer dans ${srcDir}.`);
  process.exit(0);
}

console.log(`Bucket : ${bucket} | Source : ${srcDir} | ${files.length} fichier(s)\n`);

for (const file of files) {
  const rel = relative(srcDir, file).split(sep).join('/');
  const key = [prefix, rel].filter(Boolean).join('/');
  console.log(`${dryRun ? '[dry-run] ' : ''}put ${bucket}/${key} <- ${file}`);
  if (!dryRun) {
    execFileSync(
      'npx',
      ['wrangler', 'r2', 'object', 'put', `${bucket}/${key}`, '--file', file, '--remote'],
      { stdio: 'inherit' }
    );
  }
}

console.log('\nTerminé.');
