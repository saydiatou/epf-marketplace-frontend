export default function Pagination({ meta, onPage }) {
  if (!meta || meta.last_page <= 1) return null;

  const current = meta.current_page;
  const last    = meta.last_page;

  const buildPageNumbers = () => {
    const pages = [];
    const delta = 2;
    for (let i = 1; i <= last; i++) {
      if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '…') {
        pages.push('…');
      }
    }
    return pages;
  };

  return (
    <nav className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Page <strong>{current}</strong> sur <strong>{last}</strong>
        {meta.total && ` · ${meta.total} résultat${meta.total > 1 ? 's' : ''}`}
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(current - 1)} disabled={current === 1} className="px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100">
          ← Préc.
        </button>
        {buildPageNumbers().map((page, idx) =>
          page === '…' ? (
            <span key={`e-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
          ) : (
            <button key={page} onClick={() => onPage(page)} className={`w-9 h-9 rounded-lg text-sm font-medium transition ${page === current ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
              {page}
            </button>
          )
        )}
        <button onClick={() => onPage(current + 1)} disabled={current === last} className="px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100">
          Suiv. →
        </button>
      </div>
    </nav>
  );
}
