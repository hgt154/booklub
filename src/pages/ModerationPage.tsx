import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchApplicant,
  fetchModerationQueue,
  setBookstoreStatus,
  type ModerationBookstore,
} from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { useAuth } from '../lib/useAuth';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ModerationPage() {
  const { profile, loading, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return <p className="max-w-7xl mx-auto px-6 py-10 text-forest/60">Loading…</p>;
  }
  // Не підказуємо, що сторінка існує: для всіх, крім super_admin, це просто "Not found"
  if (profile?.role !== 'super_admin') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl text-forest mb-2">Not found</h1>
        <p className="text-sm text-ink/60 mb-6">This page does not exist.</p>
        <Link to="/" className="text-sm text-forest font-medium underline">
          Back to home
        </Link>
      </div>
    );
  }

  return <ModerationContent />;
}

function ModerationContent() {
  const [reloadKey, setReloadKey] = useState(0);
  const { data, loading, error } = useAsync(() => fetchModerationQueue(10), [reloadKey]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-2">
        Super admin
      </p>
      <h1 className="font-display text-4xl text-forest mb-8">Moderation</h1>

      {error && <p className="text-sm text-terracotta">Could not load bookstores.</p>}
      {loading && !data && <p className="text-sm text-forest/60">Loading…</p>}

      {data && (
        <>
          <section className="mb-12">
            <h2 className="font-display text-2xl text-forest mb-4">
              Pending applications{' '}
              <span className="text-ink/40 text-lg">({data.pending.length})</span>
            </h2>
            {data.pending.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-soft p-6 text-sm text-ink/60">
                No applications waiting for review.
              </div>
            ) : (
              <div className="space-y-4">
                {data.pending.map((s) => (
                  <PendingCard key={s.id} store={s} onDone={() => setReloadKey((k) => k + 1)} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-2xl text-forest mb-4">Recently approved</h2>
            {data.approved.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-soft p-6 text-sm text-ink/60">
                No approved bookstores yet.
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-soft divide-y divide-ink/5">
                {data.approved.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-6 py-4"
                  >
                    <div className="min-w-0">
                      <Link
                        to={`/bookstores/${s.slug}`}
                        className="text-sm font-medium text-forest hover:text-terracotta"
                      >
                        {s.name}
                      </Link>
                      <p className="text-xs text-ink/45">
                        {[s.neighborhood, s.address].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <span className="text-xs text-ink/45 shrink-0">
                      Applied {formatDate(s.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function PendingCard({ store, onDone }: { store: ModerationBookstore; onDone: () => void }) {
  const { data: applicant, error: applicantError } = useAsync(
    () => fetchApplicant(store.id),
    [store.id]
  );
  const [confirmReject, setConfirmReject] = useState(false);
  const [busy, setBusy] = useState<'approve' | 'reject' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(status: 'approved' | 'rejected') {
    setBusy(status === 'approved' ? 'approve' : 'reject');
    setError(null);
    try {
      await setBookstoreStatus(store.id, status);
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update this bookstore.');
      setBusy(null);
    }
  }

  return (
    <article className="bg-white rounded-2xl shadow-soft p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl text-forest">{store.name}</h3>
          <p className="text-sm text-ink/60">
            {[store.neighborhood, store.address].filter(Boolean).join(' · ') || 'No address given'}
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-terracotta/10 text-terracotta shrink-0">
          Pending
        </span>
      </div>

      {store.story && (
        <p className="text-sm text-ink/70 leading-relaxed whitespace-pre-line wrap-break-word mb-4">
          {store.story}
        </p>
      )}

      <dl className="grid sm:grid-cols-3 gap-3 text-sm mb-5">
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/40">Applicant</dt>
          <dd className="text-forest">{applicant?.name || '—'}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-xs uppercase tracking-wide text-ink/40">Email</dt>
          <dd className="text-forest break-all">
            {applicant?.email || (applicantError ? 'Unavailable' : '—')}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-ink/40">Applied</dt>
          <dd className="text-forest">{formatDate(store.createdAt)}</dd>
        </div>
      </dl>

      {error && <p className="text-sm text-terracotta mb-3">{error}</p>}

      {confirmReject ? (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-ink/70">Reject this application?</span>
          <button
            onClick={() => decide('rejected')}
            disabled={busy !== null}
            className="text-sm font-medium px-5 py-2 rounded-full bg-terracotta text-cream disabled:opacity-60"
          >
            {busy === 'reject' ? '…' : 'Yes, reject'}
          </button>
          <button
            onClick={() => setConfirmReject(false)}
            disabled={busy !== null}
            className="text-sm font-medium text-ink/50 hover:text-forest px-2"
          >
            Keep
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => decide('approved')}
            disabled={busy !== null}
            className="btn-primary bg-forest text-cream text-sm font-medium px-6 py-2.5 rounded-full disabled:opacity-60"
          >
            {busy === 'approve' ? '…' : 'Approve'}
          </button>
          <button
            onClick={() => setConfirmReject(true)}
            disabled={busy !== null}
            className="btn-outline border border-forest text-forest text-sm font-medium px-6 py-2.5 rounded-full disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      )}
    </article>
  );
}
