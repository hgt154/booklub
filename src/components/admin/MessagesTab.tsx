import { fetchBookstoreMessages } from '../../lib/api';
import { useAsync } from '../../lib/useAsync';

export function MessagesTab({ bookstoreId }: { bookstoreId: string }) {
  const { data: messages, loading, error } = useAsync(
    () => fetchBookstoreMessages(bookstoreId),
    [bookstoreId]
  );

  return (
    <div>
      <h2 className="font-display text-2xl text-forest mb-6">Messages</h2>

      {error && <p className="text-sm text-terracotta">Could not load messages.</p>}
      {loading && !messages && <p className="text-sm text-forest/60">Loading…</p>}
      {messages?.length === 0 && (
        <div className="bg-white rounded-2xl shadow-soft p-6 text-sm text-ink/60">
          No messages yet.
        </div>
      )}

      {messages && messages.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft divide-y divide-ink/5">
          {messages.map((m) => (
            <div key={m.id} className="px-6 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <span className="text-sm font-medium text-forest">
                  {m.readerName || <span className="text-ink/40 font-normal">Reader</span>}
                </span>
                <span className="text-xs text-ink/45">
                  {new Date(m.createdAt).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-sm text-ink/70 whitespace-pre-line wrap-break-word">{m.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
