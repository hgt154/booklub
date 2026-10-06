import { supabase } from './supabaseClient';
import type { Bookstore } from '../types';

type BookstoreRow = {
  id: string;
  slug: string; name: string; neighborhood: string; district: string; address: string;
  accent: string; mark: string; specialties: string[]; languages: string[];
  atmosphere: string; founded: number; owner_name: string; owner_role: string;
  owner_portrait: string; quote: string; story: string; mission: string;
  timeline: { year: string; text: string }[]; hours: string[][];
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

export async function fetchBookstores(): Promise<Bookstore[]> {
  const { data, error } = await supabase.from('bookstores').select(SELECT).order('name');
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
  status: string;
  lastConfirmed: string;
  book: { id: string; title: string; author: string; color1: string; color2: string };
};

type ListingRow = {
  id: string; price: number; condition: string; language: string; status: string;
  last_confirmed_at: string;
  // Supabase повертає вкладений join як масив, навіть якщо зв'язок один-до-одного
  book: { id: string; title: string; author: string; color1: string; color2: string }[];
};

export async function fetchListingsByBookstore(bookstoreId: string): Promise<ListingWithBook[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('id, price, condition, language, status, last_confirmed_at, book:books(id, title, author, color1, color2)')
    .eq('bookstore_id', bookstoreId)
    .order('last_confirmed_at', { ascending: false });

  if (error) throw error;

  return (data as ListingRow[])
    .filter((r) => r.book[0])
    .map((r) => ({
      id: r.id, price: r.price, condition: r.condition, language: r.language,
      status: r.status, lastConfirmed: r.last_confirmed_at,
      book: r.book[0],
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
    .filter((r) => r.bookstore[0])
    .map((r) => ({
      id: r.id, title: r.title, type: r.type, description: r.description,
      date: r.event_date, time: r.event_time, bookstore: r.bookstore[0],
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
    .filter((r) => r.bookstore[0])
    .map((r) => ({
      id: r.id, name: r.name, freq: r.freq, description: r.description,
      bookstore: r.bookstore[0],
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
    .filter((r) => r.bookstore[0])
    .map((r) => ({
      id: r.id, title: r.title, img: r.img, excerpt: r.excerpt,
      bookstore: r.bookstore[0],
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
      'id, price, condition, language, status, last_confirmed_at, ' +
      'book:books!inner(slug), ' +
      'bookstore:bookstores(slug, name, neighborhood, accent, mark)'
    )
    .eq('book.slug', bookSlug)
    .order('price');
  if (error) throw error;
  return (data as BookListingRow[])
    .filter((r) => r.bookstore[0])
    .map((r) => ({
      id: r.id, price: r.price, condition: r.condition, language: r.language,
      status: r.status, lastConfirmed: r.last_confirmed_at, bookstore: r.bookstore[0],
    }));
}

/* ---------- SEARCH ---------- */

export type SearchListing = {
  id: string; price: number; condition: string; language: string; status: string;
  lastConfirmed: string;
  book: { id: string; title: string; author: string; color1: string; color2: string };
  bookstore: { slug: string; name: string; neighborhood: string; accent: string; mark: string };
};

type SearchListingRow = {
  id: string; price: number; condition: string; language: string; status: string;
  last_confirmed_at: string;
  book: { id: string; title: string; author: string; color1: string; color2: string }[];
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
      'id, price, condition, language, status, last_confirmed_at, ' +
      'book:books(id, title, author, color1, color2), ' +
      'bookstore:bookstores(slug, name, neighborhood, accent, mark)'
    )
    .in('book_id', bookIds)
    .order('price');
  if (error) throw error;

  return (data as SearchListingRow[])
    .filter((r) => r.book[0] && r.bookstore[0])
    .map((r) => ({
      id: r.id, price: r.price, condition: r.condition, language: r.language,
      status: r.status, lastConfirmed: r.last_confirmed_at,
      book: r.book[0], bookstore: r.bookstore[0],
    }));
}

/* ---------- HOME EXTRAS ---------- */

type RecentBookRow = {
  book_id: string;
  book: { id: string; title: string; author: string; color1: string; color2: string }[];
  bookstore: { slug: string; name: string }[];
};

export type RecentBook = {
  book: { id: string; title: string; author: string; color1: string; color2: string };
  bookstore: { slug: string; name: string };
};

export async function fetchRecentBooks(limit = 10): Promise<RecentBook[]> {
  const { data, error } = await supabase
    .from('listings')
    .select(
      'book_id, book:books(id, title, author, color1, color2), bookstore:bookstores(slug, name)'
    )
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as RecentBookRow[])
    .filter((r) => r.book[0] && r.bookstore[0])
    .map((r) => ({ book: r.book[0], bookstore: r.bookstore[0] }));
}