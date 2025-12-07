// =============================
// server/rotalar/ringRota.js
// =============================
import express from "express";
import db from "../yapilandirma/veritabani.js";

const router = express.Router();

/* ============================================================
   🔹 TÜM RİNG SAATLERİNİ GETİR
   ============================================================ */
router.get("/", async (req, res) => {
  try {
    // sadece mevcut kolonlar: id, yon, saat
    const veri = await db.all("SELECT id, yon, saat FROM ring_saatleri ORDER BY yon, saat");
    res.json(veri);
  } catch (err) {
    console.error("🔥 Veri çekme hatası:", err.message);
    res.status(500).json({ hata: "Veriler alınamadı." });
  }
});

/* ============================================================
   ➕ YENİ RİNG SAATİ EKLE
   ============================================================ */
router.post("/ekle", async (req, res) => {
  try {
    const { yon, saat } = req.body;
    if (!yon || !saat)
      return res.status(400).json({ hata: "Yön ve saat zorunlu." });

    await db.run("INSERT INTO ring_saatleri (yon, saat) VALUES (?, ?)", [
      yon,
      saat,
    ]);
    res.json({ mesaj: "Yeni ring saati eklendi." });
  } catch (err) {
    console.error("🔥 Ekleme hatası:", err.message);
    res.status(500).json({ hata: "Ekleme başarısız." });
  }
});

/* ============================================================
   ❌ RİNG SAATİ SİL
   ============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.run("DELETE FROM ring_saatleri WHERE id = ?", [id]);
    res.json({ mesaj: "Kayıt silindi." });
  } catch (err) {
    console.error("🔥 Silme hatası:", err.message);
    res.status(500).json({ hata: "Silme başarısız." });
  }
});

/* ============================================================
   ✏️ RİNG SAATİ GÜNCELLE
   ============================================================ */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { yon, saat } = req.body;
    await db.run(
      "UPDATE ring_saatleri SET yon = ?, saat = ? WHERE id = ?",
      [yon, saat, id]
    );
    res.json({ mesaj: "Güncelleme başarılı." });
  } catch (err) {
    console.error("🔥 Güncelleme hatası:", err.message);
    res.status(500).json({ hata: "Güncelleme başarısız." });
  }
});

export default router;
