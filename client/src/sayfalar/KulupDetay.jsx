import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, UserPlusIcon, CheckCircleIcon, UsersIcon, AcademicCapIcon, MapPinIcon, CalendarDaysIcon, ClockIcon, PaintBrushIcon, BoltIcon, HeartIcon } from '@heroicons/react/24/outline';

// API Sabiti
const API_URL = "http://localhost:5050"; 


// **********************************************
// VERİ YAPISI - DİKKAT: Statik Veriler (Aynı kalır)
// **********************************************
const Categories = {
    SPOR: "Spor",
    SANAT: "Sanat & Kültür",
    AKADEMI: "Akademi & Kariyer",
    SOSYAL: "Sosyal Sorumluluk"
};

// Kategoriye göre renk paletini belirleyen yardımcı fonksiyon (Yeni eklendi)
const getCategoryColor = (category) => {
    switch (category) {
        case Categories.SPOR: return { main: 'red', light: 'red-50', icon: <BoltIcon className="w-5 h-5" /> };
        case Categories.SANAT: return { main: 'purple', light: 'purple-50', icon: <PaintBrushIcon className="w-5 h-5" /> };
        case Categories.AKADEMI: return { main: 'blue', light: 'blue-50', icon: <AcademicCapIcon className="w-5 h-5" /> };
        case Categories.SOSYAL: return { main: 'green', light: 'green-50', icon: <HeartIcon className="w-5 h-5" /> };
        default: return { main: 'gray', light: 'gray-100', icon: <UsersIcon className="w-5 h-5" /> };
    }
};


const CLUBS = [
    { id: 1, name: "BİLİŞİM KULÜBÜ", category: Categories.AKADEMI, president: "HALİL İBRAHİM SARAL", email: "halil@vizia.edu", members: 350, logo: "/placeholder_club_logo.jpg", slogan: "Dijital dönüşüme liderlik ediyoruz.", longDesc: "Yazılım, siber güvenlik, veri bilimi ve yapay zeka konularında bilgi ve becerileri geliştirmeyi amaçlar. Düzenli atölyeler ve sektör profesyonelleriyle buluşmalar düzenliyoruz.", location: "A Blok 302", established: "1 Ekim 2025" },
    { id: 2, name: "HUKUK KULÜBÜ", category: Categories.AKADEMI, president: "YAZGI ÖZBAY", email: "yazgi@vizia.edu", members: 280, logo: "/placeholder_club_logo.jpg", slogan: "Adaletin ve hukukun üstünlüğü.", longDesc: "Hukuk öğrencilerini bir araya getirerek güncel hukuki meseleler üzerine seminerler, paneller ve münazaralar düzenliyoruz. Hukuk nosyonunu geliştirmeyi hedefliyoruz.", location: "Hukuk Fakültesi", established: "1 Ekim 2025" },
    { id: 3, name: "AKIL OYUNLARI KULÜBÜ", category: Categories.SANAT, president: "SENA ÇELİK", email: "sena@vizia.edu", members: 150, logo: "/placeholder_club_logo.jpg", slogan: "Zeka, strateji ve eğlence.", longDesc: "Satranç, Go, Reversi ve çeşitli zeka oyunları ile öğrencilerin analitik düşünme ve strateji geliştirme becerilerini artırmayı amaçlar.", location: "Sosyal Tesisler", established: "1 Ekim 2025" },
    { id: 4, name: "DOĞUŞTAN FENERBAHÇELİLER", category: Categories.SPOR, president: "HASAN BERK ÖRT", email: "hasan@vizia.edu", members: 420, logo: "/placeholder_club_logo.jpg", slogan: "Sevdamız Doğuş'tan, Kalbimiz Fener'den.", longDesc: "Üniversitemizdeki Fenerbahçe taraftarlarını bir araya getirerek maç izleme etkinlikleri, sosyal buluşmalar ve spor ruhunu yansıtan aktiviteler düzenliyoruz.", location: "A Blok Kantin", established: "1 Ekim 2025" },
    { id: 5, name: "GASTROSANAT KULÜBÜ", category: Categories.SANAT, president: "SENANUR TETİK", email: "senanur@vizia.edu", members: 190, logo: "/placeholder_club_logo.jpg", slogan: "Mutfak ve sanat birleşimi.", longDesc: "Gastronomiye ilgi duyan öğrencilere mutfak sanatları, tadım etkinlikleri ve profesyonel aşçılarla atölye çalışmaları sunar.", location: "Gastronomi Mutfağı", established: "1 Ekim 2025" },
    { id: 6, name: "BİYOTEKNOLOJİ VE İNOVASYON KULÜBÜ", category: Categories.AKADEMI, president: "BAŞKAN YOK", email: "biyo@vizia.edu", members: 110, logo: "/placeholder_club_logo.jpg", slogan: "Geleceği biyoloji ile inşa ediyoruz.", longDesc: "Biyoteknoloji alanındaki güncel gelişmeleri takip etmek, inovatif projeler geliştirmek ve bilimsel etkinlikler düzenlemek ana hedeflerimizdir.", location: "Fen-Edebiyat Binası", established: "1 Ekim 2025" },
    { id: 7, name: "AFET YÖNETİMİ VE İNSANİ YARDIM KULÜBÜ", category: Categories.SOSYAL, president: "BAŞKAN YOK", email: "afet@vizia.edu", members: 300, logo: "/placeholder_club_logo.jpg", slogan: "Hazırlıklı ol, hayat kurtar.", longDesc: "Afetlere karşı bilinçlendirme çalışmaları, ilk yardım eğitimleri ve insani yardım projeleri ile topluma katkı sağlamayı amaçlayan en aktif sosyal kulübümüzdür.", location: "Sosyal Tesisler", established: "1 Ekim 2025" },
    { id: 8, name: "DANS KULÜBÜ", category: Categories.SANAT, president: "GÖKHAN EMRE AKÇAY", email: "gokhan@vizia.edu", members: 160, logo: "/placeholder_club_logo.jpg", slogan: "Müziği hisset, hareket et.", longDesc: "Farklı dans türlerinde (halk oyunları, modern dans, salsa) atölyeler ve gösteriler düzenleyen enerjik bir kulüp. ", location: "Spor Merkezi", established: "1 Ekim 2025" },
    { id: 9, name: "KARİYER VE GELİŞİM KULÜBÜ", category: Categories.AKADEMI, president: "EFE MERT İÇEN", email: "efe@vizia.edu", members: 500, logo: "/placeholder_club_logo.jpg", slogan: "Geleceğini bugünden planla.", longDesc: "Sektörden önemli isimleri öğrencilerle buluşturan, CV hazırlama, mülakat teknikleri gibi konularda seminerler düzenleyen kariyer odaklı kulüp.", location: "Büyük Amfi", established: "1 Ekim 2025" },
    { id: 10, name: "MÜHENDİS BEYİNLER KULÜBÜ", category: Categories.AKADEMI, president: "MUHAMMET ŞAHİN YILDIRIM", email: "muhammet@vizia.edu", members: 220, logo: "/placeholder_club_logo.jpg", slogan: "Mühendislik sınırlarını zorluyoruz.", longDesc: "Farklı mühendislik disiplinlerinden öğrencileri bir araya getirerek proje geliştiren ve teknik geziler düzenleyen kulüp.", location: "Mühendislik Binası", established: "1 Ekim 2025" },
    { id: 11, name: "DOĞUŞTAN GÖNÜLLÜLER KULÜBÜ", category: Categories.SOSYAL, president: "BAŞKAN YOK", email: "gonullu@vizia.edu", members: 600, logo: "/placeholder_club_logo.jpg", slogan: "Gönüllü ol, dünyayı değiştir.", longDesc: "Çeşitli yardım kampanyaları, çevre temizliği ve farkındalık projeleri yürüten en büyük sosyal sorumluluk kulübü.", location: "Sosyal Tesisler", established: "1 Ekim 2025" },
    { id: 12, name: "DOĞA SPORLARI KULÜBÜ", category: Categories.SPOR, president: "BAŞKAN YOK", email: "doga@vizia.edu", members: 140, logo: "/placeholder_club_logo.jpg", slogan: "Doğayla iç içe, zirveye doğru.", longDesc: "Tırmanış, kampçılık, doğa yürüyüşleri ve kayak gibi doğa sporlarını sevenleri bir araya getirir.", location: "A Blok 101", established: "1 Ekim 2025" },
    { id: 13, name: "DOĞUŞTAN BEŞİKTAŞLILAR", category: Categories.SPOR, president: "BAŞKAN YOK", email: "besiktas@vizia.edu", members: 310, logo: "/placeholder_club_logo.jpg", slogan: "Kara Kartal'ın üniversitedeki gücü.", longDesc: "Beşiktaş taraftarlarının buluşma noktası. Maç izleme etkinlikleri ve turnuvalar düzenler.", location: "Kampüs Kafe", established: "1 Ekim 2025" },
    { id: 14, name: "DOĞUŞTAN GALATASARAYLILAR", category: Categories.SPOR, president: "BAŞKAN YOK", email: "galata@vizia.edu", members: 340, logo: "/placeholder_club_logo.jpg", slogan: "Cimbom'un kalbi kampüste atıyor.", longDesc: "Galatasaray taraftarlarını bir araya getirerek heyecanlı maç izleme ve sosyal etkinlikler organize eder.", location: "A Blok Kantin", established: "1 Ekim 2025" },
];

const CLUB_EVENTS = [
    // Etkinlik verileri aynı kalır, ancak artık kullanılmayacak
    { id: 101, clubId: 1, name: "Yapay Zeka Atölyesi", date: "25/12/2025", time: "14:00", location: "A Blok 302", registered: 55, total: 80, isVoted: false },
    { id: 201, clubId: 2, name: "Anayasa Mahkemesi Gezisi", date: "05/01/2026", time: "09:00", location: "Ankara", registered: 30, total: 40, isVoted: false },
];


// **********************************************
// KULÜP DETAY SAYFASI
// **********************************************
export default function KulupDetay() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    
    const club = CLUBS.find(c => c.id === parseInt(id));

    // State'ler (Aynı kalır, kullanılmayanlar temizlendi)
    const [isJoined, setIsJoined] = useState(false); 
    const [isPending, setIsPending] = useState(false); 
    const [yukleniyor, setYukleniyor] = useState(false); 
    const [ogrenciId, setOgrenciId] = useState(null); 
    const [ogrenciEmail, setOgrenciEmail] = useState('ogrenci@test.com'); 


    // Renk Ayarı: Kulübün kategorisine göre tema rengini belirliyoruz
    const theme = club ? getCategoryColor(club.category) : getCategoryColor(null);
    const themeColor = theme.main; // örn: 'red'
    const themeLight = theme.light; // örn: 'red-50'
    const themeIcon = theme.icon; // örn: <BoltIcon>


    // 🔥 YENİ FONKSİYON: Durumu API'dan çeker (Aynı kalır)
    const fetchDurum = async (kulup_id, ogrenci_id) => {
        try {
            const response = await fetch(`${API_URL}/api/kulupler/uyelik/durum/${kulup_id}/${ogrenci_id}`);
            const data = await response.json();

            if (response.ok && data.durum) {
                if (data.durum === 'Onaylandı') {
                    setIsJoined(true);
                    setIsPending(false);
                } else if (data.durum === 'Beklemede') {
                    setIsPending(true);
                    setIsJoined(false);
                } else {
                     setIsJoined(false);
                     setIsPending(false);
                }
            } else {
                setIsJoined(false);
                setIsPending(false);
            }
        } catch (error) {
            console.error("Durum çekme hatası:", error);
        }
    };


    // Component Yüklenirken Durumu Çekme (Aynı kalır, gereksiz interval kaldırıldı)
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('ogrenci'));
        let currentOgrenciId = null;

        if (storedData && storedData.id) {
            currentOgrenciId = parseInt(storedData.id);
            setOgrenciId(currentOgrenciId); 
            setOgrenciEmail(storedData.email);
            
            fetchDurum(club.id, currentOgrenciId); 
        }

        // Başkan durumu simülasyonu kaldırıldı.
    }, [club.id]); 


    if (!club) {
        return <div className="p-10 text-center text-xl">Kulüp bulunamadı.</div>;
    }

    // Kulübe Katıl İşlevi (Aynı kalır)
    const handleJoin = async () => {
        if (!ogrenciId) {
            return alert('Lütfen kulübe katılmak için önce Öğrenci Paneline giriş yapınız.');
        }
        if (isJoined || isPending) {
             return; 
        }
        setYukleniyor(true);

        try {
            const response = await fetch(`${API_URL}/api/kulupler/uyelik/basvur`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kulup_id: club.id, 
                    ogrenci_id: ogrenciId, 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsPending(true); 
                alert(`✅ Başvurunuz (${club.name}) kulübüne iletildi ve onay bekleniyor.`);
            } else if (response.status === 409) {
                alert(data.hata); 
                fetchDurum(club.id, ogrenciId);
            } else {
                alert(data.hata || "Başvuru sırasında hata oluştu.");
            }
        } catch (error) {
            console.error("Katılma hatası:", error);
            alert("Sunucu bağlantı hatası: Başvuru gönderilemedi.");
        } finally {
            setYukleniyor(false);
        }
    };
    
    // Mesaj gönderme, Kayıt ve Oylama fonksiyonları kaldırıldı
    const handleSendMessage = () => {}; 
    const handleRegister = () => {};
    const handleVote = () => {};


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 p-4 md:p-10">
            {/* ⬅️ Başlık ve Geri Dön Butonu */}
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-red-200">
                <button 
                    onClick={() => navigate('/kulupler')} 
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Tüm Kulüplere Geri Dön</span>
                </button>
                <h1 className="text-4xl font-extrabold text-gray-800 flex items-center tracking-tight">
                    {themeIcon && React.cloneElement(themeIcon, { className: `w-9 h-9 mr-2 text-${themeColor}-600` })} Kulüp Detay
                </h1>
                <div className="w-20"></div> 
            </header>

            <div className={`max-w-4xl mx-auto w-full bg-white rounded-xl shadow-2xl overflow-hidden border-t-4 border-${themeColor}-600`}>
                
                {/* 1. Üst Kısım: Logo, Başlık, Slogan, Aksiyon Butonu */}
                <div className={`p-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 bg-${themeLight}`}>
                    
                    {/* Sol: Logo, Ad ve Kategori */}
                    <div className="flex items-center mb-4 md:mb-0">
                        {/* Logo Alanı */}
                        <div className={`w-24 h-24 rounded-full shadow-xl mr-6 object-contain bg-white flex items-center justify-center flex-shrink-0 border-4 border-${themeColor}-400`}>
                             {themeIcon && React.cloneElement(themeIcon, { className: `w-12 h-12 text-${themeColor}-600 opacity-80` })}
                        </div>
                        
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 leading-tight">{club.name}</h2>
                            <p className="text-xl text-gray-600 italic mt-1">"{club.slogan}"</p>
                            <span className={`inline-block bg-${themeColor}-600 text-white px-3 py-1 rounded-full text-sm font-semibold mt-2 shadow-md`}>
                                {club.category}
                            </span>
                        </div>
                    </div>
                    
                    {/* Sağ: Katıl Butonu (Aksiyon) */}
                    <div className="w-full md:w-auto mt-4 md:mt-0">
                        {isJoined ? (
                            <button className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold cursor-default flex items-center justify-center gap-2 shadow-lg">
                                <CheckCircleIcon className="w-5 h-5" /> ÜYESİNİZ
                            </button>
                        ) : isPending ? (
                            <button className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold cursor-default shadow-lg">
                                ONAY BEKLENİYOR...
                            </button>
                        ) : (
                            <button 
                                onClick={handleJoin}
                                className={`w-full bg-${themeColor}-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-${themeColor}-700 transition flex items-center justify-center gap-2 shadow-lg`}
                                disabled={yukleniyor || !ogrenciId} 
                            >
                                {yukleniyor ? 'BAŞVURULUYOR...' : <><UserPlusIcon className="w-5 h-5" /> KULÜBE KATIL</>}
                            </button>
                        )}
                        <div className="mt-2 text-xs text-gray-500 text-center">
                            {ogrenciId ? 'Onay gereklidir.' : 'Giriş yapınız.'}
                        </div>
                    </div>
                </div>

                {/* 2. Orta Kısım: Uzun Açıklama ve Temel Bilgiler (Grid) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
                    
                    {/* Sol: Uzun Açıklama (2/3 Genişlik) */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-inner border border-gray-100">
                        <h3 className={`text-2xl font-bold text-${themeColor}-700 mb-4 border-b pb-2`}>Misyonumuz ve Detaylar</h3>
                        <p className="text-gray-700 leading-relaxed text-lg">{club.longDesc}</p>
                    </div>

                    {/* Sağ: Temel Bilgiler Kutusu (1/3 Genişlik) */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-xl shadow-xl border border-gray-200">
                            <h3 className={`text-xl font-bold text-${themeColor}-700 mb-4`}>Kulüp Künyesi</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start text-gray-700">
                                    <UsersIcon className={`w-5 h-5 mt-1 mr-3 text-${themeColor}-600 flex-shrink-0`} />
                                    <div>
                                        <span className="font-semibold block">Üye Sayısı</span>
                                        <span className="text-lg font-extrabold">{club.members}</span>
                                    </div>
                                </div>
                                <div className="flex items-start text-gray-700">
                                    <AcademicCapIcon className={`w-5 h-5 mt-1 mr-3 text-${themeColor}-600 flex-shrink-0`} />
                                    <div>
                                        <span className="font-semibold block">Kulüp Başkanı</span>
                                        <span className="text-lg font-extrabold">{club.president}</span>
                                    </div>
                                </div>
                                <div className="flex items-start text-gray-700">
                                    <MapPinIcon className={`w-5 h-5 mt-1 mr-3 text-${themeColor}-600 flex-shrink-0`} />
                                    <div>
                                        <span className="font-semibold block">Buluşma Yeri</span>
                                        <span className="text-lg font-extrabold">{club.location}</span>
                                    </div>
                                </div>
                                <div className="flex items-start text-gray-700">
                                    <CalendarDaysIcon className={`w-5 h-5 mt-1 mr-3 text-${themeColor}-600 flex-shrink-0`} />
                                    <div>
                                        <span className="font-semibold block">Kuruluş Tarihi</span>
                                        <span className="text-lg font-extrabold">{club.established}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}