import { fetchRecentSearches } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';

export function RecentSearchesTab({ bookstoreId }: { bookstoreId: string }) {
  const { data: searches, loading, error } = useAsync(
    () => fetchRecentSearches(bookstoreId),
    [bookstoreId]
  );

  return (
    <div>
      <h2 className="font-display text-2xl text-forest mb-2">Recent searches</h2>
      <p className="text-sm text-ink/50 mb-6">
        What readers searched for in the last 30 days that matches books in your catalogue.
      </p>

      {error && <p className="text-sm text-terracotta">Could not load recent searches.</p>}
      {loading && !searches && <p className="text-sm text-forest/60">Loading…</p>}
      {searches?.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-6 text-sm text-ink/60">
          No searches matching your books yet.
        </div>
      )}

      {searches && searches.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft divide-y divide-ink/5">
          {searches.map((s) => (
            <div
              key={s.query}
              className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1 px-6 py-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-forest wrap-break-word">“{s.query}”</p>
                <p className="text-xs text-ink/45 mt-0.5">
                  Matches: {s.matchingBooks.join(', ')}
                </p>
              </div>
              <span className="text-xs text-ink/45 shrink-0">
                {s.times} {s.times === 1 ? 'search' : 'searches'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
