// =============================
// server/denetleyiciler/kulupDenetleyici.js
// =============================
import db from "../yapilandirma/veritabani.js";
import fs from 'fs'; 
import path from 'path'; 

/* ---------------------------------------------------
 * YETKİ KONTROL YARDIMCISI
 * --------------------------------------------------- */
const getAdminInfo = (req) => {
    // Frontend'den gelen clubid ve role header'larını varsayıyoruz
    const { clubid, role } = req.headers; 
    // Header'dan gelen clubid'yi burada sayıya çeviriyoruz (parseInt)
    return { clubId: parseInt(clubid), role };
};

/* ============================================================
   1. KULÜP BİLGİLERİ YÖNETİMİ
   ============================================================ */

// Tüm kulüpleri (Super Admin) veya tek bir kulübü (Başkan) getirir
export async function kulupBilgileriGetir(req, res) {
    try {
        const { clubId, role } = getAdminInfo(req);
        let kulupler;

        if (role === 'SuperAdmin') {
            kulupler = await db.all("SELECT * FROM kulupler ORDER BY id");
        } else if (role === 'ClubPresident' && clubId) {
            kulupler = await db.all("SELECT * FROM kulupler WHERE id = ?", [clubId]);
        } else {
            return res.status(403).json({ hata: "Yetkisiz erişim veya eksik bilgi." });
        }

        res.json(kulupler);
    } catch (err) {
        console.error("🔥 kulupBilgileriGetir hatası:", err.message);
        res.status(500).json({ hata: "Kulüp bilgileri alınamadı." });
    }
}

// Kulüp bilgilerini günceller (Super Admin veya Kulüp Başkanı kendi kulübünü)
export async function kulupBilgileriniGuncelle(req, res) {
    try {
        const { clubId, role } = getAdminInfo(req);
        const { id, ad, slogan, aciklama, logo_yolu, baskan_adsoyad } = req.body;

        if (!id) return res.status(400).json({ hata: "Kulüp ID gerekli." });

        const isAuthorized = role === 'SuperAdmin' || (role === 'ClubPresident' && id === clubId);
        if (!isAuthorized) {
            return res.status(403).json({ hata: "Bu kulübü düzenlemeye yetkiniz yok." });
        }

        await db.run(
            "UPDATE kulupler SET ad = ?, slogan = ?, aciklama = ?, logo_yolu = ?, baskan_adsoyad = ? WHERE id = ?",
            [ad, slogan, aciklama, logo_yolu, baskan_adsoyad, id]
        );

        res.json({ mesaj: `✅ ${ad} bilgileri başarıyla güncellendi.` });
    } catch (err) {
        console.error("🔥 kulupBilgileriniGuncelle hatası:", err.message);
        res.status(500).json({ hata: "Güncelleme başarısız." });
    }
}


/* ============================================================
   🔥🔥🔥 SUPER ADMIN HESAP YÖNETİMİ (AÇIK METİN ŞİFRE) 🔥🔥🔥
   ============================================================ */

// Süper Admin tüm başkanların hesaplarını listeler
export async function listeleBaskanHesaplari(req, res) {
    const { role } = req.headers;
    
    if (role !== 'SuperAdmin') {
        return res.status(403).json({ hata: "Sadece Süper Admin bu listeyi görebilir." });
    }

    try {
        const baskanlar = await db.all(
            "SELECT id, ad AS club_name, baskan_adsoyad, baskan_email FROM kulupler ORDER BY id"
        );
        res.json(baskanlar);
    } catch (err) {
        console.error("🔥 listeleBaskanHesaplari hatası:", err.message);
        res.status(500).json({ hata: "Başkan listesi alınamadı." });
    }
}

// Süper Admin başkan hesabını günceller (E-posta ve/veya Şifre)
export async function guncelleBaskanHesabi(req, res) {
    const { role } = req.headers;
    const { id } = req.params;
    const { baskan_email, new_password } = req.body; 

    if (role !== 'SuperAdmin') {
        return res.status(403).json({ hata: "Sadece Süper Admin bu işlemi yapabilir." });
    }
    if (!baskan_email) {
        return res.status(400).json({ hata: "E-posta alanı boş bırakılamaz." });
    }

    try {
        let sql = "UPDATE kulupler SET baskan_email = ?";
        const params = [baskan_email];
        let mesaj = "E-posta başarıyla güncellendi.";
        
        // 1. ŞİFRE GÜNCELLEMESİ (Yeni şifre varsa)
        if (new_password) {
            if (new_password.length < 4) { // Minimum şifre uzunluğu kontrolü
                return res.status(400).json({ hata: "Şifre en az 4 karakter olmalıdır." });
            }
            sql += ", baskan_sifre_hash = ?"; 
            params.push(new_password); // Şifre açık metin olarak kaydediliyor
            mesaj = "E-posta ve Şifre başarıyla güncellendi.";
        }
        
        // 2. SON KOMUTU TAMAMLA VE ÇALIŞTIR
        sql += " WHERE id = ?";
        params.push(id);
        
        const result = await db.run(sql, params);

        if (result.changes === 0) {
            return res.status(404).json({ hata: "Belirtilen ID'ye sahip başkan bulunamadı." });
        }

        res.json({ mesaj: `✅ ${mesaj}` });

    } catch (err) {
        console.error("🔥 guncelleBaskanHesabi hatası:", err.message);
        res.status(500).json({ hata: "Hesap güncelleme başarısız." });
    }
}


/* ============================================================
   2. ÜYELİK YÖNETİMİ
   ============================================================ */

// Öğrencinin kulübe katılma başvurusu (Öğrenci Tarafı)
export async function uyelikBasvurusuYap(req, res) {
    try {
        const { kulup_id, ogrenci_id } = req.body;
        
        await db.run(
            "INSERT INTO kulup_uyelikleri (kulup_id, ogrenci_id) VALUES (?, ?)",
            [kulup_id, ogrenci_id]
        );
        res.json({ mesaj: "Başvurunuz kulüp yönetimine iletildi ve onay bekleniyor." });
    } catch (err) {
        if (err.message.includes("UNIQUE")) {
            return res.status(409).json({ hata: "Bu kulübe zaten başvurmuşsunuz." });
        }
        console.error("🔥 uyelikBasvurusuYap hatası:", err.message);
        res.status(500).json({ hata: "Başvuru başarısız." });
    }
}

// Admin/Başkanın bekleyen üyelik başvurularını görmesi (Admin Tarafı)
export async function bekleyenUyeleriListele(req, res) {
    try {
        const { clubId, role } = getAdminInfo(req);
        let sql = `
            SELECT 
                u.id, u.onay_durumu, u.basvuru_tarihi,
                k.ad AS kulup_ad,
                o.adsoyad AS ogrenci_adsoyad, o.email AS ogrenci_email
            FROM kulup_uyelikleri u
            JOIN kulupler k ON u.kulup_id = k.id
            JOIN ogrenciler o ON u.ogrenci_id = o.id
            WHERE u.onay_durumu = 'Beklemede' 
        `;
        const params = [];

        if (role === 'ClubPresident' && clubId) {
            sql += " AND u.kulup_id = ?";
            params.push(clubId);
        } else if (role !== 'SuperAdmin') {
             return res.status(403).json({ hata: "Yetkisiz erişim." });
        }
        
        const bekleyenler = await db.all(sql + " ORDER BY u.basvuru_tarihi DESC", params);
        res.json(bekleyenler);

    } catch (err) {
        console.error("🔥 bekleyenUyeleriListele hatası:", err.message);
        res.status(500).json({ hata: "Liste alınamadı." });
    }
}

// Admin/Başkanın üyelik başvurusunu onaylaması/reddetmesi (Admin Tarafı)
export async function uyelikDurumuGuncelle(req, res) {
    try {
        const { clubId, role } = getAdminInfo(req);
        const { basvuru_id, durum } = req.body;

        if (!['Onaylandı', 'Reddedildi'].includes(durum)) {
            return res.status(400).json({ hata: "Geçersiz durum." });
        }

        const basvuru = await db.get("SELECT kulup_id FROM kulup_uyelikleri WHERE id = ?", [basvuru_id]);
        if (!basvuru) return res.status(404).json({ hata: "Başvuru bulunamadı." });

        const isAuthorized = role === 'SuperAdmin' || (role === 'ClubPresident' && basvuru.kulup_id === clubId);
        if (!isAuthorized) {
            return res.status(403).json({ hata: "Bu işlemi yapmaya yetkiniz yok." });
        }

        await db.run("UPDATE kulup_uyelikleri SET onay_durumu = ? WHERE id = ?", [durum, basvuru_id]);

        if (durum === 'Onaylandı') {
             await db.run("UPDATE kulupler SET aktif_uye_sayisi = aktif_uye_sayisi + 1 WHERE id = ?", [basvuru.kulup_id]);
        }
        
        res.json({ mesaj: `Başvuru durumu başarıyla ${durum} olarak güncellendi.` });

    } catch (err) {
        console.error("🔥 uyelikDurumuGuncelle hatası:", err.message);
        res.status(500).json({ hata: "Durum güncellenemedi." });
    }
}

// Öğrencinin kulüpteki durumunu kontrol eder
export async function uyelikDurumuKontrol(req, res) {
    try {
        const { kulup_id, ogrenci_id } = req.params;

        const durum = await db.get(
            "SELECT onay_durumu FROM kulup_uyelikleri WHERE kulup_id = ? AND ogrenci_id = ?",
            [kulup_id, ogrenci_id]
        );

        if (!durum) {
            return res.json({ durum: 'Yok' });
        }

        return res.json({ durum: durum.onay_durumu });

    } catch (err) {
        console.error("🔥 uyelikDurumuKontrol hatası:", err.message);
        res.status(500).json({ hata: "Durum kontrolü başarısız." });
    }
}

// Öğrencinin tüm üyeliklerini listeler
export async function ogrenciUyelikleriniGetir(req, res) {
    try {
        const { ogrenci_id } = req.params;

        const uyelikler = await db.all(
            `SELECT 
                u.id, 
                u.onay_durumu, 
                u.basvuru_tarihi,
                k.ad AS kulup_ad,
                k.kategori 
            FROM kulup_uyelikleri u
            JOIN kulupler k ON u.kulup_id = k.id
            WHERE u.ogrenci_id = ?
            ORDER BY u.basvuru_tarihi DESC`,
            [ogrenci_id]
        );

        res.json(uyelikler);
    } catch (err) {
        console.error("🔥 ogrenciUyelikleriniGetir hatası:", err.message);
        res.status(500).json({ hata: "Öğrenci üyelikleri alınamadı. Lütfen sunucu loglarını kontrol edin." });
    }
}

// Başkanın onaylanmış üyeleri görmesi
export async function onaylananUyeleriListele(req, res) {
    try {
        const { clubId, role } = getAdminInfo(req);
        
        if (role !== 'ClubPresident' || !clubId) {
            return res.status(403).json({ hata: "Yetkisiz erişim." });
        }
        
        const sql = `
            SELECT 
                u.id, 
                u.basvuru_tarihi,
                o.adsoyad AS ogrenci_adsoyad, 
                o.email AS ogrenci_email
            FROM kulup_uyelikleri u
            JOIN ogrenciler o ON u.ogrenci_id = o.id
            WHERE u.kulup_id = ? AND u.onay_durumu = 'Onaylandı' 
            ORDER BY o.adsoyad
        `;
        const uyeler = await db.all(sql, [clubId]);
        res.json(uyeler);

    } catch (err) {
        console.error("🔥 onaylananUyeleriListele hatası:", err.message);
        res.status(500).json({ hata: "Onaylanmış üyeler listelenemedi." });
    }
}

// Başkanın üyeyi kulüpten çıkarması (Durumu Reddedildi'ye çeker)
export async function uyeliktenCikar(req, res) {
    try {
        const { clubId, role } = getAdminInfo(req);
        const { uyelik_id, durum } = req.body; 

        if (role !== 'ClubPresident' || !clubId) {
            return res.status(403).json({ hata: "Bu işlemi yapmaya yetkiniz yok." });
        }
        
        const uyelik = await db.get("SELECT kulup_id FROM kulup_uyelikleri WHERE id = ?", [uyelik_id]);
        if (!uyelik || uyelik.kulup_id !== clubId) {
            return res.status(403).json({ hata: "Sadece kendi kulübünüzün üyelerini çıkarabilirsiniz." });
        }

        await db.run("UPDATE kulup_uyelikleri SET onay_durumu = ? WHERE id = ?", [durum, uyelik_id]);
        
        await db.run("UPDATE kulupler SET aktif_uye_sayisi = aktif_uye_sayisi - 1 WHERE id = ?", [clubId]);

        res.json({ mesaj: `Üye başarıyla kulüpten çıkarıldı.` });

    } catch (err) {
        console.error("🔥 uyeliktenCikar hatası:", err.message);
        res.status(500).json({ hata: "Üye çıkarma başarısız." });
    }
}


/* ============================================================
   3. MESAJLAŞMA YÖNETİMİ
   ============================================================ */

// Öğrencinin mesaj göndermesi (Öğrenci Tarafı)
export async function mesajGonder(req, res) {
    try {
        const { kulup_id, ogrenci_email, mesaj_metni } = req.body;
        
        await db.run(
            "INSERT INTO kulup_mesajlari (kulup_id, ogrenci_email, mesaj_metni) VALUES (?, ?, ?)",
            [kulup_id, ogrenci_email, mesaj_metni]
        );
        res.json({ mesaj: "Mesajınız kulüp başkanına iletildi." });
    } catch (err) {
        console.error("🔥 mesajGonder hatası:", err.message);
        res.status(500).json({ hata: "Mesaj gönderilemedi." });
    }
}

// Admin/Başkanın gelen mesajları görmesi (Admin Tarafı)
export async function gelenMesajlariListele(req, res) {
    try {
        const { clubId, role } = getAdminInfo(req);
        let sql = `
            SELECT m.*, k.ad AS kulup_ad, o.adsoyad AS ogrenci_adsoyad, o.email AS ogrenci_email
            FROM kulup_mesajlari m
            JOIN kulupler k ON m.kulup_id = k.id
            JOIN ogrenciler o ON m.ogrenci_email = o.email
            WHERE m.cevaplandi = 0
        `;
        const params = [];

        if (role === 'ClubPresident' && clubId) {
            // Başkan sadece kendi kulübüne ait mesajları görür
            sql += " AND m.kulup_id = ?";
            params.push(clubId);
        } else if (role !== 'SuperAdmin') {
             return res.status(403).json({ hata: "Yetkisiz erişim." });
        }
        
        const mesajlar = await db.all(sql + " ORDER BY m.olusturma_tarihi DESC", params);
        res.json(mesajlar);

    } catch (err) {
        console.error("🔥 gelenMesajlariListele hatası:", err.message);
        res.status(500).json({ hata: "Mesajlar listelenemedi." });
    }
}

// Admin/Başkanın mesaja cevap vermesi (Admin Tarafı)
export async function mesajCevapla(req, res) {
    try {
        const { clubId, role } = getAdminInfo(req);
        const { mesaj_id, cevap_metni } = req.body;

        // Önce mesajın hangi kulübe ait olduğunu kontrol et
        const mesaj = await db.get("SELECT kulup_id FROM kulup_mesajlari WHERE id = ?", [mesaj_id]);
        if (!mesaj) return res.status(404).json({ hata: "Mesaj bulunamadı." });

        const isAuthorized = role === 'SuperAdmin' || (role === 'ClubPresident' && mesaj.kulup_id === clubId);
        if (!isAuthorized) {
            return res.status(403).json({ hata: "Bu mesaja cevap vermeye yetkiniz yok." });
        }

        await db.run(
            "UPDATE kulup_mesajlari SET cevap_metni = ?, cevaplandi = 1, cevap_tarihi = datetime('now') WHERE id = ?",
            [cevap_metni, mesaj_id]
        );

        res.json({ mesaj: "Mesaj başarıyla cevaplandı." });
    } catch (err) {
        console.error("🔥 mesajCevapla hatası:", err.message);
        res.status(500).json({ hata: "Cevap gönderilemedi." });
    }
}

// Öğrenciye ait tüm mesajları ve cevaplarını getirir
export async function ogrenciMesajlariniGetir(req, res) {
    try {
        const { ogrenci_email } = req.params;

        // Mesajları kulüp adıyla birleştirip, cevaplanmış mesajları da getirir
        const mesajlar = await db.all(
            `SELECT 
                m.*, 
                k.ad AS kulup_ad
            FROM kulup_mesajlari m
            JOIN kulupler k ON m.kulup_id = k.id
            WHERE m.ogrenci_email = ?
            ORDER BY m.olusturma_tarihi DESC`,
            [ogrenci_email]
        );

        res.json(mesajlar);
    } catch (err) {
        console.error("🔥 ogrenciMesajlariniGetir hatası:", err.message);
        res.status(500).json({ hata: "Öğrenci mesajları alınamadı." });
    }
}

// BAŞKANIN KULÜP ÜYELERİNE TOPLU MESAJ GÖNDERMESİ
export async function topluMesajGonder(req, res) {
    try {
        const { clubId, role } = getAdminInfo(req);
        const { kulup_id, mesaj_metni } = req.body;
        
        // 1. Yetki ve Kulüp Kontrolü: Sadece ilgili kulübün başkanı toplu mesaj atabilir.
        if (role !== 'ClubPresident' || clubId !== parseInt(kulup_id)) { // kulup_id'yi de sayıya çevirerek karşılaştır
            return res.status(403).json({ hata: "Bu kulübe toplu mesaj göndermeye yetkiniz yok." });
        }

        // 2. Mesajı alacak onaylı üyeleri bul
        const uyeler = await db.all(
            `SELECT o.email FROM kulup_uyelikleri u
             JOIN ogrenciler o ON u.ogrenci_id = o.id
             WHERE u.kulup_id = ? AND u.onay_durumu = 'Onaylandı'`,
            [kulup_id]
        );

        if (uyeler.length === 0) {
            return res.status(404).json({ hata: "Bu kulüpte onaylanmış üye bulunmamaktadır." });
        }

        // 3. Her üye için tek tek mesaj kaydı ekle
        const kulup = await db.get("SELECT ad FROM kulupler WHERE id = ?", [kulup_id]);
        const mesajBasligi = `${kulup.ad} Duyurusu`; 
        
        for (const uye of uyeler) {
            await db.run(
                `INSERT INTO kulup_mesajlari 
                 (kulup_id, ogrenci_email, mesaj_metni, cevaplandi, cevap_metni, cevap_tarihi) 
                 VALUES (?, ?, ?, 1, ?, datetime('now'))`, 
                [kulup_id, uye.email, mesajBasligi, mesaj_metni]
            );
        }
        
        res.json({ mesaj: `✅ Mesaj, ${uyeler.length} üyeye başarıyla gönderildi.` });

    } catch (err) {
        console.error("🔥 topluMesajGonder hatası:", err.message);
        res.status(500).json({ hata: "Toplu mesaj gönderilemedi." });
    }
}


/* ============================================================
   🔥🔥🔥 4. ETKİNLİK MODÜLÜ (CRUD ve Öğrenci Aksiyonları) 🔥🔥🔥
   ============================================================ */

// ------------------------------------------
// 4.1. ÖĞRENCİ TARAFI (READ, KAYIT, OYLAMA)
// ------------------------------------------

// Tüm etkinlikleri listeler (Kayıt ve Oy durumu ile birlikte)
export async function listeleEtkinlikler(req, res) {
    try {
        const { ogrenci_id } = req.query; 
        
        let sql = `
            SELECT 
                e.id, e.kulup_id, e.ad, e.aciklama, e.tarih, e.saat, e.yer, e.kapasite, e.resim_url,
                k.ad AS clubName,
                k.kategori AS category,
                
                -- Kayıt Sayısı
                (SELECT COUNT(id) FROM etkinlik_kayitlari WHERE etkinlik_id = e.id) AS registered_count,
                
                -- Beğeni Sayıları
                (SELECT COUNT(id) FROM etkinlik_oylamalari WHERE etkinlik_id = e.id AND oy_tipi = 1) AS like_count,
                (SELECT COUNT(id) FROM etkinlik_oylamalari WHERE etkinlik_id = e.id AND oy_tipi = 0) AS dislike_count
        `;

        if (ogrenci_id) {
            sql += `,
                -- Kullanıcının Kayıt Durumu (1 veya 0)
                EXISTS(SELECT 1 FROM etkinlik_kayitlari WHERE etkinlik_id = e.id AND ogrenci_id = ?) AS user_is_registered,
                
                -- Kullanıcının Oy Durumu (1: Like, 0: Dislike, NULL: Oylanmadı)
                (SELECT oy_tipi FROM etkinlik_oylamalari WHERE etkinlik_id = e.id AND ogrenci_id = ?) AS user_vote
            `;
        }

        sql += `
            FROM etkinlikler e
            JOIN kulupler k ON e.kulup_id = k.id
            ORDER BY e.tarih DESC
        `;
        
        const params = [];
        if (ogrenci_id) {
            params.push(ogrenci_id, ogrenci_id);
        }

        const etkinlikler = await db.all(sql, params);
        res.json(etkinlikler);

    } catch (err) {
        console.error("🔥 listeleEtkinlikler hatası:", err.message);
        res.status(500).json({ hata: "Etkinlikler listelenemedi." });
    }
}

// Öğrenci Kayıt İşlemi (Kapasite Kontrolü Eklendi)
export async function etkinligeKaydol(req, res) {
    try {
        const { etkinlik_id, ogrenci_id } = req.body;
        
        // Kapasite Kontrolü
        const etkinlik = await db.get("SELECT kapasite FROM etkinlikler WHERE id = ?", [etkinlik_id]);
        
        if (etkinlik && etkinlik.kapasite > 0) {
             const kayitliSayisi = await db.get("SELECT COUNT(id) AS count FROM etkinlik_kayitlari WHERE etkinlik_id = ?", [etkinlik_id]);
             
             if (kayitliSayisi.count >= etkinlik.kapasite) {
                 return res.status(400).json({ hata: "Etkinlik kapasitesi dolmuştur." });
             }
        }
        
        await db.run(
            "INSERT INTO etkinlik_kayitlari (etkinlik_id, ogrenci_id) VALUES (?, ?)",
            [etkinlik_id, ogrenci_id]
        );
        res.json({ mesaj: "✅ Etkinliğe başarıyla kaydoldunuz." });
        
    } catch (err) {
        if (err.message.includes("UNIQUE")) {
            return res.status(409).json({ hata: "Bu etkinliğe zaten kaydolmuşsunuz." });
        }
        console.error("🔥 etkinligeKaydol hatası:", err.message);
        res.status(500).json({ hata: "Kayıt işlemi başarısız." });
    }
}

// Öğrenci Oylama İşlemi
export async function etkinlikOyla(req, res) {
    try {
        const { etkinlik_id, ogrenci_id, oy_tipi } = req.body; 
        
        // 1. İptal Etme İşlemi
        if (oy_tipi === null) {
            await db.run(
                "DELETE FROM etkinlik_oylamalari WHERE etkinlik_id = ? AND ogrenci_id = ?",
                [etkinlik_id, ogrenci_id]
            );
            return res.json({ mesaj: "Oylama başarıyla iptal edildi." });
        }
        
        // 2. Yeni Oy Veya Mevcut Oyu Güncelleme
        if (![0, 1].includes(oy_tipi)) {
            return res.status(400).json({ hata: "Geçersiz oy tipi." });
        }
        
        await db.run(
            `INSERT INTO etkinlik_oylamalari (etkinlik_id, ogrenci_id, oy_tipi) 
             VALUES (?, ?, ?)
             ON CONFLICT(etkinlik_id, ogrenci_id) 
             DO UPDATE SET oy_tipi = ?`,
            [etkinlik_id, ogrenci_id, oy_tipi, oy_tipi]
        );
        
        res.json({ mesaj: `Oylama başarıyla kaydedildi.` });

    } catch (err) {
        console.error("🔥 etkinlikOyla hatası:", err.message);
        res.status(500).json({ hata: "Oylama başarısız." });
    }
}


// ------------------------------------------
// 4.2. BAŞKAN YÖNETİMİ (CRUD)
// ------------------------------------------

// Başkanın kendi kulübüne ait etkinlikleri listelemesi
export async function listeleBaskanEtkinlikleri(req, res) {
    try {
        // URL'den gelen clubId'yi al ve sayıya çevir
        const clubIdParam = parseInt(req.params.clubId); 
        const { clubId: clubIdHeader, role } = getAdminInfo(req); // Header'dan gelen ID (Zaten sayı)

        // KRİTİK KONTROL: URL'deki ID, Header'daki ID'ye eşit mi VE rol Başkan mı?
        // Bu kontrol, 403 hatasını çözmek için en güvenilir yoldur.
        if (role !== 'ClubPresident' || clubIdParam !== clubIdHeader) {
            return res.status(403).json({ hata: "Bu kulübün etkinliklerini görüntülemeye yetkiniz yok." });
        }

        // URL'den gelen ID'yi sorguda kullanıyoruz (Zaten sayıya çevrildi)
        const sql = `
            SELECT 
                e.id, e.kulup_id, e.ad, e.aciklama, e.tarih, e.saat, e.yer, e.kapasite, e.resim_url,
                k.ad AS clubName,
                (SELECT COUNT(id) FROM etkinlik_kayitlari WHERE etkinlik_id = e.id) AS registered_count,
                (SELECT COUNT(id) FROM etkinlik_oylamalari WHERE etkinlik_id = e.id AND oy_tipi = 1) AS like_count,
                (SELECT COUNT(id) FROM etkinlik_oylamalari WHERE etkinlik_id = e.id AND oy_tipi = 0) AS dislike_count
            FROM etkinlikler e
            JOIN kulupler k ON e.kulup_id = k.id
            WHERE e.kulup_id = ?
            ORDER BY e.tarih DESC
        `;
        
        const etkinlikler = await db.all(sql, [clubIdParam]);
        res.json(etkinlikler);

    } catch (err) {
        console.error("🔥 listeleBaskanEtkinlikleri hatası:", err.message);
        res.status(500).json({ hata: "Başkan etkinlikleri listelenemedi." });
    }
}

// Etkinlik Ekleme (POST)
export async function etkinlikEkle(req, res) {
    try {
        // Form verileri req.body'den, dosya ise req.file'dan gelir (Multer sayesinde)
        const { ad, aciklama, tarih, saat, yer, kapasite, kulup_id } = req.body;
        const { clubId: clubIdHeader, role } = getAdminInfo(req); // clubIdHeader zaten sayı
        
        // KRİTİK DÜZELTME: Sadece Header'dan gelen güvenilir clubIdHeader'ı kullanıyoruz
        if (role !== 'ClubPresident' || parseInt(kulup_id) !== clubIdHeader) {
            // Yüklenen dosyayı sil
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(403).json({ hata: "Sadece kendi kulübünüz için etkinlik ekleyebilirsiniz." });
        }
        
        if (!ad || !tarih || !kulup_id) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ hata: "Etkinlik Adı, Tarihi ve Kulüp ID'si zorunludur." });
        }

        // Resim Yolu: Multer dosya yüklediyse yolu al, yoksa boş bırak
        const resim_url = req.file ? `/uploads/events/${req.file.filename}` : null; 
        
        // INSERT işleminde header'dan gelen ve doğrulanan clubIdHeader'ı kullan
        await db.run(
            `INSERT INTO etkinlikler (kulup_id, ad, aciklama, tarih, saat, yer, kapasite, resim_url) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [clubIdHeader, ad, aciklama, tarih, saat, yer, kapasite || 0, resim_url]
        );
        
        res.json({ mesaj: "✅ Etkinlik başarıyla eklendi ve yayınlandı." });

    } catch (err) {
        console.error("🔥 etkinlikEkle hatası:", err.message);
        if (req.file) fs.unlinkSync(req.file.path); // Hata durumunda yüklenen dosyayı sil
        res.status(500).json({ hata: "Etkinlik eklenirken hata oluştu." });
    }
}

// Etkinlik Güncelleme (PUT)
export async function etkinlikGuncelle(req, res) {
    try {
        const { id } = req.params;
        const { ad, aciklama, tarih, saat, yer, kapasite } = req.body;
        const { clubId: clubIdHeader, role } = getAdminInfo(req); // clubIdHeader zaten sayı
        
        // 1. Yetki ve sahiplik kontrolü
        const existingEvent = await db.get("SELECT kulup_id, resim_url FROM etkinlikler WHERE id = ?", [id]);
        if (!existingEvent) {
             if (req.file) fs.unlinkSync(req.file.path);
             return res.status(404).json({ hata: "Güncellenecek etkinlik bulunamadı." });
        }
        
        // Yetki Kontrolü: Body'den gelen kulup_id yerine, mevcut etkinliğin kulup_id'sini header ile karşılaştır
        if (role !== 'ClubPresident' || existingEvent.kulup_id !== clubIdHeader) {
             if (req.file) fs.unlinkSync(req.file.path);
             return res.status(403).json({ hata: "Bu etkinliği düzenlemeye yetkiniz yok." });
        }
        
        // 2. Resim yolu yönetimi
        let resim_url = existingEvent.resim_url;
        if (req.file) {
            // Yeni dosya yüklendi: Eski dosyayı sil (Güvenlik ve yer kazanımı için)
            if (existingEvent.resim_url) {
                const absolutePath = path.join(process.cwd(), 'uploads', 'events', existingEvent.resim_url.split('/').pop());
                 if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath);
                 }
            }
            resim_url = `/uploads/events/${req.file.filename}`;
        }
        
        await db.run(
            `UPDATE etkinlikler SET 
             ad = ?, aciklama = ?, tarih = ?, saat = ?, yer = ?, kapasite = ?, resim_url = ?
             WHERE id = ?`,
            [ad, aciklama, tarih, saat, yer, kapasite, resim_url, id]
        );

        res.json({ mesaj: "✅ Etkinlik başarıyla güncellendi." });

    } catch (err) {
        console.error("🔥 etkinlikGuncelle hatası:", err.message);
        if (req.file) fs.unlinkSync(req.file.path); // Hata durumunda yeni yüklenen dosyayı sil
        res.status(500).json({ hata: "Etkinlik güncellenirken hata oluştu." });
    }
}

// Etkinlik Silme (DELETE)
export async function etkinlikSil(req, res) {
    try {
        const { id } = req.params;
        const { clubId: clubIdHeader, role } = getAdminInfo(req); // clubIdHeader zaten sayı

        // 1. Yetki ve sahiplik kontrolü
        const existingEvent = await db.get("SELECT kulup_id, resim_url FROM etkinlikler WHERE id = ?", [id]);
        if (!existingEvent) {
             return res.status(404).json({ hata: "Silinecek etkinlik bulunamadı." });
        }
        
        // Yetki Kontrolü
        if (role !== 'ClubPresident' || existingEvent.kulup_id !== clubIdHeader) {
             return res.status(403).json({ hata: "Bu etkinliği silmeye yetkiniz yok." });
        }
        
        // 2. Eski resmi diskten sil
        if (existingEvent.resim_url) {
            const absolutePath = path.join(process.cwd(), 'uploads', 'events', existingEvent.resim_url.split('/').pop());
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }

        // 3. İlgili kayıtları sil
        await db.run("DELETE FROM etkinlik_kayitlari WHERE etkinlik_id = ?", [id]);
        await db.run("DELETE FROM etkinlik_oylamalari WHERE etkinlik_id = ?", [id]);

        // 4. Ana etkinliği sil
        await db.run("DELETE FROM etkinlikler WHERE id = ?", [id]);
        
        res.json({ mesaj: "✅ Etkinlik başarıyla silindi." });

    } catch (err) {
        console.error("🔥 etkinlikSil hatası:", err.message);
        res.status(500).json({ hata: "Etkinlik silinirken hata oluştu." });
    }
} 