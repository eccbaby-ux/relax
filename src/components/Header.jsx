import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuToggle, activeCategory }) {
  const navigate = useNavigate();
  const title = activeCategory === "הכל" ? "🌈 רוגע" : activeCategory;

  return (
    <header className="bg-purple-500 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/admin')}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-purple-600 active:bg-purple-700 transition-colors text-lg flex-shrink-0 opacity-70 hover:opacity-100"
          aria-label="כניסת מנהל"
          title="כניסת מנהל"
        >
          🔐
        </button>
      </div>

      <h1 className="text-xl font-bold tracking-wide truncate absolute left-1/2 -translate-x-1/2">
        {title}
      </h1>

      <button
        onClick={onMenuToggle}
        className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-purple-600 active:bg-purple-700 transition-colors text-2xl flex-shrink-0"
        aria-label="פתח תפריט"
      >
        ☰
      </button>
    </header>
  );
}
