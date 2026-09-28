import { BOOKSTORES } from '../data';
import { BookstoreCard } from '../components/BookstoreCard';

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="font-display text-3xl text-forest mb-6">Featured bookstores</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {BOOKSTORES.slice(0, 3).map((store) => (
          <BookstoreCard
            key={store.id}
            store={{ ...store, hours: store.hours.map(([day, time]) => [day, time] as [string, string]) }}
          />
        ))}
      </div>
    </div>
  );
}