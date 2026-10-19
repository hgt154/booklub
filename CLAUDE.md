# Estante

A community platform for independent bookstores in Vienna. Readers find and reserve books, follow bookstores, and discover events and reading clubs. Bookstore owners manage their catalogue and reservations. It is a community platform, not a marketplace: there are no online payments, books are reserved and picked up in the shop.

This repo is a rewrite of a vanilla-JS prototype (`legacy/`, live reference: https://hgt154.github.io/booklub/) into a real React + Supabase app. The visual design must match the prototype.

Pilot scope: about 5 bookstores in Vienna, centrally moderated by a super admin.

## Working with me

- All UI text, code, comments and commit messages are in English.
- Work only on the files named in the task. Do not read or refactor the whole project.
- If a product decision is needed, ask instead of guessing.
- Do not commit or push until I say so. Never stage `.env*.local`.
- Keep changes small and show what changed at the end (list of files, one line each).

## Stack

- Vite + React + TypeScript, `react-router-dom` (routes in `src/App.tsx`, all inside `<Layout />`).
- Tailwind CSS v4. Design tokens live in `@theme` in `src/index.css`. There is no `tailwind.config.js`; do not create one. Plugin: `@tailwindcss/vite`.
- Supabase: Postgres, Auth, Row Level Security. Frontend uses the publishable (anon) key only.
- Seed script: `scripts/seed.ts` (run with `npm run seed`, uses `tsx`, `dotenv`, `ws`).
- Node 20 on Windows (PowerShell). Hosting target: Vercel.

## Project structure

```
src/
  lib/
    supabaseClient.ts   Supabase client (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
    api.ts              ALL database queries; maps snake_case rows to camelCase UI types
    useAsync.ts         hook: useAsync(fn, deps) -> { data, error, loading }
    auth-context.ts     AuthContext, Profile and Role types
    useAuth.ts          hook: useAuth() -> { user, profile, loading, signOut }
  components/           Layout, Navbar (search + suggestions), Footer, AuthProvider,
                        BookCover, StoreMark, TagList, BookstoreCard
  pages/                Home, BookstoresList, Bookstore, Book, Community, Search,
                        Auth, Profile, Admin (stub). Pages use default export,
                        except BookstoresListPage (named export).
  types.ts              Bookstore, Book, Listing, BookEvent, Club, Story, Walk, Collection
  data/index.ts         typed mock data, used ONLY by the seed script
supabase/schema.sql     schema + RLS, source of truth for the database
scripts/seed.ts         upserts bookstores/books by slug, re-inserts listings/events/...
legacy/                 old prototype, reference only, never modify
```

## Data layer rules

- Components never call Supabase directly. Add a function to `src/lib/api.ts` and use it through `useAsync`.
- URLs use slugs. `Bookstore.id` in the UI is the slug; `Bookstore.dbId` is the database uuid. Use `dbId` for foreign keys (for example `bookstore_id`), slugs for routes and `.eq('slug', …)`.
- Supabase returns many-to-one joins as an object (the generated types say array). Always read them with the `one()` helper in `api.ts`.
- Count joins look like `listings(count)` and return `[{ count: n }]`.
- Search uses `ilike` and must strip `% , ( ) *` from user input before building `.or()` filters.
- Handle loading, empty and error states on every page that reads data.

## Database and security

- Tables: `profiles`, `bookstores`, `books`, `listings`, `events`, `clubs`, `stories`, `walks`, `reservations`, `messages`, `follows`.
- Roles (`user_role` enum): `reader`, `bookstore_owner`, `super_admin`. A user cannot change their own role (column-level grants). Roles are set by the super admin in the Supabase Table Editor.
- `bookstores.status` is `pending` or `approved`. The public sees only approved stores; owners also see their own. Moderation is done by the super admin.
- `reservations.status`: `pending`, `confirmed`, `ready`, `completed`, `cancelled`. Readers create and see their own reservations and can only cancel; owners update the status of reservations on their listings.
- RLS is on for every table. Any new table needs RLS policies in the same SQL.
- Do NOT change the database yourself. Write SQL to `supabase/*.sql`, append it to `schema.sql` as documentation, and I will run it in the Supabase SQL Editor.
- Secrets: only in `.env.local` (frontend) and `.env.seed.local` (service role key, seed script only). Never read, print, log or commit these files. The service role key must never reach frontend code.

## Design system

- Colors (tokens in `src/index.css`): cream (background), forest (primary dark green), terracotta (accent), brown, ink (text). Use `text-ink/xx` for body text opacity.
- Fonts: Fraunces (`font-display`) for headings, Inter for body.
- Shared classes: `.btn-primary`, `.btn-outline`, `.card-lift`, `.img-zoom`, `.nav-link`, `.fade-slide`, `.hero-gradient`, `.no-scrollbar`, `.book-cover`.
- Layout: fixed header (`h-20`) with logo, nav links and the search bar with suggestion dropdown; `<main>` has `pt-20`; dark-green footer. Containers are `max-w-7xl mx-auto px-6`.
- Cards: white, `rounded-2xl` or `rounded-3xl`, `shadow-soft` / `shadow-lift`. Eyebrow labels are small uppercase terracotta text.
- Must work on mobile. Use v4 canonical class names (for example `min-h-150`, `bg-linear-to-t`).

## Code conventions

- TypeScript strict, no `any`, no `as unknown[]` casts to silence errors. Types belong in `src/types.ts` or next to the API function that returns them.
- Function components with hooks only. Do not set state synchronously inside `useEffect` (the lint rule `react-hooks/set-state-in-effect` is on); use `useAsync` for fetching.
- After changes run `npx tsc -b` and `npm run lint`, and fix what you broke. Ignore pre-existing hints in `legacy/`.
- Tailwind classes in JSX, no new CSS files. Reusable component styles go to `src/index.css`.

## Commands

```
npm run dev      # local dev server on http://localhost:5173
npm run build    # type-check + production build
npm run lint     # ESLint
npm run seed     # load test data into Supabase (needs .env.seed.local)
```

If data does not load and the browser console shows `ERR_NAME_NOT_RESOLVED`, the free Supabase project is paused (it pauses after a week of inactivity). Resume it in the Supabase dashboard.

## Status

Done:
- Schema, RLS, seed data; read-only pages on live data (home, bookstores, bookstore page, book page, community, search results).
- Header with live search suggestions; footer; layout matching the prototype.
- Auth: sign up, log in, log out, session handling (`/auth`).
- Reservations: Reserve button on the book page, `/profile` with reservations and cancel, editable name.

Next, in this order:
1. Bookstore application form ("List your bookstore") that creates a `pending` bookstore for review.
2. Owner dashboard (`/admin`): Books (add, edit price, mark sold), Reservations (confirm, ready, complete), Recent searches, Recently added, Messages.
3. Contact bookstore (`messages`) and Follow (`follows`), with real follower counts.
4. Email templates and custom SMTP in Supabase Auth; transactional emails for reservation status changes (Edge Function).
5. Remaining pages aligned with the prototype (bookstores list filters, community sections, breadcrumbs).
6. Vercel deploy, loading/empty/error states, mobile pass, keep the Supabase project from pausing (Pro plan or a weekly ping).

Update this section when a stage is finished.