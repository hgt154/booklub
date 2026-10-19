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
