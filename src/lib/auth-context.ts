import { createContext } from 'react';
import type { User } from '@supabase/supabase-js';

export type Role = 'reader' | 'bookstore_owner' | 'super_admin';

export type Profile = { id: string; name: string | null; role: Role };

export type AuthState = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});