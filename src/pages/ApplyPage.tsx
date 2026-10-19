import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { applyForBookstore, fetchMyBookstores, type BookstoreApplication } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { useAuth } from '../lib/useAuth';

export default function ApplyPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="max-w-2xl mx-auto px-6 py-10 text-forest/60">Loading…</p>;
  }
  if (!user) return <Navigate to="/auth?next=/apply" replace />;

  return <ApplyContent userId={user.id} />;
}

function ApplyContent({ userId }: { userId: string }) {
  const { data: stores, loading } = useAsync(() => fetchMyBookstores(userId), [userId]);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const pending = stores?.find((s) => s.status === 'pending');
  const reviewName = submittedName ?? pending?.name;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-2">
        For booksellers
      </p>
      <h1 className="font-display text-4xl text-forest mb-2">List your bookstore</h1>
      <p className="text-ink/60 mb-8 text-sm">
        Tell us about your shop. Our team reviews every application, and once it is approved you
        get access to your bookstore dashboard.
      </p>

      {loading && !stores ? (
        <p className="text-sm text-forest/60">Loading…</p>
      ) : reviewName ? (
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <h2 className="font-display text-2xl text-forest mb-2">Your application is under review</h2>
          <p className="text-sm text-ink/60">
            Thanks for applying with <span className="text-forest font-medium">{reviewName}</span>.
            We will review it soon. Your dashboard opens once it is approved.
          </p>
          <Link to="/" className="inline-block mt-6 text-sm text-forest font-medium underline">
            Back to home
          </Link>
        </div>
      ) : (
        <ApplyForm onDone={setSubmittedName} />
      )}
    </div>
  );
}

const EMPTY: BookstoreApplication = { name: '', neighborhood: '', address: '', description: '' };

function ApplyForm({ onDone }: { onDone: (name: string) => void }) {
  const [form, setForm] = useState<BookstoreApplication>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof BookstoreApplication>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await applyForBookstore(form);
      onDone(form.name.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your application.');
      setBusy(false);
    }
  }

  const input =
    'w-full bg-white border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-terracotta/60';
  const label = 'block text-terracotta text-xs font-semibold tracking-widest uppercase mb-2';

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-soft p-8 space-y-5">
      <div>
        <label htmlFor="apply-name" className={label}>Bookstore name</label>
        <input
          id="apply-name"
          className={input}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          maxLength={120}
          required
        />
      </div>
      <div>
        <label htmlFor="apply-neighborhood" className={label}>Neighborhood</label>
        <input
          id="apply-neighborhood"
          className={input}
          placeholder="e.g. Neubau"
          value={form.neighborhood}
          onChange={(e) => set('neighborhood', e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="apply-address" className={label}>Address</label>
        <input
          id="apply-address"
          className={input}
          placeholder="Street, number, postcode Wien"
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="apply-description" className={label}>About your bookstore</label>
        <textarea
          id="apply-description"
          className={`${input} min-h-32`}
          placeholder="What makes your shop special? Specialties, languages, atmosphere…"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          required
        />
      </div>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="btn-primary w-full bg-forest text-cream font-medium py-3 rounded-full disabled:opacity-60"
      >
        {busy ? '…' : 'Send application'}
      </button>
    </form>
  );
}
