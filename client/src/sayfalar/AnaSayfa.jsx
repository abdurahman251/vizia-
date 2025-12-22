import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    UserIcon, ArrowRightIcon, Bars3Icon, 
    ChevronDownIcon, MapIcon, ClockIcon, 
    ShoppingBagIcon, CalendarDaysIcon, CalculatorIcon 
} from "@heroicons/react/24/outline"; 

export default function AnaSayfa() {
    const navigate = useNavigate();
    const [isServicesOpen, setIsServicesOpen] = useState(false);

    const services = [
        { name: "Kat Planları", path: "/ogrenci/kat-planlari", icon: MapIcon },
        { name: "Ring Saatleri", path: "/ogrenci/ring-saatleri", icon: ClockIcon },
        { name: "Kampüs Mağazası", path: "/ogrenci/magaza", icon: ShoppingBagIcon },
        { name: "Akademik Takvim", path: "/akademik/takvim", icon: CalendarDaysIcon },
        { name: "Ücret Hesaplama", path: "/ucret/hesaplama", icon: CalculatorIcon },
    ];

    return (
        <div className="relative h-screen w-full bg-[#e5eef5] text-black flex flex-col md:flex-row overflow-hidden font-sans select-none">
            
            {/* ❄️ SOL PANEL: ARCTIC FROSTED CORE */}
            <div className="w-full md:w-[63%] h-full relative flex flex-col justify-between p-12 md:p-16 border-r border-white/40 overflow-hidden">
                
                {/* 🏗️ ARKA PLAN: BUZUL KATMANLARI */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-blue-400/20 rounded-full blur-[130px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-200/20 rounded-full blur-[100px] animate-float"></div>
                </div>

                {/* 🌫️ ULTRA-ICE GLASS & SNOW */}
                <div className="absolute inset-0 z-10 backdrop-blur-[130px] bg-white/40 shadow-inner overflow-hidden border-r border-white/50">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/frozen-wall.png')]"></div>
                    {[...Array(25)].map((_, i) => (
                        <div key={i} className="absolute text-white/70 animate-snow pointer-events-none"
                             style={{
                                 left: `${Math.random() * 100}%`,
                                 animationDuration: `${Math.random() * 8 + 5}s`,
                                 animationDelay: `${Math.random() * 5}s`,
                                 fontSize: `${Math.random() * 10 + 10}px`
                             }}>❄</div>
                    ))}
                </div>

                {/* 1. ÜST: AĞAÇ + VIZIA KAMPÜS LOGO */}
                <div className="relative z-20 flex items-center gap-4 group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl animate-bounce drop-shadow-md" style={{ animationDuration: '2.5s' }}>🎄</div>
                        <div className="w-12 h-12 bg-black flex items-center justify-center rounded-2xl shadow-2xl transition-all duration-700 group-hover:bg-red-600">
                            <span className="text-white text-2xl font-black italic">V</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-black tracking-tighter uppercase italic text-black leading-none">VIZIA</h1>
                        <span className="text-[10px] font-bold tracking-[0.4em] text-red-600 uppercase">KAMPÜS</span>
                    </div>
                </div>

                {/* 2. ORTA: ESTETİK DOĞUŞ PORTAL TİPOGRAFİSİ */}
                <div className="relative z-20">
                    <div className="flex flex-col space-y-1">
                        <span className="text-[10px] font-black tracking-[0.8em] text-red-600 uppercase mb-2">Kurumsal Dijital Platform</span>
                        <h2 className="text-[6.5vw] font-[100] tracking-[-0.08em] text-black leading-tight uppercase italic opacity-90">
                            DOĞUŞ <br />
                            <span className="font-[1000] text-black not-italic tracking-[-0.1em]">PORTAL</span>
                        </h2>
                    </div>
                    <div className="mt-8 flex items-center gap-6">
                        <div className="h-[2px] w-20 bg-red-600"></div>
                        <p className="max-w-md text-[11px] font-black text-gray-500 uppercase tracking-[0.35em] leading-relaxed italic">
                            Geleceğin dünyasını bugünün <br /> 
                            vizyonuyla inşa ediyoruz.
                        </p>
                    </div>
                </div>

                {/* 3. ALT: KOORDİNATLAR & DOĞUŞ'UN KALBİ */}
                <div className="relative z-20 flex items-end justify-between">
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            {/* YENİLENEN YAZI */}
                            <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1 italic animate-pulse">
                                DOĞUŞ'UN KALBİ BURADA ATIYOR
                            </p>
                            <div className="flex items-center gap-8">
                                <p className="text-base font-black text-black tracking-tighter flex items-center gap-2">
                                    41.0115° N <span className="text-red-600 mx-1">•</span> 29.1558° E
                                </p>
                                <div className="relative w-32 h-8 bg-blue-600/5 rounded-lg overflow-hidden border border-blue-200/20 backdrop-blur-md">
                                    <svg viewBox="0 0 100 30" className="w-full h-full stroke-red-600 stroke-[1.5] fill-none">
                                        <path d="M0 15 L30 15 L35 5 L40 25 L45 15 L100 15" className="animate-ekg" />
                                    </svg>
                                </div>
                                <span className="text-[9px] font-black text-red-600 uppercase tracking-widest animate-pulse">Live</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Winter Edition v.6</span>
                        <span className="text-2xl animate-pulse opacity-60">🎅</span>
                    </div>
                </div>
            </div>

            {/* 🛠️ SAĞ PANEL: HOŞ GELDİNİZ */}
            <div className="w-full md:w-[37%] h-full flex items-center justify-center p-12 bg-white relative shadow-[-50px_0_100px_rgba(0,0,0,0.05)] z-30">
                <div className="w-full max-w-[380px] flex flex-col gap-6">
                    
                    <div className="mb-6 text-right">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em] mb-3 block italic">Dogus University Ecosystem</span>
                        <h3 className="text-5xl font-[1000] text-black tracking-tighter uppercase italic leading-none">
                            HOŞ <br />
                            <span className="text-red-600">GELDİNİZ .</span>
                        </h3>
                    </div>

                    <button 
                        onClick={() => navigate("/ogrenci/giris")}
                        className="group relative w-full h-24 bg-red-600 rounded-[35px] p-6 flex items-center justify-between shadow-[0_30px_60px_-15px_rgba(220,38,38,0.5)] hover:bg-black transition-all duration-500 overflow-hidden"
                    >
                        <div className="flex items-center gap-5 text-white relative z-10">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                                <UserIcon className="w-8 h-8" />
                            </div>
                            <span className="text-2xl font-black italic uppercase tracking-tighter">Sisteme Giriş</span>
                        </div>
                        <div className="text-4xl absolute right-12 translate-y-24 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out">🦌</div>
                        <ArrowRightIcon className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => navigate("/ogrenci/kayit")} className="h-20 bg-white border-2 border-black rounded-[30px] flex flex-col items-center justify-center gap-1 hover:border-red-600 hover:text-red-600 transition-all group shadow-sm">
                            <span className="text-[10px] font-black tracking-widest uppercase text-black group-hover:text-red-600">HESAP OLUŞTUR</span>
                            <span className="text-2xl group-hover:rotate-[360deg] transition-transform duration-1000">❄️</span>
                        </button>
                        <button onClick={() => navigate("/admin/giris")} className="h-20 bg-black rounded-[30px] flex flex-col items-center justify-center gap-1 text-white hover:bg-red-600 transition-all shadow-xl group">
                            <span className="text-[10px] font-black tracking-widest uppercase opacity-40">ADMIN</span>
                            <span className="text-xl group-hover:scale-125 transition-transform">👑</span>
                        </button>
                    </div>

                    <div className="relative mt-2">
                        <button 
                            onClick={() => setIsServicesOpen(!isServicesOpen)}
                            className={`w-full h-16 rounded-[28px] px-8 flex items-center justify-between transition-all duration-500 border-2 ${isServicesOpen ? 'bg-black text-white border-black shadow-xl' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-white hover:border-red-600 group'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`transition-transform duration-500 ${isServicesOpen ? 'rotate-180' : 'rotate-0'}`}>
                                    {isServicesOpen ? <ChevronDownIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                                </div>
                                <span className="font-black text-xs tracking-widest uppercase">Servisler</span>
                            </div>
                            <div className="text-3xl transition-transform duration-300">{isServicesOpen ? "🎉" : "🎁"}</div>
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isServicesOpen ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                            <div className="grid grid-cols-1 gap-1.5 p-2 bg-white rounded-[32px] border border-gray-100 shadow-inner">
                                {services.map((s) => (
                                    <button key={s.name} onClick={() => navigate(s.path)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-50 rounded-[22px] transition-all group/item">
                                        <div className="flex items-center gap-4">
                                            <s.icon className="w-5 h-5 text-red-600 opacity-40 group-hover/item:opacity-100" />
                                            <span className="text-[11px] font-black uppercase text-gray-700">{s.name}</span>
                                        </div>
                                        <ArrowRightIcon className="w-4 h-4 text-gray-200 group-hover/item:text-red-600 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes snow {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
                @keyframes ekg {
                    0% { stroke-dasharray: 0, 100; stroke-dashoffset: 0; }
                    50% { stroke-dasharray: 100, 0; }
                    100% { stroke-dasharray: 0, 100; stroke-dashoffset: -100; }
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(-20px, -20px); }
                }
                .animate-snow { animation: snow linear infinite; }
                .animate-ekg { 
                    stroke-dasharray: 1000;
                    animation: ekg 2s linear infinite; 
                }
                .animate-float { animation: float 12s infinite ease-in-out; }
            `}</style>
        </div>
    );
}