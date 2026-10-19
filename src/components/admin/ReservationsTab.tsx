import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchBookstoreReservations,
  updateReservationStatus,
  type ReservationStatus,
} from '../../lib/api';
import { useAsync } from '../../lib/useAsync';

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  ready: 'Ready for pickup',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const STATUS_STYLE: Record<ReservationStatus, string> = {
  pending: 'bg-terracotta/10 text-terracotta',
  confirmed: 'bg-forest/10 text-forest',
  ready: 'bg-forest/10 text-forest',
  completed: 'bg-ink/5 text-ink/50',
  cancelled: 'bg-ink/5 text-ink/40',
};

// Наступний крок для власника: pending -> confirmed -> ready -> completed
const NEXT: Partial<Record<ReservationStatus, { status: ReservationStatus; label: string }>> = {
  pending: { status: 'confirmed', label: 'Confirm' },
  confirmed: { status: 'ready', label: 'Mark ready' },
  ready: { status: 'completed', label: 'Complete' },
};

export function ReservationsTab({ bookstoreId }: { bookstoreId: string }) {
  const [reloadKey, setReloadKey] = useState(0);
  const { data: reservations, loading, error } = useAsync(
    () => fetchBookstoreReservations(bookstoreId),
    [bookstoreId, reloadKey]
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function advance(id: string, status: ReservationStatus) {
    setBusyId(id);
    setActionError(null);
    try {
      await updateReservationStatus(id, status);
      setReloadKey((k) => k + 1);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Could not update this reservation.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl text-forest mb-6">Reservations</h2>

      {actionError && <p className="text-sm text-terracotta mb-4">{actionError}</p>}
      {error && <p className="text-sm text-terracotta">Could not load reservations.</p>}
      {loading && !reservations && <p className="text-sm text-forest/60">Loading…</p>}
      {reservations?.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-6 text-sm text-ink/60">
          No reservations yet.
        </div>
      )}

      {reservations && reservations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft overflow-x-auto">
          <table className="w-full text-sm min-w-160">
            <thead>
              <tr className="text-left text-ink/40 text-xs uppercase tracking-wide border-b border-ink/10">
                <th className="py-3 px-5">Reader</th>
                <th className="py-3 px-5">Book</th>
                <th className="py-3 px-5">Requested</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5" />
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => {
                const next = NEXT[r.status];
                return (
                  <tr key={r.id} className="border-b border-ink/5 last:border-0 hover:bg-cream/60">
                    <td className="py-3 px-5 font-medium text-forest">
                      {r.readerName || <span className="text-ink/40 font-normal">Reader</span>}
                    </td>
                    <td className="py-3 px-5 text-ink/60">
                      <Link to={`/books/${r.book.slug}`} className="hover:text-terracotta">
                        {r.book.title}
                      </Link>
                      <span className="text-ink/40"> · €{r.price}</span>
                    </td>
                    <td className="py-3 px-5 text-ink/60">
                      {new Date(r.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-5">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_STYLE[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      {next && (
                        <button
                          onClick={() => advance(r.id, next.status)}
                          disabled={busyId !== null}
                          className="btn-primary bg-forest text-cream text-xs font-medium px-4 py-2 rounded-full disabled:opacity-60 whitespace-nowrap"
                        >
                          {busyId === r.id ? '…' : next.label}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
