const CATEGORIES = [
  { name: "הכל", emoji: "✨" },
  { name: "מוזיקה מרגיעה", emoji: "🎵" },
  { name: "סרטונים מצחיקים", emoji: "😂" },
  { name: "משחקים פשוטים", emoji: "🎮" },
  { name: "נשימות ורוגע", emoji: "🌈" },
  { name: "סיפורים", emoji: "📖" },
  { name: "חבר וירטואלי", emoji: "🤖" },
];

export default function Sidebar({ isOpen, activeCategory, onSelect, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-purple-500 text-white">
          <span className="text-xl font-bold">קטגוריות</span>
          <button
            onClick={onClose}
            className="text-2xl leading-none w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-600 transition-colors"
            aria-label="סגור תפריט"
          >
            ✕
          </button>
        </div>

        <ul className="p-4 space-y-2 overflow-y-auto">
          {CATEGORIES.map((cat) => (
            <li key={cat.name}>
              <button
                onClick={() => { onSelect(cat.name); onClose(); }}
                className={`w-full text-right px-4 py-4 rounded-2xl text-lg font-semibold transition-colors active:scale-95
                  ${activeCategory === cat.name
                    ? "bg-purple-500 text-white shadow-md"
                    : "bg-purple-50 text-purple-800 hover:bg-purple-100"}`}
              >
                <span className="ml-2">{cat.emoji}</span>
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
