import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { BooksTab } from '../components/admin/BooksTab';
import { ReservationsTab } from '../components/admin/ReservationsTab';
import { MessagesTab } from '../components/admin/MessagesTab';
import { RecentSearchesTab } from '../components/admin/RecentSearchesTab';
import { RecentlyAddedTab } from '../components/admin/RecentlyAddedTab';
import { fetchMyBookstores, type BookstoreStatus, type MyBookstore } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { useAuth } from '../lib/useAuth';

const STATUS_LABEL: Record<BookstoreStatus, string> = {
  pending: 'Under review',
  approved: 'Approved',
  rejected: 'Not approved',
};

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="max-w-7xl mx-auto px-6 py-10 text-forest/60">Loading…</p>;
  }
  if (!user) return <Navigate to="/auth?next=/admin" replace />;

  return <AdminContent userId={user.id} />;
}

function AdminContent({ userId }: { userId: string }) {
  const { data: stores, loading, error } = useAsync(() => fetchMyBookstores(userId), [userId]);

  if (loading && !stores) {
    return <p className="max-w-7xl mx-auto px-6 py-10 text-forest/60">Loading…</p>;
  }
  if (error || !stores) {
    return (
      <p className="max-w-7xl mx-auto px-6 py-10 text-terracotta">
        Could not load your bookstore.
      </p>
    );
  }

  // Дашборд відкривається, коли хоча б одну книгарню користувача схвалено
  const approved = stores.find((s) => s.status === 'approved');
  if (approved) return <OwnerDashboard store={approved} />;

  const pending = stores.find((s) => s.status === 'pending');
  const latest = stores[0];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-forest mb-6">Bookstore dashboard</h1>
      <div className="bg-white rounded-2xl shadow-soft p-8">
        {pending ? (
          <>
            <h2 className="font-display text-2xl text-forest mb-2">
              Your application is under review
            </h2>
            <p className="text-sm text-ink/60">
              We are reviewing <span className="text-forest font-medium">{pending.name}</span>. The
              dashboard opens here as soon as it is approved.
            </p>
          </>
        ) : latest?.status === 'rejected' ? (
          <>
            <h2 className="font-display text-2xl text-forest mb-2">
              Your application was not approved
            </h2>
            <p className="text-sm text-ink/60 mb-6">
              We could not approve <span className="text-forest font-medium">{latest.name}</span>.
              You can send a new application with updated details.
            </p>
            <ApplyLink label="Apply again" />
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl text-forest mb-2">
              This dashboard is for bookstore owners
            </h2>
            <p className="text-sm text-ink/60 mb-6">
              Run an independent bookstore in Vienna? Apply to list it on Estante. Once your
              application is approved, you can manage it here.
            </p>
            <ApplyLink label="List your bookstore" />
          </>
        )}
      </div>
    </div>
  );
}

function ApplyLink({ label }: { label: string }) {
  return (
    <Link
      to="/apply"
      className="btn-primary inline-block bg-forest text-cream text-sm font-medium px-6 py-3 rounded-full"
    >
      {label}
    </Link>
  );
}

const TABS = [
  { key: 'books', label: '📖 Books' },
  { key: 'reservations', label: '🗂️ Reservations' },
  { key: 'searches', label: '🔍 Recent searches' },
  { key: 'added', label: '🆕 Recently added' },
  { key: 'messages', label: '✉️ Messages' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function OwnerDashboard({ store }: { store: MyBookstore }) {
  // вкладка в URL (?tab=reservations), щоб переживала перезавантаження
  const [params, setParams] = useSearchParams();
  const tab: TabKey = TABS.find((t) => t.key === params.get('tab'))?.key ?? 'books';

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-[220px_1fr] gap-10">
      <aside className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-ink/40 font-semibold mb-4 px-3">
          {store.name} — Admin
        </p>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setParams({ tab: t.key }, { replace: true })}
            aria-current={tab === t.key ? 'page' : undefined}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white transition-colors ${
              tab === t.key ? 'bg-white shadow-soft text-forest' : 'text-ink/70'
            }`}
          >
            {t.label}
          </button>
        ))}
        <div className="pt-6 mt-6 border-t border-ink/10 px-3 space-y-2">
          <p className="text-xs text-ink/50">
            Status:{' '}
            <span className="text-forest font-medium">{STATUS_LABEL[store.status]}</span>
          </p>
          <Link to={`/bookstores/${store.slug}`} className="block text-xs text-ink/50 hover:text-forest">
            View public page →
          </Link>
          <Link to="/" className="block text-xs text-ink/50 hover:text-forest">
            ← Back to Estante
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        {tab === 'books' && <BooksTab bookstoreId={store.id} />}
        {tab === 'reservations' && <ReservationsTab bookstoreId={store.id} />}
        {tab === 'searches' && <RecentSearchesTab bookstoreId={store.id} />}
        {tab === 'added' && <RecentlyAddedTab bookstoreId={store.id} />}
        {tab === 'messages' && <MessagesTab bookstoreId={store.id} />}
      </div>
    </div>
  );
}
