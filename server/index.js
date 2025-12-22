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
import aiRota from "./rotalar/aiRota.js"; // 🔥 YENİ: AI Rotasını içeri alıyoruz
import multer from 'multer';

// 🌿 Ortam değişkenlerini yükle
dotenv.config();

// 🚀 Express uygulamasını başlat
const app = express();

// 🔧 Uygulama genel middleware ve ayarları
// NOT: uygulamaAyar.js içinde CORS izinlerinin localhost:3000 (React) için açık olduğundan emin ol kanka!
uygulaAyarlar(app);

// 🔥 YENİ: Express'e static dosyaların (resimlerin) yolunu gösterme
app.use('/uploads', express.static('uploads')); 

// 🛣️ API Rotaları
app.use("/api/ogrenciler", ogrenciRota);
app.use("/api/yoneticiler", yoneticiRota);
app.use("/api/ringler", ringRota);
app.use("/api/kulupler", kulupRota); 
app.use("/api/ai", aiRota); // 🔥 YENİ: Chatbot için yeni endpoint: /api/ai/chat

// 🩺 Genel Sağlık Kontrolü
app.get("/api/saglik", (req, res) => {
  res.json({ durum: "ok", sunucu: "çalışıyor" });
});

app.get("/", (req, res) => {
  res.send("✅ Vizia Kampüs Sunucusu Aktif! Chatbot ve Kulüpler Modülü Hazır.");
});

// ❗ Genel Hata Yakalama
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error("🔥 Multer Dosya Yükleme Hatası:", err.message);
        return res.status(400).json({ hata: `Dosya yükleme hatası: ${err.message}` });
    }
    
    console.error("🔥 Sunucu hatası:", err.stack);
    res.status(500).json({ hata: "Sunucu hatası oluştu.", detay: err.message });
});

// ⚙️ Sunucuyu başlat (Senin .env'deki 5050 portunu kullanır)
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda modüler yapıda akıyor...`);
});