import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  cancelReservation,
  fetchMyReservations,
  updateMyName,
  type ReservationStatus,
} from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { useAuth } from '../lib/useAuth';

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: 'Waiting for the bookstore',
  confirmed: 'Confirmed',
  ready: 'Ready for pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_STYLE: Record<ReservationStatus, string> = {
  pending: 'bg-cream-dark text-brown',
  confirmed: 'bg-forest/10 text-forest',
  ready: 'bg-terracotta/15 text-terracotta',
  completed: 'bg-cream-dark text-ink/50',
  cancelled: 'bg-cream-dark text-ink/40',
};

const CANCELLABLE: ReservationStatus[] = ['pending', 'confirmed'];

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <p className="max-w-3xl mx-auto px-6 py-10 text-forest/60">Loading…</p>;
  }
  if (!user) return <Navigate to="/auth?next=/profile" replace />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl text-forest mb-8">Your profile</h1>

      <section className="bg-white rounded-2xl shadow-soft p-6 mb-10">
        <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-1">
          Email
        </p>
        <p className="text-forest mb-6 break-all">{user.email}</p>
        {/* key: форма перемонтовується, коли профіль довантажився */}
        <NameForm key={profile?.name ?? ''} userId={user.id} initialName={profile?.name ?? ''} />
      </section>

      <MyReservations userId={user.id} />
    </div>
  );
}

function NameForm({ userId, initialName }: { userId: string; initialName: string }) {
  const { refreshProfile } = useAuth();
  const [name, setName] = useState(initialName);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      await updateMyName(userId, name);
      await refreshProfile();
      setNotice({ kind: 'ok', text: 'Saved.' });
    } catch (err) {
      setNotice({ kind: 'error', text: err instanceof Error ? err.message : 'Could not save.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="profile-name"
        className="block text-terracotta text-xs font-semibold tracking-widest uppercase mb-2"
      >
        Name
      </label>
      <div className="flex flex-wrap gap-3">
        <input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="flex-1 min-w-0 bg-white border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-terracotta/60"
        />
        <button
          type="submit"
          disabled={busy || name.trim() === initialName.trim()}
          className="btn-primary bg-forest text-cream text-sm font-medium px-6 py-3 rounded-full disabled:opacity-60"
        >
          {busy ? '…' : 'Save'}
        </button>
      </div>
      {notice && (
        <p className={`text-sm mt-3 ${notice.kind === 'ok' ? 'text-forest' : 'text-terracotta'}`}>
          {notice.text}
        </p>
      )}
    </form>
  );
}

function MyReservations({ userId }: { userId: string }) {
  const [reloadKey, setReloadKey] = useState(0);
  const { data: reservations, loading, error } = useAsync(
    () => fetchMyReservations(userId),
    [userId, reloadKey]
  );
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function cancel(id: string) {
    setCancellingId(id);
    setActionError(null);
    try {
      await cancelReservation(id);
      setReloadKey((k) => k + 1);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Could not cancel this reservation.');
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <section>
      <h2 className="font-display text-2xl text-forest mb-4">My reservations</h2>

      {actionError && <p className="text-sm text-terracotta mb-4">{actionError}</p>}
      {error && <p className="text-sm text-terracotta">Could not load your reservations.</p>}
      {loading && !reservations && <p className="text-sm text-forest/60">Loading…</p>}

      {reservations?.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-6 text-sm text-forest/60">
          You have no reservations yet.{' '}
          <Link to="/bookstores" className="text-forest font-medium underline">
            Browse bookstores
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {reservations?.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl shadow-soft p-5 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <Link
                to={`/books/${r.book.slug}`}
                className="block font-display text-lg text-forest hover:text-terracotta transition-colors"
              >
                {r.book.title}
              </Link>
              <p className="text-sm text-forest/60">{r.book.author}</p>
              <p className="text-xs text-forest/45 mt-1">
                <Link to={`/bookstores/${r.bookstore.slug}`} className="hover:text-terracotta">
                  {r.bookstore.name}
                </Link>{' '}
                · {r.bookstore.neighborhood} · Reserved{' '}
                {new Date(r.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <p className="font-display text-lg text-forest">€{r.price}</p>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLE[r.status]}`}
              >
                {STATUS_LABEL[r.status]}
              </span>
              {CANCELLABLE.includes(r.status) && (
                <button
                  onClick={() => cancel(r.id)}
                  disabled={cancellingId !== null}
                  className="btn-outline text-sm font-medium px-4 py-2 rounded-full disabled:opacity-60"
                >
                  {cancellingId === r.id ? '…' : 'Cancel'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
