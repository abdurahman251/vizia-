import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function OgrenciPanel() {
  const navigate = useNavigate();
  const [ogrenci, setOgrenci] = useState(null);

  useEffect(() => {
    const veri = localStorage.getItem("ogrenci");
    if (veri) {
      setOgrenci(JSON.parse(veri));
    } else {
      navigate("/ogrenci/giris");
    }
  }, [navigate]);

  const cikisYap = () => {
    localStorage.removeItem("ogrenci");
    navigate("/ogrenci/giris");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-gray-100">
      {/* 🔙 Çıkış */}
      <button
        onClick={cikisYap}
        className="absolute top-6 left-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Çıkış Yap</span>
      </button>

      {/* 🧾 Panel Kartı */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center border-t-4 border-red-600 animate-fade-in">
        <h2 className="text-2xl font-bold text-red-700 mb-6">Öğrenci Paneli</h2>

        {ogrenci ? (
          <>
            <p className="text-xl font-semibold text-gray-800">
              Hoş geldin, {ogrenci.adsoyad} 🎓
            </p>
            <p className="text-gray-600 mt-2">{ogrenci.email}</p>

            <div className="mt-6 text-sm text-gray-500">
              Bu alan şu an bilgi ekranı. İleride modüller (Dersler, Notlar,
              Duyurular…) buraya eklenecek.
            </div>

            {/* 🚌 Ring Saatleri Butonu */}
            <button
              onClick={() => navigate("/ogrenci/ring-saatleri")}
              className="mt-8 w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-md"
            >
              🚌 Ring Saatleri
            </button>

            {/* 🗺️ ⭐ Sadece EKLENEN BUTON — başka hiçbir şeye dokunulmadı */}
            <button
              onClick={() => navigate("/ogrenci/kat-planlari")}
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md"
            >
              🗺️ Kat Planları
            </button>

          </>
        ) : (
          <p>Yükleniyor…</p>
        )}
      </div>
    </div>
  );
}
