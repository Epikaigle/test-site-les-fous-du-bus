import React, { useState, useEffect, useRef } from 'react';

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    const handleOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('openSearch', handleOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('openSearch', handleOpen);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        // @ts-ignore
        const pagefindUrl = '/pagefind/pagefind.js';
        const pagefind = await import(/* @vite-ignore */ pagefindUrl);
        await pagefind.init();
        const search = await pagefind.search(query);
        const fiveResults = await Promise.all(search.results.slice(0, 5).map((r: any) => r.data()));
        setResults(fiveResults);
      } catch (e) {
        console.error("Pagefind n'est pas disponible (il faut build le site une fois).", e);
      }
    };
    fetchResults();
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-2xl bg-bgSecondary border border-white/10 rounded-lg shadow-2xl overflow-hidden flex flex-col mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-4 border-b border-white/10 bg-surface">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet mr-3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            ref={inputRef}
            type="text" 
            className="flex-1 bg-transparent border-none outline-none text-textMain text-[17px] placeholder-textSecondary"
            placeholder="Rechercher dans la théorie..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="text-textSecondary hover:text-textMain px-2 text-xs font-semibold tracking-wider">ECHAP</button>
        </div>
        
        {results.length > 0 && (
          <div className="max-h-[50vh] overflow-y-auto">
            <ul className="py-2">
              {results.map((result, idx) => (
                <li key={idx}>
                  <a href={result.url} className="block px-6 py-4 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors">
                    <h4 className="text-textMain font-medium mb-1 text-[15px]">{result.meta.title || "Page"}</h4>
                    <p className="text-[13px] text-textSecondary line-clamp-2" dangerouslySetInnerHTML={{ __html: result.excerpt }}></p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {query && results.length === 0 && (
          <div className="px-6 py-12 text-center text-textSecondary text-[14px]">
            Aucun résultat pour "{query}"
          </div>
        )}
      </div>
    </div>
  );
}
