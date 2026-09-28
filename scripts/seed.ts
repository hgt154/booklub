import ws from 'ws';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
  BOOKSTORES, BOOKS, LISTINGS, EVENTS, CLUBS, STORIES, WALKS,
} from '../src/data';

config({ path: '.env.seed.local' });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { realtime: { transport: ws as never } }
);

function check<T>(res: { data: T; error: { message: string } | null }, label: string): T {
  if (res.error) throw new Error(`${label}: ${res.error.message}`);
  console.log(`✓ ${label}`);
  return res.data;
}

// Mock dates are "Jul 24" without a year and now lie in the past,
// so we put them in 2026 and shift them 3 months ahead.
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function toDate(s: string) {
  const [m, d] = s.split(' ');
  return new Date(Date.UTC(2026, MONTHS.indexOf(m) + 3, Number(d))).toISOString().slice(0, 10);
}

async function clear(table: string) {
  check(await supabase.from(table).delete().not('id', 'is', null), `clear ${table}`);
}

async function main() {
  // 1. bookstores (upsert by slug, so re-running does not duplicate)
  const stores = check(
    await supabase
      .from('bookstores')
      .upsert(
        BOOKSTORES.map((s) => ({
          slug: s.id, status: 'approved', name: s.name,
          neighborhood: s.neighborhood, district: s.district, address: s.address,
          accent: s.accent, mark: s.mark, specialties: s.specialties,
          languages: s.languages, atmosphere: s.atmosphere, founded: s.founded,
          owner_name: s.owner, owner_role: s.ownerRole, owner_portrait: s.ownerPortrait,
          quote: s.quote, story: s.story, mission: s.mission,
          timeline: s.timeline, hours: s.hours, hero_img: s.heroImg,
          gallery: s.gallery, instagram: s.instagram, badge: s.badge,
        })),
        { onConflict: 'slug' }
      )
      .select('id, slug'),
    'bookstores'
  );
  const storeId = Object.fromEntries(stores.map((s) => [s.slug, s.id]));

  // 2. books
  const books = check(
    await supabase
      .from('books')
      .upsert(
        BOOKS.map((b) => ({
          slug: b.id, title: b.title, author: b.author, genre: b.genre,
          description: b.desc, color1: b.color1, color2: b.color2, source: 'manual',
        })),
        { onConflict: 'slug' }
      )
      .select('id, slug'),
    'books'
  );
  const bookId = Object.fromEntries(books.map((b) => [b.slug, b.id]));

  // 3. listings (cleared and re-inserted; this also removes reservations)
  await clear('listings');
  check(
    await supabase.from('listings').insert(
      LISTINGS.map((l) => ({
        book_id: bookId[l.bookId], bookstore_id: storeId[l.bookstoreId],
        price: l.price, condition: l.condition, language: l.language, status: 'available',
      }))
    ),
    'listings'
  );

  // 4. events, clubs, stories, walks
  await clear('events');
  check(
    await supabase.from('events').insert(
      EVENTS.map((e) => ({
        bookstore_id: storeId[e.bookstoreId], title: e.title, type: e.type,
        description: e.description, event_date: toDate(e.date), event_time: e.time,
      }))
    ),
    'events'
  );

  await clear('clubs');
  check(
    await supabase.from('clubs').insert(
      CLUBS.map((c) => ({
        bookstore_id: storeId[c.bookstoreId], name: c.name, freq: c.freq, description: c.desc,
      }))
    ),
    'clubs'
  );

  await clear('stories');
  check(
    await supabase.from('stories').insert(
      STORIES.map((s) => ({
        bookstore_id: storeId[s.bookstoreId], title: s.title, img: s.img, excerpt: s.excerpt,
      }))
    ),
    'stories'
  );

  await clear('walks');
  check(
    await supabase.from('walks').insert(
      WALKS.map((w) => ({
        title: w.title, stops: w.stops, duration: w.duration, img: w.img, description: w.desc,
      }))
    ),
    'walks'
  );

  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});