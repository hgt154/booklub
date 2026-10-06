import { Link } from 'react-router-dom';
import { fetchEvents, fetchClubs, fetchStories, fetchWalks } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { StoreMark } from '../components/StoreMark';

export default function CommunityPage() {
  const { data: events } = useAsync(fetchEvents);
  const { data: clubs } = useAsync(fetchClubs);
  const { data: stories } = useAsync(fetchStories);
  const { data: walks } = useAsync(fetchWalks);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl text-forest mb-2">Community</h1>
      <p className="text-forest/60 mb-12">
        Events, reading circles and stories from Vienna's independent bookstores.
      </p>

      {/* EVENTS */}
      <section className="mb-16">
        <h2 className="font-display text-2xl text-forest mb-6">Upcoming events</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events?.map((ev) => (
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
          {events?.length === 0 && (
            <p className="text-sm text-forest/50">No upcoming events yet.</p>
          )}
        </div>
      </section>

      {/* BOOK CLUBS */}
      <section className="mb-16">
        <h2 className="font-display text-2xl text-forest mb-6">Book clubs</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {clubs?.map((club) => (
            <div key={club.id} className="bg-white rounded-2xl p-6 shadow-sm flex gap-4">
              <StoreMark store={club.bookstore} sizeClass="w-11 h-11 shrink-0" />
              <div>
                <h3 className="font-display text-lg text-forest leading-snug">{club.name}</h3>
                <p className="text-xs text-terracotta font-medium mt-1 mb-2">
                  {club.freq} · at {club.bookstore.name}
                </p>
                <p className="text-sm text-forest/60 leading-relaxed">{club.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STORIES */}
      <section className="mb-16">
        <h2 className="font-display text-2xl text-forest mb-6">Stories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {stories?.map((s) => (
            <Link
              key={s.id}
              to={`/bookstores/${s.bookstore.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm block"
            >
              <div className="h-40 overflow-hidden">
                <img src={s.img} className="w-full h-full object-cover" alt={s.title} />
              </div>
              <div className="p-6">
                <p className="text-[11px] text-terracotta font-semibold tracking-widest uppercase mb-2">
                  Story
                </p>
                <h3 className="font-display text-lg text-forest leading-snug mb-2">{s.title}</h3>
                <p className="text-sm text-forest/60 leading-relaxed">{s.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LITERARY WALKS */}
      <section>
        <h2 className="font-display text-2xl text-forest mb-6">Literary walks</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {walks?.map((w) => (
            <div key={w.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="h-40 overflow-hidden">
                <img src={w.img} className="w-full h-full object-cover" alt={w.title} />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg text-forest leading-snug mb-1">{w.title}</h3>
                <p className="text-xs text-forest/45 mb-3">
                  {w.duration} · {w.stops.join(' → ')}
                </p>
                <p className="text-sm text-forest/60 leading-relaxed">{w.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
