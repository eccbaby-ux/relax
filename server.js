import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
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
app.get('/api/items', async (req, res) => {
  const { data, error } = await supabase.from('items').select('*').order('id');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
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
  const cats = [...new Set(data.map(i => i.category))];
  res.json(cats);
});

// ── Static (production) ───────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server → port ${PORT} | Supabase connected`));
