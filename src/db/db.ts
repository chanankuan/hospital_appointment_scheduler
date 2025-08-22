import path from "path";
import Database, { type Database as DatabaseType } from "better-sqlite3";

export const db: DatabaseType = new Database(path.resolve("data/database.db"), {
  verbose: console.log,
});
db.pragma("journal_mode = WAL");
