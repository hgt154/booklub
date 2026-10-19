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
