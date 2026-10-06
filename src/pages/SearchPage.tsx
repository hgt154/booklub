import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchListings } from '../lib/api';
import { useAsync } from '../lib/useAsync';
import { BookCover } from '../components/BookCover';
import { StoreMark } from '../components/StoreMark';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const [input, setInput] = useState(query);

  const { data: results, loading } = useAsync(() => searchListings(query), [query]);

  const [language, setLanguage] = useState<string>('any');
  const [condition, setCondition] = useState<string>('any');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setParams(input.trim() ? { q: input.trim() } : {});
  }

  const languages = [...new Set(results?.map((r) => r.language) ?? [])];
  const conditions = [...new Set(results?.map((r) => r.condition) ?? [])];

  const filtered = (results ?? []).filter(
    (r) =>
      (language === 'any' || r.language === language) &&
      (condition === 'any' || r.condition === condition)
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl text-forest mb-6">Search</h1>

      <form onSubmit={onSubmit} className="flex gap-2 mb-10 max-w-xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Title or author…"
          className="flex-1 bg-white border border-forest/15 rounded-full px-5 py-2.5 text-sm outline-none focus:border-terracotta/50"
        />
        <button
          type="submit"
          className="bg-forest text-cream text-sm font-medium px-6 py-2.5 rounded-full"
        >
          Search
        </button>
      </form>

      {!query && <p className="text-forest/50">Search for a title or author to get started.</p>}

      {query && (
        <div className="grid md:grid-cols-[220px_1fr] gap-10">
          <aside className="space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-forest/40 mb-2">
                Language
              </p>
              <div className="space-y-1">
                <FilterOption label="Any" active={language === 'any'} onClick={() => setLanguage('any')} />
                {languages.map((l) => (
                  <FilterOption key={l} label={l} active={language === l} onClick={() => setLanguage(l)} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-forest/40 mb-2">
                Condition
              </p>
              <div className="space-y-1">
                <FilterOption label="Any" active={condition === 'any'} onClick={() => setCondition('any')} />
                {conditions.map((c) => (
                  <FilterOption key={c} label={c} active={condition === c} onClick={() => setCondition(c)} />
                ))}
              </div>
            </div>
          </aside>

          <div>
            {loading && <p className="text-forest/60">Searching…</p>}

            {!loading && (
              <p className="text-sm text-forest/50 mb-6">
                {filtered.length} {filtered.length === 1 ? 'copy' : 'copies'} found for “{query}”
              </p>
            )}

            <div className="space-y-4">
              {filtered.map((l) => (
                <div key={l.id} className="bg-white rounded-2xl p-5 shadow-sm flex gap-5 items-stretch">
                  <Link to={`/books/${l.book.id}`} className="w-20 shrink-0">
                    <BookCover book={{ ...l.book, genre: '', desc: '' }} />
                  </Link>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          to={`/books/${l.book.id}`}
                          className="font-display text-lg text-forest hover:text-terracotta"
                        >
                          {l.book.title}
                        </Link>
                        <p className="text-sm text-forest/55">{l.book.author}</p>
                      </div>
                      <span className="text-lg font-display text-forest whitespace-nowrap">
                        €{l.price}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3 mb-4">
                      <Tag>{l.language}</Tag>
                      <Tag>{l.condition}</Tag>
                    </div>
                    <Link
                      to={`/bookstores/${l.bookstore.slug}`}
                      className="mt-auto flex items-center gap-2 border-t border-forest/8 pt-4 group"
                    >
                      <StoreMark store={l.bookstore} sizeClass="w-8 h-8 text-xs" />
                      <span>
                        <span className="block text-sm font-medium text-forest group-hover:text-terracotta">
                          {l.bookstore.name}
                        </span>
                        <span className="block text-[11px] text-forest/45">{l.bookstore.neighborhood}</span>
                      </span>
                    </Link>
                  </div>
                </div>
              ))}

              {!loading && filtered.length === 0 && (
                <p className="text-sm text-forest/50">No copies match these filters.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterOption({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`block text-sm text-left w-full px-3 py-1.5 rounded-full ${
        active ? 'bg-forest text-cream' : 'text-forest/70 hover:bg-forest/5'
      }`}
    >
      {label}
    </button>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] px-2.5 py-1 rounded-full bg-forest/8 text-forest/60">
      {children}
    </span>
  );
}
