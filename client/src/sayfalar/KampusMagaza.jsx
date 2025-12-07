import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

// Demo Ürün Verileri (API'den gelmesi gereken verilerin simülasyonu)
const urunler = [
  { id: 1, ad: "Vizia Logolu Sweatshirt", fiyat: "450 TL", kategori: "Üst Giyim", renk: "Kırmızı", resim: "https://via.placeholder.com/300x200?text=Sweatshirt" },
  { id: 2, ad: "Kampüs T-Shirt (Beyaz)", fiyat: "200 TL", kategori: "Üst Giyim", renk: "Beyaz", resim: "https://via.placeholder.com/300x200?text=T-Shirt" },
  { id: 3, ad: "Vizia Spor Çanta", fiyat: "350 TL", kategori: "Aksesuar", renk: "Siyah", resim: "https://via.placeholder.com/300x200?text=Spor+Canta" },
  { id: 4, ad: "Vizia Şapka", fiyat: "150 TL", kategori: "Aksesuar", renk: "Kırmızı", resim: "https://via.placeholder.com/300x200?text=Sapka" },
  { id: 5, ad: "Vizia Kalem Seti", fiyat: "80 TL", kategori: "Kırtasiye", renk: "Çoklu", resim: "https://via.placeholder.com/300x200?text=Kalem+Seti" },
  { id: 6, ad: "Vizia Kampüs Mont", fiyat: "780 TL", kategori: "Üst Giyim", renk: "Lacivert", resim: "https://via.placeholder.com/300x200?text=Mont" },
];

const filtreler = [
  { baslik: "Kategori", secenekler: ["Üst Giyim", "Alt Giyim", "Aksesuar", "Kırtasiye"] },
  { baslik: "Renk", secenekler: ["Kırmızı", "Beyaz", "Siyah", "Lacivert"] },
];

export default function KampusMagaza() {
  const navigate = useNavigate();
  const [seciliFiltreler, setSeciliFiltreler] = React.useState({}); // Filtreleme durumu

  // Normalde burada filtreleme mantığı uygulanır (şimdilik pasif)
  // const filtrelenmisUrunler = urunler.filter(...)

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10 animate-fade-in">
      {/* ⬅️ Geri Dön ve Başlık */}
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-red-200">
        <button 
          onClick={() => navigate(-1)} 
          className="text-red-600 hover:text-red-800 transition font-medium"
        >
          {"< Geri Dön"}
        </button>
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
          <ShoppingBagIcon className="w-8 h-8 mr-2 text-red-600" /> Vizia Kampüs Mağazası
        </h1>
      </header>

      {/* 🛍️ MAĞAZA İÇERİĞİ (GRID YAPISI) */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* ⚙️ Sol Menü - Filtreler */}
        <aside className="w-full md:w-64 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">Ürün Filtreleri</h2>
          {filtreler.map((filtre) => (
            <div key={filtre.baslik} className="mb-4">
              <button className="w-full flex justify-between items-center text-left font-semibold text-red-600 hover:text-red-700 py-2">
                {filtre.baslik} <ChevronDownIcon className="w-4 h-4" />
              </button>
              <div className="pl-2 pt-1 text-sm text-gray-600">
                {filtre.secenekler.map((secenek) => (
                  <label key={secenek} className="flex items-center space-x-2 py-1 cursor-pointer hover:text-red-500">
                    <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" />
                    <span>{secenek}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">Filtrele</button>
        </aside>

        {/* 📦 Ürün Listesi - Ana Alan */}
        <main className="flex-grow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {urunler.map((urun) => (
              <div key={urun.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-[1.02] hover:shadow-2xl">
                {/* Ürün Görseli */}
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                  <img src={urun.resim} alt={urun.ad} className="object-cover w-full h-full" />
                </div>
                {/* Ürün Bilgileri */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-2">{urun.ad}</h3>
                  <p className="text-sm text-red-600 font-semibold mt-1">{urun.kategori}</p>
                  <p className="text-xl font-extrabold text-gray-900 mt-2">{urun.fiyat}</p>
                </div>
                {/* E-ticaret olmayan 'İncele' butonu */}
                <div className="p-4 pt-0">
                  <button className="w-full bg-red-100 text-red-700 py-2 rounded-lg font-medium hover:bg-red-200 transition">
                    Ürünü İncele (Satış Yok)
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ⚠️ Eğer hiç ürün yoksa gösterilecek mesaj */}
          {urunler.length === 0 && (
            <div className="text-center py-20 text-gray-500 text-lg">
              Şu anda mağazada görüntülenecek ürün bulunmamaktadır.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}