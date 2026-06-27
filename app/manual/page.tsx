'use client';

import { useEffect } from 'react';

export default function ManualPage() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <style>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>
      <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <iframe
          src="/manual-orium.html"
          width="100%"
          style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
          sandbox="allow-scripts allow-same-origin"
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
            background: 'transparent',
          }}
        />
      </div>
    </>
  );
}
