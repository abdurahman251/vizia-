import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { UserGroupIcon, CheckCircleIcon, XCircleIcon, AcademicCapIcon, BoltIcon, HeartIcon, PaintBrushIcon } from '@heroicons/react/24/outline';

const API_URL = "http://localhost:5050"; 

// UTILITY: Kategori İkonları
const getCategoryIcon = (category) => {
    switch (category) {
        case 'Spor': return <BoltIcon className="w-5 h-5 text-red-600" />;
        case 'Sanat & Kültür': return <PaintBrushIcon className="w-5 h-5 text-purple-600" />;
        case 'Akademi & Kariyer': return <AcademicCapIcon className="w-5 h-5 text-blue-600" />;
        case 'Sosyal Sorumluluk': return <HeartIcon className="w-5 h-5 text-green-600" />;
        default: return <UserGroupIcon className="w-5 h-5 text-gray-500" />;
    }
};


export default function OgrenciUyeliklerim() {
    const navigate = useNavigate();
    const [uyelikler, setUyelikler] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [hata, setHata] = useState("");
    
    // LocalStorage'dan öğrenci verisini al
    const ogrenciData = JSON.parse(localStorage.getItem("ogrenci"));
    
    // 🔥 KRİTİK ID ÇEKME DÜZELTMESİ: Math.floor ile ondalıklı kısmı atıyoruz
    const ogrenciId = ogrenciData?.id ? Math.floor(parseFloat(ogrenciData.id)) : null; 

    const fetchUyelikler = async () => {
        // ID'nin geçerli bir sayı olduğunu kontrol et
        if (!ogrenciId || isNaN(ogrenciId) || ogrenciId <= 0) {
            setHata("Öğrenci ID bulunamadı veya geçersiz. Lütfen öğrenci panelinden giriş yapın.");
            setYukleniyor(false);
            return;
        }

        setYukleniyor(true);
        setHata("");
        
        // HATA AYIKLAMA: Gönderilen URL'yi konsola yazdır
        const fetchURL = `${API_URL}/api/kulupler/uyelik/ogrenci/${ogrenciId}`;
        console.log("Gönderilen API URL (Düzeltildi):", fetchURL); 

        try {
            // Backend rotasını kullanıyoruz
            const response = await fetch(fetchURL); 
            const data = await response.json();

            if (response.ok) {
                setUyelikler(data); 
            } else {
                setHata(data.hata || `Üyelikler alınamadı. Hata Kodu: ${response.status}`);
            }
        } catch (error) {
            setHata("Sunucuya bağlantı hatası. Backend terminalini kontrol edin.");
        } finally {
            setYukleniyor(false);
        }
    };

    useEffect(() => {
        fetchUyelikler();
    }, []); 

    const onayliUyeSayisi = uyelikler.filter(u => u.onay_durumu === 'Onaylandı').length;
    
    // Yükleniyor durumu
    if (yukleniyor) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Üyelikler yükleniyor...</div>;
    
    // Giriş yapılmadıysa
    if (!ogrenciId || isNaN(ogrenciId) || ogrenciId <= 0) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600 font-semibold">Giriş Yapılmadı. Lütfen Öğrenci Paneli üzerinden giriş yapın.</div>;

    // Hata varsa (API'dan dönen hata)
    if (hata) return <div className="p-10 text-center text-red-600 font-semibold">{hata}</div>;


    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            
            <header className="w-full max-w-5xl flex justify-between items-center mb-8 pb-4 border-b border-red-200">
                <button 
                    onClick={() => navigate('/ogrenci/panel')} 
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Panele Dön</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <UserGroupIcon className="w-7 h-7 mr-2 text-red-600" /> Üye Olduğum Kulüpler ({uyelikler.length})
                </h1>
                <div className="w-20"></div>
            </header>
            
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6">
                
                {/* Onaylı Üye Sayısı Bilgisi */}
                <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 mb-6 flex justify-between items-center rounded-lg">
                    <span className="font-semibold flex items-center">
                        <CheckCircleIcon className="w-6 h-6 mr-2" />
                        Aktif Olarak Üye Olduğunuz Kulüp Sayısı: <span className="ml-2 font-bold text-lg">{onayliUyeSayisi}</span>
                    </span>
                    <button
                        onClick={() => navigate('/kulupler')}
                        className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                    >
                        Yeni Kulüp Keşfet
                    </button>
                </div>

                {/* Üyelik Listesi */}
                <div className="space-y-4">
                    {uyelikler.length > 0 ? (
                        uyelikler.map((u) => (
                            <div 
                                key={u.id} 
                                className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex justify-between items-center p-4"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`flex items-center justify-center p-3 rounded-full ${u.onay_durumu === 'Onaylandı' ? 'bg-red-100' : 'bg-gray-100'}`}>
                                        {getCategoryIcon(u.kategori)} 
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-800">{u.kulup_ad}</h3>
                                        <p className="text-sm text-gray-500 flex items-center">
                                            Başvuru Tarihi: {new Date(u.basvuru_tarihi).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Durum Rozeti */}
                                {u.onay_durumu === 'Onaylandı' ? (
                                    <span className="flex items-center text-sm font-semibold text-green-700 bg-green-200 px-3 py-1 rounded-full">
                                        <CheckCircleIcon className="w-4 h-4 mr-1" /> Onaylandı
                                    </span>
                                ) : u.onay_durumu === 'Beklemede' ? (
                                    <span className="flex items-center text-sm font-semibold text-yellow-700 bg-yellow-200 px-3 py-1 rounded-full">
                                        Beklemede
                                    </span>
                                ) : (
                                     <span className="flex items-center text-sm font-semibold text-red-700 bg-red-200 px-3 py-1 rounded-full">
                                        <XCircleIcon className="w-4 h-4 mr-1" /> Reddedildi
                                    </span>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center text-gray-500">
                            Henüz hiçbir kulübe başvurmadınız veya üye değilsiniz.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}