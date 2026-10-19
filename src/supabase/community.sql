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
