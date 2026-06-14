import express from 'express';
import session from 'express-session';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import crypto from 'crypto';

const app = express();
app.use(express.json());

// Session (cookie-based)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // set true behind HTTPS
      maxAge: 1000 * 60 * 60 * 2,
    },
  })
);

// SQLite DB
const db = new Database('app.db');

db.exec(`
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Simple login audit trail (not required, but useful)
CREATE TABLE IF NOT EXISTS auth_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  event_type TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Example "some sql" table used by the app after login
CREATE TABLE IF NOT EXISTS palette_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

function seedIfEmpty() {
  const existing = db.prepare('SELECT 1 FROM users LIMIT 1').get();
  if (existing) return;

  const email = 'demo@chroma.local';
  const password = 'demo1234';
  const passwordHash = bcrypt.hashSync(password, 10);

  const info = db.prepare(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)'
  ).run(email, passwordHash);

  db.prepare(
    'INSERT INTO auth_events (user_id, event_type, ip, user_agent) VALUES (?, ?, ?, ?)'
  ).run(info.lastInsertRowid, 'seed', '127.0.0.1', 'seed');

  console.log(`Seeded user: ${email} / ${password}`);
}

seedIfEmpty();

function requireAuth(req, res, next) {
  if (req.session?.userId) return next();
  return res.status(401).json({ ok: false, error: 'Unauthorized' });
}

// Serve static files (front-end)
app.use(express.static('.'));

app.get('/api/me', (req, res) => {
  const userId = req.session?.userId;
  if (!userId) return res.json({ ok: true, user: null });

  const user = db
    .prepare('SELECT id, email, created_at FROM users WHERE id = ?')
    .get(userId);

  res.json({ ok: true, user });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'Missing email/password' });
  }

  const user = db
    .prepare('SELECT id, email, password_hash FROM users WHERE email = ?')
    .get(email);

  if (!user) {
    return res.status(401).json({ ok: false, error: 'Invalid credentials' });
  }

  const ok = bcrypt.compareSync(password, user.password_hash);
  const ip = req.ip;
  const ua = req.headers['user-agent'] || '';

  db.prepare(
    'INSERT INTO auth_events (user_id, event_type, ip, user_agent) VALUES (?, ?, ?, ?)'
  ).run(user.id, ok ? 'login_success' : 'login_failed', ip, ua);

  if (!ok) return res.status(401).json({ ok: false, error: 'Invalid credentials' });

  req.session.userId = user.id;
  res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// Example SQL usage after login
app.post('/api/palette-visit', requireAuth, (req, res) => {
  const { action } = req.body || {};
  const safeAction = typeof action === 'string' && action.trim() ? action.trim().slice(0, 80) : 'view';

  const userId = req.session.userId;

  const stmt = db.prepare(
    'INSERT INTO palette_visits (user_id, action) VALUES (?, ?)'
  );
  stmt.run(userId, safeAction);

  const total = db
    .prepare('SELECT COUNT(*) as c FROM palette_visits WHERE user_id = ?')
    .get(userId).c;

  res.json({ ok: true, totalVisits: total });
});

// Optional: quick admin token endpoint demonstrating crypto
app.get('/api/nonce', requireAuth, (req, res) => {
  const nonce = crypto.randomBytes(16).toString('hex');
  res.json({ ok: true, nonce });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

