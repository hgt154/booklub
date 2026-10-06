import { Link } from 'react-router-dom';
import { fetchBookstores, fetchRecentBooks, fetchEvents } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { BookstoreCard } from '../components/BookstoreCard';
import { BookCover } from '../components/BookCover';
import { StoreMark } from '../components/StoreMark';

export default function HomePage() {
  const { data: bookstores } = useAsync(fetchBookstores);
  const { data: recentBooks } = useAsync(() => fetchRecentBooks(10));
  const { data: events } = useAsync(fetchEvents);

  return (
    <div>
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center">
        <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-4">
          Vienna, 2026
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-forest leading-tight max-w-3xl mx-auto mb-6">
          Discover independent bookstores, one shelf at a time
        </h1>
        <p className="text-forest/60 max-w-xl mx-auto mb-10">
          A community, not a marketplace. Find the book you're looking for and the
          people behind the shelves.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/search"
            className="bg-forest text-cream text-sm font-medium px-7 py-3 rounded-full"
          >
            Find a book
          </Link>
          <Link
            to="/bookstores"
            className="border border-forest text-forest text-sm font-medium px-7 py-3 rounded-full hover:bg-forest hover:text-cream transition-colors"
          >
            Browse bookstores
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* FEATURED BOOKSTORES */}
        <section className="mb-20">
          <h2 className="font-display text-3xl text-forest mb-6">Featured bookstores</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {bookstores?.slice(0, 3).map((store) => (
              <BookstoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>

        {/* RECENTLY ADDED BOOKS */}
        <section className="mb-20">
          <h2 className="font-display text-3xl text-forest mb-6">Recently added</h2>
          <div className="flex gap-5 overflow-x-auto pb-2">
            {recentBooks?.map(({ book, bookstore }) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="w-40 shrink-0 group"
              >
                <BookCover book={{ ...book, genre: '', desc: '' }} />
                <p className="font-display text-sm text-forest mt-3 leading-snug group-hover:text-terracotta transition-colors">
                  {book.title}
                </p>
                <p className="text-xs text-forest/50 mt-0.5">{book.author}</p>
                <p className="text-[11px] text-forest/40 mt-1">at {bookstore.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* UPCOMING EVENTS */}
        <section className="mb-20">
          <h2 className="font-display text-3xl text-forest mb-6">Upcoming events</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events?.slice(0, 3).map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl p-6 shadow-sm border-t-4"
                style={{ borderColor: ev.bookstore.accent }}
              >
                <p className="text-[11px] font-semibold tracking-widest uppercase text-terracotta mb-2">
                  {ev.type}
                </p>
                <h3 className="font-display text-lg text-forest leading-snug mb-2">{ev.title}</h3>
                <p className="text-sm text-forest/60 leading-relaxed mb-4">{ev.description}</p>
                <div className="flex items-center justify-between text-xs text-forest/50 border-t border-forest/8 pt-4">
                  <span>{ev.date} · {ev.time}</span>
                  <Link
                    to={`/bookstores/${ev.bookstore.slug}`}
                    className="flex items-center gap-1.5 font-medium text-forest hover:text-terracotta"
                  >
                    <StoreMark store={ev.bookstore} sizeClass="w-5 h-5 text-[10px]" />
                    {ev.bookstore.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
