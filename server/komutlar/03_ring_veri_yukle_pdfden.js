// ==============================
// 03_ring_veri_yukle_pdfden.js
// ==============================
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

// 📍 Geçerli dosya yolu ayarı
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📘 Veritabanı bağlantısı (senin dosya yapına göre)
const dbPath = path.join(__dirname, "../veri/okulVeritabani.sqlite3.db");
const db = new sqlite3.Database(dbPath);

console.log("⏳ Ring saatleri veritabanına ekleniyor...");

// 🧹 1. Eski verileri temizle
db.run("DELETE FROM ring_saatleri", (err) => {
  if (err) return console.error("🧨 Tablo temizlenemedi:", err.message);

  console.log("🧼 Eski veriler silindi, yeni veriler ekleniyor...");

  // 🚌 2. Gerçek ring saatleri
  const saatler = [
    // === Dudullu → Kampüs ===
    { yon: "Dudullu Metro → Kampüs", saat: "08:15" },
    { yon: "Dudullu Metro → Kampüs", saat: "09:15" },
    { yon: "Dudullu Metro → Kampüs", saat: "12:15" },
    { yon: "Dudullu Metro → Kampüs", saat: "13:15" },
    { yon: "Dudullu Metro → Kampüs", saat: "14:05" },
    { yon: "Dudullu Metro → Kampüs", saat: "16:15" },
    { yon: "Dudullu Metro → Kampüs", saat: "17:15" },
    { yon: "Dudullu Metro → Kampüs", saat: "18:15" },
    { yon: "Dudullu Metro → Kampüs", saat: "20:15" },
    { yon: "Dudullu Metro → Kampüs", saat: "21:15" },

    // === Kampüs → Dudullu ===
    { yon: "Kampüs → Dudullu Metro", saat: "09:05" },
    { yon: "Kampüs → Dudullu Metro", saat: "10:05" },
    { yon: "Kampüs → Dudullu Metro", saat: "13:05" },
    { yon: "Kampüs → Dudullu Metro", saat: "14:05" },
    { yon: "Kampüs → Dudullu Metro", saat: "15:05" },
    { yon: "Kampüs → Dudullu Metro", saat: "17:05" },
    { yon: "Kampüs → Dudullu Metro", saat: "18:05" },
    { yon: "Kampüs → Dudullu Metro", saat: "19:15" },
    { yon: "Kampüs → Dudullu Metro", saat: "21:15" },

    // === Maltepe Huzurevi Metro → Kampüs ===
    { yon: "Maltepe Metro → Kampüs", saat: "08:00" },
    { yon: "Maltepe Metro → Kampüs", saat: "09:00" },
    { yon: "Maltepe Metro → Kampüs", saat: "12:00" },
    { yon: "Maltepe Metro → Kampüs", saat: "14:00" },
    { yon: "Maltepe Metro → Kampüs", saat: "15:00" },
    { yon: "Maltepe Metro → Kampüs", saat: "16:00" },
    { yon: "Maltepe Metro → Kampüs", saat: "17:00" },
    { yon: "Maltepe Metro → Kampüs", saat: "21:15" },

    // === Kampüs → Maltepe Metro ===
    { yon: "Kampüs → Maltepe Metro", saat: "09:00" },
    { yon: "Kampüs → Maltepe Metro", saat: "12:15" },
    { yon: "Kampüs → Maltepe Metro", saat: "14:15" },
    { yon: "Kampüs → Maltepe Metro", saat: "15:15" },
    { yon: "Kampüs → Maltepe Metro", saat: "17:15" },
    { yon: "Kampüs → Maltepe Metro", saat: "21:15" },
  ];

  // 💾 3. Tüm verileri ekle
  const stmt = db.prepare("INSERT INTO ring_saatleri (yon, saat) VALUES (?, ?)");
  for (const s of saatler) {
    stmt.run(s.yon, s.saat);
  }
  stmt.finalize();

  console.log(`✅ ${saatler.length} ring saati başarıyla eklendi!`);
  db.close();
});
