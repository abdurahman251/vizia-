// =============================
// index.js (Backend giriş noktası)
// =============================
import express from "express";
import dotenv from "dotenv";
import { uygulaAyarlar } from "./uygulamaAyar.js";
import ogrenciRota from "./rotalar/ogrenciRota.js";
import yoneticiRota from "./rotalar/yoneticiRota.js";
import ringRota from "./rotalar/ringRota.js";
import kulupRota from "./rotalar/kulupRota.js"; 
import multer from 'multer'; // 🔥 Resim yükleme için (Multer)

// 🌿 Ortam değişkenlerini yükle
dotenv.config();

// 🚀 Express uygulamasını başlat
const app = express();

// 🔧 Uygulama genel middleware ve ayarları (Body parsers, CORS vb. burada olmalı)
uygulaAyarlar(app);

// 🔥 YENİ: Express'e static dosyaların (resimlerin) yolunu gösterme
app.use('/uploads', express.static('uploads')); 


// 🛣️ API Rotaları (Rotasyonel Modüller)
app.use("/api/ogrenciler", ogrenciRota);
app.use("/api/yoneticiler", yoneticiRota);
app.use("/api/ringler", ringRota);
app.use("/api/kulupler", kulupRota); 

// 🩺 Genel Sağlık Kontrolü ve Ana Sayfa
app.get("/api/saglik", (req, res) => {
  res.json({ durum: "ok", sunucu: "çalışıyor" });
});
app.get("/", (req, res) => {
  res.send("✅ Vizia Kampüs Sunucusu Aktif ve Kulüpler Modülü Entegre Edildi!");
});


// ❗ Genel Hata Yakalama (4 parametreli middleware, hataları yakalar)
app.use((err, req, res, next) => {
    // 1. Multer Hatalarını Yakala
    if (err instanceof multer.MulterError) {
        console.error("🔥 Multer Dosya Yükleme Hatası:", err.message);
        return res.status(400).json({ hata: `Dosya yükleme hatası: ${err.message}` });
    }
    
    // 2. Diğer Tüm Hataları Yakala (500 Internal Server Error)
    console.error("🔥 Sunucu hatası:", err.stack); // Hata izini logla
    res.status(500).json({ hata: "Sunucu hatası oluştu.", detay: err.message });
});

// ⚙️ Sunucuyu başlat
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda modüler yapıda çalışıyor...`);
});