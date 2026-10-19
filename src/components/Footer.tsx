import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-forest text-cream/70">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-cream/10 flex items-center justify-center text-cream font-display">
              E
            </span>
            <span className="font-display text-xl text-cream">Estante</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed">
            Helping readers discover independent bookstores while helping bookstores become
            discoverable. Community comes before marketplace — always.
          </p>
        </div>
        <div>
          <h5 className="text-cream font-medium mb-3 text-sm">Explore</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/bookstores" className="hover:text-cream">Bookstores</Link></li>
            <li><Link to="/search" className="hover:text-cream">Search books</Link></li>
            <li><Link to="/community" className="hover:text-cream">Community</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-cream font-medium mb-3 text-sm">For bookstores</h5>
          <ul className="space-y-2 text-sm">
            <li><Link to="/apply" className="hover:text-cream">List your bookstore</Link></li>
            <li><Link to="/admin" className="hover:text-cream text-cream/40">Admin dashboard</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/40">
        Prototype for demonstration purposes · Vienna, 2026
      </div>
    </footer>
  );
}
