import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { SparklesIcon, ChevronRightIcon, QuestionMarkCircleIcon, AcademicCapIcon, BoltIcon, HeartIcon, PaintBrushIcon, TrophyIcon, CheckCircleIcon } from '@heroicons/react/24/outline'; // CheckCircleIcon eklendi
import { SORU_AKISI, PUAN_KATEGORILERI } from '../sabitler/SimulasyonSabitler';

// UTILITY: Kategoriye göre ikon seçimi (Aynı kalır)
const getCategoryIcon = (category) => {
    switch (category) {
        case 'AKADEMİ_TEK':
        case 'AKADEMİ_KARİYER': return <AcademicCapIcon className="w-6 h-6" />;
        case 'SPOR_SOSYAL':
        case 'SPOR_AKSIYON': return <BoltIcon className="w-6 h-6" />;
        case 'SOSYAL_GÖNÜLLÜ': return <HeartIcon className="w-6 h-6" />;
        case 'SANAT_MANTIK':
        case 'SANAT_YEMEK': return <PaintBrushIcon className="w-6 h-6" />;
        default: return <QuestionMarkCircleIcon className="w-6 h-6" />;
    }
};

// 🔥 YENİ BİLEŞEN: Geri Bildirim Mesajı (Altta Sabit)
const FeedbackMessage = ({ message }) => {
    if (!message) return null;

    // Turuncu/Sarı bir vurgu rengi kullanıyoruz
    return (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-800 p-3 rounded-full shadow-2xl z-50 transition-opacity duration-300 animate-pulse">
            <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-6 h-6 text-white" />
                <span className="font-semibold">{message}</span>
            </div>
        </div>
    );
};


export default function KulupSimulasyon() {
    const navigate = useNavigate();
    const [adim, setAdim] = useState(0); 
    const [puanlar, setPuanlar] = useState({ ...PUAN_KATEGORILERI });
    const [isFinishing, setIsFinishing] = useState(false);
    const [secilenCevap, setSecilenCevap] = useState(null);
    // 🔥 Yeni state eklendi
    const [feedback, setFeedback] = useState(null);
    
    // --- AKIŞ FONKSİYONLARI ---

    // Puanlamadan en çok etkilenen kategoriyi bulur
    const getDominantCategory = (puanlama) => {
        let maxPuan = -1;
        let dominantKategori = 'Genel';
        
        Object.keys(puanlama).forEach(kategori => {
            if (puanlama[kategori] > maxPuan) {
                maxPuan = puanlama[kategori];
                dominantKategori = kategori.split('_')[0]; // Sadece ANA KATEGORİYİ al
            }
        });
        return dominantKategori;
    };


    const handleCevapSecimi = (puanlama, index) => {
        if (secilenCevap !== null) return; 
        
        setSecilenCevap(index); 

        // 🔥 Geri bildirim mantığı
        const dominantCategory = getDominantCategory(puanlama);
        const message = `Seçiminiz, ${dominantCategory.toUpperCase()} puanını artırdı!`;
        setFeedback(message);


        const yeniPuanlar = { ...puanlar };
        Object.keys(puanlama).forEach(kategori => {
            yeniPuanlar[kategori] += puanlama[kategori];
        });
        
        setPuanlar(yeniPuanlar);

        // Cevap efekti ve ilerleme
        setTimeout(() => {
            setSecilenCevap(null);
            setFeedback(null); // Mesajı kaldır
            if (adim < SORU_AKISI.length) {
                setAdim(adim + 1);
            } else {
                setIsFinishing(true);
            }
        }, 800); 
    };
    
    useEffect(() => {
        if (isFinishing) {
            const puanString = encodeURIComponent(JSON.stringify(puanlar));
            navigate(`/kulupler/tavsiye?puan=${puanString}`);
        }
    }, [isFinishing, navigate, puanlar]);


    // --- BİLEŞENLERİ RENDER ETME ---

    // Giriş Ekranı (Tailwind ile beyaz kutu)
    const renderGiris = () => (
        <div className="text-center p-12 bg-white rounded-xl shadow-2xl border-t-8 border-red-600 relative z-10 mx-auto max-w-xl mt-10">
            <SparklesIcon className="w-20 h-20 text-red-600 mx-auto mb-4 animate-bounce" />
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">KULÜP TAVSİYE SİMÜLASYONU</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto">
                Tercihlerinize göre en uygun kulübü bulan interaktif oyunumuza hoş geldiniz! Macerayı başlatarak soruları görmeye başlayın.
            </p>
            <button
                onClick={() => setAdim(1)}
                className="bg-red-600 text-white font-extrabold px-12 py-5 rounded-full shadow-lg hover:bg-red-700 transition transform hover:scale-[1.05] active:scale-[0.98] tracking-wider"
            >
                HEMEN BAŞLA <ChevronRightIcon className="w-5 h-5 inline ml-3" />
            </button>
        </div>
    );

    // Soru ve Cevap Alanı (Video artık üstte)
    const renderSoru = () => {
        const mevcutSoru = SORU_AKISI[adim - 1];
        const toplamSoru = SORU_AKISI.length;

        return (
            <div className="w-full max-w-4xl mx-auto z-10 relative"> 
                
                {/* 1. Sabit Boyutlu Video (Üstte) */}
                <div className="flex justify-center mb-2">
                     <video autoPlay loop muted className="background-video-fixed">
                        <source src="/simulation/simulation_bg.mp4" type="video/mp4" /> 
                        Tarayıcınız video etiketini desteklemiyor.
                    </video>
                </div>
                
                {/* İlerleme Çubuğu */}
                <div className="w-full h-4 bg-gray-200 rounded-full my-4 shadow-inner max-w-xl mx-auto">
                    <div 
                        className="h-full bg-red-600 rounded-full transition-all duration-500 shadow-md" 
                        style={{ width: `${(adim / toplamSoru) * 100}%` }}
                    ></div>
                </div>

                {/* 2. Soru Kutusu (Ana Panel) */}
                <div className="w-full mx-auto"> 
                    
                    <div className="p-6 md:p-8 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[500px] overflow-y-auto">
                        
                        {/* Soru Başlığı */}
                        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-inner mb-4 flex-shrink-0">
                            <div className="text-sm font-semibold mb-1 tracking-widest">
                                SORU {adim} / {toplamSoru}
                            </div>
                            <h2 className="text-2xl font-bold">
                                {mevcutSoru.soru}
                            </h2>
                        </div>
                        
                        {/* Cevap Kartları (İki sütunlu grid yapısı) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                            {mevcutSoru.cevaplar.map((cevap, index) => {
                                const isSelected = secilenCevap === index;
                                
                                const ilkKategori = Object.keys(cevap.puanlama)[0];
                                const IconComponent = getCategoryIcon(ilkKategori);

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleCevapSecimi(cevap.puanlama, index)}
                                        disabled={secilenCevap !== null}
                                        className={`
                                            w-full text-left p-3 rounded-lg border-2 transition-all duration-300
                                            ${isSelected 
                                                ? 'bg-green-500 border-green-700 shadow-xl text-white' 
                                                : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-red-50' 
                                            }
                                        `}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`p-2 rounded-full flex-shrink-0 ${isSelected ? 'bg-white' : 'bg-gray-200'}`}> 
                                                {React.cloneElement(IconComponent, { className: 'w-5 h-5 text-red-600' })} 
                                            </div>
                                            <span className="font-semibold text-sm flex-grow">{cevap.metin}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Yükleniyor Ekranı (Aynı kalır)
    if (isFinishing) {
        return (
             <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center p-10 bg-white rounded-xl shadow-2xl border-t-8 border-yellow-600 relative z-10">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-4 animate-pulse">
                        <TrophyIcon className="w-8 h-8 inline mr-2 text-yellow-600" /> SONUÇLAR ANALİZ EDİLİYOR...
                    </h2>
                    <p className="text-lg text-gray-600">Kişiliğinize en uygun kulüpler listeleniyor. Lütfen bekleyin.</p>
                </div>
            </div>
        );
    }

    // Ana Yapı
    return (
        <div className="simulation-container-bg p-6 flex flex-col items-center"> 
            
            {/* Bu header aynı kalır. */}
            <header className="w-full max-w-6xl flex justify-between items-center mb-8 pb-4 border-b border-gray-300 relative z-10">
                <button 
                    onClick={() => navigate('/kulupler')} 
                    className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Kulüplere Dön</span>
                </button>
                <h1 className="text-2xl font-extrabold text-gray-800">
                    KULÜP TAVSİYE TESTİ
                </h1>
                <div className="w-20"></div>
            </header>
            
            {/* MERKEZİ İÇERİK */}
            <div className="w-full max-w-6xl">
                
                {adim === 0 && renderGiris()}
                {adim > 0 && adim <= SORU_AKISI.length && renderSoru()}
                
            </div>

            {/* 🔥 Geri Bildirim Mesajı (Tüm ekranın üstünde kalır) */}
            <FeedbackMessage message={feedback} />
        </div>
    );
}