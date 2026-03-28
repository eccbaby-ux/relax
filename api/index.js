import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const DEFAULT_CATEGORIES = [
  'מוזיקה מרגיעה',
  'סרטונים מצחיקים',
  'משחקים פשוטים',
  'נשימות ורוגע',
  'סיפורים',
  'חבר וירטואלי',
];
const ADMIN_TOKEN = 'relax-admin-secret-token';

// ── Auth ──────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: 'סיסמה שגויה' });
  }
});

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token !== ADMIN_TOKEN) return res.status(401).json({ error: 'לא מורשה' });
  next();
}

// ── Items ─────────────────────────────────────────────
const normalizeItem = (item) => ({
  ...item,
  category: typeof item.category === 'object' && item.category !== null
    ? item.category.name
    : item.category,
});

app.get('/api/items', async (req, res) => {
  const { data, error } = await supabase.from('items').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data.map(normalizeItem));
});

app.post('/api/items', requireAuth, async (req, res) => {
  const { data, error } = await supabase.from('items').insert([req.body]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/items/:id', requireAuth, async (req, res) => {
  const { id, ...fields } = req.body;
  const { data, error } = await supabase
    .from('items')
    .update(fields)
    .eq('id', req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/items/:id', requireAuth, async (req, res) => {
  const { error } = await supabase.from('items').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ── Categories ────────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  const { data, error } = await supabase.from('items').select('category');
  if (error) return res.status(500).json({ error: error.message });
  const fromDb = data.map(i =>
    typeof i.category === 'object' && i.category !== null ? i.category.name : i.category
  ).filter(Boolean);
  const cats = [...new Set([...DEFAULT_CATEGORIES, ...fromDb])];
  res.json(cats);
});

export default app;
