import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 p-6 relative">
      {/* 🔙 Geri Butonu */}
      <button
        onClick={() => navigate(-1)} // 🔥 artık önceki sayfaya döner
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Geri
      </button>

      {/* Başlık */}
      <h1 className="text-3xl font-bold text-red-700 mb-8">
        Admin Kontrol Paneli
      </h1>

      {/* Kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* 🧾 Öğrenci Onay */}
        <button
          onClick={() => navigate("/admin/onay")}
          className="bg-white shadow-lg border-t-4 border-red-600 rounded-2xl p-8 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-2xl"
        >
          <span className="text-2xl font-semibold text-red-700">
            🧾 Öğrenci Onay
          </span>
          <p className="text-gray-600 mt-2 text-sm">
            Yeni kayıtları görüntüle ve onayla
          </p>
        </button>

        {/* 🚌 Ring Saatleri */}
        <button
          onClick={() => navigate("/admin/ringler")}
          className="bg-white shadow-lg border-t-4 border-red-600 rounded-2xl p-8 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-2xl"
        >
          <span className="text-2xl font-semibold text-red-700">
            🚌 Ring Saatleri
          </span>
          <p className="text-gray-600 mt-2 text-sm">
            Kampüs ring saatlerini düzenle
          </p>
        </button>
      </div>
    </div>
  );
}
