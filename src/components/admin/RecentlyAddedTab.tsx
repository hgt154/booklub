import { Link } from 'react-router-dom';
import { fetchRecentListings } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';
import { BookCover } from '../BookCover';

export function RecentlyAddedTab({ bookstoreId }: { bookstoreId: string }) {
  const { data: listings, loading, error } = useAsync(
    () => fetchRecentListings(bookstoreId, 20),
    [bookstoreId]
  );

  return (
    <div>
      <h2 className="font-display text-2xl text-forest mb-6">Recently added books</h2>

      {error && <p className="text-sm text-terracotta">Could not load recently added books.</p>}
      {loading && !listings && <p className="text-sm text-forest/60">Loading…</p>}
      {listings?.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-6 text-sm text-ink/60">
          No books added yet. Add one in the{' '}
          <Link to="/admin?tab=books" className="text-forest font-medium underline">
            Books
          </Link>{' '}
          tab.
        </div>
      )}

      {listings && listings.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((l) => (
            <Link
              key={l.id}
              to={`/books/${l.book.slug}`}
              className="bg-white rounded-xl p-4 shadow-soft group"
            >
              <div className="w-16 mx-auto mb-3">
                <BookCover book={l.book} />
              </div>
              <p className="text-xs font-medium text-forest text-center leading-snug group-hover:text-terracotta transition-colors">
                {l.book.title}
              </p>
              <p className="text-[11px] text-ink/45 text-center mt-1">
                €{l.price} ·{' '}
                {new Date(l.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
