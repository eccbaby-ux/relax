import Card from "./Card";

export default function ContentGrid({ items, activeCategory }) {
  const filtered =
    activeCategory === "הכל"
      ? items
      : items.filter((item) => item.category === activeCategory);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <span className="text-6xl mb-4">🔍</span>
        <p className="text-xl font-semibold">לא נמצאו פריטים</p>
      </div>
    );
  }

  return (
    <main className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-3">
      {filtered.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </main>
  );
}
