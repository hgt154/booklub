type Props = {
  items: string[];
  limit?: number;
};

export function TagList({ items, limit }: Props) {
  const shown = limit ? items.slice(0, limit) : items;

  return (
    <>
      {shown.map((item) => (
        <span
          key={item}
          className="text-[11px] font-medium px-3 py-1 rounded-full bg-forest/10 text-forest border border-forest/15"
        >
          {item}
        </span>
      ))}
    </>
  );
}