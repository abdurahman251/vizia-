import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CalendarDaysIcon, 
    ArrowLeftIcon, 
    MagnifyingGlassIcon, 
    MapPinIcon, 
    ClockIcon, 
    UsersIcon, 
    XMarkIcon, 
    HandThumbUpIcon, 
    HandThumbDownIcon, 
    AdjustmentsHorizontalIcon, 
    AcademicCapIcon, 
    BoltIcon, 
    HeartIcon 
} from '@heroicons/react/24/outline';

// API Sabiti (Backend'inizin çalıştığı adresi kontrol edin)
const API_URL = "https://vizia-server.onrender.com"; 

// Kategoriler
const Categories = {
    SPOR: "Spor",
    SANAT: "Sanat & Kültür",
    AKADEMI: "Akademi & Kariyer",
    SOSYAL: "Sosyal Sorumluluk"
};

// **********************************************
// 1. YARDIMCI FONKSİYONLAR
// **********************************************

// Yetkilendirme için öğrenci ID'sini alır (Kayıt ve Oylama için Gerekli)
const getOgrenciId = () => {
    const ogrenci = localStorage.getItem('ogrenci');
    return ogrenci ? JSON.parse(ogrenci).id : null;
};

// Kulüp Adı ve Kategorileri Filtrelemek için statik listeye ihtiyacımız var (Backend'den çekilmeli)
const STATIC_CLUBS = [
    "BİLİŞİM KULÜBÜ", "HUKUK KULÜBÜ", "KARİYER VE GELİŞİM KULÜBÜ", 
    "DOĞUŞTAN GÖNÜLLÜLER KULÜBÜ", "DANS KULÜBÜ"
];


// **********************************************
// 2. ETKİNLİK KARTI
// **********************************************
const EventCard = ({ event, onEventClick }) => {
    const cardBg = event.category === Categories.AKADEMI ? 'bg-blue-50' : event.category === Categories.SPOR ? 'bg-red-50' : 'bg-gray-50';
    
    // Aktif kayıt sayısını ve beğeni/beğenmeme sayısını Backend'den gelen verilere göre hesaplar
    const registeredCount = event.registered_count || 0;
    const likeCount = event.like_count || 0;
    const dislikeCount = event.dislike_count || 0;

    return (
        <div 
            className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden 
                       transform transition duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer ${cardBg}`}
            onClick={() => onEventClick(event)}
        >
            {/* Görsel Alanı: h-40 ile sabit yükseklik, overflow-hidden ile taşmayı engelliyor */}
            <div className="relative h-40 overflow-hidden bg-gray-200">
                {/* Resim URL'si Backend'den gelir */}
                <img 
                    src={event.resim_url ? `${API_URL}${event.resim_url}` : '/images/placeholder.jpg'} 
                    alt={event.name} 
                    // w-full h-full object-cover: Kapsayıcıyı tamamen doldur, gerekirse kırp.
                    className="w-full h-full object-cover" 
                    onError={(e) => {e.target.onerror = null; e.target.src="/images/placeholder.jpg"}}
                />
                 {registeredCount >= event.kapasite && (
                    <span className="absolute top-2 left-2 bg-yellow-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">KAPASİTE DOLU</span>
                )}
            </div>
            
            {/* İçerik */}
            <div className="p-4 flex flex-col justify-between h-auto">
                <h3 className="text-lg font-extrabold text-gray-900 tracking-tight mb-2 truncate">
                    {event.ad}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                    {event.clubName} • {event.category}
                </p>

                <div className="text-sm space-y-1 text-gray-700">
                    <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-4 h-4 text-red-500" />
                        <span>{event.tarih} / {event.saat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4 text-red-500" />
                        <span>{event.yer}</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-blue-600">
                        {registeredCount}/{event.kapasite} Kayıt
                    </span>
                    <span className="text-xs flex items-center gap-1 text-gray-500">
                        <HandThumbUpIcon className="w-4 h-4 text-green-500" /> {likeCount} / <HandThumbDownIcon className="w-4 h-4 text-red-500" /> {dislikeCount} 
                    </span>
                </div>
            </div>
        </div>
    );
};


// **********************************************
// 3. ETKİNLİK DETAY MODALI (Oylama ve Kayıt İçin)
// **********************************************
const EventDetailModal = ({ event, onClose, onActionSuccess }) => {
    if (!event) return null;

    const ogrenciId = getOgrenciId();
    const [isVoted, setIsVoted] = useState(event.user_vote); // 1: Like, 0: Dislike, null: Yok
    const [isRegistered, setIsRegistered] = useState(event.user_is_registered);
    const [actionLoading, setActionLoading] = useState(false);

    // 🔥 API'a Kayıt İşlemi (Madde 8)
    const handleRegister = async () => {
        if (!ogrenciId || isRegistered || actionLoading) return;
        setActionLoading(true);
        
        try {
            // Rota Düzeltildi: /api/kulupler/etkinlikler/kaydol olmalı
            const response = await fetch(`${API_URL}/api/kulupler/etkinlikler/kaydol`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ etkinlik_id: event.id, ogrenci_id: ogrenciId }),
            });

            // Hata yakalamayı güvenli hale getir
            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({ hata: `Sunucu Hatası (${response.status})` }));
                 throw new Error(errorData.hata || "Kayıt başarısız.");
            }

            setIsRegistered(true);
            alert("Etkinliğe başarıyla kayıt olundu!");
            onActionSuccess(); // Ana listeyi güncelle
            
        } catch (err) {
            alert(`Hata: ${err.message}`);
        } finally {
            setActionLoading(false);
        }
    };

    // 🔥 API'a Oylama İşlemi (Madde 4)
    const handleVote = async (oyTipi) => { // oyTipi: 1 (Like) veya 0 (Dislike)
        if (!ogrenciId || actionLoading) return;
        setActionLoading(true);

        // Eğer zaten bu oyu vermişse iptal et
        const finalOyTipi = isVoted === oyTipi ? null : oyTipi; 

        try {
             // Rota Düzeltildi: /api/kulupler/etkinlikler/oyla olmalı
             const response = await fetch(`${API_URL}/api/kulupler/etkinlikler/oyla`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ etkinlik_id: event.id, ogrenci_id: ogrenciId, oy_tipi: finalOyTipi }),
            });

            // Hata yakalamayı güvenli hale getir
            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({ hata: `Sunucu Hatası (${response.status})` }));
                 throw new Error(errorData.hata || "Oylama başarısız.");
            }
            
            setIsVoted(finalOyTipi);
            alert(`Oylamanız kaydedildi.`);
            onActionSuccess(); // Ana listeyi güncelle

        } catch (err) {
             alert(`Hata: ${err.message}`);
        } finally {
            setActionLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-white rounded-xl shadow-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Görsel Alanı: h-64 ile sabit yükseklik, overflow-hidden ile taşmayı engelliyor */}
                <div className="relative h-64 overflow-hidden bg-gray-200">
                    <img 
                        src={event.resim_url ? `${API_URL}${event.resim_url}` : '/images/placeholder.jpg'} 
                        alt={event.ad} 
                        // w-full h-full object-cover: Kapsayıcıyı tamamen doldur, gerekirse kırp.
                        className="w-full h-full object-cover"
                        onError={(e) => {e.target.onerror = null; e.target.src="/images/placeholder.jpg"}}
                    />
                    <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    <span className="absolute bottom-3 left-3 bg-red-600 text-white text-md font-bold px-4 py-1 rounded-full">{event.clubName}</span>
                </div>

                <div className="p-6 md:p-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-3">{event.ad}</h2>
                    <p className="text-sm text-gray-500 mb-4">{event.category}</p>

                    {/* Detay Bilgileri */}
                    <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm mb-6 pb-6 border-b">
                        <div className="flex items-center gap-2"><CalendarDaysIcon className="w-5 h-5 text-red-500" /> Tarih: <span className="font-semibold">{event.tarih}</span></div>
                        <div className="flex items-center gap-2"><ClockIcon className="w-5 h-5 text-red-500" /> Saat: <span className="font-semibold">{event.saat}</span></div>
                        <div className="flex items-center gap-2"><MapPinIcon className="w-5 h-5 text-red-500" /> Yer: <span className="font-semibold">{event.yer}</span></div>
                        <div className="flex items-center gap-2"><UsersIcon className="w-5 h-5 text-red-500" /> Kayıt: <span className="font-semibold">{event.registered_count || 0}/{event.kapasite}</span></div>
                    </div>

                    <p className="text-gray-700 mb-6">{event.aciklama}</p>
                    
                    {/* AKSİYONLAR (Kayıt ve Oylama) */}
                    <div className="flex gap-4 mt-6">
                        {/* Kaydol Butonu */}
                        <button
                            onClick={handleRegister}
                            disabled={isRegistered || actionLoading || !ogrenciId || (event.registered_count >= event.kapasite)}
                            className={`flex-grow py-3 rounded-lg font-semibold transition ${
                                isRegistered 
                                ? 'bg-green-600 text-white cursor-default' 
                                : 'bg-red-600 text-white hover:bg-red-700'
                            } ${!ogrenciId && 'opacity-50 cursor-not-allowed'}`}
                        >
                            {ogrenciId ? (
                                event.registered_count >= event.kapasite ? 'KAPASİTE DOLU' : 
                                isRegistered ? 'Kayıt Yapıldı ✅' : actionLoading ? 'Kaydediliyor...' : 'Etkinliğe Kaydol'
                            ) : 'Giriş Yapın (Kayıt İçin)'}
                        </button>

                        {/* Oylama Butonları */}
                        <div className="flex gap-2">
                             <button
                                onClick={() => handleVote(1)}
                                disabled={actionLoading || !ogrenciId}
                                className={`p-3 rounded-lg transition ${isVoted === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-green-50'} ${!ogrenciId && 'opacity-50 cursor-not-allowed'}`}
                            >
                                <HandThumbUpIcon className="w-6 h-6" />
                            </button>
                            <button
                                onClick={() => handleVote(0)}
                                disabled={actionLoading || !ogrenciId}
                                className={`p-3 rounded-lg transition ${isVoted === 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-red-50'} ${!ogrenciId && 'opacity-50 cursor-not-allowed'}`}
                            >
                                <HandThumbDownIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    
                    {!ogrenciId && <p className="text-sm text-red-500 mt-2 text-center">Kayıt olmak veya oylamak için öğrenci girişi yapmalısınız.</p>}
                </div>
            </div>
        </div>
    );
};


// **********************************************
// 4. ETKİNLİKLER ANA SAYFASI (Etkinlikler.jsx)
// **********************************************
export default function Etkinlikler() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('Hepsi');
    const [selectedEvent, setSelectedEvent] = useState(null); 
    
    // Gerçek Veri State'leri
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const ogrenciId = getOgrenciId();

    // 🔥 API'dan Etkinlikleri Çekme Fonksiyonu
    const fetchEvents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Rota Düzeltildi: /api/kulupler/etkinlikler olmalı
            const response = await fetch(`${API_URL}/api/kulupler/etkinlikler?ogrenci_id=${ogrenciId || ''}`); 
            
            // Hata yakalamayı güvenli hale getir
            if (!response.ok) {
                 // Yanıt başarılı değilse, hatayı JSON olarak ayrıştırmaya çalış, başarısız olursa genel hata ver
                 const errorData = await response.json().catch(() => ({ hata: `Sunucu Hatası (${response.status})` }));
                 throw new Error(errorData.hata || 'Etkinlikler yüklenemedi.');
            }
            
            const data = await response.json();
            setEvents(data);

        } catch (err) {
            console.error("Etkinlik yükleme hatası:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [ogrenciId]); 
    
    // Filtre Seçenekleri
    const categoryOptions = Object.values(Categories);
    const filterOptions = ['Hepsi', 'Öne Çıkanlar', ...categoryOptions, ...STATIC_CLUBS];


    // Filtreleme Mantığı
    const filtrelenmisEtkinlikler = useMemo(() => {
        return events.filter(event => {
            // Öne Çıkanlar filtresi için Backend'den 'is_featured' alanı gelmesi gerekir.
            const isFeaturedFilter = activeFilter === 'Öne Çıkanlar' && event.is_featured; 
            const isCategoryFilter = categoryOptions.includes(activeFilter) && event.category === activeFilter;
            const isClubFilter = STATIC_CLUBS.includes(activeFilter) && event.clubName === activeFilter;
            
            const matchesActiveFilter = activeFilter === 'Hepsi' || isFeaturedFilter || isCategoryFilter || isClubFilter;

            const matchesSearch = event.ad.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  (event.clubName && event.clubName.toLowerCase().includes(searchTerm.toLowerCase()));
            
            return matchesActiveFilter && matchesSearch;
        });
    }, [searchTerm, activeFilter, events]);


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 p-4 md:p-10">
            
            {/* ETKİNLİK DETAY MODALI */}
            <EventDetailModal 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)} 
                onActionSuccess={fetchEvents} // Kayıt/Oylama sonrası listeyi yeniler
            />

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
                    <CalendarDaysIcon className="w-9 h-9 mr-2 text-red-600" /> Tüm Kampüs Etkinlikleri
                </h1>
                <div className="w-20"></div> 
            </header>

            {/* ⭐ Arama ve Filtre Alanı */}
            <div className="max-w-6xl mx-auto w-full mb-10">
                
                {/* Arama Çubuğu */}
                <div className="relative mb-6">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Etkinlik veya kulüp adı ile arama yapın..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 pl-12 border border-gray-300 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 transition shadow-md"
                    />
                </div>

                {/* Kategori Filtreleri */}
                <div className="flex flex-wrap gap-2 justify-start items-center p-3 bg-white rounded-xl shadow-md border border-gray-100">
                    <AdjustmentsHorizontalIcon className="w-5 h-5 text-gray-500 ml-1 mr-2" />
                    {filterOptions.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition duration-200 ${
                                activeFilter === filter 
                                    ? 'bg-red-600 text-white shadow-lg' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-red-50'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Yüklenme ve Hata Durumları */}
            {isLoading && <div className="text-center py-20 text-lg text-red-600"><BoltIcon className="w-6 h-6 animate-spin inline mr-2" /> Etkinlikler yükleniyor...</div>}
            {error && !isLoading && <div className="text-center py-20 text-xl text-red-700">Hata: {error}</div>}

            {/* ⭐ Etkinlikler Listesi */}
            {!isLoading && !error && (
                <div className="max-w-6xl mx-auto w-full">
                    {filtrelenmisEtkinlikler.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filtrelenmisEtkinlikler.map(event => (
                                <EventCard key={event.id} event={event} onEventClick={setSelectedEvent} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500 text-xl">
                            Aramanıza uygun etkinlik bulunamadı.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}