import { useParams, Link } from 'react-router-dom';
import { fetchBook, fetchListingsByBook } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { BookCover } from '../components/BookCover';
import { StoreMark } from '../components/StoreMark';

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const { data: book, loading, error } = useAsync(() => fetchBook(id!), [id]);
  const { data: listings } = useAsync(
    () => (id ? fetchListingsByBook(id) : Promise.resolve([])),
    [id]
  );

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
        <div className="space-y-4">
          {listings?.map((l) => (
            <div
              key={l.id}
              className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4"
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
              <div className="text-right shrink-0">
                <p className="font-display text-lg text-forest">€{l.price}</p>
                <p className="text-[11px] text-forest/45">
                  {l.status === 'available' ? 'In stock' : l.status}
                </p>
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
