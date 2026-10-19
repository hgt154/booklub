import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { fetchSuggestions, logSearch, type Suggestions } from '../lib/api';
import { useAuth } from '../lib/useAuth';

export function Navbar() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Suggestions | null>(null);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isSuperAdmin = profile?.role === 'super_admin';
  const wrapRef = useRef<HTMLDivElement>(null);

  // debounce: запит до Supabase через 250 мс після останнього символу
  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      fetchSuggestions(q)
        .then((r) => {
          if (!cancelled) {
            setResults(r);
            setOpen(true);
          }
        })
        .catch(() => {});
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // клік поза пошуком закриває dropdown
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function onChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults(null);
      setOpen(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && query.trim()) {
      logSearch(query);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      e.currentTarget.blur();
    }
    if (e.key === 'Escape') setOpen(false);
  }

  const close = () => setOpen(false);
  const hasResults =
    results &&
    (results.authors.length || results.books.length || results.bookstores.length || results.events.length);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-cream/90 backdrop-blur-md border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20 gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <span className="w-9 h-9 rounded-full bg-forest flex items-center justify-center text-cream font-display text-lg group-hover:rotate-6 transition-transform">
            E
          </span>
          <span className="font-display text-2xl tracking-tight text-forest">Estante</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 font-medium text-sm text-ink/80">
          <NavLink to="/" end className="nav-link">Home</NavLink>
          <NavLink to="/bookstores" className="nav-link">Bookstores</NavLink>
          <NavLink to="/community" className="nav-link">Community</NavLink>
          {isSuperAdmin && (
            <NavLink to="/moderation" className="nav-link">Moderation</NavLink>
          )}
        </div>

        {/* SEARCH */}
        <div className="relative flex-1 max-w-md" ref={wrapRef}>
          <div className="flex items-center gap-2 bg-white/70 border border-ink/10 rounded-full px-4 py-2.5 focus-within:shadow-soft focus-within:border-terracotta/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-ink/40 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              value={query}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => hasResults && setOpen(true)}
              type="text"
              placeholder="Search books, authors, bookstores…"
              className="bg-transparent outline-none text-sm w-full placeholder:text-ink/40"
              autoComplete="off"
            />
          </div>

          {open && hasResults && (
            <div className="absolute mt-2 w-full bg-white rounded-2xl shadow-lift border border-ink/5 z-50 max-h-105 overflow-y-auto">
              {results.authors.length > 0 && (
                <Group label="Authors">
                  {results.authors.map((a) => (
                    <Item key={a} to={`/search?q=${encodeURIComponent(a)}`} title={a} onPick={close} />
                  ))}
                </Group>
              )}
              {results.books.length > 0 && (
                <Group label="Books">
                  {results.books.map((b) => (
                    <Item key={b.slug} to={`/books/${b.slug}`} title={b.title} sub={b.author} onPick={close} />
                  ))}
                </Group>
              )}
              {results.bookstores.length > 0 && (
                <Group label="Bookstores">
                  {results.bookstores.map((s) => (
                    <Item
                      key={s.slug}
                      to={`/bookstores/${s.slug}`}
                      title={s.name}
                      sub={s.neighborhood}
                      onPick={close}
                    />
                  ))}
                </Group>
              )}
              {results.events.length > 0 && (
                <Group label="Events">
                  {results.events.map((e) => (
                    <Item key={e.id} to="/community" title={e.title} sub={e.date} onPick={close} />
                  ))}
                </Group>
              )}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link
            to="/apply"
            className="text-sm font-medium text-ink/70 hover:text-forest transition-colors px-3"
          >
            List your bookstore
          </Link>
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-sm text-ink/70 hover:text-forest transition-colors max-w-32 truncate"
              >
                {profile?.name || user.email}
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  navigate('/');
                }}
                className="btn-outline text-sm font-medium px-5 py-2.5 rounded-full"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="text-sm font-medium text-ink/70 hover:text-forest transition-colors px-3"
              >
                Log in
              </Link>
              <Link
                to="/auth?mode=signup"
                className="btn-primary bg-forest text-cream text-sm font-medium px-5 py-2.5 rounded-full"
              >
                Join the community
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON (nav links are hidden below lg) */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="lg:hidden w-10 h-10 shrink-0 rounded-full border border-ink/15 flex items-center justify-center text-forest hover:bg-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <MobileMenu
          isSuperAdmin={isSuperAdmin}
          userLabel={user ? profile?.name || user.email || 'Profile' : null}
          onClose={() => setMenuOpen(false)}
          onSignOut={async () => {
            setMenuOpen(false);
            await signOut();
            navigate('/');
          }}
        />
      )}
    </nav>
  );
}

function MobileMenu({
  isSuperAdmin, userLabel, onClose, onSignOut,
}: {
  isSuperAdmin: boolean;
  userLabel: string | null;
  onClose: () => void;
  onSignOut: () => void;
}) {
  const item = 'block px-3 py-2.5 rounded-lg text-sm font-medium text-ink/80 hover:bg-white hover:text-forest';
  const active = ({ isActive }: { isActive: boolean }) =>
    `${item} ${isActive ? 'bg-white shadow-soft text-forest' : ''}`;

  return (
    <div id="mobile-menu" className="lg:hidden border-t border-ink/5 bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
        <NavLink to="/" end className={active} onClick={onClose}>Home</NavLink>
        <NavLink to="/bookstores" className={active} onClick={onClose}>Bookstores</NavLink>
        <NavLink to="/community" className={active} onClick={onClose}>Community</NavLink>
        {isSuperAdmin && (
          <NavLink to="/moderation" className={active} onClick={onClose}>Moderation</NavLink>
        )}
        <NavLink to="/apply" className={active} onClick={onClose}>List your bookstore</NavLink>

        <div className="pt-3 mt-3 border-t border-ink/10 space-y-1">
          {userLabel ? (
            <>
              <NavLink to="/profile" className={active} onClick={onClose}>
                <span className="block truncate">{userLabel}</span>
              </NavLink>
              <button onClick={onSignOut} className={`${item} w-full text-left`}>
                Log out
              </button>
            </>
          ) : (
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to="/auth"
                onClick={onClose}
                className="btn-outline text-sm font-medium px-5 py-2.5 rounded-full"
              >
                Log in
              </Link>
              <Link
                to="/auth?mode=signup"
                onClick={onClose}
                className="btn-primary bg-forest text-cream text-sm font-medium px-5 py-2.5 rounded-full"
              >
                Join the community
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest uppercase text-ink/35">
        {label}
      </div>
      {children}
    </div>
  );
}

function Item({
  to, title, sub, onPick,
}: { to: string; title: string; sub?: string; onPick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onPick}
      className="w-full px-4 py-2.5 hover:bg-cream/70 flex items-center justify-between group"
    >
      <span className="text-sm text-ink/85 group-hover:text-forest">{title}</span>
      {sub && <span className="text-xs text-ink/40">{sub}</span>}
    </Link>
  );
}
