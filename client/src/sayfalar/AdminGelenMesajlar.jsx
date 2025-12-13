import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { EnvelopeOpenIcon, CheckCircleIcon, PaperAirplaneIcon, UsersIcon } from '@heroicons/react/24/outline';

const API_URL = "http://localhost:5050"; 

// **********************************************
// CEVAPLAMA MODALI
// **********************************************
const CevapModal = ({ mesaj, isOpen, onClose, fetchMesajlar }) => {
    const [cevapMetni, setCevapMetni] = useState('');
    const [yukleniyor, setYukleniyor] = useState(false);
    const [hata, setHata] = useState('');
    
    // Admin header bilgileri (Başkan/SuperAdmin yetkisi için)
    const adminData = JSON.parse(localStorage.getItem("admin"));
    const clubId = adminData?.clubId;
    const role = adminData?.role;

    const handleCevapGonder = async (e) => {
        e.preventDefault();
        if (!cevapMetni.trim()) {
            setHata("Cevap metni boş bırakılamaz.");
            return;
        }
        setYukleniyor(true);
        setHata('');

        try {
            const response = await fetch(`${API_URL}/api/kulupler/mesaj/cevapla`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    // Yetkilendirme için header'ları gönderiyoruz
                    'clubId': clubId,
                    'role': role
                },
                body: JSON.stringify({
                    mesaj_id: mesaj.id,
                    cevap_metni: cevapMetni
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`✅ Mesaj başarıyla cevaplandı ve öğrenciye iletildi!`);
                onClose();
                fetchMesajlar(); // Listeyi yenile
            } else {
                setHata(data.hata || "Cevap gönderilemedi.");
            }
        } catch (error) {
            setHata("Sunucu bağlantı hatası.");
        } finally {
            setYukleniyor(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setCevapMetni('');
            setHata('');
        }
    }, [isOpen]);

    if (!isOpen || !mesaj) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-red-700 flex items-center">
                        <PaperAirplaneIcon className="w-5 h-5 mr-2" /> Mesaja Cevapla
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-lg">&times;</button>
                </div>

                <div className="mb-4 p-3 bg-gray-100 rounded-lg border-l-4 border-gray-400">
                    <p className="font-semibold text-sm text-gray-700">Gönderen: {mesaj.ogrenci_adsoyad} ({mesaj.ogrenci_email})</p>
                    <p className="text-gray-600 italic mt-1">Soru: "{mesaj.mesaj_metni}"</p>
                </div>

                <form onSubmit={handleCevapGonder}>
                    <textarea
                        value={cevapMetni}
                        onChange={(e) => setCevapMetni(e.target.value)}
                        placeholder="Cevabınızı buraya yazın..."
                        rows="5"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 transition mb-3"
                        required
                    />
                    {hata && <p className="text-sm text-red-600 mb-3">{hata}</p>}
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                        disabled={yukleniyor}
                    >
                        {yukleniyor ? 'Gönderiliyor...' : 'Cevabı Gönder'}
                    </button>
                </form>
            </div>
        </div>
    );
};


// **********************************************
// ADMIN GELEN MESAJLAR SAYFASI
// **********************************************
export default function AdminGelenMesajlar() {
    const navigate = useNavigate();
    const [mesajlar, setMesajlar] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [hata, setHata] = useState('');
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [secilenMesaj, setSecilenMesaj] = useState(null);

    // Admin header bilgileri (Başkan/SuperAdmin yetkisi için)
    const adminData = JSON.parse(localStorage.getItem("admin"));
    const clubId = adminData?.clubId;
    const role = adminData?.role;

    const fetchMesajlar = async () => {
        if (!role) {
            setHata("Yetki bilgisi eksik. Lütfen tekrar giriş yapın.");
            setYukleniyor(false);
            return;
        }
        setYukleniyor(true);
        setHata('');

        try {
            // Backend rotası, header'daki clubId'ye göre filtreleme yapacaktır.
            const response = await fetch(`${API_URL}/api/kulupler/mesaj/gelenler`, {
                headers: {
                    'clubId': clubId,
                    'role': role
                }
            });
            const data = await response.json();

            if (response.ok) {
                // Sadece cevaplanmamış mesajlar listelenir
                setMesajlar(data); 
            } else {
                setHata(data.hata || "Mesajlar alınamadı.");
            }
        } catch (error) {
            setHata("Sunucu bağlantı hatası.");
        } finally {
            setYukleniyor(false);
        }
    };

    useEffect(() => {
        fetchMesajlar();
    }, []); 

    const handleOpenModal = (mesaj) => {
        setSecilenMesaj(mesaj);
        setIsModalOpen(true);
    };
    
    // Yalnızca Başkanların erişimini sağlamak için (Ek güvenlik)
    if (role !== 'ClubPresident') {
        return <div className="p-10 text-center text-red-600">Bu sayfaya erişim yetkiniz yoktur.</div>;
    }


    if (yukleniyor && mesajlar.length === 0) return <div className="p-10 text-center">Mesajlar yükleniyor...</div>;
    if (hata) return <div className="p-10 text-center text-red-600 font-semibold">{hata}</div>;


    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            
            {/* Cevaplama Modalı */}
            <CevapModal 
                mesaj={secilenMesaj}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fetchMesajlar={fetchMesajlar}
            />

            <header className="w-full max-w-6xl flex justify-between items-center mb-8 pb-4 border-b border-red-200">
                <button 
                    onClick={() => navigate('/admin/panel')} 
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Admin Panele Dön</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <EnvelopeOpenIcon className="w-7 h-7 mr-2 text-red-600" /> Gelen Öğrenci Mesajları ({mesajlar.length})
                </h1>
                <div className="w-20"></div>
            </header>
            
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-6">
                
                {mesajlar.length > 0 ? (
                    <div className="space-y-4">
                        {mesajlar.map((mesaj) => (
                            <div key={mesaj.id} className="border border-gray-200 p-4 rounded-lg shadow-md bg-white">
                                <div className="flex justify-between items-center border-b pb-2 mb-2">
                                    <span className="font-semibold text-lg text-gray-900 flex items-center">
                                        <UsersIcon className="w-5 h-5 mr-1 text-blue-500" />
                                        {mesaj.ogrenci_adsoyad} 
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(mesaj.olusturma_tarihi).toLocaleString()}
                                    </span>
                                </div>
                                
                                <p className="text-gray-700 italic">"{mesaj.mesaj_metni}"</p>
                                
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => handleOpenModal(mesaj)}
                                        className="flex items-center gap-1 bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                    >
                                        <PaperAirplaneIcon className="w-4 h-4" /> Cevapla
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-10 text-center text-gray-500 text-xl">
                        Cevaplanmayı bekleyen yeni bir mesaj bulunmamaktadır.
                    </div>
                )}
            </div>
        </div>
    );
}