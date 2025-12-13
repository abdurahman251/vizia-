import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Gerekli Heroicon'ları import edelim
import { CalendarDaysIcon, CalculatorIcon, ShoppingBagIcon, MapIcon, ClockIcon, Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/outline"; 

export default function AnaSayfa() {
    const navigate = useNavigate();
    // Dropdown menü durumunu yönetmek için yeni state
    const [isServicesOpen, setIsServicesOpen] = useState(false);

    // Servis butonları verisi
    const services = [
        { name: "Kat Planları", path: "/ogrenci/kat-planlari", icon: MapIcon },
        { name: "Ring Saatleri", path: "/ogrenci/ring-saatleri", icon: ClockIcon },
        { name: "Kampüs Mağazası", path: "/ogrenci/magaza", icon: ShoppingBagIcon },
        { name: "Akademik Takvim", path: "/akademik/takvim", icon: CalendarDaysIcon },
        { name: "Ücret Hesaplama", path: "/ucret/hesaplama", icon: CalculatorIcon },
    ];

    return (
        <div
            className="relative min-h-screen flex flex-col bg-cover bg-center text-gray-800"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
                backgroundAttachment: "fixed",
            }}
        >
            {/* 🔹 Üst Navigasyon Bar - DEĞİŞİKLİK YOK */}
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

            {/* Diğer Overlay'ler - DEĞİŞİKLİK YOK */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-100/40 via-white/20 to-white/50"></div>
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

            {/* 🔹 İçerik Kutusu - BUTONLAR GÜNCELLENDİ */}
            <main className="relative z-10 flex flex-col items-center justify-center flex-grow p-6 text-center">
                <div className="bg-white/50 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-10 max-w-4xl w-full border-t-4 border-red-600 animate-fade-in">
                    <h1 className="text-4xl font-extrabold text-red-700 mb-6 drop-shadow-md">
                        Vizia Kampüs’e Hoş Geldiniz
                    </h1>
                    <p className="text-gray-700 mb-8 text-lg">
                        Lütfen yapmak istediğiniz işlemi seçin.
                    </p>

                    {/* ⭐⭐⭐ 4 ANA BUTON DİZİLİMİ ⭐⭐⭐ */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        
                        {/* 1. KAMPÜS SERVİSLERİ MENÜSÜ (DROPDOWN) */}
                        <div className="relative z-30">
                            <button
                                onClick={() => setIsServicesOpen(!isServicesOpen)}
                                className="w-full bg-red-500 text-white py-4 rounded-lg font-semibold hover:bg-red-600 transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                                <Bars3Icon className="w-6 h-6" />
                                Kampüs Servisleri
                                <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform ${isServicesOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </button>

                            {/* Açılır Menü İçeriği */}
                            {isServicesOpen && (
                                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden text-left animate-slide-down">
                                    {services.map((service) => (
                                        <button
                                            key={service.name}
                                            onClick={() => {
                                                navigate(service.path);
                                                setIsServicesOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition"
                                        >
                                            <service.icon className="w-5 h-5 flex-shrink-0 text-red-500" />
                                            {service.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* 2. Öğrenci Giriş */}
                        <button
                            onClick={() => navigate("/ogrenci/giris")}
                            className="bg-red-600 text-white py-4 rounded-lg font-semibold hover:bg-red-700 transition transform hover:scale-105 shadow-lg"
                        >
                            Öğrenci Giriş
                        </button>

                        {/* 3. Öğrenci Kayıt */}
                        <button
                            onClick={() => navigate("/ogrenci/kayit")}
                            className="bg-white/70 border border-red-600 text-red-700 py-4 rounded-lg font-semibold hover:bg-red-50 transition transform hover:scale-105 shadow-lg"
                        >
                            Öğrenci Kayıt
                        </button>

                        {/* 4. Admin Giriş */}
                        <button
                            onClick={() => navigate("/admin/giris")}
                            className="bg-gray-800/90 text-white py-4 rounded-lg font-semibold hover:bg-gray-900 transition transform hover:scale-105 shadow-lg"
                        >
                            Admin Giriş
                        </button>
                    </div>
                </div>
            </main>

            {/* ⚫ Alt Bilgi (Footer) - DEĞİŞİKLİK YOK */}
            <footer className="relative z-10 text-center py-6 text-gray-600 text-sm bg-white/40 backdrop-blur-sm shadow-inner">
                © 2025 Vizia Kampüs • Tüm Hakları Saklıdır.
            </footer>
        </div>
    );
}