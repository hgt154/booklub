import { supabase } from './supabaseClient';
import type { Bookstore } from '../types';

type BookstoreRow = {
  id: string;
  slug: string; name: string; neighborhood: string; district: string; address: string;
  accent: string; mark: string; specialties: string[]; languages: string[];
  atmosphere: string; founded: number; owner_name: string; owner_role: string;
  owner_portrait: string; quote: string; story: string; mission: string;
  timeline: { year: string; text: string }[]; hours: [string, string][];
  hero_img: string; gallery: string[]; instagram: string; badge: string;
  listings: { count: number }[]; events: { count: number }[];
};

function toBookstore(r: BookstoreRow): Bookstore {
  return {
    id: r.slug,
    dbId: r.id,
    name: r.name, neighborhood: r.neighborhood, district: r.district, address: r.address,
    accent: r.accent, mark: r.mark, specialties: r.specialties, languages: r.languages,
    atmosphere: r.atmosphere, founded: r.founded,
    owner: r.owner_name, ownerRole: r.owner_role, ownerPortrait: r.owner_portrait,
    quote: r.quote, story: r.story, mission: r.mission,
    timeline: r.timeline,
    hours: r.hours,
    heroImg: r.hero_img, gallery: r.gallery, instagram: r.instagram, badge: r.badge,
    stats: {
      books: r.listings[0]?.count ?? 0,
      followers: 0,
      eventsHosted: r.events[0]?.count ?? 0,
      reserved: 0,
      recentlyAdded: 0,
    },
  };
}

const SELECT = '*, listings(count), events(count)';

// Supabase повертає many-to-one join як об'єкт, а не масив (TS-типи кажуть інакше).
// Ця функція нормалізує обидва варіанти.
function one<T>(x: T[] | T | null | undefined): T | undefined {
  return Array.isArray(x) ? x[0] : (x ?? undefined);
}

export async function fetchBookstores(): Promise<Bookstore[]> {
  // RLS показує власнику його pending-книгарню, а супер-адміну всі: публічний список лише approved
  const { data, error } = await supabase
    .from('bookstores').select(SELECT).eq('status', 'approved').order('name');
  if (error) throw error;
  return (data as BookstoreRow[]).map(toBookstore);
}

export async function fetchBookstore(slug: string): Promise<Bookstore | null> {
  const { data, error } = await supabase
    .from('bookstores').select(SELECT).eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? toBookstore(data as BookstoreRow) : null;
}

export type ListingWithBook = {
  id: string;
  price: number;
  condition: string;
  language: string;
  status: ListingStatus;
  lastConfirmed: string;
  book: { id: string; slug: string; title: string; author: string; color1: string; color2: string };
};

type ListingRow = {
  id: string; price: number; condition: string; language: string; status: ListingStatus;
  last_confirmed_at: string;
  // Supabase повертає вкладений join як масив, навіть якщо зв'язок один-до-одного
  book: { id: string; slug: string; title: string; author: string; color1: string; color2: string }[];
};

export async function fetchListingsByBookstore(bookstoreId: string): Promise<ListingWithBook[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('id, price, condition, language, status, last_confirmed_at, book:books(id, slug, title, author, color1, color2)')
    .eq('bookstore_id', bookstoreId)
    .order('last_confirmed_at', { ascending: false });

  if (error) throw error;

  return (data as ListingRow[])
    .filter((r) => one(r.book))
    .map((r) => ({
      id: r.id, price: r.price, condition: r.condition, language: r.language,
      status: r.status, lastConfirmed: r.last_confirmed_at,
      book: one(r.book)!,
    }));
}

/* ---------- COMMUNITY ---------- */

type EventRow = {
  id: string; title: string; type: string; description: string;
  event_date: string; event_time: string;
  bookstore: { id: string; slug: string; name: string; accent: string; mark: string }[];
};

export type EventWithStore = {
  id: string; title: string; type: string; description: string;
  date: string; time: string;
  bookstore: { id: string; slug: string; name: string; accent: string; mark: string };
};

export async function fetchEvents(): Promise<EventWithStore[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, title, type, description, event_date, event_time, bookstore:bookstores(id, slug, name, accent, mark)')
    .order('event_date');
  if (error) throw error;
  return (data as EventRow[])
    .filter((r) => one(r.bookstore))
    .map((r) => ({
      id: r.id, title: r.title, type: r.type, description: r.description,
      date: r.event_date, time: r.event_time, bookstore: one(r.bookstore)!,
    }));
}

type ClubRow = {
  id: string; name: string; freq: string; description: string;
  bookstore: { id: string; slug: string; name: string; accent: string; mark: string }[];
};

export type ClubWithStore = {
  id: string; name: string; freq: string; description: string;
  bookstore: { id: string; slug: string; name: string; accent: string; mark: string };
};

export async function fetchClubs(): Promise<ClubWithStore[]> {
  const { data, error } = await supabase
    .from('clubs')
    .select('id, name, freq, description, bookstore:bookstores(id, slug, name, accent, mark)');
  if (error) throw error;
  return (data as ClubRow[])
    .filter((r) => one(r.bookstore))
    .map((r) => ({
      id: r.id, name: r.name, freq: r.freq, description: r.description,
      bookstore: one(r.bookstore)!,
    }));
}

type StoryRow = {
  id: string; title: string; img: string; excerpt: string;
  bookstore: { id: string; slug: string; name: string }[];
};

export type StoryWithStore = {
  id: string; title: string; img: string; excerpt: string;
  bookstore: { id: string; slug: string; name: string };
};

export async function fetchStories(): Promise<StoryWithStore[]> {
  const { data, error } = await supabase
    .from('stories')
    .select('id, title, img, excerpt, bookstore:bookstores(id, slug, name)');
  if (error) throw error;
  return (data as StoryRow[])
    .filter((r) => one(r.bookstore))
    .map((r) => ({
      id: r.id, title: r.title, img: r.img, excerpt: r.excerpt,
      bookstore: one(r.bookstore)!,
    }));
}

type WalkRow = {
  id: string; title: string; stops: string[]; duration: string; img: string; description: string;
};

export async function fetchWalks(): Promise<WalkRow[]> {
  const { data, error } = await supabase
    .from('walks')
    .select('id, title, stops, duration, img, description');
  if (error) throw error;
  return data as WalkRow[];
}

/* ---------- SINGLE BOOK ---------- */

export type Book = {
  id: string; title: string; author: string; genre: string;
  description: string; color1: string; color2: string;
};

type BookRow = {
  slug: string; title: string; author: string; genre: string;
  description: string; color1: string; color2: string;
};

export async function fetchBook(slug: string): Promise<Book | null> {
  const { data, error } = await supabase
    .from('books')
    .select('slug, title, author, genre, description, color1, color2')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = data as BookRow;
  return {
    id: r.slug, title: r.title, author: r.author, genre: r.genre,
    description: r.description, color1: r.color1, color2: r.color2,
  };
}

type BookListingRow = {
  id: string; price: number; condition: string; language: string; status: string;
  last_confirmed_at: string;
  bookstore: { slug: string; name: string; neighborhood: string; accent: string; mark: string }[];
};

export type BookListing = {
  id: string; price: number; condition: string; language: string; status: string;
  lastConfirmed: string;
  bookstore: { slug: string; name: string; neighborhood: string; accent: string; mark: string };
};

export async function fetchListingsByBook(bookSlug: string): Promise<BookListing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select(
      'id, price, condition, language, status, last_confirmed_at, book:books!inner(slug), bookstore:bookstores(slug, name, neighborhood, accent, mark)'
    )
    .eq('book.slug', bookSlug)
    .order('price');
  if (error) throw error;
  return (data as BookListingRow[])
    .filter((r) => one(r.bookstore))
    .map((r) => ({
      id: r.id, price: r.price, condition: r.condition, language: r.language,
      status: r.status, lastConfirmed: r.last_confirmed_at, bookstore: one(r.bookstore)!,
    }));
}

/* ---------- SEARCH ---------- */

export type SearchListing = {
  id: string; price: number; condition: string; language: string; status: string;
  lastConfirmed: string;
  book: { id: string; slug: string; title: string; author: string; color1: string; color2: string };
  bookstore: { slug: string; name: string; neighborhood: string; accent: string; mark: string };
};

type SearchListingRow = {
  id: string; price: number; condition: string; language: string; status: string;
  last_confirmed_at: string;
  book: { id: string; slug: string; title: string; author: string; color1: string; color2: string }[];
  bookstore: { slug: string; name: string; neighborhood: string; accent: string; mark: string }[];
};

export async function searchListings(query: string): Promise<SearchListing[]> {
  if (!query.trim()) return [];

  // Find matching books first (title or author), then pull their listings.
  const { data: books, error: bookErr } = await supabase
    .from('books')
    .select('id')
    .or(`title.ilike.%${query}%,author.ilike.%${query}%`);
  if (bookErr) throw bookErr;
  if (!books?.length) return [];

  const bookIds = books.map((b) => b.id);

  const { data, error } = await supabase
    .from('listings')
    .select(
      'id, price, condition, language, status, last_confirmed_at, book:books(id, slug, title, author, color1, color2), bookstore:bookstores(slug, name, neighborhood, accent, mark)'
    )
    .in('book_id', bookIds)
    .order('price');
  if (error) throw error;

  return (data as SearchListingRow[])
    .filter((r) => one(r.book) && one(r.bookstore))
    .map((r) => ({
      id: r.id, price: r.price, condition: r.condition, language: r.language,
      status: r.status, lastConfirmed: r.last_confirmed_at,
      book: one(r.book)!, bookstore: one(r.bookstore)!,
    }));
}

/* ---------- HOME EXTRAS ---------- */

type RecentBookRow = {
  book_id: string;
  book: { id: string; slug: string; title: string; author: string; color1: string; color2: string }[];
  bookstore: { slug: string; name: string }[];
};

export type RecentBook = {
  book: { id: string; slug: string; title: string; author: string; color1: string; color2: string };
  bookstore: { slug: string; name: string };
};

export async function fetchRecentBooks(limit = 10): Promise<RecentBook[]> {
  const { data, error } = await supabase
    .from('listings')
    .select(
      'book_id, book:books(id, slug, title, author, color1, color2), bookstore:bookstores(slug, name)'
    )
    .order('created_at', { ascending: false })
    // одна книга може мати кілька листингів: беремо із запасом і лишаємо найновіший
    .limit(limit * 4);
  if (error) throw error;
  const seen = new Set<string>();
  return (data as RecentBookRow[])
    .filter((r) => one(r.book) && one(r.bookstore))
    .filter((r) => !seen.has(r.book_id) && seen.add(r.book_id))
    .slice(0, limit)
    .map((r) => ({ book: one(r.book)!, bookstore: one(r.bookstore)! }));
}

/* ---------- NAVBAR SEARCH SUGGESTIONS ---------- */

export type Suggestions = {
  authors: string[];
  books: { slug: string; title: string; author: string }[];
  bookstores: { slug: string; name: string; neighborhood: string }[];
  events: { id: string; title: string; date: string }[];
};

export async function fetchSuggestions(query: string): Promise<Suggestions> {
  // прибираємо символи, які ламають синтаксис .or() у PostgREST
  const q = query.replace(/[%,()*]/g, ' ').trim();
  const empty: Suggestions = { authors: [], books: [], bookstores: [], events: [] };
  if (!q) return empty;

  const [booksRes, storesRes, eventsRes] = await Promise.all([
    supabase
      .from('books')
      .select('slug, title, author')
      .or(`title.ilike.%${q}%,author.ilike.%${q}%`)
      .limit(8),
    supabase
      .from('bookstores')
      .select('slug, name, neighborhood')
      .eq('status', 'approved')
      .or(`name.ilike.%${q}%,neighborhood.ilike.%${q}%`)
      .limit(3),
    supabase
      .from('events')
      .select('id, title, event_date')
      .ilike('title', `%${q}%`)
      .limit(3),
  ]);

  const books = (booksRes.data ?? []) as { slug: string; title: string; author: string }[];
  const lower = q.toLowerCase();

  return {
    authors: [...new Set(books.map((b) => b.author))]
      .filter((a) => a.toLowerCase().includes(lower))
      .slice(0, 3),
    books: books.slice(0, 4),
    bookstores: (storesRes.data ?? []) as { slug: string; name: string; neighborhood: string }[],
    events: ((eventsRes.data ?? []) as { id: string; title: string; event_date: string }[]).map(
      (e) => ({ id: e.id, title: e.title, date: e.event_date })
    ),
  };
}
/* ---------- RESERVATIONS ---------- */

export type ReservationStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';

const ACTIVE_STATUSES: ReservationStatus[] = ['pending', 'confirmed', 'ready'];

export async function createReservation(listingId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('reservations')
    .insert({ listing_id: listingId, user_id: userId });
  // 23505 = unique violation: активна резервація цього листингу вже є
  if (error?.code === '23505') throw new Error('You have already reserved this copy.');
  if (error) throw error;
}

export async function fetchMyActiveListingIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select('listing_id')
    .eq('user_id', userId)
    .in('status', ACTIVE_STATUSES);
  if (error) throw error;
  return (data as { listing_id: string }[]).map((r) => r.listing_id);
}

type MyReservationRow = {
  id: string; status: ReservationStatus; created_at: string;
  listing: {
    price: number;
    book: { slug: string; title: string; author: string }[];
    bookstore: { slug: string; name: string; neighborhood: string }[];
  }[];
};

export type MyReservation = {
  id: string; status: ReservationStatus; createdAt: string; price: number;
  book: { slug: string; title: string; author: string };
  bookstore: { slug: string; name: string; neighborhood: string };
};

export async function fetchMyReservations(userId: string): Promise<MyReservation[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select(
      'id, status, created_at, listing:listings(price, book:books(slug, title, author), bookstore:bookstores(slug, name, neighborhood))'
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as MyReservationRow[]).flatMap((r) => {
    const listing = one(r.listing);
    const book = one(listing?.book);
    const bookstore = one(listing?.bookstore);
    if (!listing || !book || !bookstore) return [];
    return [{
      id: r.id, status: r.status, createdAt: r.created_at, price: listing.price,
      book, bookstore,
    }];
  });
}

export async function cancelReservation(id: string): Promise<void> {
  const { data, error } = await supabase
    .from('reservations')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select('id');
  if (error) throw error;
  // RLS не повертає помилку, якщо рядок не оновився, тому перевіряємо результат
  if (!data?.length) throw new Error('This reservation can no longer be cancelled.');
}

/* ---------- PROFILE ---------- */

export async function updateMyName(userId: string, name: string): Promise<void> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ name: name.trim() || null })
    .eq('id', userId)
    .select('id');
  if (error) throw error;
  if (!data?.length) throw new Error('Could not save your name.');
}

/* ---------- OWNER APPLICATION ---------- */

export type BookstoreStatus = 'pending' | 'approved' | 'rejected';

export type BookstoreApplication = {
  name: string; neighborhood: string; address: string; description: string;
};

// Повертає slug створеної книгарні (status = 'pending')
export async function applyForBookstore(app: BookstoreApplication): Promise<string> {
  const { data, error } = await supabase.rpc('apply_for_bookstore', {
    p_name: app.name,
    p_neighborhood: app.neighborhood,
    p_address: app.address,
    p_description: app.description,
  });
  // 23505 = unique violation: заявка вже на розгляді (подвійне натискання)
  if (error?.code === '23505') throw new Error('You already have an application under review.');
  if (error) throw error;
  return data as string;
}

export type MyBookstore = {
  id: string; slug: string; name: string; status: BookstoreStatus; createdAt: string;
};

export async function fetchMyBookstores(userId: string): Promise<MyBookstore[]> {
  const { data, error } = await supabase
    .from('bookstores')
    .select('id, slug, name, status, created_at')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as { id: string; slug: string; name: string; status: BookstoreStatus; created_at: string }[])
    .map((r) => ({ id: r.id, slug: r.slug, name: r.name, status: r.status, createdAt: r.created_at }));
}

/* ---------- OWNER DASHBOARD: BOOKS ---------- */

export type ListingStatus = 'available' | 'reserved' | 'sold';

export type NewListing = {
  title: string; author: string; genre: string;
  price: number; language: string; condition: string;
};

// Те саме правило, що й у SQL apply_for_bookstore: "Grande Sertão" -> "grande-sertao"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function findBookBySlug(slug: string): Promise<{ id: string; author: string } | null> {
  const { data, error } = await supabase
    .from('books')
    .select('id, author')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as { id: string; author: string } | null;
}

// Знаходить книгу за slug або створює її. Slug береться з назви (як у сід-даних);
// якщо під ним уже інша книга іншого автора, використовуємо "назва-автор".
async function findOrCreateBook(b: Pick<NewListing, 'title' | 'author' | 'genre'>): Promise<string> {
  const sameAuthor = (author: string) => author.trim().toLowerCase() === b.author.trim().toLowerCase();

  let slug = slugify(b.title) || 'book';
  let existing = await findBookBySlug(slug);
  if (existing && !sameAuthor(existing.author)) {
    slug = slugify(`${b.title} ${b.author}`);
    existing = await findBookBySlug(slug);
  }
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from('books')
    .insert({
      slug, title: b.title.trim(), author: b.author.trim(),
      genre: b.genre.trim() || null, source: 'manual',
    })
    .select('id')
    .single();
  if (error?.code === '23505') {
    // хтось щойно створив цю книгу: беремо її
    const created = await findBookBySlug(slug);
    if (created) return created.id;
  }
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function addListing(bookstoreId: string, l: NewListing): Promise<void> {
  const bookId = await findOrCreateBook(l);
  const { error } = await supabase.from('listings').insert({
    book_id: bookId, bookstore_id: bookstoreId, price: l.price,
    language: l.language.trim() || null, condition: l.condition || null,
  });
  if (error) throw error;
}

export async function updateListing(
  id: string,
  changes: { price: number; status: ListingStatus }
): Promise<void> {
  const { data, error } = await supabase
    .from('listings')
    // власник перевірив примірник, тож оновлюємо "last confirmed"
    .update({ ...changes, last_confirmed_at: new Date().toISOString() })
    .eq('id', id)
    .select('id');
  if (error) throw error;
  if (!data?.length) throw new Error('Could not update this listing.');
}

export async function deleteListing(id: string): Promise<void> {
  const { data, error } = await supabase.from('listings').delete().eq('id', id).select('id');
  if (error) throw error;
  if (!data?.length) throw new Error('Could not delete this listing.');
}

/* ---------- OWNER DASHBOARD: RESERVATIONS ---------- */

type StoreReservationRow = {
  id: string; status: ReservationStatus; created_at: string;
  reader: { name: string | null }[] | null;
  listing: {
    price: number;
    book: { slug: string; title: string; author: string }[];
  }[];
};

export type StoreReservation = {
  id: string; status: ReservationStatus; createdAt: string; price: number;
  // null, якщо RLS не дозволяє власнику читати профіль (див. owner-dashboard.sql)
  readerName: string | null;
  book: { slug: string; title: string; author: string };
};

export async function fetchBookstoreReservations(bookstoreId: string): Promise<StoreReservation[]> {
  const { data, error } = await supabase
    .from('reservations')
    .select('id, status, created_at, reader:profiles(name), listing:listings!inner(price, bookstore_id, book:books(slug, title, author))')
    .eq('listing.bookstore_id', bookstoreId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as StoreReservationRow[]).flatMap((r) => {
    const listing = one(r.listing);
    const book = one(listing?.book);
    if (!listing || !book) return [];
    return [{
      id: r.id, status: r.status, createdAt: r.created_at, price: listing.price,
      readerName: one(r.reader)?.name ?? null, book,
    }];
  });
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<void> {
  const { data, error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id)
    .select('id');
  if (error) throw error;
  if (!data?.length) throw new Error('Could not update this reservation.');
}

/* ---------- FOLLOWS, MESSAGES, PUBLIC COUNTERS ---------- */

export type BookstoreCounts = { followers: number; reserved: number };

// RLS ховає чужі follows і резервації, тому лічильники рахує security definer функція
export async function fetchBookstoreCounts(bookstoreId: string): Promise<BookstoreCounts> {
  const { data, error } = await supabase.rpc('bookstore_public_stats', { p_bookstore: bookstoreId });
  if (error) throw error;
  // bigint приходить числом або рядком, залежно від розміру
  const row = (data as { followers: number | string; reserved: number | string }[])[0];
  return { followers: Number(row?.followers ?? 0), reserved: Number(row?.reserved ?? 0) };
}

export async function fetchIsFollowing(userId: string, bookstoreId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('follows')
    .select('bookstore_id')
    .eq('user_id', userId)
    .eq('bookstore_id', bookstoreId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

export async function followBookstore(userId: string, bookstoreId: string): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .insert({ user_id: userId, bookstore_id: bookstoreId });
  // 23505: вже підписані (наприклад, з іншої вкладки) — це не помилка
  if (error && error.code !== '23505') throw error;
}

export async function unfollowBookstore(userId: string, bookstoreId: string): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('user_id', userId)
    .eq('bookstore_id', bookstoreId);
  if (error) throw error;
}

export async function sendMessage(bookstoreId: string, userId: string, content: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .insert({ bookstore_id: bookstoreId, user_id: userId, content: content.trim() });
  if (error) throw error;
}

export type StoreMessage = {
  id: string; content: string; createdAt: string;
  readerName: string | null;
};

export async function fetchBookstoreMessages(bookstoreId: string): Promise<StoreMessage[]> {
  const { data, error } = await supabase.rpc('bookstore_messages', { p_bookstore: bookstoreId });
  if (error) throw error;
  return (data as { id: string; content: string; created_at: string; reader_name: string | null }[])
    .map((r) => ({ id: r.id, content: r.content, createdAt: r.created_at, readerName: r.reader_name }));
}

/* ---------- OWNER DASHBOARD: RECENTLY ADDED ---------- */

type RecentListingRow = {
  id: string; price: number; created_at: string;
  book: { id: string; slug: string; title: string; author: string; color1: string; color2: string }[];
};

export type RecentListing = {
  id: string; price: number; createdAt: string;
  book: { id: string; slug: string; title: string; author: string; color1: string; color2: string };
};

export async function fetchRecentListings(bookstoreId: string, limit = 20): Promise<RecentListing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('id, price, created_at, book:books(id, slug, title, author, color1, color2)')
    .eq('bookstore_id', bookstoreId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as RecentListingRow[])
    .filter((r) => one(r.book))
    .map((r) => ({ id: r.id, price: r.price, createdAt: r.created_at, book: one(r.book)! }));
}

/* ---------- SEARCH LOG ---------- */

// Захист від подвійного запису: Enter у Navbar веде на /search, який теж логує,
// а StrictMode у dev двічі запускає ефекти. Той самий запит логуємо раз на хвилину.
const recentlyLogged = new Map<string, number>();
const LOG_DEDUPE_MS = 60_000;

// Fire and forget: нічого не повертає й ніколи не кидає помилку
export function logSearch(query: string): void {
  const q = query.trim().replace(/\s+/g, ' ').slice(0, 100);
  if (q.length < 2) return;
  const key = q.toLowerCase();
  const now = Date.now();
  const last = recentlyLogged.get(key);
  if (last !== undefined && now - last < LOG_DEDUPE_MS) return;
  recentlyLogged.set(key, now);

  // лише текст запиту: без user id та інших персональних даних
  supabase
    .from('search_logs')
    .insert({ query: q })
    .then(
      () => {},
      () => {}
    );
}

/* ---------- OWNER DASHBOARD: RECENT SEARCHES ---------- */

export type RecentSearch = { query: string; times: number; matchingBooks: string[] };

export async function fetchRecentSearches(bookstoreId: string): Promise<RecentSearch[]> {
  const { data, error } = await supabase.rpc('bookstore_recent_searches', { p_bookstore: bookstoreId });
  if (error) throw error;
  return (data as { query: string; times: number | string; matching_books: string[] | null }[])
    .map((r) => ({ query: r.query, times: Number(r.times), matchingBooks: r.matching_books ?? [] }));
}

/* ---------- SUPER ADMIN: MODERATION ---------- */

export type ModerationBookstore = {
  id: string; slug: string; name: string; status: BookstoreStatus; createdAt: string;
  neighborhood: string | null; address: string | null; story: string | null;
};

type ModerationRow = {
  id: string; slug: string; name: string; status: BookstoreStatus; created_at: string;
  neighborhood: string | null; address: string | null; story: string | null;
};

// Pending (найстаріші першими, як черга) і нещодавно схвалені (нові першими)
export async function fetchModerationQueue(
  approvedLimit = 10
): Promise<{ pending: ModerationBookstore[]; approved: ModerationBookstore[] }> {
  const columns = 'id, slug, name, status, created_at, neighborhood, address, story';
  const [pendingRes, approvedRes] = await Promise.all([
    supabase.from('bookstores').select(columns).eq('status', 'pending')
      .order('created_at', { ascending: true }),
    supabase.from('bookstores').select(columns).eq('status', 'approved')
      .order('created_at', { ascending: false }).limit(approvedLimit),
  ]);
  if (pendingRes.error) throw pendingRes.error;
  if (approvedRes.error) throw approvedRes.error;
  const map = (r: ModerationRow): ModerationBookstore => ({
    id: r.id, slug: r.slug, name: r.name, status: r.status, createdAt: r.created_at,
    neighborhood: r.neighborhood, address: r.address, story: r.story,
  });
  return {
    pending: (pendingRes.data as ModerationRow[]).map(map),
    approved: (approvedRes.data as ModerationRow[]).map(map),
  };
}

export type Applicant = { name: string | null; email: string | null };

// Лише для pending-книгарень і лише для super_admin (інакше null)
export async function fetchApplicant(bookstoreId: string): Promise<Applicant | null> {
  const { data, error } = await supabase.rpc('bookstore_applicant', { p_bookstore: bookstoreId });
  if (error) throw error;
  const row = (data as { name: string | null; email: string | null }[])[0];
  return row ? { name: row.name, email: row.email } : null;
}

export async function setBookstoreStatus(
  id: string,
  status: Extract<BookstoreStatus, 'approved' | 'rejected'>
): Promise<void> {
  const { data, error } = await supabase
    .from('bookstores')
    .update({ status })
    .eq('id', id)
    .select('id');
  if (error) throw error;
  if (!data?.length) throw new Error('Could not update this bookstore.');
}
