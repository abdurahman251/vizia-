import pg from 'pg';
import dotenv from 'dotenv';

// .env dosyasını oku
dotenv.config();

const { Pool } = pg;

// .env dosyasından DATABASE_URL'yi al
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ HATA: DATABASE_URL .env dosyasında bulunamadı!");
    process.exit(1);
}

// SSL ayarını ekliyoruz (Supabase bulut bağlantısı için gerekli)
const db = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

// Bağlantıyı Test Et
db.connect()
    .then(() => console.log("✅ Supabase (PostgreSQL) Veritabanına Bağlandı! 🚀"))
    .catch(err => console.error("🔥 Veritabanı Bağlantı Hatası:", err.message));

// --- SQLITE UYUMLULUK KATMANI ---
// Kodlarımız SQLite'a göre yazıldığı için (db.get, db.all, db.run),
// PostgreSQL'i taklit eden yardımcı fonksiyonlar ekliyoruz.

// 1. db.all -> SELECT sorguları (Çoklu veri)
db.all = async (text, params) => {
    try {
        // Parametre yoksa boş dizi ata
        if (!params) params = [];
        
        // SQLite '?' kullanır, Postgres '$1, $2' kullanır. Dönüştürüyoruz.
        let paramCount = 1;
        const pgText = text.replace(/\?/g, () => `$${paramCount++}`);
        
        const res = await db.query(pgText, params);
        return res.rows;
    } catch (err) {
        console.error("SQL Hatası (all):", text, err.message);
        throw err;
    }
};

// 2. db.get -> Tek satır veri çekme
db.get = async (text, params) => {
    try {
        if (!params) params = [];
        
        let paramCount = 1;
        const pgText = text.replace(/\?/g, () => `$${paramCount++}`);
        
        const res = await db.query(pgText, params);
        return res.rows[0]; // Sadece ilk satırı döndür
    } catch (err) {
        console.error("SQL Hatası (get):", text, err.message);
        throw err;
    }
};

// 3. db.run -> INSERT, UPDATE, DELETE işlemleri
db.run = async (text, params) => {
    try {
        if (!params) params = [];
        
        let paramCount = 1;
        const pgText = text.replace(/\?/g, () => `$${paramCount++}`);
        
        const res = await db.query(pgText, params);
        // SQLite'daki gibi changes (etkilenen satır) döndür
        // ve eklenen ID'yi döndür (id varsa)
        return { 
            changes: res.rowCount,
            lastID: res.rows.length > 0 ? res.rows[0].id : null 
        }; 
    } catch (err) {
        console.error("SQL Hatası (run):", text, err.message);
        throw err;
    }
};

export default db;