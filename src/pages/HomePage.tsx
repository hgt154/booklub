import { useRef } from 'react';
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
  const carousel = useRef<HTMLDivElement>(null);

  function scrollCarousel(dir: number) {
    carousel.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  }

  return (
    <div>
      {/* HERO */}
      <div className="relative h-[92vh] min-h-150 w-full overflow-hidden -mt-20 pt-20">
        <img
          src="https://images.unsplash.com/photo-1521123845560-14093637aa7d?auto=format&fit=crop&w=1800&q=80"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Warm interior of an independent bookstore"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-24">
          <p className="fade-slide text-cream/80 tracking-[0.25em] text-xs font-medium uppercase mb-5">
            A community for independent bookstores &amp; readers
          </p>
          <h1
            className="fade-slide font-display text-cream text-5xl md:text-7xl leading-[1.05] max-w-3xl"
            style={{ animationDelay: '.1s' }}
          >
            Discover books through people, not algorithms.
          </h1>
          <p
            className="fade-slide text-cream/85 text-lg md:text-xl max-w-2xl mt-6 font-light"
            style={{ animationDelay: '.2s' }}
          >
            Explore independent bookstores, discover unique collections, and become part of a
            community that believes every bookstore has a story.
          </p>
        </div>
      </div>

      {/* THREE ENTRY CARDS */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 grid md:grid-cols-3 gap-6">
        <EntryCard
          emoji="📚"
          title="I'm looking for a specific book"
          text="Search by title, author or ISBN and instantly discover which independent bookstores have it."
          to="/search"
          button="Search Books"
        />
        <EntryCard
          emoji="🏡"
          title="I want to discover independent bookstores"
          text="Browse bookstores by neighborhood, specialty, language and atmosphere."
          to="/bookstores"
          button="Explore Bookstores"
        />
        <EntryCard
          emoji="☕"
          title="I'm looking for my next literary place"
          text="Find reading clubs, literary cafés, events, exhibitions and inspiring places."
          to="/community"
          button="Explore Community"
        />
      </div>

      {/* FEATURED BOOKSTORES */}
      <div className="max-w-7xl mx-auto px-6 mt-28">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Featured
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-forest">
              Bookstores worth wandering into
            </h2>
          </div>
          <Link
            to="/bookstores"
            className="hidden md:block text-sm font-medium text-forest border-b border-forest/40 hover:border-forest pb-0.5"
          >
            View all bookstores →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {bookstores?.slice(0, 3).map((store) => (
            <BookstoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>

      {/* RECENTLY ADDED BOOKS */}
      <div className="max-w-7xl mx-auto px-6 mt-28">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Fresh on the shelves
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-forest">Recently added books</h2>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scrollCarousel(-1)}
              className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center hover:bg-forest hover:text-cream hover:border-forest transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => scrollCarousel(1)}
              className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center hover:bg-forest hover:text-cream hover:border-forest transition-colors"
            >
              →
            </button>
          </div>
        </div>
        <div ref={carousel} className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
          {recentBooks?.map(({ book, bookstore }) => (
            <Link key={book.id} to={`/books/${book.slug}`} className="w-44 shrink-0 group">
              <div className="img-zoom">
                <BookCover book={book} />
              </div>
              <p className="font-display text-sm text-forest mt-3 leading-snug group-hover:text-terracotta transition-colors">
                {book.title}
              </p>
              <p className="text-xs text-ink/50 mt-0.5">{book.author}</p>
              <p className="text-[11px] text-ink/40 mt-1">at {bookstore.name}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <div className="max-w-7xl mx-auto px-6 mt-28 mb-28">
        <div className="mb-8">
          <p className="text-terracotta text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Don't miss
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-forest">Upcoming events</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {events?.slice(0, 3).map((ev) => (
            <div
              key={ev.id}
              className="card-lift bg-white rounded-2xl p-6 shadow-soft border-t-4"
              style={{ borderColor: ev.bookstore.accent }}
            >
              <p className="text-[11px] font-semibold tracking-widest uppercase text-terracotta mb-2">
                {ev.type}
              </p>
              <h4 className="font-display text-lg text-forest leading-snug mb-2">{ev.title}</h4>
              <p className="text-sm text-ink/60 leading-relaxed mb-4">{ev.description}</p>
              <div className="flex items-center justify-between text-xs text-ink/50 border-t border-ink/8 pt-4">
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
      </div>

      {/* CTA BANNER */}
      <div className="bg-forest">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-cream leading-tight">
              Every independent bookstore has a story. Let's help readers find it.
            </h2>
            <p className="text-cream/70 mt-4 max-w-lg">
              Estante is a community platform, not a marketplace. We're currently building with
              a small group of independent booksellers in Vienna.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link
              to="/apply"
              className="btn-primary bg-cream text-forest font-medium px-8 py-4 rounded-full"
            >
              List your bookstore
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EntryCard({
  emoji, title, text, to, button,
}: { emoji: string; title: string; text: string; to: string; button: string }) {
  return (
    <div className="card-lift bg-white rounded-3xl p-8 shadow-lift flex flex-col">
      <span className="text-4xl mb-5">{emoji}</span>
      <h3 className="font-display text-xl text-forest mb-2">{title}</h3>
      <p className="text-ink/65 text-sm leading-relaxed flex-1">{text}</p>
      <Link
        to={to}
        className="btn-primary mt-6 bg-forest text-cream text-sm font-medium px-5 py-3 rounded-full w-full text-center"
      >
        {button}
      </Link>
    </div>
  );
}
