import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function AdminGiris() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setHata("");

    // Basit kontrol (ileride backend'e bağlanacak)
    if (email === "admin@gmail.com" && sifre === "1234") {
      navigate("/admin/panel"); // 🔥 yönlendirme düzeltildi
    } else {
      setHata("E-posta veya şifre hatalı!");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 via-white to-red-200">
      {/* 🔙 Portala Dön Butonu */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Portala Dön</span>
      </button>

      {/* 🔑 Admin Giriş Formu */}
      <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md border-t-4 border-red-600 animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-700">
          Admin Giriş
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
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

          {hata && (
            <p className="text-center text-red-600 font-medium">{hata}</p>
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
