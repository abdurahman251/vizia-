// ==================================
// uygulamaAyar.js (global middleware)
// ==================================
import express from "express";
import cors from "cors";

export function uygulaAyarlar(app) {
  // 🧩 JSON gövdelerini parse et
  app.use(express.json({ limit: "1mb" }));

  // 🧾 Form verilerini parse et
  app.use(express.urlencoded({ extended: true }));

  // 🌍 CORS ayarları (frontend ve testler için)
  app.use(
    cors({
      origin: [
        "http://localhost:5173", // Vite dev server
        "http://localhost:3000", // React CRA
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
    })
  );
}
