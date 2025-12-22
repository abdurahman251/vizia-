import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ArrowLeftIcon, 
    EnvelopeIcon, 
    LockClosedIcon, 
    ShieldCheckIcon,
    ChevronRightIcon,
    SparklesIcon
} from "@heroicons/react/24/outline";

// API Sabiti
const API_URL = "http://localhost:5050"; 

export default function AdminGiris() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [sifre, setSifre] = useState("");
    const [hata, setHata] = useState("");
    const [yukleniyor, setYukleniyor] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHata("");
        setYukleniyor(true);

        try {
            const response = await fetch(`${API_URL}/api/yoneticiler/giris`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, sifre }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("admin", JSON.stringify(data.yonetici));
                navigate("/admin/panel");
            } else {
                setHata(data.hata || "Yetkilendirme başarısız oldu.");
            }
        } catch (error) {
            console.error("Giriş hatası:", error);
            setHata("Sistem bağlantısı kurulamadı.");
        } finally {
            setYukleniyor(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#fafafa] relative overflow-hidden font-sans">
            
            {/* 🚀 Performans Dostu Arka Plan */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] bg-red-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Portala Dön Butonu */}
            <motion.button
                onClick={() => navigate("/")}
                className="absolute top-10 left-10 z-50 flex items-center gap-2 group bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
                <ArrowLeftIcon className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                <span className="text-[11px] font-black tracking-widest text-gray-500 uppercase">Portala Dön</span>
            </motion.button>

            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-[440px] px-6"
            >
                <div className="bg-white border border-gray-100 rounded-[3.5rem] p-10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.04)] relative">
                    
                    {/* Minimal Yılbaşı Detayı */}
                    <SparklesIcon className="absolute top-10 right-10 w-6 h-6 text-red-200 animate-pulse" />

                    {/* İkon Bölümü: Adminlere Özel Kalkan */}
                    <div className="flex justify-center mb-8">
                        <div className="relative p-6 rounded-[2.2rem] bg-[#fcfcfc] border border-gray-50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01),0_10px_20px_rgba(0,0,0,0.02)]">
                            <ShieldCheckIcon className="w-12 h-12 text-red-600" />
                            <span className="absolute -top-1 -right-1 text-xl drop-shadow-sm">🎄</span>
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h2 className="text-[32px] font-[1000] text-slate-900 tracking-tight leading-tight uppercase">
                            Yönetim
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Admin & Başkan Girişi</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <EnvelopeIcon className="w-5 h-5 text-gray-300 group-focus-within:text-red-600 transition-colors duration-200" />
                            </div>
                            <input
                                type="email"
                                placeholder="Yönetici E-postası"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-14 pr-6 py-[1.25rem] bg-gray-50/50 border border-transparent rounded-[1.5rem] text-[15px] text-slate-800 outline-none focus:bg-white focus:border-red-100 focus:shadow-sm transition-all duration-200 font-bold placeholder:text-gray-300"
                                required
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <LockClosedIcon className="w-5 h-5 text-gray-300 group-focus-within:text-red-600 transition-colors duration-200" />
                            </div>
                            <input
                                type="password"
                                placeholder="Erişim Şifresi"
                                value={sifre}
                                onChange={(e) => setSifre(e.target.value)}
                                className="w-full pl-14 pr-6 py-[1.25rem] bg-gray-50/50 border border-transparent rounded-[1.5rem] text-[15px] text-slate-800 outline-none focus:bg-white focus:border-red-100 focus:shadow-sm transition-all duration-200 font-bold placeholder:text-gray-300"
                                required
                            />
                        </div>

                        <AnimatePresence>
                            {hata && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-red-50 text-red-600 py-3.5 px-6 rounded-2xl text-[11px] font-black uppercase text-center border border-red-100"
                                >
                                    {hata}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            disabled={yukleniyor}
                            className="w-full h-[70px] mt-4 bg-slate-900 rounded-[1.8rem] relative group overflow-hidden shadow-xl shadow-slate-200 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                <span className="text-[14px] font-black text-white uppercase tracking-[0.2em]">
                                    {yukleniyor ? "Doğrulanıyor..." : "Yönetim Paneline Gir"}
                                </span>
                                {!yukleniyor && <ChevronRightIcon className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />}
                            </div>
                        </motion.button>
                    </form>

                    {/* Bilgi Notu (Daha Minimal) */}
                    <div className="mt-12 text-center pt-8 border-t border-gray-50">
                         <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] leading-relaxed">
                            Güvenli erişim için üniversite tarafından <br/> atanan yetkili hesabınızı kullanın.
                         </p>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-10 text-center space-y-1 opacity-40">
                    <p className="text-[9px] font-black tracking-[0.4em] text-slate-800 uppercase italic">Vizia Admin Security • 2026</p>
                </div>
            </motion.div>
        </div>
    );
}