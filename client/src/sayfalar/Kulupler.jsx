import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// TÜM GEREKLİ İKONLAR ARTIK BURADA
import { ArrowLeftIcon, MagnifyingGlassIcon, UsersIcon, AcademicCapIcon, BoltIcon, HeartIcon, SparklesIcon, PaintBrushIcon, ChatBubbleLeftRightIcon, UserGroupIcon, ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; 

import '../App.css'; 

const API_URL = "https://vizia-server.onrender.com"; 


// **********************************************
// 1. KULÜPLER KATEGORİ YAPISI
// **********************************************
const Categories = {
    SPOR: "Spor",
    SANAT: "Sanat & Kültür",
    AKADEMI: "Akademi & Kariyer",
    SOSYAL: "Sosyal Sorumluluk"
};

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
    // Backend'den gelen alan isimleri
    const clubName = club.ad || club.name;
    const category = club.kategori || Categories.SOSYAL;
    const slogan = club.slogan || "Slogan girilmemiş.";
    const members = club.aktif_uye_sayisi || 0;
    
    // 🔥 KRİTİK LOGO DÜZELTMESİ: Logo yolu `/logos/` ile başlıyorsa, doğru formatı korur.
    // Eğer logo yolu sadece dosya adı ise, `/logos/` prefix'ini ekleriz.
    let logoPath = club.logo_yolu || '/placeholder_club_logo.jpg';
    
    if (logoPath && !logoPath.startsWith('/') && logoPath !== '/placeholder_club_logo.jpg') {
        // Örn: logo_yolu veritabanında "bilisim.png" ise, "/logos/bilisim.png" yaparız.
        // Eğer veritabanında zaten "/logos/bilisim.png" olarak kayıtlıysa (ki olması gereken bu), bu adım atlanır.
        // Not: Çoğu modern uygulama, /logos yolunu doğru çözmelidir. Ancak statik diziden kalanlar için bu kritik olabilir.
        logoPath = `/logos/${logoPath}`; 
    }
    
    // Eğer logo yolu hala boşsa, varsayılanı kullan
    if (!logoPath) {
        logoPath = '/placeholder_club_logo.jpg';
    }
    
    // İhtiyaç duyulan tüm logolarınızın public klasörü altında `/logos/` içinde olduğunu varsayıyoruz.

    return (
        <div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between 
                       transform transition duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
            onClick={() => navigate(`/kulupler/${club.id}`)} 
        >
            <div className="flex items-start mb-4">
                {/* Logo Alanı */}
                <div className="flex-shrink-0 w-16 h-16 mr-4 rounded-full bg-gray-200 overflow-hidden shadow-inner flex items-center justify-center border border-gray-300">
                    
                    {logoPath && logoPath !== '/placeholder_club_logo.jpg' ? ( 
                        <img 
                            // Logo yolu olarak dinamik yolu kullanıyoruz
                            src={logoPath} 
                            alt={`${clubName} logosu`} 
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
                        {clubName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                        {getCategoryIcon(category)}
                        <span className="ml-1 font-medium">{category}</span>
                    </div>
                </div>
            </div>
            
            <p className="text-gray-600 mb-4 italic text-sm">
                "{slogan}"
            </p>

            <div className="mt-auto pt-3 border-t border-dashed border-gray-200 flex justify-between items-center">
                <div className="flex items-center text-sm font-medium text-gray-700">
                    <UsersIcon className="w-4 h-4 mr-1 text-red-500" />
                    <span>{members} Üye</span>
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

    // 🔥 DİNAMİK VERİ STATE'LERİ
    const [apiClubs, setApiClubs] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [hata, setHata] = useState(null);

    // API'dan Kulüp Verisini Çekme Fonksiyonu
    const fetchClubs = async () => {
        setYukleniyor(true);
        setHata(null);
        try {
            // Öğrenci/Misafir erişimi için yetkilendirme header'ı GÖNDERİLMEZ.
            const response = await fetch(`${API_URL}/api/kulupler/bilgiler`);
            const data = await response.json();
            
            if (response.ok) {
                setApiClubs(data.map(club => ({
                    ...club,
                    kategori: club.kategori || Categories.SOSYAL, 
                })));
            } else {
                setHata(data.hata || "Kulüp listesi çekilirken bilinmeyen hata oluştu.");
            }
        } catch (err) {
            setHata("Sunucuya bağlanılamadı veya ağ hatası oluştu.");
            console.error("API Hatası:", err);
        } finally {
            setYukleniyor(false);
        }
    };
    
    useEffect(() => {
        fetchClubs();
    }, []); // Sadece ilk yüklemede çalışır

    const categoryOptions = ['Hepsi', ...Object.values(Categories)];

    // Filtreleme Mantığı (API'dan gelen dinamik veriye uygulanır)
    const filtrelenmisKulupler = useMemo(() => {
        return apiClubs.filter(club => {
            const matchesCategory = activeCategory === 'Hepsi' || club.kategori === activeCategory;
            
            const matchesSearch = club.ad.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  (club.baskan_adsoyad && club.baskan_adsoyad.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                  (club.slogan && club.slogan.toLowerCase().includes(searchTerm.toLowerCase()));
            
            return matchesCategory && matchesSearch;
        });
    }, [searchTerm, activeCategory, apiClubs]); 

    
    const handleGoToInbox = () => {
        navigate('/ogrenci/gelen-kutusu'); 
    };

    const handleGoToUyeliklerim = () => {
        navigate('/ogrenci/uyeliklerim'); 
    };

    const handleStartSimulasyon = () => {
        navigate('/kulupler/simulasyon'); 
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 p-4 md:p-10">
            
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

            <div className="max-w-6xl mx-auto w-full mb-10">
                
                <div className="flex gap-4 mb-6 items-center">
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
                    
                    <button
                        onClick={handleGoToInbox}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 text-sm rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                    >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        Mesaj Gelen Kutusu
                    </button>

                    <button
                        onClick={handleGoToUyeliklerim}
                        className="flex items-center gap-2 bg-red-600 text-white font-semibold px-6 py-3 text-sm rounded-xl shadow-lg hover:bg-red-700 transition transform hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                    >
                        <UserGroupIcon className="w-5 h-5" />
                        Üyeliklerim
                    </button>

                     <button
                        onClick={handleStartSimulasyon}
                        className="flex items-center gap-2 bg-gray-300 text-gray-900 font-semibold px-6 py-3 text-sm rounded-xl shadow-lg hover:bg-gray-800 hover:text-white transition transform hover:scale-[1.03] active:scale-[0.97] whitespace-nowrap btn-hologram hologram group"
                    >
                        <div className="scan-line"></div> 
                        
                        <SparklesIcon className="w-5 h-5 relative z-10 group-hover:text-yellow-300 transition" /> 
                        
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
                {hata && (
                    <div className="text-center py-10 text-red-600 text-xl flex items-center justify-center">
                         <ExclamationCircleIcon className="w-6 h-6 mr-2" /> {hata}
                    </div>
                )}
                
                {yukleniyor && !hata ? (
                    <div className="text-center py-20 text-gray-500 text-xl">
                        <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Kulüpler yükleniyor...
                    </div>
                ) : filtrelenmisKulupler.length > 0 ? (
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