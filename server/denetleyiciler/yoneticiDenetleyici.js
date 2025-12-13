// =============================
// server/denetleyiciler/yoneticiDenetleyici.js
// =============================
import db from "../yapilandirma/veritabani.js";
// bcrypt importu kaldırıldı. Şifreler artık açık metin olarak işlenir.

// ✅ Sağlık kontrolü
export function saglik(req, res) {
  res.json({ modül: "yonetici", durum: "calisiyor" });
}

// ✅ Bekleyen öğrencileri listele
export async function listeleOgrenciler(req, res) {
  try {
    const bekleyenler = await db.all(
      "SELECT id, adsoyad, email FROM ogrenciler WHERE dogrulandi = 0 ORDER BY id DESC"
    );
    res.json(bekleyenler);
  } catch (err) {
    console.error("🔥 Listeleme hatası:", err.message);
    res.status(500).json({ hata: "Öğrenciler listelenemedi." });
  }
}

// ============================================================
// Öğrenciyi onayla
// ============================================================
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

    const result = await db.run("UPDATE ogrenciler SET dogrulandi = 1 WHERE id = ?", [id]);

    if (result.changes === 0) {
         return res.status(400).json({ hata: "Öğrenci onaylanamadı veya zaten onaylı." });
    }

    res.json({ mesaj: `✅ ${ogrenci.adsoyad} başarıyla onaylandı.` });
  } catch (err) {
    console.error("🔥 Onay hatası (Backend):", err.message);
    res.status(500).json({ hata: "Sunucu hatası oluştu. (Lütfen console log'u kontrol edin)" });
  }
}

// ============================================================
// 🔥 NİHAİ GİRİŞ İŞLEMİ (Açık Metin Şifre Kontrolü)
// ============================================================
export async function girisYap(req, res) {
  try {
    const { email, sifre } = req.body;

    if (!email || !sifre) {
      return res.status(400).json({ hata: "E-posta ve şifre gereklidir." });
    }

    // 1. ADIM: Super Admin Kontrolü (Sabit şifre korundu)
    if (email === "admin@gmail.com" && sifre === "1234") {
        return res.json({
            mesaj: "Giriş başarılı.",
            yonetici: {
                adsoyad: "Vizia Super Admin",
                role: "SuperAdmin",
                clubId: null,
            },
        });
    }

    // 2. ADIM: Kulüp Başkanı Kontrolü (VERİTABANINDAN AÇIK METİN KARŞILAŞTIRMA)
    const baskan = await db.get(
        `SELECT id, ad AS clubName, baskan_adsoyad, baskan_email, baskan_sifre_hash 
         FROM kulupler 
         WHERE baskan_email = ? AND baskan_email IS NOT NULL`,
        [email]
    );

    if (baskan && baskan.baskan_sifre_hash) {
        // 🔥 AÇIK METİN KARŞILAŞTIRMASI YAPILIYOR
        if (sifre === baskan.baskan_sifre_hash) { 
            return res.json({
                mesaj: "Giriş başarılı.",
                yonetici: {
                    adsoyad: baskan.baskan_adsoyad,
                    role: "ClubPresident",
                    clubId: baskan.id,
                    clubName: baskan.clubName,
                },
            });
        }
    }

    // 3. HATA: Hiçbir hesap eşleşmedi (Başkan veya Super Admin)
    return res.status(401).json({ hata: "Geçersiz e-posta veya şifre." }); // 401 Unauthorized
    
  } catch (err) {
    console.error("🔥 yoneticiDenetleyici/girisYap hatası:", err.message);
    res.status(500).json({ hata: "Sunucu hatası oluştu." });
  }
}