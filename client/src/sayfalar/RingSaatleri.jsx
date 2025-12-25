import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  MapPinIcon, 
  ChevronDownIcon,
  TruckIcon,
  CalendarDaysIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

export default function RingSaatleri() {
  const navigate = useNavigate();

  // --- LOGIC (ORİJİNAL MANTIK KORUNDU) ---
  const [ringler, setRingler] = useState({});
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState("");
  const [saat, setSaat] = useState(new Date());
  const [seciliYon, setSeciliYon] = useState(null);
  const [siradaki, setSiradaki] = useState(null);
  const [kalan, setKalan] = useState("");
  const [tabloGoster, setTabloGoster] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSaat(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    async function yukle() {
      try {
        setYukleniyor(true);
        const res = await fetch("https://vizia-server.onrender.com/api/ringler");
        if (!res.ok) throw new Error("Veri çekilemedi");
        const data = await res.json();
        const gruplanmis = data.reduce((acc, item) => {
          if (!acc[item.yon]) acc[item.yon] = [];
          acc[item.yon].push(item.saat);
          return acc;
        }, {});
        Object.keys(gruplanmis).forEach((yon) => {
          gruplanmis[yon].sort((a, b) => {
            const [ha, ma] = a.split(":").map(Number);
            const [hb, mb] = b.split(":").map(Number);
            return ha * 60 + ma - (hb * 60 + mb);
          });
        });
        setRingler(gruplanmis);
        const ilkYon = Object.keys(gruplanmis)[0] || null;
        setSeciliYon((prev) => prev ?? ilkYon);
      } catch (err) { setHata(err.message); } 
      finally { setYukleniyor(false); }
    }
    yukle();
  }, []);

  useEffect(() => {
    if (!seciliYon || !ringler[seciliYon]) {
      setSiradaki(null);
      setKalan("");
      return;
    }
    const liste = ringler[seciliYon];
    const simdiDakika = saat.getHours() * 60 + saat.getMinutes();
    const sonraki = liste.find((t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m > simdiDakika;
    });
    if (!sonraki) { setSiradaki(null); setKalan(""); return; }
    const [h, m] = sonraki.split(":").map(Number);
    const hedef = new Date(saat);
    hedef.setHours(h, m, 0, 0);
    const diffMs = Math.max(0, hedef.getTime() - saat.getTime());
    
    const sa = Math.floor(diffMs / 3600000);
    const dk = Math.floor((diffMs % 3600000) / 60000);
    const sn = Math.floor((diffMs % 60000) / 1000);

    setSiradaki(sonraki);
    setKalan(`${sa > 0 ? sa + ' sa ' : ''}${dk} dk ${sn} sn`);
  }, [seciliYon, ringler, saat]);

  const yonler = useMemo(() => Object.keys(ringler), [ringler]);

  // ⭐ ÖĞRENCİ PANELİNDEKİ WIDGET RENKLERİ (BİREBİR)
  const widgetGradients = [
    "from-red-600 to-pink-500",      // Aktif Üyelikler Kırmızısı
    "from-teal-500 to-green-600",    // Mesajlar Yeşili
    "from-indigo-500 to-purple-600", // Etkinlikler Moru
    "from-yellow-500 to-orange-600", // Profil Sarısı/Turuncusu
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#e5eef5] text-black overflow-x-hidden font-sans selection:bg-red-500">
      
      {/* 🏗️ ARKA PLAN: ANA SAYFA BUZUL KATMANLARI */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-400/20 rounded-full blur-[130px] animate-pulse"></div>
        <div className="absolute inset-0 backdrop-blur-[120px] bg-white/40"></div>
      </div>

      {/* --- ÜST NAV --- */}
      <nav className="relative z-50 p-6 flex justify-between items-center border-b border-white/50 backdrop-blur-md">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/ogrenci/panel")} 
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/50 border border-white shadow-sm hover:bg-white transition-all"
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </motion.button>
        
        <h1 className="text-xl font-[1000] tracking-tighter italic uppercase text-black">
          DOĞUŞ <span className="text-red-600">RING</span>
        </h1>

        <div className="bg-black px-4 py-2 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
           <span className="text-[12px] font-black text-white italic tracking-widest">
             {saat.toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
           </span>
        </div>
      </nav>

      <main className="relative z-20 p-6 max-w-5xl mx-auto pt-10">
        
        {/* --- 🚌 ÖĞRENCİ PANELİ WIDGET STİLİNDE YÖN KARTLARI --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {yonler.map((yon, index) => (
            <motion.button
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={yon}
              onClick={() => setSeciliYon(yon)}
              className={`relative p-6 rounded-2xl shadow-xl transition-all duration-300 text-left border border-white/20 flex flex-col justify-between h-32 ${
                seciliYon === yon ? 'ring-4 ring-black/10' : 'opacity-80 hover:opacity-100'
              } bg-gradient-to-br ${widgetGradients[index % widgetGradients.length]}`}
            >
              <div className="flex justify-between items-center w-full">
                <TruckIcon className="w-10 h-10 text-white/70" />
                <span className="text-3xl font-black text-white/40 italic">0{index + 1}</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Rota</span>
                <h3 className="text-sm font-bold text-white uppercase truncate tracking-tight">{yon}</h3>
              </div>
              {seciliYon === yon && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-ping" />
              )}
            </motion.button>
          ))}
        </div>

        {/* --- 🕓 MERKEZİ WIDGET (ARCTIC GLASS) --- */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={seciliYon}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white/60 backdrop-blur-[100px] border border-white/50 rounded-[50px] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] text-center mb-10 overflow-hidden"
          >
            <div className="absolute top-10 right-10 text-red-600/10"><SparklesIcon className="w-20 h-20" /></div>

            {siradaki ? (
              <>
                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.6em] italic mb-6 inline-block">Sıradaki Kalkış</span>
                
                <h2 className="text-[110px] font-[1000] leading-none tracking-[-0.08em] text-black italic drop-shadow-sm mb-10">
                  {siradaki}
                </h2>
                
                <div className="inline-flex flex-col items-center">
                   <div className="bg-black px-12 py-5 rounded-[30px] shadow-2xl relative group overflow-hidden transition-all hover:bg-red-600">
                      <span className="text-3xl font-black text-white italic tracking-tighter uppercase relative z-10 leading-none">{kalan}</span>
                      <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                   </div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-8 italic">Kampüs Koordinatlarına Kalan Süre</p>
                </div>
              </>
            ) : (
              <div className="py-24 text-gray-300 font-black italic uppercase text-2xl tracking-tighter">Seferler Sona Erdi</div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* --- 📅 TAKVİM --- */}
        <div className="max-w-md mx-auto">
           <button 
             onClick={() => setTabloGoster(!tabloGoster)}
             className={`w-full h-18 rounded-[28px] px-8 py-5 flex items-center justify-between transition-all duration-500 border-2 ${tabloGoster ? 'bg-black text-white border-black shadow-xl' : 'bg-white/80 border-white/50 text-gray-500 hover:border-red-600 hover:text-red-600'}`}
           >
              <div className="flex items-center gap-4">
                 <CalendarDaysIcon className={`w-6 h-6 ${tabloGoster ? 'text-red-600' : 'text-gray-400'}`} />
                 <span className="font-black text-[11px] tracking-widest uppercase italic">Günlük Program</span>
              </div>
              <div className={`transition-transform duration-500 ${tabloGoster ? 'rotate-180' : ''}`}>❄️</div>
           </button>

           <AnimatePresence>
             {tabloGoster && (
               <motion.div
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="mt-4 p-6 bg-white rounded-[32px] border border-white/50 shadow-2xl"
               >
                 {Object.keys(ringler).map((yon) => (
                   <div key={yon} className="mb-6 last:mb-0">
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 italic">{yon}</p>
                      <div className="flex flex-wrap gap-2">
                         {ringler[yon].map(s => (
                           <span key={s} className={`px-4 py-2 rounded-xl text-[11px] font-black italic ${s === siradaki ? 'bg-red-600 text-white shadow-lg scale-105' : 'bg-gray-50 text-gray-400'}`}>
                             {s}
                           </span>
                         ))}
                      </div>
                   </div>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>
        </div>

      </main>

      <footer className="text-center pb-12 mt-12 opacity-30">
          <p className="text-[9px] font-black tracking-[0.5em] text-black uppercase italic">Dogus Ecosystem | Vizia Transit v.2026</p>
      </footer>
    </div>
  );
}