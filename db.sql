-- SQLite schema + sample queries for the login + palette-visit demo

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Auth event audit trail
CREATE TABLE IF NOT EXISTS auth_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  event_type TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Example "some sql" business table written after login
CREATE TABLE IF NOT EXISTS palette_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Queries used by the server

-- Find user by email (for login)
SELECT id, email, password_hash
FROM users
WHERE email = ?;

-- Insert an auth event
INSERT INTO auth_events (user_id, event_type, ip, user_agent)
VALUES (?, ?, ?, ?);

-- Insert a palette visit
INSERT INTO palette_visits (user_id, action)
VALUES (?, ?);

-- Count visits for user
SELECT COUNT(*) as c
FROM palette_visits
WHERE user_id = ?;

