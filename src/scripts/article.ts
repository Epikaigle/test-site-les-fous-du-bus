/**
 * Scripts propres aux pages article :
 * - sommaire généré depuis les titres (h2, h3) de la zone principale ;
 * - mise en évidence de la section courante (IntersectionObserver) ;
 * - temps de lecture (~220 mots/minute).
 *
 * Le contenu reste intégralement lisible sans JavaScript : le sommaire est
 * alors simplement vide, et le temps de lecture n'apparaît pas.
 */

const main = document.querySelector<HTMLElement>('main[data-pagefind-body].article-body');

if (main) {
  const headings = Array.from(main.querySelectorAll<HTMLHeadingElement>('h2, h3')).filter(
    (heading) => (heading.textContent ?? '').trim().length > 0,
  );

  const tocTargets = ['toc-list-desktop', 'toc-list-mobile']
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));

  if (tocTargets.length > 0 && headings.length >= 2) {
    // Identifiants d'ancre : réutilisés si présents, générés sinon.
    const slugCounts = new Map<string, number>();
    headings.forEach((heading) => {
      if (heading.id) return;
      const base = slugify(heading.textContent ?? 'section') || 'section';
      const count = slugCounts.get(base) ?? 0;
      slugCounts.set(base, count + 1);
      heading.id = count ? `${base}-${count + 1}` : base;
    });

    const linkFor = (heading: HTMLHeadingElement) => {
      const sub = heading.tagName === 'H3' ? ' toc-link--sub' : '';
      return `<a class="toc-link${sub}" href="#${heading.id}" data-toc-link="${heading.id}">${heading.textContent}</a>`;
    };

    tocTargets.forEach((target) => {
      target.innerHTML = `<nav aria-label="Sommaire">${headings.map(linkFor).join('')}</nav>`;
    });

    const knownIds = new Set(headings.map((heading) => heading.id));
    const setActive = (id: string) => {
      document.querySelectorAll('.toc-link').forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('data-toc-link') === id);
      });
    };
    if (headings[0]) setActive(headings[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting && knownIds.has(id)) setActive(id);
        });
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 },
    );
    headings.forEach((heading) => observer.observe(heading));
  } else {
    // Article court ou sommaire désactivé : on retire les contrôles associés.
    document.querySelectorAll<HTMLElement>('[data-toc-floating]').forEach((el) => {
      el.style.display = 'none';
    });
  }

  // Temps de lecture estimé (~220 mots / minute).
  const words = (main.textContent ?? '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  document.querySelectorAll<HTMLElement>('[data-reading-time]').forEach((el) => {
    el.textContent = `${minutes} min de lecture`;
    el.closest('[data-reading-time-wrap]')?.removeAttribute('hidden');
  });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
