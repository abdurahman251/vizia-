 import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// ⭐ YENİ: Profil ikonları (Solid set)
import { ArrowLeftIcon, Cog6ToothIcon, HomeIcon, UserGroupIcon, FireIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
// ⭐ YENİ: Servis ikonları (Outline set)
import { 
    CalendarDaysIcon, 
    UsersIcon, 
    CalculatorIcon, 
    ShoppingBagIcon, 
    MapIcon, 
    ClockIcon,
    EnvelopeIcon
} from "@heroicons/react/24/outline"; 

// API Sabiti (Backend'inizin çalıştığı adresi kontrol edin)
const API_URL = "http://localhost:5050"; 

// ===============================================
// SERVİS MERKEZİ LİSTESİ
// ===============================================
const SERVICES_LIST = [
    { name: "Ana Panel", path: "/ogrenci/panel", icon: HomeIcon, color: 'text-red-600', isCore: true },
    { name: "Kulüpler Dünyası", path: "/kulupler", icon: UsersIcon, color: 'text-red-700', isCore: true }, 
    { name: "Kampüs Etkinlikleri", path: "/etkinlikler", icon: CalendarDaysIcon, color: 'text-purple-600', isCore: true }, 
    // Daha az önemli/merkezi servisler
    { name: "Ücret Hesaplama", path: "/ucret/hesaplama", icon: CalculatorIcon, color: 'text-blue-600', isCore: false },
    { name: "Akademik Takvim", path: "/akademik/takvim", icon: CalendarDaysIcon, color: 'text-red-500', isCore: false },
    { name: "Ring Saatleri", path: "/ogrenci/ring-saatleri", icon: ClockIcon, color: 'text-red-600', isCore: false },
    { name: "Kat Planları", path: "/ogrenci/kat-planlari", icon: MapIcon, color: 'text-blue-600', isCore: false },
    { name: "Kampüs Mağazası", path: "/ogrenci/magaza", icon: ShoppingBagIcon, color: 'text-slate-600', isCore: false },
    { name: "Gelen Kutum", path: "/ogrenci/mesajlar", icon: EnvelopeIcon, color: 'text-teal-600', isCore: false }, 
    { name: "Ayarlar & Profil", path: "/ogrenci/profil", icon: Cog6ToothIcon, color: 'text-gray-600', isCore: false },
];


// ===============================================
// YARDIMCI BİLEŞEN: ANALİTİK WIDGET (MODERN KART)
// İşlevsiz Kart: Tıklama özelliği kaldırıldı.
// ===============================================
const AnalyticsWidget = ({ title, value, icon: Icon, gradient }) => (
    <div 
        // onClick özelliği kaldırıldı, sadece bilgi amaçlı kart oldu
        className={`p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 transform text-white ${gradient}`}
    >
        <div className="flex justify-between items-center">
            {/* Yüklenirken Spinner Göster */}
            {value === null 
                ? <svg className="animate-spin w-10 h-10 text-white opacity-70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                : <Icon className="w-10 h-10 opacity-70" />}
            
            {/* Yüklenirken veya Hata varsa Placeholder göster */}
            <span className="text-3xl font-extrabold">
                {value === null ? '...' : (value === 'Hata' ? 'X' : value)}
            </span>
        </div>
        <h3 className="text-sm font-semibold mt-4 opacity-90">{title}</h3>
        <p className="text-xs mt-1 opacity-80">
            {value === null ? 'Yükleniyor...' : 'Sadece bilgi amaçlı özet'}
        </p>
    </div>
);


// ===============================================
// YARDIMCI BİLEŞEN: MİNİMALİST YAN MENÜ (SIDEBAR)
// ===============================================
const OgrenciSidebar = ({ ogrenci, cikisYap, navigate }) => {
    const location = useLocation();
    const initials = ogrenci?.adsoyad?.split(' ').map(n => n[0]).join('').toUpperCase() || 'OG';
    
    // Alt kısım Ayarlar ve Çıkış için kullanılan linkleri filtreliyoruz
    const navLinks = SERVICES_LIST.filter(s => s.path !== "/ogrenci/profil");
    
    const coreLinks = navLinks.filter(s => s.isCore);
    const otherLinks = navLinks.filter(s => !s.isCore);
    const profileSettings = SERVICES_LIST.find(s => s.path === "/ogrenci/profil");

    const NavItem = ({ service }) => {
        const isActive = location.pathname === service.path;
        return (
            <button
                onClick={() => navigate(service.path)}
                className={`flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium transition duration-150 ${
                    isActive
                        ? 'bg-red-50 text-red-700 font-bold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
                <service.icon className={`w-5 h-5 mr-3 ${service.color}`} />
                {service.name}
            </button>
        );
    };


    return (
        <div className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-xl flex flex-col z-40">
            
            {/* 1. Üst Kısım: Logo */}
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <span className="text-2xl font-extrabold text-red-600 tracking-wider">
                    VIZIA <span className="text-gray-900">KAMPÜS</span>
                </span>
            </div>

            {/* 2. Profil Özeti */}
            <div className="p-4 border-b border-gray-100">
                 <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/ogrenci/profil")}>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white font-bold text-md flex-shrink-0 shadow">
                        {initials}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 truncate">{ogrenci.adsoyad.split(' ')[0]}</div>
                        <div className="text-xs text-gray-500 truncate">{ogrenci.email}</div>
                    </div>
                </div>
            </div>

            {/* 3. Navigasyon Linkleri */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                
                {/* Ana Modüller */}
                <nav className="space-y-1">
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-2 px-3">Ana Modüller</p>
                    {coreLinks.map((service) => (
                        <NavItem key={service.name} service={service} />
                    ))}
                </nav>

                {/* Diğer Servisler */}
                <nav className="space-y-1 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold uppercase text-gray-400 mb-2 px-3">Kampüs Araçları</p>
                    {otherLinks.map((service) => (
                        <NavItem key={service.name} service={service} />
                    ))}
                </nav>
            </div>

            {/* 4. Alt Kısım: Ayarlar ve Çıkış */}
            <div className="p-4 border-t border-gray-200 space-y-2">
                <button
                    onClick={() => navigate(profileSettings.path)}
                    className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                >
                    <profileSettings.icon className="w-5 h-5 mr-3 text-gray-500" />
                    {profileSettings.name}
                </button>
                <button
                    onClick={cikisYap}
                    className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-3" />
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
};


// ===============================================
// YARDIMCI BİLEŞEN: POPÜLER KULÜPLER AKIŞI
// ===============================================
const PopularClubs = ({ navigate }) => {
    // 🔥 Mock Popüler Kulüp Verisi (API'dan çekilmelidir)
    const mockClubs = [
        { name: "BİLİŞİM KULÜBÜ", members: 120, category: "Akademi" },
        { name: "DANS KULÜBÜ", members: 85, category: "Sanat" },
        { name: "DOĞUŞTAN GÖNÜLLÜLER", members: 150, category: "Sosyal" },
    ];

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Kampüsün Gözdesi (Popüler Kulüpler)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockClubs.map((club, index) => (
                    <div
                        key={index}
                        onClick={() => navigate("/kulupler")} // Kulüpler sayfasına yönlendirir
                        className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300 cursor-pointer"
                    >
                        <div className="flex justify-between items-start">
                            <h4 className="text-lg font-bold text-gray-900">{club.name}</h4>
                            <FireIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{club.category}</p>
                        <div className="mt-4 flex items-center text-sm font-semibold text-gray-700">
                            <UserGroupIcon className="w-4 h-4 mr-1 text-gray-400" />
                            {club.members} Aktif Üye
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// ===============================================
// ANA SAYFA: ÖĞRENCİ PANELİ
// ===============================================
export default function OgrenciPanel() {
    const navigate = useNavigate();
    const [ogrenci, setOgrenci] = useState(null);
    
    // 🔥 Durum Özeti State'leri
    const [activeClubsCount, setActiveClubsCount] = useState(null); // Başlangıçta null: Yükleniyor
    const [unreadMessages, setUnreadMessages] = useState(2); // Şimdilik mock
    const [upcomingEvents, setUpcomingEvents] = useState(5); // Şimdilik mock
    const [profileCompletion, setProfileCompletion] = useState("80%"); // Şimdilik mock


    // 🔥 API'dan Aktif Kulüp Sayısını Çekme Fonksiyonu
    const fetchActiveClubsCount = async (id) => {
        if (!id) return;
        try {
            // 🔥🔥🔥 DÜZELTME YAPILDI: '/api/ogrenci/' yerine Backend'deki doğru rota '/api/ogrenciler/' kullanıldı 🔥🔥🔥
            const response = await fetch(`${API_URL}/api/ogrenciler/aktif-uyelik-sayisi?ogrenci_id=${id}`); 
            
            if (!response.ok) {
                 // Hata durumunda, yanıtın detaylarını loglayabiliriz
                 const errorText = await response.text();
                 console.error("API Yanıt Hatası (404/500):", errorText);
                 throw new Error('Aktif kulüp sayısı yüklenemedi.');
            }
            
            const data = await response.json();
            // Varsayım: Backend sadece sayıyı döndürüyor: { sayi: 3 }
            setActiveClubsCount(data.sayi || 0);

        } catch (err) {
            console.error("Aktif Kulüp Sayısı Hatası:", err);
            setActiveClubsCount('Hata'); // Hata durumunda 'Hata' mesajı gösterilebilir
        }
    };
    

    useEffect(() => {
        const veri = localStorage.getItem("ogrenci");
        if (veri) {
            const parsedOgrenci = JSON.parse(veri);
            setOgrenci(parsedOgrenci);
            
            // Öğrenci verisi yüklendikten sonra API çağrılarını başlat
            if (parsedOgrenci.id) {
                // Aktif Kulüpler Sayısını çek
                fetchActiveClubsCount(parsedOgrenci.id); 
            }

        } else {
            navigate("/ogrenci/giris");
        }
    }, [navigate]); 

    const cikisYap = () => {
        localStorage.removeItem("ogrenci");
        navigate("/ogrenci/giris");
    };
    
    // Öğrenci verileri yüklenene kadar beklet
    if (!ogrenci) {
         return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl font-semibold text-red-600">Yükleniyor...</div>;
    }

    // Durum Özeti Verileri (Artık state'leri kullanıyor, Aktif Üyelikler dinamik)
    const analyticsData = [
        { 
            title: "Aktif Üyeliklerim", 
            value: activeClubsCount, // GERÇEK VERİ BURADAN ÇEKİLECEK
            icon: UserGroupIcon, 
            gradient: "bg-gradient-to-br from-red-600 to-pink-500",
        },
        { 
            title: "Okunmamış Mesajlar", 
            value: unreadMessages, 
            icon: EnvelopeIcon, 
            gradient: "bg-gradient-to-br from-teal-500 to-green-600",
        },
        { 
            title: "Yaklaşan Etkinlikler (7 Gün)", 
            value: upcomingEvents, 
            icon: CalendarDaysIcon, 
            gradient: "bg-gradient-to-br from-indigo-500 to-purple-600",
        },
        { 
            title: "Profil Tamamlanma", 
            value: profileCompletion, 
            icon: CheckCircleIcon, 
            gradient: "bg-gradient-to-br from-yellow-500 to-orange-600",
        },
    ];


    return (
        // Sayfa Yapısı: Solda Sidebar (w-64), sağda içerik (ml-64 ile boşluk)
        <div className="min-h-screen bg-gray-50 flex"> 
            
            {/* 🔥🔥🔥 YAN MENÜ 🔥🔥🔥 */}
            <OgrenciSidebar ogrenci={ogrenci} cikisYap={cikisYap} navigate={navigate} />
            
            {/* Ana İçerik Alanı (Sidebar genişliği kadar sola boşluk bırak) */}
            <div className="flex-grow ml-64 p-4 sm:p-8">
                
                <div className="max-w-6xl mx-auto py-8">
                    
                    {/* 1. HOŞ GELDİNİZ BAŞLIĞI */}
                    <header className="mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                            Hoş Geldin, <span className="text-red-600">{ogrenci.adsoyad.split(' ')[0]}</span>!
                        </h1>
                        <p className="mt-2 text-lg text-gray-500">
                            Buradan tüm kampüs servislerine hızlıca erişebilirsin.
                        </p>
                    </header>

                    {/* 2. MODERN GÖSTERGE PANELİ WIDGET'LARI */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Durum Özeti</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                         {analyticsData.map((data) => (
                            // İşlevsiz Widget'lar
                            <AnalyticsWidget 
                                key={data.title}
                                title={data.title}
                                value={data.value}
                                icon={data.icon}
                                gradient={data.gradient}
                                // onClick kaldırıldı
                            />
                        ))}
                    </div>

                    {/* 3. POPÜLER KULÜPLER */}
                    <PopularClubs navigate={navigate} />
                    
                    {/* 4. Ek Bilgi Alanı */}
                    <div className="mt-16 text-center text-gray-400">
                        <p>VIZIA Kampüs Sistemi | Tüm hakları saklıdır.</p>
                    </div>

                </div>
            </div>
        </div>
    );
} 