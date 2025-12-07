// =============================
// index.js (Backend giriş noktası)
// =============================
import express from "express";
import dotenv from "dotenv";
import { uygulaAyarlar } from "./uygulamaAyar.js";
import ogrenciRota from "./rotalar/ogrenciRota.js";
import yoneticiRota from "./rotalar/yoneticiRota.js";
import ringRota from "./rotalar/ringRota.js"; // 🆕 Ring rotası eklendi

// 🌿 Ortam değişkenlerini yükle
dotenv.config();

// 🚀 Express uygulamasını başlat
const app = express();

// 🔧 Uygulama genel middleware ve ayarları
uygulaAyarlar(app);

// 🛣️ API Rotaları
app.use("/api/ogrenciler", ogrenciRota);
app.use("/api/yoneticiler", yoneticiRota);
app.use("/api/ringler", ringRota); // 🆕 Ring rotası aktif

// 🩺 Sağlık kontrolü
app.get("/api/saglik", (req, res) => {
  res.json({ durum: "ok", sunucu: "çalışıyor" });
});

// 🖥️ Ana test rotası
app.get("/", (req, res) => {
  res.send("✅ Vizia Kampüs Sunucusu Aktif ve Ring Modülü Entegre Edildi!");
});

// ❗ Genel hata yakalama (tüm rotalar için)
app.use((err, req, res, next) => {
  console.error("🔥 Sunucu hatası:", err.message);
  res.status(500).json({ hata: "Sunucu hatası oluştu." });
});

// ⚙️ Sunucuyu başlat
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda modüler yapıda çalışıyor...`);
});
