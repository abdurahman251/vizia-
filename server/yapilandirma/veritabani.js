import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Veritabanı dosyasının yolu
const dbPath = path.join(__dirname, "../veri/okulVeritabani.sqlite3.db");

const dbPromise = await open({
  filename: dbPath,
  driver: sqlite3.Database,
});

export default dbPromise;
