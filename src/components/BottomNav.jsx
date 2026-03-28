const CATEGORIES = [
  { name: "הכל", emoji: "✨" },
  { name: "מוזיקה מרגיעה", emoji: "🎵" },
  { name: "סרטונים מצחיקים", emoji: "😂" },
  { name: "משחקים פשוטים", emoji: "🎮" },
  { name: "נשימות ורוגע", emoji: "🌈" },
  { name: "סיפורים", emoji: "📖" },
  { name: "חבר וירטואלי", emoji: "🤖" },
];

export default function BottomNav({ activeCategory, onSelect }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-purple-100 shadow-2xl z-40 flex overflow-x-auto scrollbar-hide"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {CATEGORIES.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={`flex flex-col items-center justify-center flex-shrink-0 px-3 py-2 min-w-[64px] h-16 text-[11px] font-semibold transition-all active:scale-90
            ${activeCategory === cat.name
              ? "text-purple-600 border-t-2 border-purple-500 bg-purple-50"
              : "text-gray-400"}`}
        >
          <span className="text-2xl leading-none">{cat.emoji}</span>
          <span className="mt-1 leading-tight text-center w-full truncate px-1">
            {cat.name === "מוזיקה מרגיעה" ? "מוזיקה" :
             cat.name === "סרטונים מצחיקים" ? "סרטונים" :
             cat.name === "משחקים פשוטים" ? "משחקים" :
             cat.name === "נשימות ורוגע" ? "נשימות" :
             cat.name === "חבר וירטואלי" ? "חבר AI" :
             cat.name}
          </span>
        </button>
      ))}
    </nav>
  );
}
