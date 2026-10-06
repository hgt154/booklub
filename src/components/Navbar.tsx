import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium ${isActive ? 'text-terracotta' : 'text-forest hover:text-terracotta'}`

export function Navbar() {
  return (
    <header className="bg-white border-b border-forest/10">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <NavLink to="/" className="font-display text-xl text-forest">Estante</NavLink>
        <div className="flex gap-6">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/bookstores" className={linkClass}>Bookstores</NavLink>
          <NavLink to="/community" className={linkClass}>Community</NavLink>
          <NavLink to="/search" className={linkClass}>Search</NavLink>
        </div>
      </nav>
    </header>
  )
}