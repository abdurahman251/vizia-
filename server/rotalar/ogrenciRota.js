// =============================
// 🎓 ogrenciRota.js
// =============================
import express from "express";
import db from "../yapilandirma/veritabani.js";

const router = express.Router();

/* ============================================================
   ✅ SAĞLIK KONTROLÜ
   ============================================================ */
router.get("/saglik", (req, res) => {
  res.json({ modul: "ogrenci", durum: "calisiyor" });
});

/* ============================================================
   🧾 ÖĞRENCİ KAYIT (Admin onaylı sistem)
   ============================================================ */
router.post("/kayit", async (req, res) => {
  try {
    const { adsoyad, email, sifre } = req.body;

    // 🧠 Zorunlu alan kontrolü
    if (!adsoyad || !email || !sifre) {
      return res.status(400).json({ hata: "Tüm alanlar gereklidir." });
    }

    // 📧 Aynı e-posta zaten varsa reddet
    const mevcut = await db.get("SELECT * FROM ogrenciler WHERE email = ?", [email]);
    if (mevcut) {
      return res.status(400).json({ hata: "Bu e-posta zaten kayıtlı." });
    }

    // 🆕 Yeni öğrenci ekle (henüz admin tarafından onaylanmamış)
    await db.run(
      "INSERT INTO ogrenciler (adsoyad, email, sifre, dogrulandi) VALUES (?, ?, ?, 0)",
      [adsoyad, email, sifre]
    );

    // 🎉 Başarılı yanıt
    res.json({
      mesaj: "Kayıt başarılı! Admin onayı bekleniyor.",
    });
  } catch (err) {
    console.error("🔥 Kayıt hatası:", err.message);
    res.status(500).json({ hata: "Sunucu hatası oluştu." });
  }
});

/* ============================================================
   🔐 ÖĞRENCİ GİRİŞ (Sadece onaylı kullanıcılar)
   ============================================================ */
router.post("/giris", async (req, res) => {
  try {
    const { email, sifre } = req.body;

    if (!email || !sifre) {
      return res.status(400).json({ hata: "E-posta ve şifre gereklidir." });
    }

    // 🧠 Öğrenciyi bul
    const ogrenci = await db.get(
      "SELECT * FROM ogrenciler WHERE email = ? AND sifre = ?",
      [email, sifre]
    );

    if (!ogrenci) {
      return res.status(404).json({ hata: "Geçersiz e-posta veya şifre." });
    }

    // 🔐 Onaylanmamış hesap engeli
    if (ogrenci.dogrulandi === 0) {
      return res
        .status(403)
        .json({ hata: "Hesabınız henüz admin tarafından onaylanmadı." });
    }

    // 🎯 Başarılı giriş
    res.json({
      mesaj: "Giriş başarılı.",
      ogrenci: {
        id: ogrenci.id,
        adsoyad: ogrenci.adsoyad,
        email: ogrenci.email,
      },
    });
  } catch (err) {
    console.error("🔥 Giriş hatası:", err.message);
    res.status(500).json({ hata: "Sunucu hatası oluştu." });
  }
});

export default router;
