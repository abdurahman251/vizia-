import db from "../yapilandirma/veritabani.js";

// ✅ Sağlık kontrolü
export function saglik(req, res) {
  res.json({ modül: "yonetici", durum: "calisiyor" });
}

// ✅ Bekleyen öğrencileri listele
export async function listeleOgrenciler(req, res) {
  try {
    const bekleyenler = await db.all(
      "SELECT id, adsoyad, email, dogrulandi FROM ogrenciler ORDER BY id DESC"
    );
    res.json(bekleyenler);
  } catch (err) {
    console.error("🔥 Listeleme hatası:", err.message);
    res.status(500).json({ hata: "Öğrenciler listelenemedi." });
  }
}

// ✅ Öğrenciyi onayla
export async function onaylaOgrenci(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ hata: "Öğrenci ID gerekli." });
    }

    const ogrenci = await db.get("SELECT * FROM ogrenciler WHERE id = ?", [id]);
    if (!ogrenci) {
      return res.status(404).json({ hata: "Öğrenci bulunamadı." });
    }

    await db.run("UPDATE ogrenciler SET dogrulandi = 1 WHERE id = ?", [id]);
    res.json({ mesaj: `✅ ${ogrenci.adsoyad} başarıyla onaylandı.` });
  } catch (err) {
    console.error("🔥 Onay hatası:", err.message);
    res.status(500).json({ hata: "Öğrenci onaylanamadı." });
  }
}
