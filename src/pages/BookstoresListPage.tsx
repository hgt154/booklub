import { useState } from 'react';
import { fetchBookstores } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { BookstoreCard } from '../components/BookstoreCard';

export function BookstoresListPage() {
  const { data: bookstores, loading, error } = useAsync(fetchBookstores);
  const [filter, setFilter] = useState('all');

  if (loading) return <p className="max-w-7xl mx-auto px-6 py-10 text-forest/60">Loading…</p>;
  if (error || !bookstores)
    return <p className="max-w-7xl mx-auto px-6 py-10 text-terracotta">Could not load bookstores.</p>;

  const neighborhoods = ['all', ...new Set(bookstores.map((b) => b.neighborhood))];
  const list = bookstores.filter((s) => filter === 'all' || s.neighborhood === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl text-forest mb-2">Bookstores</h1>
      <p className="text-forest/60 mb-8">Independent bookstores across Vienna.</p>

      <div className="flex flex-wrap gap-2 mb-10">
        {neighborhoods.map((n) => (
          <button
            key={n}
            onClick={() => setFilter(n)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              filter === n
                ? 'bg-forest text-cream border-forest'
                : 'bg-white border-forest/15 text-forest/70 hover:border-forest/40'
            }`}
          >
            {n === 'all' ? 'All neighborhoods' : n}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {list.map((store) => (
          <BookstoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}