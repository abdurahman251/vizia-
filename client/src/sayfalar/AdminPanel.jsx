import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { 
    WrenchScrewdriverIcon, 
    ChatBubbleLeftRightIcon, 
    UserGroupIcon, 
    EnvelopeOpenIcon, 
    PaperAirplaneIcon,
    KeyIcon, 
    CalendarDaysIcon // 🔥 Yeni İkon: Etkinlikler için
} from "@heroicons/react/24/outline"; 

export default function AdminPanel() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Oturum Kontrolü ve Yetki Bilgisini Yükleme
        const veri = localStorage.getItem("admin");
        if (veri) {
            const parsedAdmin = JSON.parse(veri);
            setAdmin(parsedAdmin);
            setIsLoggedIn(true);
        } else {
            // Oturum yoksa Admin Girişine yönlendir
            navigate("/admin/giris");
        }
    }, [navigate]);

    const cikisYap = () => {
        localStorage.removeItem("admin");
        navigate("/admin/giris");
    };

    if (!isLoggedIn) {
        return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Yönlendiriliyor...</div>;
    }

    // ⭐ YETKİ KONTROLÜ
    const isAdmin = admin.role === 'SuperAdmin';
    const isPresident = admin.role === 'ClubPresident';

    const getWelcomeMessage = () => {
        if (isAdmin) {
            return `Merhaba, ${admin.adsoyad} (Sınırsız Yönetici)`;
        }
        if (isPresident) {
            return `Hoş Geldiniz, ${admin.adsoyad} (${admin.clubName} Başkanı)`;
        }
        return "Yönetim Paneli";
    };

    const AdminCard = ({ title, description, path, icon: Icon, color = 'text-red-700' }) => (
        <button
            onClick={() => navigate(path)}
            className="bg-white shadow-lg border-t-4 border-red-600 rounded-2xl p-8 flex flex-col items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-2xl"
        >
            <Icon className={`w-10 h-10 mb-2 ${color}`} />
            <span className="text-2xl font-semibold text-gray-800">
                {title}
            </span>
            <p className="text-gray-600 mt-2 text-sm">
                {description}
            </p>
        </button>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 p-6 relative">
            
            {/* 🔙 Çıkış Butonu */}
            <button
                onClick={cikisYap}
                className="absolute top-6 right-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Çıkış Yap</span>
            </button>
            
            {/* Başlık */}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {getWelcomeMessage()}
            </h1>
            <p className="text-sm text-red-600 mb-10 italic">
                {isPresident ? 'Sadece kendi kulübünüzü yönetebilirsiniz.' : 'Tüm sistem yönetimine erişiminiz var.'}
            </p>

            {/* ⭐ KARTLAR - Yetkiye Göre Gösterim */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl">
                
                {/* 1. KULÜP YÖNETİMİ (Ortak Modül - Herkes Görür) */}
                <AdminCard 
                    title="Kulüp Yönetimi" 
                    description={isPresident ? `Kendi kulübünüzü (${admin.clubName}) yönetin.` : 'Tüm kulüp verilerini düzenleyin.'}
                    path="/admin/kulupler" // AdminKulupler.jsx sayfasına gider
                    icon={WrenchScrewdriverIcon}
                    color="text-red-700"
                />

                {/* 2. SUPER ADMIN MODÜLLERİ (Sadece Super Admin Görür) */}
                {isAdmin && (
                    <>
                        {/* 🔥 KULÜP BAŞKANI HESAP YÖNETİMİ */}
                        <AdminCard 
                            title="Başkan Hesapları" 
                            description="Kulüp başkanlarının giriş e-posta ve şifrelerini (gizli) yönetin."
                            path="/admin/baskan-hesaplari" 
                            icon={KeyIcon}
                            color="text-purple-600"
                        />

                        {/* Öğrenci Onay */}
                        <AdminCard 
                            title="Öğrenci Onay" 
                            description="Yeni kayıtları görüntüle ve onayla"
                            path="/admin/onay"
                            icon={UserGroupIcon}
                            color="text-blue-600"
                        />
                         {/* Ring Saatleri */}
                        <AdminCard 
                            title="Ring Saatleri" 
                            description="Kampüs ring saatlerini düzenle"
                            path="/admin/ringler"
                            icon={ChatBubbleLeftRightIcon}
                            color="text-green-600"
                        />
                    </>
                )}
                
                {/* 3. BAŞKAN MODÜLLERİ (Sadece Kulüp Başkanı Görür) */}
                {isPresident && (
                    <>
                        {/* 🔥 YENİ KART: ETKİNLİK YÖNETİMİ 🔥 */}
                        <AdminCard 
                            title="Etkinlik Yönetimi" 
                            description="Yeni etkinlik ekleyin, düzenleyin ve katılımı takip edin."
                            path="/admin/etkinlikler" // AdminEtkinlikler.jsx rotasına gider
                            icon={CalendarDaysIcon} 
                            color="text-orange-600" 
                        />
                        
                        {/* Üyelik Başvuruları Kartı */}
                        <AdminCard 
                            title="Üyelik Başvuruları" 
                            description="Kulübünüze gelen yeni üye başvurularını inceleyin ve onaylayın."
                            path="/admin/kulup-onay" // AdminKulupOnay.jsx sayfasına gider
                            icon={UserGroupIcon}
                            color="text-blue-600"
                        />
                        
                        {/* ONAYLANMIŞ ÜYELERİ GÖRME */}
                        <AdminCard 
                            title="Kulüp Üyeleri" 
                            description={`Kulübünüzün onaylanmış üyelerini görüntüleyin ve yönetin.`} 
                            path="/admin/uyeler" // AdminUyeler.jsx sayfasına gider
                            icon={UserGroupIcon} 
                            color="text-green-600" 
                        />
                        
                        {/* Gelen Mesajları Yönetme Kartı */}
                        <AdminCard 
                            title="Gelen Öğrenci Mesajları" 
                            description="Kulübünüze gelen cevaplanmamış mesajları görüntüleyin ve cevaplayın."
                            path="/admin/gelen-mesajlar" // AdminGelenMesajlar.jsx sayfasına gider
                            icon={EnvelopeOpenIcon}
                            color="text-red-600"
                        />
                        
                        {/* Üyelere Toplu Mesaj Gönderme Kartı */}
                        <AdminCard 
                            title="Üyelere Toplu Mesaj" 
                            description="Kendi kulübünüzün tüm onaylı üyelerine anlık bildirim/mesaj gönderin."
                            path="/admin/toplu-mesaj" // AdminTopluMesaj.jsx sayfasına gider
                            icon={PaperAirplaneIcon}
                            color="text-orange-600"
                        />
                    </>
                )}
            </div>
        </div>
    );
}