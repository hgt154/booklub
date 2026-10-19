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

-- ==========================================================
-- Estante: reservations, part 2 (reader-side rules)
-- Run once in Supabase -> SQL Editor after schema.sql
-- ==========================================================

-- A user can hold only one active reservation per listing.
-- Cancelled and completed reservations do not count, so the reader can reserve again.
-- Note: this fails if duplicate active reservations already exist; clean them up first.
create unique index reservations_one_active_per_user
  on public.reservations (listing_id, user_id)
  where status in ('pending', 'confirmed', 'ready');

-- Readers may update their own reservation, but only to cancel it.
-- Column grants already limit updates to the status column.
-- The app offers Cancel only for pending/confirmed; the DB does not enforce that.
create policy "reader cancels own" on public.reservations
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and status = 'cancelled');

-- ==========================================================
-- Estante: bookstore owner applications (moderation via status)
-- Run once in Supabase -> SQL Editor after schema.sql
-- Flow: reader applies -> bookstores row with status 'pending'
--       -> super admin sets status = 'approved' in Table Editor
--       -> trigger promotes the applicant to 'bookstore_owner'
-- ==========================================================

-- At most one pending application per user (also guards against double submits).
create unique index bookstores_one_pending_per_owner
  on public.bookstores (owner_id)
  where status = 'pending';

-- Any logged-in user can apply. Runs as definer because readers cannot insert
-- into bookstores directly (the "owners create" policy requires the owner role).
-- The form description is stored in `story` (shown as "Our story").
create function public.apply_for_bookstore(
  p_name text,
  p_neighborhood text,
  p_address text,
  p_description text
) returns text
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  clean_name text := btrim(coalesce(p_name, ''));
  base_slug text;
  new_slug text;
  n int := 1;
begin
  if uid is null then
    raise exception 'You need to log in to apply.';
  end if;
  if clean_name = '' then
    raise exception 'Bookstore name is required.';
  end if;
  if length(clean_name) > 120 then
    raise exception 'Bookstore name is too long.';
  end if;
  if exists (select 1 from public.bookstores where owner_id = uid and status = 'pending') then
    raise exception 'You already have an application under review.';
  end if;

  -- "Buchhandlung Müller & Söhne" -> "buchhandlung-muller-sohne"
  base_slug := translate(
    replace(lower(clean_name), 'ß', 'ss'),
    'äöüáàâãéèêíìóòôõúùçñ',
    'aouaaaaeeeiioooouucn'
  );
  base_slug := btrim(regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g'), '-');
  if base_slug = '' then
    base_slug := 'bookstore';
  end if;

  new_slug := base_slug;
  while exists (select 1 from public.bookstores where slug = new_slug) loop
    n := n + 1;
    new_slug := base_slug || '-' || n;
  end loop;

  insert into public.bookstores (slug, owner_id, status, name, neighborhood, address, story, mark)
  values (
    new_slug, uid, 'pending', clean_name,
    nullif(btrim(p_neighborhood), ''),
    nullif(btrim(p_address), ''),
    nullif(btrim(p_description), ''),
    upper(left(clean_name, 1))
  );

  return new_slug;
end $$;

revoke execute on function public.apply_for_bookstore(text, text, text, text) from public, anon;
grant execute on function public.apply_for_bookstore(text, text, text, text) to authenticated;

-- When a bookstore becomes approved, promote its owner from reader to bookstore_owner.
-- Super admins keep their role.
create function public.promote_owner_on_approval() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'approved'
     and old.status is distinct from 'approved'
     and new.owner_id is not null then
    update public.profiles
      set role = 'bookstore_owner'
      where id = new.owner_id and role = 'reader';
  end if;
  return new;
end $$;

create trigger on_bookstore_approved
  after update of status on public.bookstores
  for each row execute function public.promote_owner_on_approval();

-- ==========================================================
-- Estante: owner dashboard
-- Run once in Supabase -> SQL Editor after schema.sql
-- ==========================================================

-- Owners can read the profile (name) of readers who reserved one of their listings.
-- Without this, the Reservations tab shows "Reader" instead of the name.
-- No recursion: reservations policies use owns_listing() (security definer)
-- and never read profiles.
create policy "owners read their customers" on public.profiles
  for select to authenticated
  using (
    exists (
      select 1 from public.reservations r
      where r.user_id = profiles.id
        and public.owns_listing(r.listing_id)
    )
  );

-- ==========================================================
-- Estante: follows, messages, public counters
-- Run once in Supabase -> SQL Editor after schema.sql
-- RLS hides other users' follows and reservations, so counts and
-- the owner's inbox go through security definer functions that
-- return only aggregates / the reader's name.
-- ==========================================================

-- Public counters for a bookstore page: followers and active reservations.
-- Only for approved stores (or the owner's own store), like the bookstores RLS.
create function public.bookstore_public_stats(p_bookstore uuid)
returns table (followers bigint, reserved bigint)
language sql stable security definer set search_path = public as $$
  select
    (select count(*) from public.follows f where f.bookstore_id = s.id),
    (select count(*)
       from public.reservations r
       join public.listings l on l.id = r.listing_id
      where l.bookstore_id = s.id
        and r.status in ('pending', 'confirmed', 'ready'))
  from public.bookstores s
  where s.id = p_bookstore
    and (s.status = 'approved' or s.owner_id = auth.uid())
$$;

revoke execute on function public.bookstore_public_stats(uuid) from public;
grant execute on function public.bookstore_public_stats(uuid) to anon, authenticated;

-- Owner inbox: messages to my bookstore with the sender's name only
-- (no email, no role). Returns nothing if the caller does not own the store.
create function public.bookstore_messages(p_bookstore uuid)
returns table (id uuid, content text, created_at timestamptz, reader_name text)
language sql stable security definer set search_path = public as $$
  select m.id, m.content, m.created_at, p.name
  from public.messages m
  left join public.profiles p on p.id = m.user_id
  where m.bookstore_id = p_bookstore
    and public.owns_bookstore(p_bookstore)
  order by m.created_at desc
$$;

revoke execute on function public.bookstore_messages(uuid) from public, anon;
grant execute on function public.bookstore_messages(uuid) to authenticated;

-- ==========================================================
-- Estante: anonymous search log + "Recent searches" for owners
-- Run once in Supabase -> SQL Editor after schema.sql
-- search_logs stores only the query text and a timestamp:
-- no user id, no IP, no other personal data.
-- ==========================================================

create table public.search_logs (
  id uuid primary key default gen_random_uuid(),
  query text not null check (char_length(query) between 2 and 100),
  created_at timestamptz not null default now()
);

create index on public.search_logs (created_at);

-- Anyone (also anonymous visitors) can insert; nobody can read rows directly.
-- There is deliberately no select/update/delete policy.
alter table public.search_logs enable row level security;
create policy "anyone logs searches" on public.search_logs
  for insert to anon, authenticated
  with check (char_length(query) between 2 and 100);
revoke all on public.search_logs from anon, authenticated;
grant insert (query) on public.search_logs to anon, authenticated;

-- Most frequent searches of the last 30 days that match the title or author
-- of at least one book listed by the given bookstore. Owner only.
-- Queries are grouped case-insensitively; % and _ in queries are matched literally.
create function public.bookstore_recent_searches(p_bookstore uuid)
returns table (query text, times bigint, matching_books text[])
language sql stable security definer set search_path = public as $$
  with recent as (
    select lower(btrim(s.query)) as q, count(*) as times
    from public.search_logs s
    where s.created_at > now() - interval '30 days'
    group by lower(btrim(s.query))
  ),
  store_books as (
    select distinct b.title, b.author
    from public.listings l
    join public.books b on b.id = l.book_id
    where l.bookstore_id = p_bookstore
  ),
  pattern as (
    select q, times,
      '%' || replace(replace(replace(q, '\', '\\'), '%', '\%'), '_', '\_') || '%' as p
    from recent
  )
  select pt.q, pt.times, array_agg(distinct sb.title order by sb.title)
  from pattern pt
  join store_books sb on sb.title ilike pt.p or sb.author ilike pt.p
  where public.owns_bookstore(p_bookstore)
  group by pt.q, pt.times
  order by pt.times desc, pt.q
  limit 20
$$;

revoke execute on function public.bookstore_recent_searches(uuid) from public, anon;
grant execute on function public.bookstore_recent_searches(uuid) to authenticated;

-- ==========================================================
-- Estante: super admin moderation (/moderation)
-- Run once in Supabase -> SQL Editor after schema.sql,
-- owner-application.sql and the other part files.
-- Flow: pending -> approved (trigger on_bookstore_approved promotes the
--       owner to bookstore_owner) or pending -> rejected.
-- ==========================================================

-- Super admins see every bookstore, including pending and rejected ones.
-- (Permissive policies are OR'ed with "read approved or own".)
create policy "super admin reads all bookstores" on public.bookstores
  for select to authenticated
  using (public.my_role() = 'super_admin');

-- Super admins may update any bookstore row ...
create policy "super admin updates bookstores" on public.bookstores
  for update to authenticated
  using (public.my_role() = 'super_admin')
  with check (public.my_role() = 'super_admin');

-- ... and the status column becomes updatable through the API.
grant update (status) on public.bookstores to authenticated;

-- Guard: the grant above also reaches owners through "owners edit own",
-- so only super admins may change status. auth.uid() is null in the
-- Supabase dashboard / service role, which stays allowed.
create function public.guard_bookstore_status() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status is distinct from old.status
     and auth.uid() is not null
     and public.my_role() is distinct from 'super_admin' then
    raise exception 'Only a super admin can change the bookstore status.';
  end if;
  return new;
end $$;

create trigger guard_bookstore_status
  before update of status on public.bookstores
  for each row execute function public.guard_bookstore_status();

-- on_bookstore_approved (owner-application.sql) is an AFTER UPDATE OF status
-- trigger with security definer, so it keeps promoting the owner when the
-- status is changed from the app instead of the Table Editor.

-- Applicant's name and email for a pending bookstore. Super admin only;
-- returns no row for anyone else or for non-pending stores.
create function public.bookstore_applicant(p_bookstore uuid)
returns table (name text, email text)
language sql stable security definer set search_path = public as $$
  select p.name, u.email::text
  from public.bookstores s
  join public.profiles p on p.id = s.owner_id
  join auth.users u on u.id = s.owner_id
  where s.id = p_bookstore
    and s.status = 'pending'
    and public.my_role() = 'super_admin'
$$;

revoke execute on function public.bookstore_applicant(uuid) from public, anon;
grant execute on function public.bookstore_applicant(uuid) to authenticated;
