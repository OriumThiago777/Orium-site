import { useEffect, useState } from 'react';

/**
 * Observa uma lista de seções por id e retorna qual está visível no viewport,
 * para sincronizar sidebars de navegação por âncora (scroll-spy).
 */
export function useScrollSpy(ids: string[], rootMargin = '-20% 0px -70% 0px') {
  const [activeId, setActiveId] = useState(ids[0] ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin, threshold: 0 }
    );

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return [activeId, setActiveId] as const;
}
