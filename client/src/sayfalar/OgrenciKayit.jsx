import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function OgrenciKayit() {
  const navigate = useNavigate();

  // 🧠 State'ler
  const [adsoyad, setAdsoyad] = useState("");
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [mesaj, setMesaj] = useState("");
  const [hata, setHata] = useState("");

  // ✅ Öğrenci kaydı gönder
  const kayitOl = async (e) => {
    e.preventDefault();
    setMesaj("");
    setHata("");

    try {
      const res = await fetch("http://localhost:5050/api/ogrenciler/kayit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adsoyad, email, sifre }),
      });

      const data = await res.json();

      if (res.ok) {
        setMesaj(data.mesaj);
        setAdsoyad("");
        setEmail("");
        setSifre("");
      } else {
        setHata(data.hata || "Bir hata oluştu.");
      }
    } catch (err) {
      console.error("Kayıt hatası:", err);
      setHata("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-white to-red-200">
      {/* 🔙 Portala Dön */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Portala Dön</span>
      </button>

      {/* 🧾 Öğrenci Kayıt Formu */}
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md border-t-4 border-red-600 animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-700">
          Öğrenci Kayıt
        </h2>

        <form onSubmit={kayitOl} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Ad Soyad
            </label>
            <input
              type="text"
              value={adsoyad}
              onChange={(e) => setAdsoyad(e.target.value)}
              placeholder="Adınızı ve soyadınızı girin"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ogrenci@site.com"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Şifre
            </label>
            <input
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              placeholder="•••••••"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-md"
          >
            Kayıt Ol
          </button>
        </form>

        {/* ✅ Mesaj veya hata */}
        {mesaj && (
          <p className="mt-5 text-center text-green-600 font-medium">{mesaj}</p>
        )}
        {hata && (
          <p className="mt-5 text-center text-red-600 font-medium">{hata}</p>
        )}

        {/* Alt bağlantı */}
        <p className="text-gray-600 text-sm mt-5 text-center">
          Zaten hesabınız var mı?{" "}
          <button
            onClick={() => navigate("/ogrenci/giris")}
            className="text-red-600 hover:underline font-medium"
          >
            Giriş Yap
          </button>
        </p>
      </div>
    </div>
  );
}
