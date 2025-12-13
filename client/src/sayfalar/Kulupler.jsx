import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MagnifyingGlassIcon, UsersIcon, AcademicCapIcon, BoltIcon, HeartIcon, SparklesIcon, PaintBrushIcon, ChatBubbleLeftRightIcon, UserGroupIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'; 

// CSS IMPORTUNUN DOĞRU OLDUĞUNDAN EMİN OLUN!
import '../App.css'; 


// API Sabiti ve Öğrenci Bilgileri artık bu sayfada kullanılmayacak, 
const API_URL = "http://localhost:5050"; 


// **********************************************
// 1. KULÜPLER VERİ YAPISI (CLUBS Data Model)
// **********************************************
const Categories = {
    SPOR: "Spor",
    SANAT: "Sanat & Kültür",
    AKADEMI: "Akademi & Kariyer",
    SOSYAL: "Sosyal Sorumluluk"
};

// KRİTİK: STATİK LOGO YOLLARI BURADA TANIMLANDI.
const CLUBS = [
    { id: 1, name: "BİLİŞİM KULÜBÜ", category: Categories.AKADEMI, president: "HALİL İBRAHİM SARAL", email: "halil@vizia.edu", members: 350, logo: "/logos/bilisim.png", slogan: "Dijital dönüşüme liderlik ediyoruz.", longDesc: "Yazılım, siber güvenlik, veri bilimi ve yapay zeka konularında bilgi ve becerileri geliştirmeyi amaçlar. Düzenli atölyeler ve sektör profesyonelleriyle buluşmalar düzenliyoruz.", location: "A Blok 302", established: "1 Ekim 2025" },
    { id: 2, name: "HUKUK KULÜBÜ", category: Categories.AKADEMI, president: "YAZGI ÖZBAY", email: "yazgi@vizia.edu", members: 280, logo: "/logos/hukuk.png", slogan: "Adaletin ve hukukun üstünlüğü.", longDesc: "Hukuk öğrencilerini bir araya getirerek güncel hukuki meseleler üzerine seminerler, paneller ve münazaralar düzenliyoruz. Hukuk nosyonunu geliştirmeyi hedefliyoruz.", location: "Hukuk Fakültesi", established: "1 Ekim 2025" },
    { id: 3, name: "AKIL OYUNLARI KULÜBÜ", category: Categories.SANAT, president: "SENA ÇELİK", email: "sena@vizia.edu", members: 150, logo: "/logos/akil_oyunlari.png", slogan: "Zeka, strateji ve eğlence.", longDesc: "Satranç, Go, Reversi ve çeşitli zeka oyunları ile öğrencilerin analitik düşünme ve strateji geliştirme becerilerini artırmayı amaçlar.", location: "Sosyal Tesisler", established: "1 Ekim 2025" },
    { id: 4, name: "DOĞUŞTAN FENERBAHÇELİLER", category: Categories.SPOR, president: "HASAN BERK ÖRT", email: "hasan@vizia.edu", members: 420, logo: "/logos/fenerbahceliler.png", slogan: "Sevdamız Doğuş'tan, Kalbimiz Fener'den.", longDesc: "Üniversitemizdeki Fenerbahçe taraftarlarını bir araya getirerek maç izleme etkinlikleri, sosyal buluşmalar ve spor ruhunu yansıtan aktiviteler düzenliyoruz.", location: "A Blok Kantin", established: "1 Ekim 2025" },
    { id: 5, name: "GASTROSANAT KULÜBÜ", category: Categories.SANAT, president: "SENANUR TETİK", email: "senanur@vizia.edu", members: 190, logo: "/logos/gastrosanat.png", slogan: "Mutfak ve sanat birleşimi.", longDesc: "Gastronomiye ilgi duyan öğrencilere mutfak sanatları, tadım etkinlikleri ve profesyonel aşçılarla atölye çalışmaları sunar.", location: "Gastronomi Mutfağı", established: "1 Ekim 2025" },
    { id: 6, name: "BİYOTEKNOLOJİ VE İNOVASYON KULÜBÜ", category: Categories.AKADEMI, president: "BAŞKAN YOK", email: "biyo@vizia.edu", members: 110, logo: "/logos/biyoteknoloji.png", slogan: "Geleceği biyoloji ile inşa ediyoruz.", longDesc: "Biyoteknoloji alanındaki güncel gelişmeleri takip etmek, inovatif projeler geliştirmek ve bilimsel etkinlikler düzenlemek ana hedeflerimizdir.", location: "Fen-Edebiyat Binası", established: "1 Ekim 2025" },
    { id: 7, name: "AFET YÖNETİMİ VE İNSANİ YARDIM KULÜBÜ", category: Categories.SOSYAL, president: "BAŞKAN YOK", email: "afet@vizia.edu", members: 300, logo: "/logos/afet_yardim.png", slogan: "Hazırlıklı ol, hayat kurtar.", longDesc: "Afetlere karşı bilinçlendirme çalışmaları, ilk yardım eğitimleri ve insani yardım projeleri ile topluma katkı sağlamayı amaçlayan en aktif sosyal kulübümüzdür.", location: "Sosyal Tesisler", established: "1 Ekim 2025" },
    { id: 8, name: "DANS KULÜBÜ", category: Categories.SANAT, president: "GÖKHAN EMRE AKÇAY", email: "gokhan@vizia.edu", members: 160, logo: "/logos/dans.png", slogan: "Müziği hisset, hareket et.", longDesc: "Farklı dans türlerinde (halk oyunları, modern dans, salsa) atölyeler ve gösteriler düzenleyen enerjik bir kulüp. ", location: "Spor Merkezi", established: "1 Ekim 2025" },
    { id: 9, name: "KARİYER VE GELİŞİM KULÜBÜ", category: Categories.AKADEMI, president: "EFE MERT İÇEN", email: "efe@vizia.edu", members: 500, logo: "/logos/kariyer.png", slogan: "Geleceğini bugünden planla.", longDesc: "Sektörden önemli isimleri öğrencilerle buluşturan, CV hazırlama, mülakat teknikleri gibi konularda seminerler düzenleyen kariyer odaklı kulüp.", location: "Büyük Amfi", established: "1 Ekim 2025" },
    { id: 10, name: "MÜHENDİS BEYİNLER KULÜBÜ", category: Categories.AKADEMI, president: "MUHAMMET ŞAHİN YILDIRIM", email: "muhendis_beyinler@vizia.edu", members: 220, logo: "/logos/muhendis_beyinler.png", slogan: "Mühendislik sınırlarını zorluyoruz.", longDesc: "Farklı mühendislik disiplinlerinden öğrencileri bir araya getirerek proje geliştiren ve teknik geziler düzenleyen kulüp.", location: "Mühendislik Binası", established: "1 Ekim 2025" },
    { id: 11, name: "DOĞUŞTAN GÖNÜLLÜLER KULÜBÜ", category: Categories.SOSYAL, president: "BAŞKAN YOK", email: "gonullu@vizia.edu", members: 600, logo: "/logos/gonulluler.png", slogan: "Gönüllü ol, dünyayı değiştir.", longDesc: "Çeşitli yardım kampanyaları, çevre temizliği ve farkındalık projeleri yürüten en büyük sosyal sorumluluk kulübü.", location: "Sosyal Tesisler", established: "1 Ekim 2025" },
    { id: 12, name: "DOĞA SPORLARI KULÜBÜ", category: Categories.SPOR, president: "BAŞKAN YOK", email: "doga@vizia.edu", members: 140, logo: "/logos/doga_sporlari.png", slogan: "Doğayla iç içe, zirveye doğru.", longDesc: "Tırmanış, kampçılık, doğa yürüyüşleri ve kayak gibi doğa sporlarını sevenleri bir araya getirir.", location: "A Blok 101", established: "1 Ekim 2025" },
    { id: 13, name: "DOĞUŞTAN BEŞİKTAŞLILAR", category: Categories.SPOR, president: "BAŞKAN YOK", email: "besiktas@vizia.edu", members: 310, logo: "/logos/besiktaslilar.png", slogan: "Kara Kartal'ın üniversitedeki gücü.", longDesc: "Beşiktaş taraftarlarının buluşma noktası. Maç izleme etkinlikleri ve turnuvalar düzenler.", location: "Kampüs Kafe", established: "1 Ekim 2025" },
    { id: 14, name: "DOĞUŞTAN GALATASARAYLILAR", category: Categories.SPOR, president: "BAŞKAN YOK", email: "galata@vizia.edu", members: 340, logo: "/logos/galatasaraylilar.png", slogan: "Cimbom'un kalbi kampüste atıyor.", longDesc: "Galatasaray taraftarlarını bir araya getirerek heyecanlı maç izleme ve sosyal etkinlikler organize eder.", location: "A Blok Kantin", established: "1 Ekim 2025" },
];

// UTILITY: Kategori İkonları
const getCategoryIcon = (category) => {
    switch (category) {
        case Categories.SPOR: return <BoltIcon className="w-5 h-5 text-red-600" />;
        case Categories.SANAT: return <PaintBrushIcon className="w-5 h-5 text-purple-600" />;
        case Categories.AKADEMI: return <AcademicCapIcon className="w-5 h-5 text-blue-600" />;
        case Categories.SOSYAL: return <HeartIcon className="w-5 h-5 text-green-600" />;
        default: return <UsersIcon className="w-5 h-5 text-gray-500" />;
    }
};

// **********************************************
// 2. KULÜP KART BİLEŞENİ (ClubCard)
// **********************************************
const ClubCard = ({ club, navigate }) => {
    return (
        <div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between 
                       transform transition duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
            onClick={() => navigate(`/kulupler/${club.id}`)} 
        >
            <div className="flex items-start mb-4">
                {/* Logo Alanı */}
                <div className="flex-shrink-0 w-16 h-16 mr-4 rounded-full bg-gray-200 overflow-hidden shadow-inner flex items-center justify-center border border-gray-300">
                    
                    {club.logo && club.logo !== '/placeholder_club_logo.jpg' ? ( 
                        <img 
                            src={club.logo} 
                            alt={`${club.name} logosu`} 
                            className="w-full h-full object-cover" 
                        /> 
                    ) : (
                        // Logo yolu yoksa varsayılan ikonu göster
                        <ExclamationCircleIcon className="w-8 h-8 text-red-600 opacity-60" /> 
                    )}
                </div>
                
                {/* Başlık Alanı */}
                <div className="flex-grow">
                    <h3 className="text-xl font-extrabold text-gray-900 leading-snug tracking-tight">
                        {club.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        {getCategoryIcon(club.category)}
                        <span className="ml-1 font-medium">{club.category}</span>
                    </div>
                </div>
            </div>
            
            <p className="text-gray-600 mb-4 italic text-sm">
                "{club.slogan}"
            </p>

            <div className="mt-auto pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                <div className="flex items-center text-sm font-medium text-gray-700">
                    <UsersIcon className="w-4 h-4 mr-1 text-red-500" />
                    <span>{club.members} Üye</span>
                </div>
                <span className="text-xs text-red-600 font-semibold hover:text-red-800 transition">
                    Detaylar →
                </span>
            </div>
        </div>
    );
};


// **********************************************
// 3. KULÜPLER ANA SAYFASI (Kulupler.jsx)
// **********************************************
export default function Kulupler() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Hepsi');

    // Kategori Seçenekleri
    const categoryOptions = ['Hepsi', ...Object.values(Categories)];

    // Filtreleme Mantığı
    const filtrelenmisKulupler = useMemo(() => {
        return CLUBS.filter(club => {
            const matchesCategory = activeCategory === 'Hepsi' || club.category === activeCategory;
            const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  club.president.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  club.slogan.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, activeCategory]);
    
    // MERKEZİ BUTON İŞLEVİ: Gelen Kutusu
    const handleGoToInbox = () => {
        navigate('/ogrenci/gelen-kutusu'); 
    };

    // YENİ BUTON İŞLEVİ: Üyeliklerim
    const handleGoToUyeliklerim = () => {
        navigate('/ogrenci/uyeliklerim'); // Yeni sayfa rotası
    };

    // YENİ BUTON İŞLEVİ: Simülasyon
    const handleStartSimulasyon = () => {
        navigate('/kulupler/simulasyon'); // Yeni simülasyon rotası
    };


    return (
        // Sayfa arka planı (bg-gray-50) açık kalır
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 p-4 md:p-10">
            
            {/* ⬅️ Başlık ve Geri Dön Butonu */}
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-red-200">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Geri Dön</span>
                </button>
                <h1 className="text-4xl font-extrabold text-gray-800 flex items-center tracking-tight">
                    <UsersIcon className="w-9 h-9 mr-2 text-red-600" /> Vizia Kulüpler Dünyası
                </h1>
                <div className="w-20"></div> 
            </header>

            {/* ⭐ Arama ve Filtre Alanı */}
            <div className="max-w-6xl mx-auto w-full mb-10">
                
                {/* Arama Çubuğu ve Mesaj/Üyelik Butonları Konumu */}
                <div className="flex gap-4 mb-6 items-center">
                    {/* Arama Çubuğu */}
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Kulüp adı, başkan veya slogan ile arama yapın..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 transition shadow-md"
                        />
                    </div>
                    
                    {/* 1. MESAJ BUTONU: Boyut Uyumlaması için py-3, text-sm */}
                    <button
                        onClick={handleGoToInbox}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 text-sm rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                    >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        Mesaj Gelen Kutusu
                    </button>

                    {/* 2. ÜYELİKLERİM BUTONU: Boyut Uyumlaması için py-3, text-sm */}
                    <button
                        onClick={handleGoToUyeliklerim}
                        className="flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 text-sm rounded-xl shadow-lg hover:bg-red-700 transition transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                    >
                        <UserGroupIcon className="w-5 h-5" />
                        Üyeliklerim
                    </button>

                     {/* 3. HOLOGRAD BUTONU: Gri Temel, Antrasit Hover, Boyut Uyumlu */}
                     <button
                        onClick={handleStartSimulasyon}
                        // 🔥 Varsayılan Renk: bg-gray-300 (Gri), Metin: text-gray-900 (Koyu Antrasit)
                        // 🔥 Hover Renk: hover:bg-gray-800 (Antrasit), Metin: hover:text-white (Beyaz)
                        className="flex items-center gap-2 bg-gray-300 text-gray-900 font-semibold px-6 py-3 text-sm rounded-xl shadow-lg hover:bg-gray-800 hover:text-white transition transform hover:scale-[1.03] active:scale-[0.97] whitespace-nowrap btn-hologram hologram"
                    >
                        {/* Tarama çizgisi */}
                        <div className="scan-line"></div> 
                        
                        <SparklesIcon className="w-5 h-5 relative z-10 
                            // Hover durumunda ikon rengini de değiştiriyoruz
                            group-hover:text-yellow-300 transition" 
                        /> 
                        
                        {/* data-text attribute'ü ve metin stili */}
                        <span className="text-content text-sm font-semibold relative z-10" data-text="KULÜP ASİSTANI">
                            KULÜP ASİSTANI
                        </span>
                    </button>
                </div>


                {/* Kategori Filtreleri */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {categoryOptions.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-200 ${
                                activeCategory === category 
                                    ? 'bg-red-600 text-white shadow-lg' 
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-red-50'
                            }`}
                        >
                            {getCategoryIcon(category)} {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* ⭐ Kulüpler Listesi */}
            <div className="max-w-6xl mx-auto w-full">
                {filtrelenmisKulupler.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtrelenmisKulupler.map(club => (
                            <ClubCard key={club.id} club={club} navigate={navigate} /> 
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500 text-xl">
                        Aramanıza uygun kulüp bulunamadı.
                    </div>
                )}
            </div>
        </div>
    );
}