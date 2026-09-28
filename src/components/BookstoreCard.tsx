import { Link } from 'react-router-dom';
import type { Bookstore } from '../types';
import { StoreMark } from './StoreMark';
import { TagList } from './TagList';

export function BookstoreCard({ store }: { store: Bookstore }) {
  return (
    <div className="card-lift bg-white rounded-3xl overflow-hidden shadow-soft">
      <div className="img-zoom h-48 relative">
        <img src={store.heroImg} className="w-full h-full object-cover" alt={store.name} />
        <span className="badge-community absolute top-3 right-3 text-cream text-[10px] font-medium px-3 py-1 rounded-full">
          {store.badge}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <StoreMark store={store} />
          <div>
            <h3 className="font-display text-lg text-forest leading-tight">{store.name}</h3>
            <p className="text-xs text-forest/50">{store.neighborhood} · {store.atmosphere}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          <TagList items={store.specialties} limit={3} />
        </div>
        <div className="flex items-center justify-between text-xs text-forest/50 mb-5">
          <span>{store.languages.join(' · ')}</span>
          <span>{store.stats.books.toLocaleString()} books</span>
        </div>
        <Link
          to={`/bookstores/${store.id}`}
          className="block text-center w-full border border-forest text-forest text-sm font-medium py-2.5 rounded-full hover:bg-forest hover:text-cream transition-colors"
        >
          Explore Bookstore
        </Link>
      </div>
    </div>
  );
}