import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ChevronDownIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'; 

// AIChat bileşeni import edildi.
import { AIChat } from './AIChat'; 

// **********************************************
// 1. ÜRÜN VERİ YAPISI ve GÖRSEL LİNKLERİ (TÜM LİSTE - KESİN GÜVENLİ YOLLAR)
// **********************************************
const Category = {
  GIYIM: "Giyim",
  AKSESUAR: "Aksesuar",
  KIRTASIYE: "Kırtasiye",
  TEKNOLOJI: "Teknoloji",
  ICECEK: "İçecek", 
  MONTAJ: "Mont"
};

const PRODUCTS = [
  // Yollar, büyük/küçük harf ve Türkçe karakter hatalarına karşı KESİN GÜVENLİ hale getirildi.
  { id: 1, name: "Kırmızı Kapüşonlu Sweatshirt", price: 1080, category: Category.GIYIM, renk: "Kırmızı", resim: "/images/kirmizi_sweatshirt.png", description: "Üniversite logolu, kalın kumaş, rahat kesim kırmızı sweatshirt.", colors: ["Kırmızı", "Siyah"], sizes: ["S", "M", "L", "XL"] },
  { id: 2, name: "Kırmızı Kolej Mont", price: 2610, category: Category.MONTAJ, renk: "Kırmızı-Beyaz", resim: "/images/kirmizi_kolej_mont.jpg", description: "Klasik kolej stili, beyaz deri kollu, armalı mont.", colors: ["Kırmızı-Beyaz"], sizes: ["S", "M", "L", "XL"] },
  { id: 3, name: "Antrasit Yelken Baskılı Tişört", price: 576, category: Category.GIYIM, renk: "Antrasit", resim: "/images/yelken_baskili_tisort.jpg", description: "Antrasit renk, özel tasarım yelken baskılı %100 pamuklu tişört.", colors: ["Antrasit", "Beyaz"], sizes: ["S", "M", "L", "XL"] },
  { id: 4, name: "Beyaz T-Shirt (Kırmızı Logo)", price: 576, category: Category.GIYIM, renk: "Beyaz", resim: "/images/beyaz_renk_tisort.jpg", description: "Minimalist kırmızı logo baskılı, %100 pamuklu unisex tişört.", colors: ["Beyaz", "Siyah"], sizes: ["S", "M", "L", "XL"] },
  { id: 5, name: "Siyah Kolej Mont", price: 2610, category: Category.MONTAJ, renk: "Siyah-Beyaz", resim: "/images/siyah_kolej_mont.jpeg", description: "Siyah/Beyaz, deri kollu, DOU armalı lüks kolej montu.", colors: ["Siyah-Beyaz"], sizes: ["M", "L", "XL"] },
  { id: 6, name: "DOU Baskılı Siyah Şapka", price: 432, category: Category.AKSESUAR, renk: "Siyah-Kırmızı", resim: "/images/dou_baskili_siyah_sapka.jpeg", description: "Kırmızı siperlikli, nakış işlemeli, ayarlanabilir beyzbol şapkası.", colors: ["Siyah-Kırmızı"], sizes: ["Standart"] },
  { id: 7, name: "Siyah Kapüşonlu Sweatshirt", price: 1080, category: Category.GIYIM, renk: "Siyah", resim: "/images/siyah_sweatshirt.png", description: "Klasik siyah kapüşonlu, üniversite baskılı sweatshirt.", colors: ["Siyah", "Gri"], sizes: ["S", "M", "L"] },
  { id: 8, name: "Beyaz Kapüşonlu Sweatshirt", price: 1080, category: Category.GIYIM, renk: "Beyaz", resim: "/images/beyaz_sweatshirt.png", description: "Yüksek kaliteli, beyaz renk kapüşonlu sweatshirt.", colors: ["Beyaz", "Mavi"], sizes: ["S", "M", "L"] },
  { id: 9, name: "Gri Tişört (DOU Baskılı)", price: 576, category: Category.GIYIM, renk: "Gri", resim: "/images/gri_dou_baskili_tisort.jpg", description: "Gri renk, DOU logosu baskılı pamuklu tişört.", colors: ["Gri", "Siyah"], sizes: ["S", "M", "L"] },
  { id: 10, name: "Kırmızı Logolu Tişört", price: 576, category: Category.GIYIM, renk: "Kırmızı", resim: "/images/kirmizi_dou_baskili_tisort.jpg", description: "Kırmızı renk, minimal DOU baskılı tişört.", colors: ["Kırmızı", "Beyaz"], sizes: ["S", "M", "L"] },
  { id: 11, name: "Siyah Powerbank", price: 855, category: Category.TEKNOLOJI, renk: "Siyah", resim: "/images/siyah_tasinabilir_sarz_aleti.jpeg", description: "10000 mAh, logo baskılı Powerbank, hızlı şarj destekli.", colors: ["Siyah"], sizes: ["Standart"] },
  { id: 12, name: "Siyah Çelik Termos", price: 630, category: Category.ICECEK, renk: "Siyah", resim: "/images/siyah_celik_termos.jpg", description: "İçeceğinizi 6 saat sıcak tutan çift katmanlı siyah termos.", colors: ["Siyah", "Kırmızı"], sizes: ["500ml"] },
  { id: 13, name: "Bez Çanta", price: 90, category: Category.AKSESUAR, renk: "Ham Bez", resim: "/images/bez_canta.jpeg", description: "Çevre dostu, dayanıklı bez omuz çantası.", colors: ["Ham Bez", "Siyah"], sizes: ["Standart"] },
  { id: 14, name: "Akademik Defter", price: 171, category: Category.KIRTASIYE, renk: "Siyah", resim: "/images/defter.jpeg", description: "Sert kapaklı, yıllık planlayıcı özellikli akademik defter.", colors: ["Siyah", "Kırmızı"], sizes: ["A5"] },
  { id: 15, name: "Rüzgar Şemsiyesi", price: 810, category: Category.AKSESUAR, renk: "Siyah", resim: "/images/semsiye.png", description: "Logo baskılı, rüzgara dayanıklı otomatik şemsiye.", colors: ["Siyah"], sizes: ["Standart"] },
];


// **********************************************
// 2. ÜRÜN KART BİLEŞENİ (ProductCard)
// **********************************************
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white flex flex-col h-full rounded-xl shadow-lg transition transform hover:scale-[1.03] hover:shadow-2xl overflow-hidden border border-gray-100">
      <div className="relative aspect-square overflow-hidden bg-gray-50 mb-5">
        <img
          src={product.resim} 
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out" 
          onError={(e) => { e.target.onerror = null; e.target.src="/placeholder.jpg"; e.target.className = "w-full h-full object-contain bg-gray-200" }}
        />
      </div>
      
      <div className="flex flex-col flex-grow text-center px-4 py-2">
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-semibold">
          {product.category}
        </span>
        <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 font-light leading-relaxed px-1">
          {product.description}
        </p>
        
        <div className="mt-auto pt-3">
          <p className="text-2xl font-black text-red-600">
            {product.price.toLocaleString('tr-TR')} ₺
          </p>
          <div className="mt-2 pt-2 border-t border-gray-100">
             <div className="flex justify-center gap-2">
                {product.sizes.map((size) => (
                  <span key={size} className="text-xs text-gray-400 font-mono">
                    [{size}]
                  </span>
                ))}
             </div>
          </div>
        </div>
      </div>
      
      {/* E-TİCARET YOK UYARISI */}
      <div className="mt-4 p-4 pt-0">
          <button className="w-full bg-red-100 text-red-700 py-3 rounded-lg font-medium transition hover:bg-red-200 cursor-default">
            SADECE KATALOG GÖRÜNTÜLEME
          </button>
      </div>
    </div>
  );
};


// **********************************************
// 3. DİNAMİK SLIDER (ProductSlider) - KESİN ÇÖZÜM
// **********************************************
const sliderItems = [
    // SLIDER GÖRSELLERİ BURADA
    { title: "Bu Kış Çok Sıcak Geçecek", subtitle: "Yeni Sweatshirt ve Mont Koleksiyonu", bg: '/images/slider1.jpg', url: "/ogrenci/magaza" },
    { title: "Tarzını Yakala", subtitle: "Siyah ve Kırmızı Koleksiyonu Kampüste!", bg: '/images/slider2.jpg', url: "/ogrenci/magaza" },
];

const ProductSlider = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Otomatik Kaydırma Efekti
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderItems.length);
        }, 5000); // 5 saniyede bir kaydır

        return () => clearInterval(interval); // Bileşen kaldırıldığında temizle
    }, []);

    const goToPrev = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex - 1 + sliderItems.length) % sliderItems.length
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderItems.length);
    };

    const currentItem = sliderItems[currentIndex];

    return (
        <div className="relative w-full h-[350px] sm:h-[450px] overflow-hidden group">
            
            {/* Arka Plan Görseli */}
            <div 
                className="absolute inset-0 transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {sliderItems.map((item, index) => (
                    <div 
                        key={index} 
                        className="w-full h-full absolute inset-0"
                        style={{ left: `${index * 100}%` }}
                    >
                        <img 
                            className="w-full h-full object-cover object-center opacity-80 transition-opacity duration-500" 
                            src={item.bg} 
                            alt={item.title} 
                        />
                        {/* METİN KATMANI */}
                        <div className="absolute inset-0 bg-red-900/30 mix-blend-multiply"></div> 
                    </div>
                ))}
            </div>

            {/* İçerik ve Metin */}
            <div className="relative max-w-7xl mx-auto h-full flex flex-col justify-center items-center text-center px-4 z-10">
                <h2 className="text-4xl font-black tracking-tight text-white sm:text-7xl mb-6 drop-shadow-lg transition-opacity duration-1000">
                    {currentItem.title}
                </h2>
                <p className="text-xl text-white max-w-2xl font-light drop-shadow-md">
                    {currentItem.subtitle}
                </p>
                <button
                    onClick={() => navigate(currentItem.url)}
                    className="mt-8 px-8 py-3 bg-white text-red-600 font-semibold rounded-full shadow-xl transition transform hover:scale-[1.05] hover:bg-red-50"
                >
                    Şimdi Keşfet
                </button>
            </div>
            
            {/* KONTROL BUTONLARI */}
            <button
                onClick={goToPrev}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-white/30 text-red-600 rounded-full 
                            opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 
                            hover:bg-white/50 hover:scale-110"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
                onClick={goToNext}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-white/30 text-red-600 rounded-full 
                            opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 
                            hover:bg-white/50 hover:scale-110"
            >
                <ChevronRightIcon className="w-6 h-6" />
            </button>
        </div>
    );
};


// **********************************************
// 4. FİLTRELEME BİLEŞENİ (Filtreler)
// **********************************************
const Filtreler = ({ filters, selectedFilters, onFilterChange }) => {
    // Kategori ve Renk bilgileri, yukarıdaki ürün listesinden otomatik çekilir.
    
    // Filtre seçenekleri, ürün listesinden dinamik olarak oluşturulur
    const filtreSecenekleri = [
        { baslik: "Kategori", tip: "category", secenekler: Object.values(Category) },
        { baslik: "Renk", tip: "renk", secenekler: Array.from(new Set(PRODUCTS.map(p => p.renk))) },
    ];
    
    return (
        <aside className="w-full md:w-64 bg-white p-6 rounded-xl shadow-lg h-fit sticky top-4">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-red-700">Filtrele</h2>
            
            {/* Seçili Filtreleri Gösterme */}
            {Object.entries(selectedFilters).some(([key, value]) => value.length > 0) && (
                <div className="mb-4 pt-2 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-700 mb-2">Aktif Filtreler</h3>
                    <div className="flex flex-wrap gap-2 text-xs">
                        {Object.entries(selectedFilters).map(([tip, degerler]) => 
                            degerler.map(deger => (
                                <span 
                                    key={deger}
                                    className="flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full font-medium cursor-pointer hover:bg-red-100 transition"
                                    onClick={() => onFilterChange(tip, deger)} // Tıklayınca kaldırma işlevi
                                >
                                    {deger} <XMarkIcon className="w-3 h-3 ml-1" />
                                </span>
                            ))
                        )}
                    </div>
                </div>
            )}


            {filtreSecenekleri.map((filtre) => (
                <div key={filtre.baslik} className="mb-4">
                    <button className="w-full flex justify-between items-center text-left font-semibold text-gray-700 hover:text-red-600 py-2 border-t border-gray-100 mt-2">
                        {filtre.baslik} <ChevronDownIcon className="w-4 h-4" />
                    </button>
                    <div className="pl-2 pt-1 text-sm text-gray-600">
                        {filtre.secenekler.map((secenek) => (
                            <label key={secenek} className="flex items-center space-x-2 py-1 cursor-pointer hover:text-red-500">
                                <input 
                                    type="checkbox" 
                                    className="rounded text-red-600 focus:ring-red-500" 
                                    checked={selectedFilters[filtre.tip]?.includes(secenek) || false}
                                    onChange={() => onFilterChange(filtre.tip, secenek)}
                                />
                                <span>{secenek}</span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            
            <button 
                onClick={() => onFilterChange(null, null, true)} // Tüm filtreleri temizle
                className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
                Tüm Filtreleri Temizle
            </button>
        </aside>
    );
};


// **********************************************
// 5. MAĞAZA SAYFASI (KampusMagaza.jsx - STATE VE MANTIK)
// **********************************************
const filtreSecenekleriStatic = [
    { baslik: "Kategori", tip: "category", secenekler: Object.values(Category) },
    { baslik: "Renk", tip: "renk", secenekler: Array.from(new Set(PRODUCTS.map(p => p.renk))) },
];

export default function KampusMagaza() {
    const navigate = useNavigate();
    const [selectedFilters, setSelectedFilters] = useState({ category: [], renk: [] });

    // Filtreleme Mantığı
    const filtrelenmisUrunler = useMemo(() => {
        return PRODUCTS.filter(urun => {
            const kategoriFiltresi = selectedFilters.category.length === 0 || selectedFilters.category.includes(urun.category);
            const renkFiltresi = selectedFilters.renk.length === 0 || selectedFilters.renk.includes(urun.renk);
            return kategoriFiltresi && renkFiltresi;
        });
    }, [selectedFilters]);

    // Filtre Değiştirme Fonksiyonu
    const handleFilterChange = (tip, deger, temizle = false) => {
        if (temizle) {
            setSelectedFilters({ category: [], renk: [] });
            return;
        }

        setSelectedFilters(prev => {
            const mevcutDegerler = prev[tip] || [];
            if (mevcutDegerler.includes(deger)) {
                // Filtreyi Kaldır
                return { ...prev, [tip]: mevcutDegerler.filter(d => d !== deger) };
            } else {
                // Filtreyi Ekle
                return { ...prev, [tip]: [...mevcutDegerler, deger] };
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            {/* ⬅️ Geri Dön Butonu - YUKARI SABİT */}
            <header className="sticky top-0 z-40 bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-100">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Geri Dön</span>
                </button>
                <span className="font-extrabold text-2xl text-red-600 tracking-tighter uppercase">
                    VIZIA MAĞAZA
                </span>
                <div className="w-20 flex items-center justify-end">
                    {/* Sepet Simgesi Eklendi */}
                    <ShoppingCartIcon className="w-6 h-6 text-gray-600 hover:text-red-600 transition cursor-pointer" />
                    {/* Sepet Sayısı (Şu an 0) */}
                    <span className="ml-1 text-red-600 font-bold">0</span>
                </div>
            </header>

            <main className="flex-grow">
                
                {/* ⭐ NİHAİ SLIDER REVİZYONU */}
                <ProductSlider /> 
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* ⚙️ Sol Menü - Filtreler */}
                        <Filtreler 
                            filters={filtreSecenekleriStatic} 
                            selectedFilters={selectedFilters}
                            onFilterChange={handleFilterChange}
                        />

                        {/* 📦 Ürün Listesi - Ana Alan */}
                        <div className="flex-grow">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-widest">
                                    Vizia Seçkisi ({filtrelenmisUrunler.length} Ürün)
                                </h2>
                                <div className="w-16 h-1.5 bg-red-600 mx-auto mt-6"></div>
                            </div>

                            {filtrelenmisUrunler.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20">
                                    {filtrelenmisUrunler.map(product => (
                                        <ProductCard 
                                            key={product.id} 
                                            product={product} 
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-gray-500 text-xl font-light">
                                    Seçili filtrelerinize uygun ürün bulunamamıştır.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <section className="bg-red-50 py-16 border-t border-red-100">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <p className="text-2xl text-red-900 font-light italic leading-relaxed">
                            "Kampüs stili sadece kıyafet değildir, bir duruşur. Vizia ile tarzını yansıt."
                        </p>
                    </div>
                </section>
            </main>

            <footer className="bg-white py-8 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className className="text-gray-400 text-xs tracking-widest uppercase">
                        VIZIA KAMPÜS © 2024
                    </p>
                </div>
            </footer>
            
            {/* ⭐ YAPAY ZEKA CHAT BOT BURAYA EKLENİYOR ⭐ */}
            <AIChat />

        </div>
    );
};