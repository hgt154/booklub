import type { Book } from '../types';

type Props = {
  book: Book;
  size?: 'normal' | 'large';
};

export function BookCover({ book, size = 'normal' }: Props) {
  const large = size === 'large';

  return (
    <div
      className={`book-cover w-full ${large ? 'p-6' : 'p-3'}`}
      style={{ background: `linear-gradient(155deg, ${book.color1}, ${book.color2})` }}
    >
      <span className="spine-line" />
      <div className="relative z-10 text-cream">
        <p className={`font-display leading-tight ${large ? 'text-xl' : 'text-[13px]'}`}>
          {book.title}
        </p>
        <p className={`uppercase tracking-wide opacity-70 mt-1 ${large ? 'text-sm' : 'text-[10px]'}`}>
          {book.author}
        </p>
      </div>
    </div>
  );
}