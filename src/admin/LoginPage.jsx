import { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(password);
    } catch {
      setError('סיסמה שגויה, נסה שוב');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h1 className="text-2xl font-bold text-purple-800 mb-6">כניסת מנהל</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמה"
            className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-lg text-right focus:outline-none focus:border-purple-500"
            autoFocus
          />

          {error && (
            <p className="text-red-500 text-sm font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="bg-purple-500 text-white rounded-xl py-3 text-lg font-bold hover:bg-purple-600 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? '...' : 'כניסה'}
          </button>
        </form>
      </div>
    </div>
  );
}
