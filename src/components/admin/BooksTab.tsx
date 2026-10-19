import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  addListing,
  deleteListing,
  fetchListingsByBookstore,
  updateListing,
  type ListingStatus,
  type ListingWithBook,
  type NewListing,
} from '../../lib/api';
import { useAsync } from '../../lib/useAsync';

const STATUS_LABEL: Record<ListingStatus, string> = {
  available: 'In stock',
  reserved: 'Reserved',
  sold: 'Sold',
};

const STATUS_STYLE: Record<ListingStatus, string> = {
  available: 'bg-forest/10 text-forest',
  reserved: 'bg-terracotta/10 text-terracotta',
  sold: 'bg-ink/5 text-ink/50',
};

const STATUSES: ListingStatus[] = ['available', 'reserved', 'sold'];
const CONDITIONS = ['Like New', 'Very Good', 'Good', 'Well-Loved'];

const input =
  'w-full bg-white border border-ink/15 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-terracotta/60';
const label = 'block text-terracotta text-xs font-semibold tracking-widest uppercase mb-2';

export function BooksTab({ bookstoreId }: { bookstoreId: string }) {
  const [reloadKey, setReloadKey] = useState(0);
  const reload = () => setReloadKey((k) => k + 1);
  const { data: listings, loading, error } = useAsync(
    () => fetchListingsByBookstore(bookstoreId),
    [bookstoreId, reloadKey]
  );
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="font-display text-2xl text-forest">Books</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="btn-outline border border-forest text-forest text-sm font-medium px-4 py-2 rounded-full"
        >
          {showForm ? 'Close' : '+ Add a book'}
        </button>
      </div>

      {showForm && (
        <AddListingForm
          bookstoreId={bookstoreId}
          onAdded={() => {
            reload();
            setShowForm(false);
          }}
        />
      )}

      {error && <p className="text-sm text-terracotta">Could not load your books.</p>}
      {loading && !listings && <p className="text-sm text-forest/60">Loading…</p>}
      {listings?.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-6 text-sm text-ink/60">
          No books listed yet. Add your first one above.
        </div>
      )}

      {listings && listings.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft overflow-x-auto">
          <table className="w-full text-sm min-w-180">
            <thead>
              <tr className="text-left text-ink/40 text-xs uppercase tracking-wide border-b border-ink/10">
                <th className="py-3 px-5">Title</th>
                <th className="py-3 px-5">Author</th>
                <th className="py-3 px-5">Condition</th>
                <th className="py-3 px-5">Language</th>
                <th className="py-3 px-5">Price</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5" />
              </tr>
            </thead>
            <tbody>
              {listings.map((l) => (
                <ListingTableRow key={l.id} listing={l} onChanged={reload} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ListingTableRow({ listing: l, onChanged }: { listing: ListingWithBook; onChanged: () => void }) {
  const [mode, setMode] = useState<'view' | 'edit' | 'confirm-delete'>('view');
  const [price, setPrice] = useState(String(l.price));
  const [status, setStatus] = useState<ListingStatus>(l.status);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await action();
      setMode('view');
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  function save() {
    const value = Number(price);
    if (!Number.isFinite(value) || value < 0) {
      setError('Enter a valid price.');
      return;
    }
    run(() => updateListing(l.id, { price: value, status }));
  }

  return (
    <tr className="border-b border-ink/5 last:border-0 hover:bg-cream/60 align-middle">
      <td className="py-3 px-5 font-medium text-forest">
        <Link to={`/books/${l.book.slug}`} className="hover:text-terracotta">
          {l.book.title}
        </Link>
        {error && <p className="text-xs text-terracotta font-normal mt-1">{error}</p>}
      </td>
      <td className="py-3 px-5 text-ink/60">{l.book.author}</td>
      <td className="py-3 px-5 text-ink/60">{l.condition}</td>
      <td className="py-3 px-5 text-ink/60">{l.language}</td>
      <td className="py-3 px-5 text-ink/60">
        {mode === 'edit' ? (
          <input
            type="number"
            min={0}
            step="0.5"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            aria-label="Price in euro"
            className="w-20 bg-white border border-ink/15 rounded-lg px-2 py-1 text-sm outline-none focus:border-terracotta/60"
          />
        ) : (
          `€${l.price}`
        )}
      </td>
      <td className="py-3 px-5">
        {mode === 'edit' ? (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ListingStatus)}
            aria-label="Status"
            className="bg-white border border-ink/15 rounded-lg px-2 py-1 text-sm outline-none focus:border-terracotta/60"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        ) : (
          <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_STYLE[l.status]}`}>
            {STATUS_LABEL[l.status]}
          </span>
        )}
      </td>
      <td className="py-3 px-5 text-right whitespace-nowrap">
        {mode === 'view' && (
          <>
            <button
              onClick={() => setMode('edit')}
              className="text-xs font-medium text-forest hover:text-terracotta mr-4"
            >
              Edit
            </button>
            <button
              onClick={() => setMode('confirm-delete')}
              className="text-xs font-medium text-ink/50 hover:text-terracotta"
            >
              Delete
            </button>
          </>
        )}
        {mode === 'edit' && (
          <>
            <button
              onClick={save}
              disabled={busy}
              className="text-xs font-medium text-forest hover:text-terracotta mr-4 disabled:opacity-60"
            >
              {busy ? '…' : 'Save'}
            </button>
            <button
              onClick={() => {
                setPrice(String(l.price));
                setStatus(l.status);
                setError(null);
                setMode('view');
              }}
              className="text-xs font-medium text-ink/50 hover:text-forest"
            >
              Cancel
            </button>
          </>
        )}
        {mode === 'confirm-delete' && (
          <>
            <span className="text-xs text-ink/60 mr-3">Delete with its reservations?</span>
            <button
              onClick={() => run(() => deleteListing(l.id))}
              disabled={busy}
              className="text-xs font-medium text-terracotta mr-4 disabled:opacity-60"
            >
              {busy ? '…' : 'Delete'}
            </button>
            <button
              onClick={() => setMode('view')}
              className="text-xs font-medium text-ink/50 hover:text-forest"
            >
              Keep
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

const EMPTY = { title: '', author: '', genre: '', price: '', language: '', condition: 'Good' };

function AddListingForm({ bookstoreId, onAdded }: { bookstoreId: string; onAdded: () => void }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: keyof typeof EMPTY, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      setError('Enter a valid price.');
      return;
    }
    const listing: NewListing = { ...form, price };
    setBusy(true);
    setError(null);
    try {
      await addListing(bookstoreId, listing);
      setForm(EMPTY);
      onAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add this book.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-soft p-6 mb-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="add-title" className={label}>Title</label>
          <input id="add-title" className={input} value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </div>
        <div>
          <label htmlFor="add-author" className={label}>Author</label>
          <input id="add-author" className={input} value={form.author} onChange={(e) => set('author', e.target.value)} required />
        </div>
        <div>
          <label htmlFor="add-genre" className={label}>Genre</label>
          <input id="add-genre" className={input} placeholder="e.g. Brazilian Literature" value={form.genre} onChange={(e) => set('genre', e.target.value)} />
        </div>
        <div>
          <label htmlFor="add-price" className={label}>Price (€)</label>
          <input id="add-price" type="number" min={0} step="0.5" className={input} value={form.price} onChange={(e) => set('price', e.target.value)} required />
        </div>
        <div>
          <label htmlFor="add-language" className={label}>Language</label>
          <input id="add-language" className={input} placeholder="e.g. Portuguese" value={form.language} onChange={(e) => set('language', e.target.value)} required />
        </div>
        <div>
          <label htmlFor="add-condition" className={label}>Condition</label>
          <select id="add-condition" className={input} value={form.condition} onChange={(e) => set('condition', e.target.value)}>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-terracotta mt-4">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="btn-primary mt-5 bg-forest text-cream text-sm font-medium px-6 py-3 rounded-full disabled:opacity-60"
      >
        {busy ? '…' : 'Add to catalogue'}
      </button>
    </form>
  );
}
