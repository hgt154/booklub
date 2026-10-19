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
