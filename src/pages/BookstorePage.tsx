import { useParams, Link } from 'react-router-dom';
import { fetchBookstore, fetchListingsByBookstore } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { StoreMark } from '../components/StoreMark';
import { TagList } from '../components/TagList';
import { BookCover } from '../components/BookCover';

export default function BookstorePage() {
  const { id } = useParams<{ id: string }>();
  const { data: store, loading, error } = useAsync(() => fetchBookstore(id!), [id]);

  const { data: listings } = useAsync(
    () => (store?.dbId ? fetchListingsByBookstore(store.dbId) : Promise.resolve([])),
    [store?.dbId]
  );

  if (loading) {
    return <p className="max-w-7xl mx-auto px-6 py-10 text-forest/60">Loading…</p>;
  }

  if (error || !store) {
    return (
      <p className="max-w-7xl mx-auto px-6 py-10 text-terracotta">
        Bookstore not found.
      </p>
    );
  }

  return (
    <div>
      {/* HERO */}
      <div className="relative h-[60vh] min-h-[380px] w-full overflow-hidden">
        <img
          src={store.heroImg}
          className="absolute inset-0 w-full h-full object-cover"
          alt={store.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-10">
          <div className="flex items-center gap-3 mb-4">
            <StoreMark store={store} sizeClass="w-12 h-12 text-lg" />
            <span className="bg-terracotta text-cream text-xs font-medium px-3 py-1.5 rounded-full">
              {store.badge}
            </span>
          </div>
          <h1 className="font-display text-cream text-4xl md:text-5xl">{store.name}</h1>
          <p className="text-cream/80 mt-2">
            {store.neighborhood}, Vienna · Est. {store.founded} · {store.atmosphere}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 -mt-8 relative z-20 mb-14">
          <StatTile value={store.stats.books} label="Books" />
          <StatTile value={store.stats.followers} label="Followers" />
          <StatTile value={store.stats.eventsHosted} label="Events hosted" />
          <StatTile value={store.stats.reserved} label="Reserved" />
          <StatTile value={store.stats.recentlyAdded} label="Recently added" />
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-12 pb-16">
          <div>
            {/* MEET THE BOOKSELLER */}
            <div className="flex items-start gap-5 mb-12">
              <img
                src={store.ownerPortrait}
                className="w-20 h-20 rounded-full object-cover shrink-0"
                alt={store.owner}
              />
              <div>
                <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-1">
                  Meet the bookseller
                </p>
                <h3 className="font-display text-lg text-forest">{store.owner}</h3>
                <p className="text-xs text-forest/50 mb-3">
                  {store.ownerRole}, {store.name}
                </p>
                <p className="font-display italic text-forest/80">"{store.quote}"</p>
              </div>
            </div>

            {/* STORY */}
            <div className="mb-12">
              <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-3">
                Our story
              </p>
              <p className="text-forest/70 leading-relaxed mb-3">{store.story}</p>
              <p className="text-forest/70 leading-relaxed">
                <span className="font-medium text-forest">Mission — </span>
                {store.mission}
              </p>
            </div>

            {/* TIMELINE */}
            <div className="mb-12">
              <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-5">
                Timeline
              </p>
              <div className="space-y-5 border-l-2 border-forest/15 pl-5">
                {store.timeline.map((t) => (
                  <div key={t.year}>
                    <p className="font-display text-forest">{t.year}</p>
                    <p className="text-sm text-forest/65">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SPECIALTIES / LANGUAGES */}
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              <div>
                <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-2">
                  Specialties
                </p>
                <div className="flex flex-wrap gap-2">
                  <TagList items={store.specialties} />
                </div>
              </div>
              <div>
                <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-2">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  <TagList items={store.languages} />
                </div>
              </div>
            </div>

            {/* BOOKS */}
            <div>
              <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-3">
                Books at {store.name}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {listings?.slice(0, 10).map((l) => (
                  <Link key={l.id} to={`/books/${l.book.id}`} className="group">
                    <BookCover book={{ ...l.book, genre: '', desc: '' }} />
                    <p className="text-xs font-medium text-forest mt-2 leading-snug group-hover:text-terracotta transition-colors">
                      {l.book.title}
                    </p>
                  </Link>
                ))}
                {listings?.length === 0 && (
                  <p className="col-span-full text-sm text-forest/50">
                    No books listed yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-5">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-widest uppercase text-forest/40 mb-3">
                Opening hours
              </p>
              {store.hours.map(([day, time]) => (
                <div key={day} className="flex justify-between text-sm py-0.5">
                  <span className="text-forest/55">{day}</span>
                  <span className="text-forest/80 font-medium">{time}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-widest uppercase text-forest/40 mb-2">
                Location
              </p>
              <p className="text-sm text-forest/70">{store.address}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold tracking-widest uppercase text-forest/40 mb-2">
                Instagram
              </p>
              <p className="text-sm text-forest font-medium">{store.instagram}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white rounded-2xl px-4 py-4 shadow-sm text-center">
      <p className="font-display text-2xl text-forest">{value.toLocaleString()}</p>
      <p className="text-[11px] uppercase tracking-wide text-forest/45 mt-1">{label}</p>
    </div>
  );
}
