import React, { useState, useMemo, useEffect } from 'react'; // useEffect eklendi
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CalculatorIcon, AcademicCapIcon, BanknotesIcon } from '@heroicons/react/24/outline'; 

// ⭐⭐⭐ TÜM BÖLÜMLERİN VE İNDİRİMLERİN YER ALDIĞI EKSİKSİZ NİHAİ VERİ YAPISI ⭐⭐⭐
const BOLUM_UCRETLERI = [
    // Bütün 44 Bölüm Buraya Alınmıştır 
    { ad: "İngilizce Hazırlık", ucret: 250000, indirim50: 167300, indirim75: 125225, indirim85: 108345 },
    { ad: "Ağız ve Diş Sağlığı", ucret: 562000, indirim50: 281000, indirim75: 210800, indirim85: 182280 },
    { ad: "Anestezi", ucret: 560400, indirim50: 275200, indirim75: 206400, indirim85: 179188 },
    { ad: "Aşçılık", ucret: 560400, indirim50: 275200, indirim75: 206400, indirim85: 179188 },
    { ad: "Bankacılık ve Sigortacılık", ucret: 496900, indirim50: 248400, indirim75: 186300, indirim85: 161350 },
    { ad: "Deniz Ulaştırma ve İşletme", ucret: 643200, indirim50: 321500, indirim75: 241200, indirim85: 208888 },
    { ad: "Bilgisayar Programcılığı", ucret: 643200, indirim50: 321500, indirim75: 241200, indirim85: 208888 },
    { ad: "Bilgisayar Teknolojisi", ucret: 643200, indirim50: 321500, indirim75: 241200, indirim85: 208888 },
    { ad: "Bilgisayar Mühendisliği", ucret: 1155870, indirim50: 584200, indirim75: 438150, indirim85: 380450 },
    { ad: "Çocuk Gelişimi", ucret: 486300, indirim50: 243100, indirim75: 182400, indirim85: 158220 },
    { ad: "Dış Ticaret", ucret: 622200, indirim50: 311100, indirim75: 233300, indirim85: 202240 },
    { ad: "Eczane Hizmetleri", ucret: 472500, indirim50: 236200, indirim75: 177000, indirim85: 153375 },
    { ad: "Elektrik", ucret: 542000, indirim50: 270800, indirim75: 203100, indirim85: 175988 },
    { ad: "Elektronik Teknolojisi", ucret: 558000, indirim50: 278900, indirim75: 209200, indirim85: 181280 },
    { ad: "Endüstri Mühendisliği", ucret: 761300, indirim50: 380500, indirim75: 285400, indirim85: 247388 },
    { ad: "Fizyoterapi", ucret: 596600, indirim50: 298200, indirim75: 223500, indirim85: 193760 },
    { ad: "Grafik Tasarımı", ucret: 593400, indirim50: 296700, indirim75: 222500, indirim85: 192862 },
    { ad: "Halkla İlişkiler ve Tanıtım", ucret: 577700, indirim50: 288800, indirim75: 216600, indirim85: 187890 },
    { ad: "İç Mimarlık", ucret: 770500, indirim50: 385100, indirim75: 288900, indirim85: 250425 },
    { ad: "İnsan Kaynakları Yönetimi", ucret: 483800, indirim50: 241900, indirim75: 181425, indirim85: 157300 },
    { ad: "İnşaat Mühendisliği", ucret: 643200, indirim50: 321500, indirim75: 241200, indirim85: 208888 },
    { ad: "İşletme", ucret: 554900, indirim50: 277400, indirim75: 208100, indirim85: 180462 },
    { ad: "İngilizce Dili ve Edebiyatı", ucret: 562000, indirim50: 281000, indirim75: 210800, indirim85: 182280 },
    { ad: "İngilizce Mütercim ve Tercümanlık", ucret: 919800, indirim50: 459900, indirim75: 344925, indirim85: 298950 },
    { ad: "İnşaat Mühendisliği (İngilizce)", ucret: 643200, indirim50: 321500, indirim75: 241200, indirim85: 208888 },
    { ad: "Mekatronik", ucret: 528000, indirim50: 264000, indirim75: 198000, indirim85: 171600 },
    { ad: "Muhasebe ve Finans Yönetimi", ucret: 528000, indirim50: 264000, indirim75: 198000, indirim85: 171600 },
    { ad: "Makine", ucret: 528000, indirim50: 264000, indirim75: 198000, indirim85: 171600 },
    { ad: "Odyometri", ucret: 496900, indirim50: 248400, indirim75: 186300, indirim85: 161350 },
    { ad: "Optisyenlik", ucret: 496900, indirim50: 248400, indirim75: 186300, indirim85: 161350 },
    { ad: "Otomotiv Teknolojisi", ucret: 643200, indirim50: 321500, indirim75: 241200, indirim85: 208888 },
    { ad: "Oyun Yazılımı", ucret: 592000, indirim50: 296000, indirim75: 222000, indirim85: 192700 }, 
    { ad: "Ön Lisans Tıbbi Dokümantasyon", ucret: 508600, indirim50: 254200, indirim75: 190800, indirim85: 165500 },
    { ad: "Sivil Hava Ulaştırma Hizmetleri", ucret: 578000, indirim50: 288800, indirim75: 216600, indirim85: 187890 },
    { ad: "Tıbbi Görüntüleme Teknikleri", ucret: 596600, indirim50: 298200, indirim75: 223500, indirim85: 193760 },
    { ad: "Tıbbi Laboratuvar Teknikleri", ucret: 576000, indirim50: 288000, indirim75: 216000, indirim85: 187200 },
    { ad: "Turizm ve Otel İşletmeciliği", ucret: 458000, indirim50: 229000, indirim75: 171800, indirim85: 148875 },
    { ad: "Uluslararası Ticaret ve İşletmecilik", ucret: 787200, indirim50: 393600, indirim75: 295200, indirim85: 255840 },
    { ad: "Yapı Denetimi", ucret: 643200, indirim50: 321500, indirim75: 241200, indirim85: 208888 },
    { ad: "Yazılım Mühendisliği", ucret: 1028400, indirim50: 514200, indirim75: 385650, indirim85: 334340 },
    { ad: "Hukuk", ucret: 693300, indirim50: 346500, indirim75: 259875, indirim85: 225300 },
    { ad: "Hemşirelik", ucret: 685100, indirim50: 342500, indirim75: 256875, indirim85: 222662 },
    { ad: "Gastronomi ve Mutfak Sanatları", ucret: 742400, indirim50: 371200, indirim75: 278400, indirim85: 241480 },
    { ad: "Görsel İletişim Tasarımı", ucret: 703700, indirim50: 351800, indirim75: 263850, indirim85: 228675 },
];


// UTILITY: Türk Lirası formatı (250.000 ₺)
const formatTL = (sayi) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 0, 
    }).format(sayi);
};


export default function UcretHesaplama() {
    const navigate = useNavigate();
    
    const [secilenBolum, setSecilenBolum] = useState(''); 
    const [secilenIndirim, setSecilenIndirim] = useState('ucret'); 
    
    // ⭐ YENİ STATE: Animasyonu her seçimde tetiklemek için
    const [animationTrigger, setAnimationTrigger] = useState(0); 

    const bolumSecenekleri = BOLUM_UCRETLERI.map(b => b.ad).sort();
    
    const indirimSecenekleri = {
        'ucret': 'Normal Ücret',
        'indirim50': '%50 Burs (Normal Öğrenci)',
        'indirim75': '%50 Burs + %25 Teşvik',
        'indirim85': '%50 Burs + %25 Teşvik + %10 Referans'
    };

    const hesaplananUcret = useMemo(() => {
        if (!secilenBolum) return 0;
        
        const bolum = BOLUM_UCRETLERI.find(b => b.ad === secilenBolum);
        if (!bolum) return 0;
        
        return bolum[secilenIndirim] || 0;

    }, [secilenBolum, secilenIndirim]);


    // 🔥🔥🔥 EFFECT: Hesaplanan ücret değiştiğinde animasyonu tetikle 🔥🔥🔥
    useEffect(() => {
        // Hesaplanan ücret değiştiğinde (seçimler değiştiğinde) tetiklenir
        setAnimationTrigger(prev => prev + 1);
    }, [hesaplananUcret]); 


    const sonucuFormatla = formatTL(hesaplananUcret);


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 p-4 md:p-10">
            {/* ⬅️ Başlık ve Geri Dön Butonu */}
            <header className="flex justify-between items-center mb-10 pb-4 border-b border-red-200">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Geri Dön</span>
                </button>
                <h1 className="text-4xl font-extrabold text-gray-800 flex items-center tracking-tight">
                    <CalculatorIcon className="w-8 h-8 mr-3 text-blue-600" /> Vizia Ücret Danışmanı
                </h1>
                <div className="w-20"></div> 
            </header>

            {/* ⭐ Hesaplama Kartı - Glassmorphism ve Şıklık Burada! ⭐ */}
            <div className="max-w-xl mx-auto w-full bg-white/70 backdrop-blur-md p-8 rounded-2xl 
                            shadow-3xl border border-white/80 transition-all duration-300 hover:shadow-4xl">
                
                {/* Kırmızı Vurgulu Başlık */}
                <div className="mb-8 pb-4 border-b border-red-200">
                    <h2 className={`text-2xl font-extrabold transition-colors duration-500 ${secilenBolum ? 'text-red-700' : 'text-gray-600'}`}>
                        {secilenBolum || 'Lütfen Hesaplama Yapmak İstediğiniz Programı Seçin'}
                    </h2>
                </div>
                
                <p className="text-md text-gray-700 mb-8">Ücretler, seçtiğiniz program ve burs oranına göre anlık olarak hesaplanır.</p>

                {/* 1. Bölüm Seçimi Grubu */}
                <div className="mb-8 group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2 transition-colors duration-300 group-focus-within:text-red-600">
                        <AcademicCapIcon className="w-5 h-5 text-red-600"/> 1. Eğitim Programınızı Belirleyin
                    </label>
                    <div className="relative">
                        <select
                            value={secilenBolum}
                            onChange={(e) => setSecilenBolum(e.target.value)}
                            className="w-full p-4 pl-12 border border-gray-300 rounded-lg bg-gray-50 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition duration-150 shadow-inner appearance-none cursor-pointer text-lg font-medium hover:border-red-400"
                        >
                            <option value="" disabled>-- Bölüm Seçin --</option>
                            {bolumSecenekleri.map(bolum => (
                                <option key={bolum} value={bolum}>{bolum}</option>
                            ))}
                        </select>
                        <AcademicCapIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-red-500 pointer-events-none"/>
                    </div>
                </div>

                {/* 2. İndirim Seçimi Grubu */}
                <div className="mb-10 group">
                    <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2 transition-colors duration-300 group-focus-within:text-green-600">
                        <BanknotesIcon className="w-5 h-5 text-green-600"/> 2. Sahip Olduğunuz İndirim Oranını Seçin
                    </label>
                    <div className="relative">
                        <select
                            value={secilenIndirim}
                            onChange={(e) => setSecilenIndirim(e.target.value)}
                            className="w-full p-4 pl-12 border border-gray-300 rounded-lg bg-gray-50 focus:border-green-500 focus:ring-2 focus:ring-green-500 transition duration-150 shadow-inner appearance-none cursor-pointer text-lg font-medium"
                            disabled={!secilenBolum} 
                        >
                            {Object.entries(indirimSecenekleri).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </select>
                        <BanknotesIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-600 pointer-events-none"/>
                    </div>
                </div>

                {/* ⭐ SONUÇ EKRANI (EN GÖSTERİŞLİ BÖLÜM + ANİMASYON) ⭐ */}
                <div className={`mt-10 p-8 rounded-2xl text-center transition-all duration-700 
                    ${hesaplananUcret > 0 ? 'bg-red-800 text-white shadow-3xl shadow-red-500/50' : 'bg-gray-200 text-gray-600 shadow-inner'}`}>
                    
                    {hesaplananUcret > 0 ? (
                        <>
                            <p className="text-xl font-medium mb-3 opacity-80">Yıllık Ödenecek Toplam Ücret</p>
                            
                            {/* 🔥 KEY'İ ZORLA TETİKLEYİCİYE BAĞLADIK: Her ücret değiştiğinde animasyon yeniden oynar 🔥 */}
                            <p className={`text-6xl font-extrabold tracking-tight transition-transform duration-300 transform scale-100 ${animationTrigger > 0 ? 'animate-pulse-once' : ''}`}
                                key={animationTrigger} 
                            >
                                {sonucuFormatla}
                            </p>
                            
                            <p className="text-sm mt-4 opacity-70">Bu, resmi indirimleriniz düşüldükten sonraki kesin ücrettir.</p>
                        </>
                    ) : (
                        <p className="text-xl font-medium">Hesaplama sonucu burada anında görüntülenecektir.</p>
                    )}
                </div>

            </div>
        </div>
    );
}