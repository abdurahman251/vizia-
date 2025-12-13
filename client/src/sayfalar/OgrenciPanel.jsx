import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
// Yeni Heroicon'ları import edelim
// ⭐ UsersIcon Kulüpler Modülü için eklendi
import { CalendarDaysIcon, CalculatorIcon, ShoppingBagIcon, MapIcon, ClockIcon, Bars3Icon, ChevronDownIcon, UsersIcon } from "@heroicons/react/24/outline"; 

export default function OgrenciPanel() {
    const navigate = useNavigate();
    const [ogrenci, setOgrenci] = useState(null);
    // Dropdown menü durumunu yönetmek için yeni state
    const [isServicesOpen, setIsServicesOpen] = useState(false);

    // ⭐⭐⭐ KULÜPLER VE ETKİNLİKLER BUTONLARI BURAYA EKLENDİ ⭐⭐⭐
    const services = [
        { name: "Kulüpler Dünyası", path: "/kulupler", icon: UsersIcon, color: 'text-red-700' }, 
        // 🔥 YENİ BUTON: Tüm Etkinlikler Modülü 🔥
        { name: "Kampüs Etkinlikleri", path: "/etkinlikler", icon: CalendarDaysIcon, color: 'text-purple-600' }, 
        { name: "Ücret Hesaplama Aracı", path: "/ucret/hesaplama", icon: CalculatorIcon, color: 'text-blue-600' },
        { name: "Akademik Takvim", path: "/akademik/takvim", icon: CalendarDaysIcon, color: 'text-red-500' },
        { name: "Ring Saatleri", path: "/ogrenci/ring-saatleri", icon: ClockIcon, color: 'text-red-600' },
        { name: "Kat Planları", path: "/ogrenci/kat-planlari", icon: MapIcon, color: 'text-blue-600' },
        { name: "Kampüs Mağazası", path: "/ogrenci/magaza", icon: ShoppingBagIcon, color: 'text-slate-600' },
    ];


    useEffect(() => {
        // ⚠️ Not: Bu kısım, öğrencinin oturum açıp açmadığını kontrol eder.
        const veri = localStorage.getItem("ogrenci");
        if (veri) {
            setOgrenci(JSON.parse(veri));
        } else {
            // Eğer oturum yoksa, giriş sayfasına yönlendir.
            navigate("/ogrenci/giris");
        }
    }, [navigate]);

    const cikisYap = () => {
        localStorage.removeItem("ogrenci");
        navigate("/ogrenci/giris");
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-gray-100">
            {/* 🔙 Çıkış Butonu */}
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

                        {/* ⭐⭐⭐ KAMPÜS SERVİSLERİ MENÜSÜ (DROPDOWN) ⭐⭐⭐ */}
                        <div className="relative z-30 mt-8">
                            <button
                                onClick={() => setIsServicesOpen(!isServicesOpen)}
                                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                            >
                                <Bars3Icon className="w-5 h-5" />
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
                                            // Her butona farklı bir renk ikonu ekledik
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition"
                                        >
                                            <service.icon className={`w-5 h-5 flex-shrink-0 ${service.color}`} />
                                            {service.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Eski butolar kaldırıldı, menüye dahil edildi. */}
                        
                    </>
                ) : (
                    <p>Yükleniyor…</p>
                )}
            </div>
        </div>
    );
}