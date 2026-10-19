import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/useAuth';

export default function AuthPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>(
    params.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const next = params.get('next') || '/';

  if (!loading && user) return <Navigate to={next} replace />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate(next, { replace: true });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }, 
      });
      if (error) setError(error.message);
      else if (!data.session) {

        setInfo('Check your inbox and confirm your email, then log in.');
        setMode('login');
      } else navigate(next, { replace: true });
    }
    setBusy(false);
  }

  const input =
    'w-full bg-white border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-terracotta/60';

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-forest mb-2">
        {mode === 'login' ? 'Welcome back' : 'Join Estante'}
      </h1>
      <p className="text-ink/60 mb-8 text-sm">
        {mode === 'login'
          ? 'Log in to reserve books and follow your favourite bookstores.'
          : 'Create a reader account to reserve books and follow bookstores.'}
      </p>

      <form onSubmit={onSubmit} className="bg-white rounded-3xl shadow-lift p-8 space-y-4">
        {mode === 'signup' && (
          <input
            className={input}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className={input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          className={input}
          type="password"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />

        {error && <p className="text-sm text-terracotta">{error}</p>}
        {info && <p className="text-sm text-forest">{info}</p>}

        <button
          type="submit"
          disabled={busy}
          className="btn-primary w-full bg-forest text-cream font-medium py-3 rounded-full disabled:opacity-60"
        >
          {busy ? '…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-ink/60 mt-6 text-center">
        {mode === 'login' ? (
          <>
            New here?{' '}
            <button onClick={() => setMode('signup')} className="text-forest font-medium underline">
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button onClick={() => setMode('login')} className="text-forest font-medium underline">
              Log in
            </button>
          </>
        )}
      </p>
      <p className="text-xs text-ink/40 mt-4 text-center">
        Own a bookstore?{' '}
        <Link to="/apply" className="underline">
          Apply to list it
        </Link>
      </p>
    </div>
  );
}
