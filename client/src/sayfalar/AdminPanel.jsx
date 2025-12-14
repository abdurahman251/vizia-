import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// İkonlar (Solid ve Outline)
import { 
    ArrowLeftIcon, Cog6ToothIcon, UserGroupIcon as UserGroupSolid, 
    KeyIcon as KeySolid, AcademicCapIcon, BuildingOfficeIcon 
} from "@heroicons/react/24/solid"; 
import { 
    WrenchScrewdriverIcon, 
    UserGroupIcon, 
    EnvelopeOpenIcon, 
    PaperAirplaneIcon,
    CalendarDaysIcon, 
    ClockIcon,
    CheckBadgeIcon,
    UserPlusIcon,
    InformationCircleIcon
} from "@heroicons/react/24/outline"; 

// API Sabiti (Frontend'de tanımlı olmalı)
const API_URL = "http://localhost:5050"; 

// ===============================================
// YARDIMCI BİLEŞEN: YÖNETİCİ WIDGET'I (KALDIRILDI)
// ===============================================
// const AdminWidget = ... (Artık kullanılmıyor)

// ===============================================
// YARDIMCI BİLEŞEN: YÖNETİCİ YAN MENÜSÜ (SIDEBAR)
// ===============================================
const AdminSidebar = ({ admin, cikisYap, navigate, themeProps }) => {
    const location = useLocation();
    const isSuperAdmin = admin.role === 'SuperAdmin';
    const initials = admin?.adsoyad?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD';

    // SUPER ADMIN LİNKLERİ (Kontrol Odaklı) - "Kulüp Üyelik Onayları" KALDIRILDI
    const superAdminLinks = [
        { name: "Genel Dashboard", path: "/admin/panel", icon: BuildingOfficeIcon, color: 'text-blue-600' },
        { name: "Öğrenci Onayları", path: "/admin/onay", icon: AcademicCapIcon, color: 'text-red-600' },
        { name: "Başkan Hesap Yönetimi", path: "/admin/baskan-hesaplari", icon: KeySolid, color: 'text-purple-600' },
        { name: "Ring Saatleri Düzenle", path: "/admin/ringler", icon: ClockIcon, color: 'text-green-600' },
        { name: "Sistem Ayarları", path: "/admin/ayarlar", icon: Cog6ToothIcon, color: 'text-gray-600' },
        { name: "Tüm Kulüp Bilgileri", path: "/admin/kulupler", icon: BuildingOfficeIcon, color: 'text-indigo-600' },
    ];

    // BAŞKAN LİNKLERİ (Aksiyon Odaklı)
    const presidentLinks = [
        { name: "Kulüp Dashboard", path: "/admin/panel", icon: BuildingOfficeIcon, color: 'text-green-600' },
        { name: "Üyelik Başvuruları", path: "/admin/kulup-onay", icon: UserPlusIcon, color: 'text-red-500' },
        { name: "Etkinlik Yönetimi", path: "/admin/etkinlikler", icon: CalendarDaysIcon, color: 'text-orange-600' },
        { name: "Aktif Kulüp Üyeleri", path: "/admin/uyeler", icon: UserGroupSolid, color: 'text-blue-600' },
        { name: "Gelen Öğrenci Mesajları", path: "/admin/gelen-mesajlar", icon: EnvelopeOpenIcon, color: 'text-yellow-700' },
        { name: "Toplu Mesaj Gönder", path: "/admin/toplu-mesaj", icon: PaperAirplaneIcon, color: 'text-purple-600' },
        { name: "Kulüp Bilgilerini Yönet", path: "/admin/kulupler", icon: WrenchScrewdriverIcon, color: 'text-gray-600' },
    ];

    const menuLinks = isSuperAdmin ? superAdminLinks : presidentLinks;

    const NavItem = ({ link }) => {
        const isActive = location.pathname === link.path;
        return (
            <button
                onClick={() => navigate(link.path)}
                className={`flex items-center w-full px-3 py-3 rounded-lg text-sm font-medium transition duration-150 ${
                    isActive
                        ? `bg-gray-100 ${themeProps.primaryColor} font-extrabold shadow-inner`
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
                <link.icon className={`w-5 h-5 mr-3 ${link.color}`} />
                {link.name}
            </button>
        );
    };

    return (
        <div className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-300 shadow-2xl flex flex-col z-40">
            
            {/* 1. Üst Kısım: Logo */}
            <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-gray-50">
                <span className={`text-2xl font-extrabold tracking-wider ${themeProps.header}`}>
                    VIZIA <span className="text-gray-900">{isSuperAdmin ? 'ADMIN' : 'BAŞKAN'}</span>
                </span>
            </div>

            {/* 2. Profil Özeti */}
            <div className="p-4 border-b border-gray-200">
                 <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${themeProps.buttonBg} text-white font-bold text-md flex-shrink-0 shadow-lg`}>
                        {initials}
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 truncate">{admin.adsoyad.split(' ')[0]}</div>
                        <div className="text-xs text-gray-500 truncate">{isSuperAdmin ? 'Süper Yönetici' : admin.clubName}</div>
                    </div>
                </div>
            </div>

            {/* 3. Navigasyon Linkleri */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                <nav className="space-y-1">
                    <p className="text-xs font-bold uppercase text-gray-500 mb-2 px-3">
                        {isSuperAdmin ? 'SİSTEM MODÜLLERİ' : 'KULÜP YÖNETİMİ'}
                    </p>
                    {menuLinks.map((link) => (
                        <NavItem key={link.name} link={link} />
                    ))}
                </nav>
            </div>

            {/* 4. Alt Kısım: Çıkış */}
            <div className="p-4 border-t border-gray-200 space-y-2">
                <button
                    onClick={cikisYap}
                    className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-white ${themeProps.buttonBg} ${themeProps.hoverBg} shadow-md transition`}
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-3" />
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
};


// ===============================================
// YARDIMCI BİLEŞEN: STATİK BİLGİ KARTI
// ===============================================
const StaticInfoCard = ({ title, content, icon: Icon, borderColor, bgColor }) => (
    <div className={`bg-white p-6 rounded-xl shadow-xl border-t-4 ${borderColor} ${bgColor} transition duration-300`}>
        <div className="flex items-center mb-3">
            <Icon className={`w-6 h-6 mr-3 ${borderColor.replace('border', 'text')}`} />
            <h3 className="text-xl font-extrabold text-gray-800">{title}</h3>
        </div>
        <div className="text-gray-600 text-sm space-y-2">
            {content}
        </div>
    </div>
);


// ===============================================
// ANA SAYFA: YÖNETİCİ PANELİ (SADECE SIDEBAR)
// ===============================================
export default function AdminPanel() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Mock/State değişkenleri (Kaldırılan widget'lardan kalanlar)
    const [metric1, setMetric1] = useState(null); 
    const [metric2, setMetric2] = useState(null); 
    const [metric3, setMetric3] = useState(null); 
    const [metric4, setMetric4] = useState(null); 

    useEffect(() => {
        const veri = localStorage.getItem("admin");
        if (veri) {
            const parsedAdmin = JSON.parse(veri);
            setAdmin(parsedAdmin);
            setIsLoggedIn(true);

            // Mock Veri Ataması (Veriler Backend'den Çekilecek Varsayımıyla)
            if (parsedAdmin.role === 'SuperAdmin') {
                setMetric1(12);
                setMetric2(45);
                setMetric3(15);
                setMetric4("99.8%");
            } else if (parsedAdmin.role === 'ClubPresident') {
                setMetric1(7);
                setMetric2(4);
                setMetric3(5);
                setMetric4("4.5/5");
            }

        } else {
            navigate("/admin/giris");
        }
    }, [navigate]);


    const cikisYap = () => {
        localStorage.removeItem("admin");
        navigate("/admin/giris");
    };

    if (!isLoggedIn || !admin) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl font-semibold text-red-600">Yönetici Paneli Yükleniyor...</div>;
    }

    const isAdmin = admin.role === 'SuperAdmin';

    // ⭐ RENK TEMALARINI TANIMLA
    const theme = {
        SuperAdmin: {
            bgGradient: "from-blue-50 to-gray-100",
            primaryColor: "text-blue-700",
            borderColor: "border-blue-600",
            buttonBg: "bg-blue-600",
            hoverBg: "hover:bg-blue-700",
            header: "text-gray-800",
            subheader: "text-blue-600",
        },
        ClubPresident: {
            bgGradient: "from-green-50 to-yellow-50",
            primaryColor: "text-green-700",
            borderColor: "border-green-600",
            buttonBg: "bg-green-600",
            hoverBg: "hover:bg-green-700",
            header: "text-gray-900",
            subheader: "text-green-700",
        }
    };
    const currentTheme = isAdmin ? theme.SuperAdmin : theme.ClubPresident;

    const welcomeMessage = isAdmin 
        ? "Süper Yönetim Dashboard'u" 
        : `Başkan Kontrol Paneli`;


    // ===============================================
    // 🔥 STATİK İÇERİKLERİN TANIMLANMASI (VERİ ÇEKMEYEN)
    // ===============================================

    // 1. Süper Admin Statik İçerikleri
    const adminStaticContent = [
        {
            title: "Sistem Durumu Özeti (Güncel)",
            icon: InformationCircleIcon,
            borderColor: "border-blue-600",
            bgColor: "bg-white",
            content: (
                <>
                    <p>✅ Tüm temel sunucu modülleri stabil çalışıyor.</p>
                    <p>💾 Son veritabanı yedeklemesi: **Bugün (14/12/2025)** saat 02:00'de tamamlandı.</p>
                    <p>📈 Disk/Veritabanı Kullanımı: %45 (Optimal).</p>
                    <p className="font-semibold text-sm text-blue-700 mt-2">
                        Acil hata raporu bulunmamaktadır.
                    </p>
                </>
            )
        },
        {
            title: "Öğrenci Onay Kılavuzu",
            icon: AcademicCapIcon,
            borderColor: "border-red-600",
            bgColor: "bg-white",
            content: (
                <ol className="list-decimal list-inside space-y-1">
                    <li>Sol menüden **Öğrenci Onayları** modülüne gidin.</li>
                    <li>Listelenen her yeni kaydın e-posta adresini kontrol edin.</li>
                    <li>Onay için **'Doğrula'** butonuna tıklayın.</li>
                    <li>Onaydan sonra öğrenci sisteme giriş yapabilir.</li>
                </ol>
            )
        }
    ];

    // 2. Kulüp Başkanı Statik İçerikleri
    const presidentStaticContent = [
        {
            title: "Acil Hatırlatıcılar (Bu Hafta)",
            icon: EnvelopeOpenIcon,
            borderColor: "border-red-500",
            bgColor: "bg-white",
            content: (
                <ol className="list-decimal list-inside space-y-1 font-semibold">
                    <li>Üyelik başvurularına **48 saat içinde** cevap verme zorunluluğu.</li>
                    <li>Gelecek ayki etkinliğin **afişini** sisteme yükleyin.</li>
                    <li>Toplu mesaj modülünü kullanarak, aktif üyelerden geri bildirim toplayın.</li>
                    <li>Mesajlaşma: Cevaplanmamış öğrenci mesajlarını kontrol edin.</li>
                </ol>
            )
        },
        {
            title: "Kulüp Başarı İpuçları",
            icon: CheckBadgeIcon,
            borderColor: "border-green-600",
            bgColor: "bg-white",
            content: (
                <ul className="list-disc list-inside space-y-1">
                    <li>Katılımı artırmak için etkinliklerinizi en az **10 gün önceden** duyurun.</li>
                    <li>Mesajlaşma hızınız, öğrenci memnuniyetini doğrudan etkiler.</li>
                    <li>Daha fazla etkileşim için kulüp bilgilerinizi (slogan, açıklama) güncel tutun.</li>
                    <li>Yeni üye kazanımı için farklı bölümlere odaklanın.</li>
                </ul>
            )
        }
    ];

    const staticContents = isAdmin ? adminStaticContent : presidentStaticContent;


    return (
        // Sayfa Yapısı: Solda Sidebar (w-64), sağda içerik (ml-64 ile boşluk)
        <div className="min-h-screen flex"> 
            
            {/* 🔥🔥🔥 YÖNETİCİ/BAŞKAN YAN MENÜSÜ 🔥🔥🔥 */}
            <AdminSidebar admin={admin} cikisYap={cikisYap} navigate={navigate} themeProps={currentTheme} />
            
            {/* Ana İçerik Alanı (Sidebar genişliği kadar sola boşluk bırak) */}
            <div className={`flex-grow ml-64 p-4 sm:p-8 ${currentTheme.bgGradient}`}>
                
                <div className="max-w-6xl mx-auto py-8">
                    
                    {/* 1. HOŞ GELDİNİZ BAŞLIĞI */}
                    <header className="mt-10 mb-14">
                        <h1 className="text-5xl font-extrabold text-gray-900">
                            {welcomeMessage}
                        </h1>
                        <p className={`mt-3 text-lg ${currentTheme.subheader}`}>
                            {isAdmin 
                                ? `Hoş Geldin, ${admin.adsoyad.split(' ')[0]}. Lütfen sol menüden yönetmek istediğin modülü seç.` 
                                : `Hoş Geldin, ${admin.adsoyad.split(' ')[0]}. Kulübün için sol menüden bir aksiyon seç.`}
                        </p>
                    </header>

                    {/* 2. STATİK BİLGİ KARTLARI */}
                    <h2 className="text-2xl font-extrabold text-gray-800 mb-8 border-b pb-2">
                        {isAdmin ? 'Sistem Bilgilendirmesi & Kılavuz' : 'Acil Görevler & İpuçları'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {staticContents.map((card, index) => (
                            <StaticInfoCard
                                key={index}
                                title={card.title}
                                content={card.content}
                                icon={card.icon}
                                borderColor={card.borderColor}
                                bgColor={card.bgColor}
                            />
                        ))}
                    </div>
                    
                    {/* 4. Ek Bilgi Alanı */}
                    <div className="mt-20 text-center text-gray-500 border-t pt-4">
                        <p className="text-sm">VIZIA Yönetim Sistemi | Versiyon 2.0 (Sidebar Odaklı)</p>
                    </div>

                </div>
            </div>
        </div>
    );
}