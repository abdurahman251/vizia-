import { useState, useEffect, useMemo } from "react";
import {
  BuildingOffice2Icon,
  XMarkIcon,
  MapPinIcon,
  QueueListIcon,
  PlusIcon,
  ArrowLeftIcon,
  BeakerIcon, 
  UsersIcon,  
  SparklesIcon, 
  HeartIcon, 
  BriefcaseIcon 
} from "@heroicons/react/24/outline"; 
import { useNavigate } from "react-router-dom"; 


// Alanları filtrelemek için anahtar kategoriler
const ALAN_KATEGORILERI = {
    "LAB_ATOLYE": "🔬 LAB & Atölye",
    "SOSYAL_KAFE": "☕ Sosyal & Kafe",
    "SPOR_SAGLIK": "🤸 Spor & Sağlık",
    "YONETIM_OFIS": "🏢 Yönetim & Ofis",
    "DERSLIKLER": "📚 Derslikler",
    "OTOPARK": "🅿️ Otopark"
};

const KATLAR_TUM = [
  {
    id: "B4",
    ad: "B4 (Otopark)",
    image: "/b4.jpg",
    alanlar: ["Otopark"],
    kategori: [ALAN_KATEGORILERI.OTOPARK]
  },
  {
    id: "B3",
    ad: "B3 (Sosyal Alanlar)",
    image: "/b3.jpg",
    alanlar: ["Otopark", "Mescid", "Abdesthane"],
    kategori: [ALAN_KATEGORILERI.OTOPARK, ALAN_KATEGORILERI.SOSYAL_KAFE]
  },
  {
    id: "B2",
    ad: "B2 (Spor & Lab)",
    image: "/b2.jpg",
    alanlar: [
      "Makine İleri Teknolojiler Laboratuvarı",
      "Spor Salonu",
      "Dans ve Drama Salonu",
      "Yoga Salonu",
      "Amfiler",
    ],
    kategori: [ALAN_KATEGORILERI.LAB_ATOLYE, ALAN_KATEGORILERI.SPOR_SAGLIK, ALAN_KATEGORILERI.DERSLIKLER]
  },
  {
    id: "B1",
    ad: "B1 (LAB & Mutfak)",
    image: "/b1.jpg",
    alanlar: [
      "Hemşirelik LAB",
      "Robot ve Teknoloji Yazılım LAB",
      "Mutfak",
      "Gastronomi",
      "Yemekhane",
      "Bilgi İşlem Akademik Ofisler",
    ],
    kategori: [ALAN_KATEGORILERI.LAB_ATOLYE, ALAN_KATEGORILERI.SOSYAL_KAFE, ALAN_KATEGORILERI.YONETIM_OFIS]
  },
  {
    id: "Z",
    ad: "Zemin Kat (Sosyal)",
    image: "/zemin.jpg",
    alanlar: [
      "Tanıtım ve Halkla İlişkiler",
      "Psikolojik Danışmanlık",
      "Engelli Öğrenci Birimi",
      "Dikiş Atölyesi",
      "Kariyer Merkezi",
      "Kafe",
      "Sergi Alanı",
    ],
    kategori: [ALAN_KATEGORILERI.SOSYAL_KAFE, ALAN_KATEGORILERI.YONETIM_OFIS]
  },
  {
    id: "1",
    ad: "1. Kat (Derslikler)",
    image: "/kat1.jpg",
    alanlar: [
      "Derslikler",
      "SBYO Müdürlüğü",
      "MYO Müdürlüğü",
      "Fakülte Dekanlıkları",
      "Teknoloji Transfer Ofisi",
    ],
    kategori: [ALAN_KATEGORILERI.DERSLIKLER, ALAN_KATEGORILERI.YONETIM_OFIS]
  },
  {
    id: "2",
    ad: "2. Kat (Yönetim)",
    image: "/kat2.jpg",
    alanlar: [
      "Rektörlük",
      "Genel Sekreterlik",
      "Personel Müdürlüğü",
      "Bilgi İşlem Müdürlüğü",
      "Teras Kafe",
    ],
    kategori: [ALAN_KATEGORILERI.YONETIM_OFIS, ALAN_KATEGORILERI.SOSYAL_KAFE]
  },
  {
    id: "3",
    ad: "3. Kat (Derslik & Ofis)",
    image: "/kat3.jpg",
    alanlar: ["Derslikler", "Spor Koordinatörlüğü", "Ofisler"],
    kategori: [ALAN_KATEGORILERI.DERSLIKLER, ALAN_KATEGORILERI.SPOR_SAGLIK, ALAN_KATEGORILERI.YONETIM_OFIS]
  },
];

// Kategori İkonları
const getCategoryIcon = (category) => {
    switch (category) {
        case ALAN_KATEGORILERI.LAB_ATOLYE: return <BeakerIcon className="w-5 h-5" />;
        case ALAN_KATEGORILERI.SOSYAL_KAFE: return <UsersIcon className="w-5 h-5" />;
        case ALAN_KATEGORILERI.SPOR_SAGLIK: return <HeartIcon className="w-5 h-5" />;
        case ALAN_KATEGORILERI.YONETIM_OFIS: return <BriefcaseIcon className="w-5 h-5" />;
        case ALAN_KATEGORILERI.DERSLIKLER: return <BuildingOffice2Icon className="w-5 h-5" />;
        case ALAN_KATEGORILERI.OTOPARK: return <MapPinIcon className="w-5 h-5" />;
        default: return <SparklesIcon className="w-5 h-5" />;
    }
};

// **********************************************
// KAT PLANLARI SAYFASI
// **********************************************
export default function KatPlanlari() {
  const navigate = useNavigate();
  const [aktifKat, setAktifKat] = useState(KATLAR_TUM[4]); 
  const [anim, setAnim] = useState(false);
  const [popupAlan, setPopupAlan] = useState(null);
  const [aktifFiltre, setAktifFiltre] = useState(null); 


  // Akıllı Filtreleme Mantığı (Aynı kalır)
  const filtrelenmisKatlar = useMemo(() => {
    if (!aktifFiltre) {
        return KATLAR_TUM;
    }
    return KATLAR_TUM.filter(kat => kat.kategori.includes(aktifFiltre));
  }, [aktifFiltre]);


  const katDegistir = (kat) => {
    if (aktifKat.id === kat.id) return;
    setAnim(false);
    setTimeout(() => {
      setAktifKat(kat);
      setAnim(true);
    }, 200);
  };
  
  useEffect(() => {
    setAnim(true);
    if (aktifFiltre && !filtrelenmisKatlar.find(k => k.id === aktifKat.id)) {
        setAktifKat(filtrelenmisKatlar[0] || KATLAR_TUM[4]); 
    }
  }, [aktifFiltre]);

  const filtreSecenekleri = useMemo(() => ['Tümü', ...Object.values(ALAN_KATEGORILERI)], []);


  const handleFiltreSec = (filtre) => {
      setAktifFiltre(filtre === 'Tümü' ? null : filtre);
  };


  return (
    // Fütüristik Beyaz Tema
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 md:p-10">
        
        {/* ANA BAŞLIK VE GERİ DÖN */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-red-200">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Geri Dön</span>
            </button>
            <h1 className="text-4xl font-extrabold text-gray-800 flex items-center tracking-tight">
                <MapPinIcon className="w-9 h-9 mr-2 text-red-600" /> Vizia Akıllı Kat Planları
            </h1>
            <div className="w-20"></div> 
        </header>

        {/* ⭐ AKILLI FİLTRELEME BÖLÜMÜ */}
        <div className="max-w-7xl mx-auto mb-8 bg-white p-6 rounded-xl shadow-lg border border-red-100">
            <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                <QueueListIcon className="w-5 h-5 mr-2 text-red-500" /> Hangi Alanlar Seni İlgilendiriyor? (Akıllı Navigasyon)
            </h3>
            <div className="flex flex-wrap gap-2">
                {filtreSecenekleri.map(filtre => (
                    <button
                        key={filtre}
                        onClick={() => handleFiltreSec(filtre)}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition duration-200 shadow-md
                            ${
                                (aktifFiltre === null && filtre === 'Tümü') || (aktifFiltre === filtre)
                                ? 'bg-red-600 text-white shadow-red-400/50'
                                : 'bg-gray-100 text-gray-700 hover:bg-red-50 border border-gray-300'
                            }`}
                    >
                        {getCategoryIcon(filtre)} {filtre}
                    </button>
                ))}
            </div>
        </div>


        {/* ⭐ İÇERİK KAPSAYICISI: Harita Paneli Görünümü (Açık Tema) */}
        <div className="max-w-7xl mx-auto w-full flex bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200" style={{ minHeight: '80vh' }}>
          
            {/* SOL PANEL (Kat Listesi) */}
            <aside className="w-80 bg-white text-gray-900 p-6 flex flex-col shadow-inner flex-shrink-0 border-r border-gray-200">
                <h2 className="text-xl font-extrabold mb-4 flex items-center text-red-600">
                    <BuildingOffice2Icon className="w-5 h-5 mr-2" /> 
                    {aktifFiltre ? 'İlgili Katlar' : 'Tüm Katlar'} ({filtrelenmisKatlar.length})
                </h2>
                
                {/* AKTİF KAT BİLGİSİ */}
                <div className="bg-red-50 p-4 rounded-xl mb-6 shadow-lg border border-red-400/50">
                    <div className="flex items-center text-lg font-semibold text-gray-700">
                        <MapPinIcon className="w-5 h-5 mr-3 text-red-600" />
                        Aktif Kat:
                    </div>
                    <p className="text-3xl font-black mt-1 text-red-800">{aktifKat.ad}</p>
                </div>

                {/* KAT LİSTESİ */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                    {filtrelenmisKatlar.map((kat) => (
                      <button
                        key={kat.id}
                        onClick={() => katDegistir(kat)}
                        className={`flex justify-between items-center w-full text-left px-4 py-3 rounded-lg transition-all border border-gray-300
                          ${
                            aktifKat.id === kat.id
                              ? "bg-red-600 text-white font-bold shadow-red-500/50 shadow-md scale-[1.02]"
                              : "hover:bg-red-50 text-gray-700"
                          }`}
                      >
                        <span>{kat.ad}</span>
                        <span className={`text-xs font-semibold ${aktifKat.id === kat.id ? 'text-white' : 'text-red-600'}`}>
                            {kat.id === aktifKat.id ? 'ŞU AN' : 'GİT'} →
                        </span>
                      </button>
                    ))}
                </div>
            </aside>

            {/* ANA İÇERİK (Harita ve Alanlar) */}
            <main className="flex-1 p-8 relative overflow-y-auto bg-gray-50">

                {/* 1. PLAN GÖRSELİ - 🔥 3D GÖRÜNÜM EKLENDİ */}
                <div
                  className={`bg-white rounded-2xl shadow-xl overflow-hidden mb-8 transition-opacity duration-500 transform border-4 border-gray-300
                  ${anim ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                  style={{ height: '550px' }} 
                >
                  <div 
                    className="w-full h-full relative perspective-[1500px]" // 3D perspektif eklendi
                  >
                     <img
                        src={aktifKat.image}
                        alt={aktifKat.ad}
                        // 🔥 3D Transformasyonu
                        className="w-full h-full object-contain rounded-xl transition duration-500 transform rotate-x-6 rotate-z-1 skew-x-1 origin-top-left shadow-2xl shadow-black/50" 
                     />
                     {/* Harita Efekti */}
                     <div className="absolute inset-0 bg-black/30 flex items-center justify-center transform rotate-x-6 rotate-z-1 skew-x-1 origin-top-left">
                         <MapPinIcon className="w-12 h-12 text-red-400 animate-pulse" />
                         <span className="ml-4 text-2xl font-bold text-white/90 drop-shadow-lg">{aktifKat.ad}</span>
                     </div>
                  </div>
                </div>

                {/* 2. ALANLAR KARTLARI */}
                <h2 className="text-2xl font-bold text-gray-800 mb-5 border-b border-gray-300 pb-2">Bu Kattaki Alanlar ({aktifKat.alanlar.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aktifKat.alanlar.map((alan, i) => (
                    <div
                      key={i}
                      onClick={() => setPopupAlan(alan)}
                      className="cursor-pointer flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-gray-200 
                                 hover:shadow-lg hover:border-red-600 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                          <BuildingOffice2Icon className="w-6 h-6 text-red-600 flex-shrink-0" />
                          <span className="font-medium text-gray-800">{alan}</span>
                      </div>
                      <PlusIcon className="w-5 h-5 text-gray-500 hover:text-red-500 transition" />
                    </div>
                  ))}
                </div>

                {/* POPUP */}
                {popupAlan && (
                  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white text-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in border border-red-600">
                      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                        <h3 className="text-xl font-bold text-red-600">{popupAlan}</h3>
                        <button onClick={() => setPopupAlan(null)}>
                          <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-red-600" />
                        </button>
                      </div>
                      <p className="text-gray-700">
                        {popupAlan} hakkında detaylı bilgiler ve o alana ait özel notlar burada gösterilebilir.
                      </p>
                    </div>
                  </div>
                )}
            </main>
        </div>
    </div>
  );
}