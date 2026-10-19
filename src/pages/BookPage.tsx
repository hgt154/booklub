import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  createReservation,
  fetchBook,
  fetchListingsByBook,
  fetchMyActiveListingIds,
} from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { useAuth } from '../lib/useAuth';
import { BookCover } from '../components/BookCover';
import { StoreMark } from '../components/StoreMark';

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const { data: book, loading, error } = useAsync(() => fetchBook(id!), [id]);
  const { user } = useAuth();
  const location = useLocation();
  // збільшуємо після резервації, щоб перечитати листинги й резервації
  const [reloadKey, setReloadKey] = useState(0);
  const { data: listings } = useAsync(
    () => (id ? fetchListingsByBook(id) : Promise.resolve([])),
    [id, reloadKey]
  );
  const { data: reservedIds } = useAsync(
    () => (user ? fetchMyActiveListingIds(user.id) : Promise.resolve([])),
    [user?.id, reloadKey]
  );
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function reserve(listingId: string) {
    if (!user) return;
    setPendingId(listingId);
    setNotice(null);
    try {
      await createReservation(listingId, user.id);
      setNotice({ kind: 'ok', text: 'Reserved! The bookstore will confirm soon. See it in your profile.' });
      setReloadKey((k) => k + 1);
    } catch (e) {
      setNotice({ kind: 'error', text: e instanceof Error ? e.message : 'Could not reserve this copy.' });
    } finally {
      setPendingId(null);
    }
  }

  const loginHref = `/auth?next=${encodeURIComponent(location.pathname + location.search)}`;

  if (loading) {
    return <p className="max-w-7xl mx-auto px-6 py-10 text-forest/60">Loading…</p>;
  }

  if (error || !book) {
    return <p className="max-w-7xl mx-auto px-6 py-10 text-terracotta">Book not found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-[260px_1fr] gap-12 mb-16">
        <div className="w-full">
          <BookCover book={book} size="large" />
        </div>
        <div>
          <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-2">
            {book.genre}
          </p>
          <h1 className="font-display text-4xl text-forest mb-2">{book.title}</h1>
          <p className="text-lg text-forest/60 mb-6">{book.author}</p>
          <p className="text-forest/70 leading-relaxed max-w-2xl">{book.description}</p>
        </div>
      </div>

      <div>
        <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-4">
          Available at
        </p>
        {notice && (
          <p
            role="status"
            className={`text-sm mb-4 ${notice.kind === 'ok' ? 'text-forest' : 'text-terracotta'}`}
          >
            {notice.text}{' '}
            {notice.kind === 'ok' && (
              <Link to="/profile" className="underline font-medium">
                My reservations
              </Link>
            )}
          </p>
        )}
        <div className="space-y-4">
          {listings?.map((l) => (
            <div
              key={l.id}
              className="bg-white rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4"
            >
              <Link to={`/bookstores/${l.bookstore.slug}`} className="flex items-center gap-3 group">
                <StoreMark store={l.bookstore} sizeClass="w-11 h-11" />
                <span>
                  <span className="block font-display text-forest group-hover:text-terracotta">
                    {l.bookstore.name}
                  </span>
                  <span className="block text-xs text-forest/45">
                    {l.bookstore.neighborhood} · {l.condition} · {l.language}
                  </span>
                </span>
              </Link>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="font-display text-lg text-forest">€{l.price}</p>
                  <p className="text-[11px] text-forest/45">
                    {l.status === 'available' ? 'In stock' : l.status}
                  </p>
                </div>
                {l.status === 'available' &&
                  (!user ? (
                    <Link to={loginHref} className="text-sm font-medium text-forest underline">
                      Log in to reserve
                    </Link>
                  ) : reservedIds?.includes(l.id) ? (
                    <span className="text-sm font-medium text-forest">Reserved ✓</span>
                  ) : (
                    <button
                      onClick={() => reserve(l.id)}
                      disabled={pendingId !== null}
                      className="btn-primary bg-forest text-cream text-sm font-medium px-5 py-2.5 rounded-full disabled:opacity-60"
                    >
                      {pendingId === l.id ? '…' : 'Reserve'}
                    </button>
                  ))}
              </div>
            </div>
          ))}
          {listings?.length === 0 && (
            <p className="text-sm text-forest/50">
              No bookstore currently lists this book.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
