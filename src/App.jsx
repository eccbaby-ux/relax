import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import ContentGrid from './components/ContentGrid';
import LoginPage from './admin/LoginPage';
import AdminPage from './admin/AdminPage';
import { useAdmin } from './admin/useAdmin';
import './index.css';

function MainApp() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('הכל');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => setItems(shuffle(data)))
      .catch(() => fetch('/data.json').then(r => r.json()).then(data => setItems(shuffle(data))));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 pb-20">
      <Header onMenuToggle={() => setSidebarOpen(true)} activeCategory={activeCategory} />
      <Sidebar
        isOpen={sidebarOpen}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
        onClose={() => setSidebarOpen(false)}
      />
      <ContentGrid items={items} activeCategory={activeCategory} />
      <BottomNav activeCategory={activeCategory} onSelect={setActiveCategory} />
    </div>
  );
}

function AdminRoute({ token, login, logout, authFetch }) {
  if (!token) return <LoginPage onLogin={login} />;
  return <AdminPage authFetch={authFetch} logout={logout} />;
}

export default function App() {
  const { token, login, logout, authFetch } = useAdmin();

  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/admin" element={<AdminRoute token={token} login={login} logout={logout} authFetch={authFetch} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
