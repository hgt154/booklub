export type Bookstore = {
  id: string; name: string; neighborhood: string; district: string; address: string;
  dbId?: string;  
  accent: string; mark: string; specialties: string[]; languages: string[];
  atmosphere: string; founded: number; owner: string; ownerRole: string;
  ownerPortrait: string; quote: string; story: string; mission: string;
  timeline: { year: string; text: string }[];
  stats: { books: number; followers: number; eventsHosted: number; reserved: number; recentlyAdded: number };
  hours: [string, string][];
  heroImg: string; gallery: string[]; instagram: string; badge: string;
};

export type Book = {
  id: string; title: string; author: string; genre: string;
  color1: string; color2: string; desc: string;
};

export type Listing = {
  id: string; bookId: string; bookstoreId: string; language: string;
  condition: string; price: number; lastConfirmed: string; distanceKm: number;
};

export type BookEvent = {
  id: string; title: string; type: string; bookstoreId: string;
  date: string; time: string; description: string;
};

export type Club = { id: string; name: string; bookstoreId: string; freq: string; desc: string };
export type Story = { id: string; title: string; bookstoreId: string; img: string; excerpt: string };
export type Walk = { id: string; title: string; stops: string[]; duration: string; img: string; desc: string };
export type Collection = { id: string; name: string; color: string; count: number };