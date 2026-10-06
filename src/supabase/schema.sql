-- ==========================================================
-- Estante: Supabase schema
-- Paste into Supabase -> SQL Editor -> New query -> Run
-- ==========================================================

create type user_role as enum ('reader', 'bookstore_owner', 'super_admin');

-- ---------- TABLES ----------

-- One row per auth user (Supabase Auth keeps email/password in auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role user_role not null default 'reader',
  created_at timestamptz not null default now()
);

create table public.bookstores (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                 -- used in URLs: /bookstores/leguara
  owner_id uuid references public.profiles(id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),   -- moderation
  name text not null,
  neighborhood text,
  district text,
  address text,
  accent text default '#2F6B4F',
  mark text,
  specialties text[] not null default '{}',
  languages text[] not null default '{}',
  atmosphere text,
  founded int,
  owner_name text,
  owner_role text,
  owner_portrait text,
  quote text,
  story text,
  mission text,
  timeline jsonb not null default '[]',      -- [{ "year": "2018", "text": "..." }]
  hours jsonb not null default '[]',         -- [["Mon","Closed"], ["Tue - Fri","10:00 - 19:00"]]
  hero_img text,
  gallery text[] not null default '{}',
  instagram text,
  badge text,
  created_at timestamptz not null default now()
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  author text not null,
  genre text,
  description text,
  cover_url text,
  isbn text unique,
  color1 text default '#2F6B4F',
  color2 text default '#1F3327',
  source text not null default 'manual' check (source in ('manual', 'google_books')),
  created_at timestamptz not null default now()
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  bookstore_id uuid not null references public.bookstores(id) on delete cascade,
  price numeric(8,2) not null check (price >= 0),
  condition text,
  language text,
  status text not null default 'available'
    check (status in ('available', 'reserved', 'sold')),
  last_confirmed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'ready', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  bookstore_id uuid not null references public.bookstores(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  bookstore_id uuid not null references public.bookstores(id) on delete cascade,
  title text not null,
  type text,
  description text,
  event_date date,
  event_time time
);

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  bookstore_id uuid not null references public.bookstores(id) on delete cascade,
  name text not null,
  freq text,
  description text
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  bookstore_id uuid not null references public.bookstores(id) on delete cascade,
  title text not null,
  img text,
  excerpt text
);

create table public.walks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  stops text[] not null default '{}',
  duration text,
  img text,
  description text
);

create table public.follows (
  user_id uuid not null references public.profiles(id) on delete cascade,
  bookstore_id uuid not null references public.bookstores(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, bookstore_id)
);

-- ---------- INDEXES ----------
create index on public.listings (bookstore_id);
create index on public.listings (book_id);
create index on public.reservations (listing_id);
create index on public.reservations (user_id);
create index on public.messages (bookstore_id);
create index on public.events (bookstore_id);

-- ---------- HELPER FUNCTIONS ----------

-- Auto-create a profile (always role 'reader') when someone signs up
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'name');
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.my_role() returns user_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create function public.owns_bookstore(b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.bookstores where id = b and owner_id = auth.uid()
  )
$$;

create function public.owns_listing(l uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.listings li
    join public.bookstores b on b.id = li.bookstore_id
    where li.id = l and b.owner_id = auth.uid()
  )
$$;

-- ---------- ROW LEVEL SECURITY ----------
-- Note: the Supabase dashboard (Table Editor / SQL Editor) bypasses RLS,
-- so you can act as super admin there without extra policies.

-- profiles: see and edit only your own; nobody can change their own role
alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles
  for select using (id = auth.uid());
create policy "update own profile" on public.profiles
  for update using (id = auth.uid());
revoke update on public.profiles from authenticated, anon;
grant update (name) on public.profiles to authenticated;

-- bookstores: public sees approved ones; owners see and edit their own
alter table public.bookstores enable row level security;
create policy "read approved or own" on public.bookstores
  for select using (status = 'approved' or owner_id = auth.uid());
create policy "owners create" on public.bookstores
  for insert with check (
    owner_id = auth.uid() and status = 'pending' and public.my_role() = 'bookstore_owner'
  );
create policy "owners edit own" on public.bookstores
  for update using (owner_id = auth.uid());
revoke update on public.bookstores from authenticated, anon;
grant update (
  name, neighborhood, district, address, accent, mark, specialties, languages,
  atmosphere, founded, owner_name, owner_role, owner_portrait, quote, story,
  mission, timeline, hours, hero_img, gallery, instagram
) on public.bookstores to authenticated;

-- books: everyone reads, logged-in users can add new ones (no edits)
alter table public.books enable row level security;
create policy "public read books" on public.books for select using (true);
create policy "logged in add books" on public.books
  for insert to authenticated with check (true);

-- listings: public sees listings of approved stores; owners manage their own
alter table public.listings enable row level security;
create policy "read listings" on public.listings
  for select using (
    public.owns_bookstore(bookstore_id)
    or exists (
      select 1 from public.bookstores s
      where s.id = bookstore_id and s.status = 'approved'
    )
  );
create policy "owner insert listings" on public.listings
  for insert with check (public.owns_bookstore(bookstore_id));
create policy "owner update listings" on public.listings
  for update using (public.owns_bookstore(bookstore_id));
create policy "owner delete listings" on public.listings
  for delete using (public.owns_bookstore(bookstore_id));

-- events, clubs, stories: public read, owner of the bookstore writes
do $$
declare t text;
begin
  foreach t in array array['events', 'clubs', 'stories'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('create policy "owner insert" on public.%I for insert with check (public.owns_bookstore(bookstore_id))', t);
    execute format('create policy "owner update" on public.%I for update using (public.owns_bookstore(bookstore_id))', t);
    execute format('create policy "owner delete" on public.%I for delete using (public.owns_bookstore(bookstore_id))', t);
  end loop;
end $$;

-- walks: public read only (managed by you in the dashboard)
alter table public.walks enable row level security;
create policy "public read walks" on public.walks for select using (true);

-- reservations: readers create and see their own; owners see and update status
alter table public.reservations enable row level security;
create policy "reader creates" on public.reservations
  for insert to authenticated with check (user_id = auth.uid());
create policy "reader or owner reads" on public.reservations
  for select using (user_id = auth.uid() or public.owns_listing(listing_id));
create policy "owner updates status" on public.reservations
  for update using (public.owns_listing(listing_id));
revoke update on public.reservations from authenticated, anon;
grant update (status) on public.reservations to authenticated;

-- messages: readers send and see their own; owners see messages to their store
alter table public.messages enable row level security;
create policy "reader sends" on public.messages
  for insert to authenticated with check (user_id = auth.uid());
create policy "reader or owner reads" on public.messages
  for select using (user_id = auth.uid() or public.owns_bookstore(bookstore_id));

-- follows: each user manages their own
alter table public.follows enable row level security;
create policy "own follows" on public.follows
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());