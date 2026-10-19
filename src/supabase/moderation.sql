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
