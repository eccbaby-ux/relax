import { useState, useEffect } from 'react';

export function useAdmin() {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '');

  const login = async (password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) throw new Error('סיסמה שגויה');
    const { token } = await res.json();
    localStorage.setItem('admin_token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
  };

  const authFetch = (url, options = {}) =>
    fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

  return { token, login, logout, authFetch };
}
