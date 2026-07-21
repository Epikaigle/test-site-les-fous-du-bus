/**
 * Couche d'interaction globale — amélioration progressive uniquement :
 * le site reste entièrement lisible et navigable sans JavaScript.
 *
 * - bascule clair / sombre ;
 * - popovers (anti-spoilers, aide) ;
 * - tiroirs latéraux (navigation, sommaire) ;
 * - réglage anti-spoilers (masquage par chapitre) ;
 * - recherche globale (Ctrl/⌘ + K, Pagefind si l'index est disponible).
 */

/* ------------------------------- Thème -------------------------------------- */

function syncThemeIcons() {
  const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  // En mode sombre on propose le soleil (passer au clair), et inversement.
  document.querySelectorAll<HTMLElement>('[data-theme-icon]').forEach((el) => {
    const showSun = theme === 'dark';
    el.classList.toggle('hidden', (el.dataset.themeIcon === 'sun') !== showSun);
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem('lfdb-theme', next);
    } catch {
      /* stockage indisponible : le choix reste en mémoire pour la page */
    }
    syncThemeIcons();
  });
});
syncThemeIcons();

/* ------------------------------- Popovers ----------------------------------- */

document.querySelectorAll<HTMLElement>('[data-popover]').forEach((root) => {
  const trigger = root.querySelector<HTMLButtonElement>('[data-popover-trigger]');
  const panel = root.querySelector<HTMLElement>('[data-popover-panel]');
  if (!trigger || !panel) return;

  const setOpen = (open: boolean) => {
    panel.classList.toggle('hidden', !open);
    trigger.setAttribute('aria-expanded', String(open));
  };

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(panel.classList.contains('hidden'));
  });
  panel.addEventListener('click', (event) => event.stopPropagation());
  document.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
});

/* -------------------------------- Tiroirs ----------------------------------- */

document.querySelectorAll<HTMLElement>('[data-drawer]').forEach((drawer) => {
  const show = () => {
    drawer.classList.remove('invisible');
    document.body.style.overflow = 'hidden';
    // double rAF : laisse le navigateur appliquer `visibility` avant la transition
    requestAnimationFrame(() => requestAnimationFrame(() => drawer.setAttribute('data-open', '')));
  };
  const hide = () => {
    drawer.removeAttribute('data-open');
    document.body.style.overflow = '';
    window.setTimeout(() => {
      if (!drawer.hasAttribute('data-open')) drawer.classList.add('invisible');
    }, 340);
  };

  document.querySelectorAll(`[data-drawer-open="${drawer.id}"]`).forEach((el) => el.addEventListener('click', show));
  drawer.querySelectorAll('[data-drawer-close]').forEach((el) => el.addEventListener('click', hide));
  // Suivre un lien ferme le tiroir (utile sur mobile)
  drawer.querySelectorAll('a[href]').forEach((link) => link.addEventListener('click', hide));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer.hasAttribute('data-open')) hide();
  });
});

/* ----------------------------- Anti-spoilers -------------------------------- */

const SPOILER_KEY = 'lfdb-spoiler-level';

function spoilerLevel(): number | null {
  try {
    const raw = localStorage.getItem(SPOILER_KEY);
    if (!raw) return null;
    const value = Number.parseInt(raw, 10);
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

function syncSpoilerUi() {
  const level = spoilerLevel();
  const state = document.querySelector<HTMLElement>('[data-spoiler-state]');
  if (state) {
    state.textContent = level ? `Restriction active : chapitre ${level}` : 'Aucune restriction';
  }
  document.querySelectorAll('[data-spoiler-dot]').forEach((el) => el.classList.toggle('hidden', level === null));
  const input = document.querySelector<HTMLInputElement>('[data-spoiler-input]');
  if (input && level !== null) input.value = String(level);
}

function buildVeil(chapter: number): HTMLButtonElement {
  const veil = document.createElement('button');
  veil.type = 'button';
  veil.className = 'spoiler-veil';
  veil.setAttribute('aria-label', `Contenu masqué — spoiler du chapitre ${chapter}. Cliquer pour révéler.`);
  veil.innerHTML =
    `<strong aria-hidden="true">Spoiler · chapitre ${chapter}</strong>` +
    '<span>Masqué par le réglage anti-spoilers — cliquer pour révéler</span>';
  veil.addEventListener('click', () => {
    (veil.parentElement as HTMLElement).setAttribute('data-revealed', '');
  });
  return veil;
}

/**
 * Masque (ou démasque) les éléments portant `data-spoiler-chapter="N"`
 * lorsque N dépasse le niveau de lecture choisi.
 */
function applySpoilers() {
  const level = spoilerLevel();
  document.querySelectorAll<HTMLElement>('[data-spoiler-chapter]').forEach((el) => {
    const chapter = Number.parseInt(el.dataset.spoilerChapter ?? '', 10);
    const masked = level !== null && Number.isFinite(chapter) && chapter > level;
    const wrap = el.closest<HTMLElement>('.spoiler-wrap');

    if (masked && !wrap) {
      const wrapper = document.createElement('div');
      wrapper.className = 'spoiler-wrap';
      el.parentNode?.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      wrapper.appendChild(buildVeil(chapter));
    } else if (!masked && wrap) {
      wrap.querySelector('.spoiler-veil')?.remove();
      wrap.parentNode?.insertBefore(el, wrap);
      wrap.remove();
    }
  });
  syncSpoilerUi();
}

document.querySelectorAll('[data-spoiler-apply]').forEach((button) => {
  button.addEventListener('click', () => {
    const input = document.querySelector<HTMLInputElement>('[data-spoiler-input]');
    const value = Number.parseInt(input?.value ?? '', 10);
    try {
      if (Number.isFinite(value) && value > 0) localStorage.setItem(SPOILER_KEY, String(value));
      else localStorage.removeItem(SPOILER_KEY);
    } catch {
      /* stockage indisponible */
    }
    applySpoilers();
  });
});

document.querySelectorAll('[data-spoiler-clear]').forEach((button) => {
  button.addEventListener('click', () => {
    try {
      localStorage.removeItem(SPOILER_KEY);
    } catch {
      /* stockage indisponible */
    }
    const input = document.querySelector<HTMLInputElement>('[data-spoiler-input]');
    if (input) input.value = '';
    applySpoilers();
  });
});

applySpoilers();

/* ------------------------------- Recherche ----------------------------------- */

interface PagefindResult {
  data: () => Promise<{ url: string; excerpt: string; meta?: { title?: string } }>;
}
interface PagefindApi {
  init?: () => Promise<void>;
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
}

const searchRoot = document.getElementById('search-root');
if (searchRoot) {
  const input = searchRoot.querySelector<HTMLInputElement>('[data-search-input]');
  const results = searchRoot.querySelector<HTMLElement>('[data-search-results]');
  let pagefind: PagefindApi | null = null;
  let indexAttempted = false;
  let debounce: number | undefined;

  const renderHint = (html: string) => {
    if (results) {
      results.innerHTML = `<p class="px-3 py-8 text-center text-sm text-mist/70">${html}</p>`;
    }
  };

  const escapeHtml = (value: string) => {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  };

  /**
   * L'index Pagefind est généré dans dist/pagefind après le build.
   * En développement (ou sans index), la boîte de dialogue affiche une note.
   */
  async function ensureIndex() {
    if (indexAttempted) return;
    indexAttempted = true;
    try {
      // Chemin volontairement dynamique : l'index n'existe qu'après le build.
      const pagefindUrl = '/pagefind/pagefind.js';
      const pf = (await import(/* @vite-ignore */ pagefindUrl)) as PagefindApi;
      await pf.init?.();
      pagefind = pf;
    } catch {
      pagefind = null;
    }
  }

  const show = () => {
    searchRoot?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    input?.focus();
    void ensureIndex();
  };
  const hide = () => {
    searchRoot?.classList.add('hidden');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-search-open]').forEach((el) => el.addEventListener('click', show));
  searchRoot.querySelectorAll('[data-search-close]').forEach((el) => el.addEventListener('click', hide));
  document.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null;
    const typing = Boolean(target?.closest('input, textarea, select, [contenteditable="true"]'));
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      searchRoot.classList.contains('hidden') ? show() : hide();
    } else if (event.key === '/' && !typing) {
      event.preventDefault();
      show();
    } else if (event.key === 'Escape' && !searchRoot.classList.contains('hidden')) {
      hide();
    }
  });

  async function runSearch() {
    const query = (input?.value ?? '').trim();
    if (!query) {
      renderHint('Saisissez un terme : un personnage, un chapitre, un lieu…');
      return;
    }
    if (!pagefind) {
      renderHint(
        'L’index de recherche n’est pas encore disponible.<br />Il sera généré lors du build ' +
          '(<code class="text-cyan">pnpm build</code>) grâce à Pagefind.',
      );
      return;
    }
    renderHint('Recherche en cours…');
    const response = await pagefind.search(query);
    if (response.results.length === 0) {
      renderHint(`Aucun résultat pour « ${escapeHtml(query)} ».`);
      return;
    }
    const items = await Promise.all(response.results.slice(0, 8).map((result) => result.data()));
    if (results) {
      results.innerHTML = items
        .map(
          (item) => `
            <a href="${item.url}" class="block rounded-lg px-3 py-2.5 transition hover:bg-surface/70">
              <span class="block text-sm font-medium text-ink">${escapeHtml(item.meta?.title ?? item.url)}</span>
              <span class="mt-0.5 block text-xs leading-relaxed text-mist/75">${item.excerpt}</span>
            </a>`,
        )
        .join('');
      results.querySelectorAll('a').forEach((link) => link.addEventListener('click', hide));
    }
  }

  input?.addEventListener('input', () => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => void runSearch(), 180);
  });
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') void runSearch();
  });
}
