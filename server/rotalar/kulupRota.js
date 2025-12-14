// =============================
// server/rotalar/kulupRota.js
// =============================
import express from "express";
import * as Kulup from "../denetleyiciler/kulupDenetleyici.js";
import { uploadEventImage } from "../yapilandirma/multerYapilandirma.js"; 

const router = express.Router(); 

/* ============================================================
   ✅ KULÜP YÖNETİMİ & ETKİNLİK API'LARI
   ============================================================ */

// 🔥🔥🔥 4. ETKİNLİK MODÜLÜ ROTLARI 🔥🔥🔥
// 4.1. ÖĞRENCİ TARAFI (EN YÜKSEK ÖNCELİKTE OKUNMALI)
router.get("/etkinlikler", Kulup.listeleEtkinlikler); 
router.post("/etkinlikler/kaydol", Kulup.etkinligeKaydol); 
router.post("/etkinlikler/oyla", Kulup.etkinlikOyla); 


// 1. KULÜP YÖNETİMİ & SÜPER ADMİN
// 🔥 YENİ ROTA: SÜPER ADMİN YENİ KULÜP OLUŞTURUR (AD, EMAIL, ŞİFRE)
router.post("/olustur", Kulup.kulupOlustur);
// Mevcut rotalar
router.get("/bilgiler", Kulup.kulupBilgileriGetir);
router.put("/bilgiler/guncelle", Kulup.kulupBilgileriniGuncelle);
router.get("/admin/baskanlar", Kulup.listeleBaskanHesaplari); 
router.put("/admin/baskanlar/:id", Kulup.guncelleBaskanHesabi);


// 4.2. BAŞKAN YÖNETİMİ (CRUD) ROTLARI
router.get("/admin/etkinlikler/:clubId", Kulup.listeleBaskanEtkinlikleri); 
router.post("/admin/etkinlikler", uploadEventImage.single('resimDosyasi'), Kulup.etkinlikEkle); 
router.put("/admin/etkinlikler/:id", uploadEventImage.single('resimDosyasi'), Kulup.etkinlikGuncelle); 
router.delete("/admin/etkinlikler/:id", Kulup.etkinlikSil); 


// 2. ÜYELİK YÖNETİMİ
router.post("/uyelik/basvur", Kulup.uyelikBasvurusuYap);
router.get("/uyelik/bekleyenler", Kulup.bekleyenUyeleriListele);
router.put("/uyelik/onayla", Kulup.uyelikDurumuGuncelle);
router.get("/uyelik/durum/:kulup_id/:ogrenci_id", Kulup.uyelikDurumuKontrol);
router.get("/uyelik/ogrenci/:ogrenci_id", Kulup.ogrenciUyelikleriniGetir); 
router.get("/uyelik/onaylananlar", Kulup.onaylananUyeleriListele);
router.put("/uyelik/cikar", Kulup.uyeliktenCikar);


// 3. MESAJLAŞMA
router.post("/mesaj/gonder", Kulup.mesajGonder);
router.get("/mesaj/gelenler", Kulup.gelenMesajlariListele);
router.put("/mesaj/cevapla", Kulup.mesajCevapla);
router.get("/mesaj/ogrenci/:ogrenci_email", Kulup.ogrenciMesajlariniGetir); 
router.post("/toplu-mesaj", Kulup.topluMesajGonder); 


export default router;