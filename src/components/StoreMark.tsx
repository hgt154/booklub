import type { Bookstore } from '../types';

type Props = {
  store: Pick<Bookstore, 'accent' | 'mark'>;
  sizeClass?: string;
};

export function StoreMark({ store, sizeClass = 'w-10 h-10 text-sm' }: Props) {
  return (
    <span
      className={`${sizeClass} rounded-full flex items-center justify-center font-display text-cream shrink-0`}
      style={{ background: store.accent }}
    >
      {store.mark}
    </span>
  );
}