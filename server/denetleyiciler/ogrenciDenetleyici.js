// 📦 Gerekli modüller
import db from "../yapilandirma/veritabani.js";

/* ---------------------------------------------------
 🩺 Test endpoint (Sunucu durumu)
--------------------------------------------------- */
export async function saglik(_req, res) {
  res.json({ modül: "ogrenci", durum: "calisiyor" });
}

/* ---------------------------------------------------
 🧾 Öğrenci Kayıt İşlemi
--------------------------------------------------- */
export async function kayitOl(req, res) {
  const { adsoyad, email, sifre } = req.body;

  // Alan kontrolü
  if (!adsoyad || !email || !sifre) {
    return res.status(400).json({ hata: "Lütfen tüm alanları doldurun." });
  }

  // SQL sorgusu
  const sql = `
    INSERT INTO ogrenciler (adsoyad, email, sifre)
    VALUES (?, ?, ?)
  `;

  // Veritabanına kayıt
  db.run(sql, [adsoyad, email, sifre], function (err) {
    if (err) {
      // Aynı e-posta ile kayıt varsa
      if (err.message.includes("UNIQUE")) {
        return res.status(409).json({ hata: "Bu e-posta zaten kayıtlı." });
      }

      console.error("❌ Veritabanı hatası:", err.message);
      return res.status(500).json({ hata: "Sunucu hatası." });
    }

    // Başarılı kayıt
    res.status(201).json({
      mesaj: "✅ Kayıt başarılı, admin onayı bekleniyor.",
      id: this.lastID,
    });
  });
}

/* ---------------------------------------------------
 🔥 YENİ: Öğrencinin Aktif (Onaylanmış) Kulüp Sayısını Çekme
--------------------------------------------------- */
export async function aktifUyelikSayisiGetir(req, res) {
    // Frontend'den gelen ogrenci_id'yi sorgu parametrelerinden alıyoruz
    const ogrenci_id = req.query.ogrenci_id;

    if (!ogrenci_id) {
        return res.status(400).json({ hata: "Öğrenci ID gereklidir." });
    }

    try {
        // SQLITE Sorgusu: kulup_uyelikleri tablosunda ogrenci_id'ye ait
        // ve onay_durumu 'Onaylandı' olan kayıtların sayısını say
        const result = await db.get(
            `SELECT COUNT(id) AS sayi 
             FROM kulup_uyelikleri 
             WHERE ogrenci_id = ? AND onay_durumu = 'Onaylandı'`,
            [ogrenci_id]
        );

        const aktifUyelikSayisi = result ? result.sayi : 0;

        // Frontend'in beklediği formatta yanıtı gönder: { sayi: X }
        res.status(200).json({ 
            sayi: aktifUyelikSayisi 
        });

    } catch (error) {
        console.error("🔥 Aktif üyelik sayısı çekilirken hata oluştu:", error.message);
        res.status(500).json({ hata: "Sunucu hatası. Üyelik sayısı çekilemedi." });
    }
}