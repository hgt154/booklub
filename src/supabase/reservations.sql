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
