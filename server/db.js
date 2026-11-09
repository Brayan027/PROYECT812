const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize clean tables
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER,
    branch_type TEXT DEFAULT 'Principal',
    name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'EN PROCESO',
    status_color TEXT DEFAULT '#eab308',
    progress INTEGER DEFAULT 0,
    visual_notes TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    priority TEXT DEFAULT 'MEDIA',
    order_num INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY(parent_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS project_modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'ACTIVO',
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    due_date TEXT,
    priority TEXT DEFAULT 'MEDIA',
    status TEXT DEFAULT 'PENDIENTE',
    completed_at TEXT,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    date TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT DEFAULT '',
    hours_spent REAL DEFAULT 0,
    type TEXT DEFAULT 'avance',
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS quick_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    title TEXT DEFAULT '',
    content TEXT NOT NULL,
    color TEXT DEFAULT '#fef08a',
    pinned INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE SET NULL
  );
`);

module.exports = db;
