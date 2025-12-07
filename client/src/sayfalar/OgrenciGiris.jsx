import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function OgrenciGiris() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [mesaj, setMesaj] = useState("");

  const girisYap = async (e) => {
    e.preventDefault();
    setMesaj("");

    try {
      const res = await fetch("http://localhost:5050/api/ogrenciler/giris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sifre }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("ogrenci", JSON.stringify(data.ogrenci));
        navigate("/ogrenci/panel");
      } else {
        setMesaj(data.hata || "Bir hata oluştu.");
      }
    } catch {
      setMesaj("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-gray-100">
      {/* 🔙 Portala Dön Butonu */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Portala Dön</span>
      </button>

      {/* 🔑 Giriş Formu (GÖRÜNÜM AYNI) */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center border-t-4 border-red-600 animate-fade-in">
        <h2 className="text-2xl font-bold text-red-700 mb-6">Öğrenci Girişi</h2>

        <form onSubmit={girisYap} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Şifre"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

        {mesaj && (
          <p className="text-sm text-red-600 font-medium">{mesaj}</p>
        )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-md"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
