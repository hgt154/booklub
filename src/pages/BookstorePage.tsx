import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  fetchBookstore,
  fetchBookstoreCounts,
  fetchIsFollowing,
  fetchListingsByBookstore,
  followBookstore,
  sendMessage,
  unfollowBookstore,
} from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { useAuth } from '../lib/useAuth';
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

  // після Follow/Unfollow перечитуємо лічильники
  const [countsKey, setCountsKey] = useState(0);
  const { data: counts } = useAsync(
    () => (store?.dbId ? fetchBookstoreCounts(store.dbId) : Promise.resolve(null)),
    [store?.dbId, countsKey]
  );
  const { user } = useAuth();

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
          <StatTile value={counts?.followers ?? store.stats.followers} label="Followers" />
          <StatTile value={store.stats.eventsHosted} label="Events hosted" />
          <StatTile value={counts?.reserved ?? store.stats.reserved} label="Reserved" />
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
                  <Link key={l.id} to={`/books/${l.book.slug}`} className="group">
                    <BookCover book={l.book} />
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
            {store.dbId && (
              <StoreActions
                key={`${store.dbId}-${user?.id ?? 'guest'}`}
                bookstoreId={store.dbId}
                storeName={store.name}
                ownerName={store.owner}
                onFollowChange={() => setCountsKey((k) => k + 1)}
              />
            )}
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

function StoreActions({
  bookstoreId, storeName, ownerName, onFollowChange,
}: { bookstoreId: string; storeName: string; ownerName: string; onFollowChange: () => void }) {
  const { user } = useAuth();
  const location = useLocation();
  const loginHref = `/auth?next=${encodeURIComponent(location.pathname + location.search)}`;

  const { data: followingFromDb } = useAsync(
    () => (user ? fetchIsFollowing(user.id, bookstoreId) : Promise.resolve(false)),
    [user?.id, bookstoreId]
  );
  // локальне значення після кліку, щоб кнопка не блимала під час перезапиту
  const [followingLocal, setFollowingLocal] = useState<boolean | null>(null);
  const following = followingLocal ?? followingFromDb ?? false;
  const [followBusy, setFollowBusy] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);

  const [contactOpen, setContactOpen] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  async function toggleFollow() {
    if (!user) return;
    setFollowBusy(true);
    setFollowError(null);
    try {
      if (following) await unfollowBookstore(user.id, bookstoreId);
      else await followBookstore(user.id, bookstoreId);
      setFollowingLocal(!following);
      onFollowChange();
    } catch (e) {
      setFollowError(e instanceof Error ? e.message : 'Could not update.');
    } finally {
      setFollowBusy(false);
    }
  }

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setSending(true);
    setSendError(null);
    try {
      await sendMessage(bookstoreId, user.id, text);
      setText('');
      setSent(true);
      setContactOpen(false);
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Could not send your message.');
    } finally {
      setSending(false);
    }
  }

  const outline =
    'btn-outline block w-full text-center border border-forest text-forest font-medium py-3 rounded-full';

  if (!user) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-soft space-y-3">
        <Link to={loginHref} className={outline}>
          Log in to contact
        </Link>
        <Link
          to={loginHref}
          className="block w-full text-center font-medium py-3 rounded-full border border-ink/15 text-ink/70 hover:border-forest transition-colors"
        >
          Log in to follow
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft space-y-3">
      {contactOpen ? (
        <form onSubmit={onSend} className="space-y-3">
          <p className="text-terracotta text-xs font-semibold tracking-widest uppercase">Contact</p>
          <p className="text-sm text-ink/60">
            Message {storeName}. {ownerName ? `${ownerName} usually replies within a day.` : ''}
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Your message"
            aria-label="Your message"
            rows={4}
            maxLength={2000}
            required
            autoFocus
            className="w-full bg-white border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-terracotta/60"
          />
          {sendError && <p className="text-sm text-terracotta">{sendError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={sending || !text.trim()}
              className="btn-primary flex-1 bg-forest text-cream text-sm font-medium py-2.5 rounded-full disabled:opacity-60"
            >
              {sending ? '…' : 'Send'}
            </button>
            <button
              type="button"
              onClick={() => setContactOpen(false)}
              className="text-sm font-medium text-ink/50 hover:text-forest px-4"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {sent && (
            <p role="status" className="text-sm text-forest">
              Message sent to {storeName}.
            </p>
          )}
          <button
            onClick={() => {
              setSent(false);
              setContactOpen(true);
            }}
            className={outline}
          >
            Contact Bookstore
          </button>
        </>
      )}

      <button
        onClick={toggleFollow}
        disabled={followBusy}
        aria-pressed={following}
        className={`w-full font-medium py-3 rounded-full border transition-colors disabled:opacity-60 ${
          following
            ? 'bg-terracotta/10 border-terracotta text-terracotta'
            : 'border-ink/15 text-ink/70 hover:border-forest'
        }`}
      >
        {following ? 'Following ✓' : 'Follow Bookstore'}
      </button>
      {followError && <p className="text-sm text-terracotta">{followError}</p>}
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
