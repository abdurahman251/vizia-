import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
// AcademicCapIcon, BoltIcon, HeartIcon, PaintBrushIcon importları eklendi
import { TrophyIcon, SparklesIcon, CheckBadgeIcon, UserGroupIcon, AcademicCapIcon, BoltIcon, HeartIcon, PaintBrushIcon } from '@heroicons/react/24/outline'; 
import { KULUPLER, SONUC_ESLESTIRME, PUAN_KATEGORILERI } from '../sabitler/SimulasyonSabitler';

// API Sabiti
const API_URL = "http://localhost:5050"; 

// UTILITY: Kulüp detaylarını ID'ye göre bulur
const getKulupDetay = (id) => {
    // Burada statik KULUPLER listesini kullanıyoruz, normalde Backend'den çekilmeli
    return KULUPLER.find(k => k.id === id);
};

// 🔥 YENİ BİLEŞEN: Analiz Grafiği (Çubuklar)
const AnalysisChart = ({ data }) => {
    // Verileri büyükten küçüğe sıralayalım
    const sortedData = Object.entries(data)
        .sort(([, a], [, b]) => b - a);
        
    // Kategorilere renk ataması (Tailwind sınıflarıyla)
    const getColorClass = (kategori) => {
        if (kategori.includes('AKADEMİ')) return 'bg-blue-500';
        if (kategori.includes('SPOR')) return 'bg-red-500';
        if (kategori.includes('SANAT')) return 'bg-purple-500';
        if (kategori.includes('SOSYAL')) return 'bg-green-500';
        return 'bg-gray-500';
    };

    return (
        <div className="space-y-4 pt-6 mt-6 border-t border-gray-200">
            <h4 className="text-xl font-bold text-gray-700 mb-4">İlgi Alanı Dağılımın:</h4>
            {sortedData.map(([kategori, yuzde]) => (
                <div key={kategori} className="flex items-center space-x-4">
                    <span className="font-medium w-40 text-gray-700 text-sm flex-shrink-0">
                        {/* Alt çizgi (_) kaldırılarak daha okunaklı kategori adı */}
                        {kategori.replace(/_/g, ' ').toUpperCase()}
                    </span>
                    <div className="flex-grow bg-gray-200 rounded-full h-4 relative">
                        {/* Çubuk */}
                        <div 
                            className={`h-4 rounded-full transition-all duration-700 ${getColorClass(kategori)}`} 
                            style={{ width: `${yuzde}%` }}
                        ></div>
                        {/* Yüzdelik Değer */}
                        <span className="absolute right-0 top-0 text-xs font-bold text-white mr-2" style={{ transform: 'translateY(1px)' }}>
                            %{Math.round(yuzde)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default function SimulasyonSonuc() {
    const navigate = useNavigate();
    const location = useLocation();
    const [tavsiyeKulupler, setTavsiyeKulupler] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [enYuksekKategori, setEnYuksekKategori] = useState("Genel");
    const [hata, setHata] = useState(null);
    // 🔥 Yeni state eklendi
    const [analizVerisi, setAnalizVerisi] = useState({});


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const puanString = params.get('puan');

        if (!puanString) {
            setHata("Puanlama verisi bulunamadı. Lütfen testi tekrar çözün.");
            setYukleniyor(false);
            return;
        }

        try {
            const puanlar = JSON.parse(decodeURIComponent(puanString));
            
            let maxPuan = -1;
            let maxKategori = '';
            let toplamPuan = 0;
            
            // Toplam puanı hesapla
            Object.values(puanlar).forEach(p => toplamPuan += p);
            
            // 🔥 Yüzde Hesaplama ve En Yüksek Kategoriyi Bulma
            const yuzdeData = {};
            Object.keys(puanlar).forEach(kategori => {
                const yuzde = (puanlar[kategori] / toplamPuan) * 100;
                yuzdeData[kategori] = yuzde;

                if (puanlar[kategori] > maxPuan) {
                    maxPuan = puanlar[kategori];
                    maxKategori = kategori;
                }
            });

            // 2. Tavsiye Edilecek Kulüp ID'lerini Çek
            const tavsiyeIdler = SONUC_ESLESTIRME[maxKategori] || [];
            const detayliKulupler = tavsiyeIdler.map(id => getKulupDetay(id)).filter(k => k !== undefined);
            
            // Kategori adını temizleyip kaydet
            setEnYuksekKategori(maxKategori.replace(/_/g, ' '));
            setTavsiyeKulupler(detayliKulupler);
            setAnalizVerisi(yuzdeData); // 🔥 Analiz verisini kaydet
            
        } catch (e) {
            console.error("Puan işlenirken hata:", e);
            setHata("Puanlama verisi işlenirken hata oluştu.");
        } finally {
            setYukleniyor(false);
        }
    }, [location.search]);

    if (yukleniyor) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><h2 className="text-2xl font-semibold animate-pulse">Sonuçlar Analiz Ediliyor...</h2></div>;
    if (hata) return <div className="p-10 text-center text-red-600 font-semibold">{hata}</div>;


    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            
            <header className="w-full max-w-4xl flex justify-between items-center mb-8 pb-4 border-b border-red-200">
                <button 
                    onClick={() => navigate('/kulupler/simulasyon')} 
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Testi Tekrar Çöz</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-800">
                    Tavsiye Sonuçları
                </h1>
                <div className="w-20"></div>
            </header>
            
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8 border-t-4 border-red-600">
                
                <div className="text-center mb-8">
                    <TrophyIcon className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Analiz Tamamlandı!</h2>
                    <p className="text-lg text-gray-600">
                        En baskın ilgi alanın: <span className="font-bold text-red-600">{enYuksekKategori.toUpperCase()}</span>
                    </p>
                </div>

                {/* 🔥 YÜZDELİK ANALİZ GRAFİĞİ BİLEŞENİ ÇAĞRILIYOR */}
                {Object.keys(analizVerisi).length > 0 && <AnalysisChart data={analizVerisi} />}
                
                <h3 className="text-xl font-bold text-gray-700 mt-10 mb-4 border-b pb-2 flex items-center">
                    <CheckBadgeIcon className="w-6 h-6 mr-2 text-red-500" />
                    Size Özel Tavsiye Edilen Kulüpler:
                </h3>

                <div className="space-y-4">
                    {tavsiyeKulupler.length > 0 ? (
                        tavsiyeKulupler.map((kulup) => (
                            <div 
                                key={kulup.id} 
                                className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center transition hover:shadow-md"
                            >
                                <div className="flex items-center space-x-3">
                                    <UserGroupIcon className="w-6 h-6 text-red-600" />
                                    <p className="font-semibold text-lg text-gray-800">{kulup.ad}</p>
                                    <span className="text-sm text-gray-500">({kulup.tur})</span>
                                </div>
                                <button
                                    onClick={() => navigate(`/kulupler/${kulup.id}`)}
                                    className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Kulübe Git →
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5 text-gray-500">
                            Üzgünüz, belirlediğiniz kriterlere tam uyan bir kulüp bulunamadı. Genel kulüpleri incelemeyi deneyin.
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t text-center">
                     <button
                        onClick={() => navigate('/kulupler')}
                        className="bg-gray-700 text-white text-sm px-6 py-3 rounded-xl hover:bg-gray-800 transition"
                    >
                        Tüm Kulüplere Geri Dön
                    </button>
                </div>

            </div>
        </div>
    );
}