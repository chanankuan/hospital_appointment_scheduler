import path from "path";
import Database from "better-sqlite3";

export const db = new Database(path.resolve("data/database.db"), {
  verbose: console.log,
});
db.pragma("journal_mode = WAL");

console.log("Starting migration");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name   TEXT NOT NULL,
      last_name    TEXT NOT NULL,
      email        TEXT NOT NULL UNIQUE,
      phone_number TEXT NOT NULL UNIQUE,
      password     TEXT,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      deleted_at   DATETIME DEFAULT NULL,
      is_verified INTEGER DEFAULT 0 NOT NULL CHECK (is_verified IN (0,1))
  );
`);

db.close();
console.log("Migration complete!");
