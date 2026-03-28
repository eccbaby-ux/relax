import { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

const EMOJIS = ['🎵','🎶','🎹','🌧️','🌊','🐦','😸','🐱','🐼','🐶','🎬','🫧','🎨','🧩','🌈','🎮','🏃','🧘','🌸','🌳','🌙','🤖','📖','😂'];

const EMPTY = { title: '', category: '', description: '', link: '', image: '', emoji: '🎵' };

export default function ItemModal({ item, categories, onSave, onClose }) {
  const [form, setForm] = useState(item ? { ...item } : { ...EMPTY });
  const [showNewCat, setShowNewCat] = useState(false);
  const [imagePreview, setImagePreview] = useState(item?.image || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      set('image', data.publicUrl);
      setImagePreview(data.publicUrl);
    } catch (err) {
      setError('שגיאה בהעלאת התמונה: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.link) {
      setError('שם, קטגוריה וקישור הם שדות חובה');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      setError('שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100">
          <h2 className="text-xl font-bold text-purple-800">
            {item ? '✏️ עריכת פריט' : '➕ פריט חדש'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

          {/* Emoji picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">אמוג'י</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => set('emoji', e)}
                  className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center transition-all
                    ${form.emoji === e ? 'bg-purple-500 shadow-md scale-110' : 'bg-purple-50 hover:bg-purple-100'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">שם הפריט *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="למשל: פסנתר שליו"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-right focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">קטגוריה *</label>
            <select
              value={showNewCat ? '__new__' : form.category}
              onChange={e => {
                if (e.target.value === '__new__') {
                  setShowNewCat(true);
                  set('category', '');
                } else {
                  setShowNewCat(false);
                  set('category', e.target.value);
                }
              }}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-right focus:outline-none focus:border-purple-400 mb-2"
            >
              <option value="">בחר קטגוריה...</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="__new__">+ קטגוריה חדשה</option>
            </select>

            {showNewCat && (
              <input
                type="text"
                value={form.category}
                onChange={e => set('category', e.target.value)}
                placeholder="שם קטגוריה חדשה..."
                autoFocus
                className="w-full border-2 border-purple-300 rounded-xl px-4 py-2.5 text-right focus:outline-none focus:border-purple-500"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">תיאור קצר</label>
            <input
              type="text"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="משפט קצר שמתאר את הפריט"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-right focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">קישור (URL) *</label>
            <input
              type="url"
              value={form.link}
              onChange={e => set('link', e.target.value)}
              placeholder="https://..."
              dir="ltr"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-left focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">תמונה</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={form.image}
                onChange={e => { set('image', e.target.value); setImagePreview(e.target.value); }}
                placeholder="https://... או העלה מהמחשב ←"
                dir="ltr"
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-left focus:outline-none focus:border-purple-400"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className="bg-purple-100 text-purple-700 rounded-xl px-4 py-2.5 font-semibold hover:bg-purple-200 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {uploading ? '⏳' : '📁 העלה'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="תצוגה מקדימה"
                className="w-full h-32 object-cover rounded-xl border border-purple-100"
                onError={e => e.target.style.display = 'none'}
              />
            )}
          </div>

          {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-purple-500 text-white rounded-xl py-3 font-bold text-lg hover:bg-purple-600 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? '...' : '💾 שמור'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-3 font-bold text-lg hover:bg-gray-200 active:scale-95 transition-all"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
