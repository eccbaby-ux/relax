import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemModal from './ItemModal';

export default function AdminPage({ authFetch, logout }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null); // null | 'new' | item-object
  const [deleteId, setDeleteId] = useState(null);
  const [filterCat, setFilterCat] = useState('הכל');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    const [itemsRes, catsRes] = await Promise.all([
      fetch('/api/items'),
      fetch('/api/categories'),
    ]);
    setItems(await itemsRes.json());
    setCategories(await catsRes.json());
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (form.id) {
      await authFetch(`/api/items/${form.id}`, { method: 'PUT', body: JSON.stringify(form) });
    } else {
      await authFetch('/api/items', { method: 'POST', body: JSON.stringify(form) });
    }
    await load();
  };

  const handleDelete = async (id) => {
    await authFetch(`/api/items/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    await load();
  };

  const visible = items.filter(i =>
    (filterCat === 'הכל' || i.category === filterCat) &&
    (!search || i.title.includes(search) || i.category.includes(search))
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* Header */}
      <header className="bg-purple-600 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="bg-purple-500 hover:bg-purple-700 rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors"
          >
            ← לאפליקציה
          </button>
          <h1 className="text-xl font-bold">🛠️ פאנל ניהול</h1>
        </div>
        <button
          onClick={logout}
          className="bg-purple-500 hover:bg-purple-700 rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors"
        >
          יציאה
        </button>
      </header>

      <div className="p-4 max-w-5xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600">{items.length}</div>
            <div className="text-sm text-gray-500">סה"כ פריטים</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
            <div className="text-sm text-gray-500">קטגוריות</div>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-purple-500 rounded-2xl p-4 shadow-sm text-center">
            <button
              onClick={() => setModal('new')}
              className="w-full text-white font-bold text-lg active:scale-95 transition-all"
            >
              ➕ הוסף פריט
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש..."
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-right focus:outline-none focus:border-purple-400"
          />
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="border-2 border-gray-200 rounded-xl px-4 py-2.5 text-right focus:outline-none focus:border-purple-400"
          >
            <option value="הכל">כל הקטגוריות</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Items list */}
        <div className="flex flex-col gap-3">
          {visible.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-lg">לא נמצאו פריטים</div>
          )}
          {visible.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
              {/* Image */}
              <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-purple-50 flex items-center justify-center text-3xl">
                {item.image
                  ? <img src={item.image} alt="" className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                  : item.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.emoji}</span>
                  <span className="font-bold text-gray-800 truncate">{item.title}</span>
                </div>
                <div className="text-xs text-purple-600 font-semibold mt-0.5">{item.category}</div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 truncate block hover:text-purple-500 transition-colors"
                  dir="ltr"
                >
                  {item.link}
                </a>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setModal(item)}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="bg-red-50 text-red-500 hover:bg-red-100 rounded-xl px-3 py-2 text-sm font-semibold transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Item Modal */}
      {modal && (
        <ItemModal
          item={modal === 'new' ? null : modal}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-xs w-full">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">למחוק את הפריט?</h3>
            <p className="text-gray-500 mb-6 text-sm">לא ניתן לבטל פעולה זו</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 text-white rounded-xl py-3 font-bold hover:bg-red-600 active:scale-95 transition-all"
              >
                מחק
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-3 font-bold hover:bg-gray-200 active:scale-95 transition-all"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
