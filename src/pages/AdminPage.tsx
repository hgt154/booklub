import { Link, Navigate } from 'react-router-dom';
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

function OwnerDashboard({ store }: { store: MyBookstore }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <p className="text-terracotta text-xs font-semibold tracking-widest uppercase mb-2">
        Bookstore dashboard
      </p>
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <h1 className="font-display text-4xl text-forest">{store.name}</h1>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-forest/10 text-forest">
          {STATUS_LABEL[store.status]}
        </span>
        <Link
          to={`/bookstores/${store.slug}`}
          className="text-sm text-forest/60 hover:text-terracotta underline"
        >
          View public page
        </Link>
      </div>

      {/* TODO: вкладки дашборду (листинги, резервації, події, профіль книгарні) */}
      <div className="bg-white rounded-2xl shadow-soft p-8 text-sm text-forest/60">
        Dashboard tabs are coming soon.
      </div>
    </div>
  );
}
