const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(`
  CREATE TABLE wm_users(
    _id INTEGER PRIMARY KEY, 
    created_at INTEGER DEFAULT (unixepoch('now', 'subsec') * 1000), 
    email TEXT, 
    password TEXT, 
    username TEXT, 
    profile_image TEXT,
    account_status TEXT DEFAULT ('pending')
    );
  `);
  db.run(`
  CREATE TABLE account_confirmation(
    id INTEGER PRIMARY KEY, 
    user_id INTEGER,
    token TEXT,
    expires INTEGER DEFAULT (unixepoch('now') + 86400)
    );
  `);
  db.run(`
  CREATE TABLE password_reset(
    id INTEGER PRIMARY KEY, 
    user_id INTEGER,
    token TEXT,
    expires INTEGER DEFAULT (unixepoch('now') + 86400)
    );
  `);
});

module.exports = db;
