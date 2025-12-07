import { useNavigate } from "react-router-dom";

export default function AnaSayfa() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen flex flex-col bg-cover bg-center text-gray-800"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* 🔹 Üst Navigasyon Bar */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-5 bg-white/40 backdrop-blur-md shadow-md z-20">
        <h1 className="text-2xl font-extrabold text-red-700 tracking-wide drop-shadow-sm">
          🎓 Vizia Kampüs Portalı
        </h1>
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <button className="hover:text-red-600 transition">Ana Sayfa</button>
          <button className="hover:text-red-600 transition">Hakkında</button>
          <button className="hover:text-red-600 transition">İletişim</button>
        </nav>
      </header>

      {/* 🌈 Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-100/40 via-white/20 to-white/50"></div>

      {/* 🔲 Arka plan overlay — hafif beyaz tonlu */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      {/* 🔹 İçerik Kutusu (Glassmorphism aktif) */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 text-center">
        <div className="bg-white/50 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-10 max-w-2xl w-full border-t-4 border-red-600 animate-fade-in">
          <h1 className="text-4xl font-extrabold text-red-700 mb-6 drop-shadow-md">
            Vizia Kampüs’e Hoş Geldiniz
          </h1>
          <p className="text-gray-700 mb-8 text-lg">
            Lütfen yapmak istediğiniz işlemi seçin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate("/ogrenci/giris")}
              className="bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition transform hover:scale-105 shadow-md hover:shadow-[0_0_15px_rgba(239,68,68,0.7)]"
            >
              Öğrenci Giriş
            </button>

            <button
              onClick={() => navigate("/ogrenci/kayit")}
              className="bg-white/70 border border-red-600 text-red-700 py-4 rounded-lg font-semibold hover:bg-red-50 transition transform hover:scale-105 shadow-md hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            >
              Öğrenci Kayıt
            </button>

            <button
              onClick={() => navigate("/admin/giris")}
              className="bg-gray-800/90 text-white py-4 rounded-lg font-semibold hover:bg-gray-900 transition transform hover:scale-105 shadow-md hover:shadow-[0_0_15px_rgba(31,41,55,0.7)]"
            >
              Admin Giriş
            </button>
          </div>
        </div>
      </main>

      {/* ⚫ Alt Bilgi (Footer) */}
      <footer className="relative z-10 text-center py-6 text-gray-600 text-sm bg-white/40 backdrop-blur-sm shadow-inner">
        © 2025 Vizia Kampüs • Tüm Hakları Saklıdır.
      </footer>
    </div>
  );
}