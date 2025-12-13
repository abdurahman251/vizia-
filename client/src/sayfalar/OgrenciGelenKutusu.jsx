import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, EnvelopeOpenIcon, CheckCircleIcon, PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const API_URL = "http://localhost:5050"; 

// 🔥 Yeni Modal Bileşeni (Sayfada kullanılacak)
const SendMessageModal = ({ isOpen, onClose, ogrenciEmail, fetchMessages }) => {
    const [mesajMetni, setMesajMetni] = useState('');
    const [secilenKulupId, setSecilenKulupId] = useState('');
    const [kulupListesi, setKulupListesi] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(false);
    const [modalHata, setModalHata] = useState('');

    useEffect(() => {
        // Modal açıldığında sadece öğrencinin üye olduğu kulüpleri çekelim
        // Ancak bu rotayı henüz yapmadığımız için, şimdilik tüm kulüpleri çekip filtreleyeceğiz.
        const fetchClubs = async () => {
            // Statik CLUBS listesini kullanıyoruz (gerçekte API'dan çekilmeli)
            // Simülasyon için: Öğrencinin üye olduğu kulüpleri buraya çekmeliyiz.
            // Geçici çözüm: Tüm kulüpleri çekip, kullanıcının seçmesini sağlayacağız.
            const CLUBS = [
                { id: 1, name: "BİLİŞİM KULÜBÜ" },
                { id: 2, name: "HUKUK KULÜBÜ" },
                { id: 9, name: "KARİYER VE GELİŞİM KULÜBÜ" },
                // ... Diğer Kulüpler
            ];
            setKulupListesi(CLUBS);
        };

        if (isOpen) {
            fetchClubs();
            setModalHata('');
            setMesajMetni('');
            setSecilenKulupId('');
        }
    }, [isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!mesajMetni.trim() || !secilenKulupId) {
            setModalHata('Lütfen mesajınızı yazın ve bir kulüp seçin.');
            return;
        }
        setYukleniyor(true);
        setModalHata('');

        try {
            const response = await fetch(`${API_URL}/api/kulupler/mesaj/gonder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kulup_id: parseInt(secilenKulupId),
                    ogrenci_email: ogrenciEmail,
                    mesaj_metni: mesajMetni,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`✅ Mesajınız ${kulupListesi.find(k => k.id === parseInt(secilenKulupId))?.name} Kulüp Başkanına iletildi!`);
                onClose(); // Modalı kapat
                fetchMessages(); // Ana listeyi yenile
            } else {
                setModalHata(data.hata || "Mesaj gönderilemedi.");
            }
        } catch (error) {
            setModalHata("Sunucu bağlantı hatası: Mesaj gönderilemedi.");
        } finally {
            setYukleniyor(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-xl font-bold text-red-700 flex items-center">
                        <PaperAirplaneIcon className="w-5 h-5 mr-2" /> Yeni Mesaj Gönder
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSend}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Kulüp Seçin:</label>
                        <select
                            value={secilenKulupId}
                            onChange={(e) => setSecilenKulupId(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500"
                            required
                        >
                            <option value="">-- Kulüp Seçiniz --</option>
                            {kulupListesi.map(kulup => (
                                <option key={kulup.id} value={kulup.id}>{kulup.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Mesajınız:</label>
                        <textarea
                            value={mesajMetni}
                            onChange={(e) => setMesajMetni(e.target.value)}
                            placeholder="Başkan(lar)a göndermek istediğiniz mesajı yazın..."
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-red-500 transition"
                            required
                        />
                    </div>

                    {modalHata && <p className="text-sm text-red-600 mb-4">{modalHata}</p>}

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                        disabled={yukleniyor}
                    >
                        {yukleniyor ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                    </button>
                </form>
            </div>
        </div>
    );
};


export default function OgrenciGelenKutusu() {
    const navigate = useNavigate();
    const [mesajlar, setMesajlar] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [hata, setHata] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal state'i
    
    // LocalStorage'dan öğrenci verisini al
    const ogrenciData = JSON.parse(localStorage.getItem("ogrenci"));
    const ogrenciEmail = ogrenciData?.email;

    // API'dan öğrenciye ait tüm mesajları (cevapları dahil) çeker
    const fetchMesajlar = async () => {
        if (!ogrenciEmail) {
            setHata("Lütfen önce öğrenci girişi yapın.");
            setYukleniyor(false);
            return;
        }

        setYukleniyor(true);
        setHata("");

        try {
            // Öğrencinin email'ine göre mesajları çek
            const response = await fetch(`${API_URL}/api/kulupler/mesaj/ogrenci/${ogrenciEmail}`); 
            const data = await response.json();

            if (response.ok) {
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

    const unreadCount = mesajlar.filter(m => m.cevaplandi === 1 && !m.okundu).length;
    

    // Sayfa Yükleniyor veya Yetki Yoksa
    if (yukleniyor && mesajlar.length === 0) return <div className="p-10 text-center">Mesajlar yükleniyor...</div>;
    if (hata && !ogrenciEmail) return <div className="p-10 text-center text-red-600 font-semibold">{hata}</div>;


    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            
            <SendMessageModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                ogrenciEmail={ogrenciEmail}
                fetchMessages={fetchMesajlar} // Mesaj gönderildikten sonra listeyi yenilemek için
            />

            <header className="w-full max-w-5xl flex justify-between items-center mb-8 pb-4 border-b border-red-200">
                <button 
                    onClick={() => navigate('/ogrenci/panel')} 
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Panele Dön</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <ChatBubbleLeftRightIcon className="w-7 h-7 mr-2 text-red-600" /> Gelen Kutusu ({mesajlar.length})
                </h1>
                <div className="w-20"></div>
            </header>
            
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl p-6">
                
                {/* Okunmamış Cevap Sayısı ve Yeni Mesaj Butonu */}
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 mb-6 flex justify-between items-center rounded-lg">
                    <span className="font-semibold flex items-center">
                        <EnvelopeOpenIcon className="w-6 h-6 mr-2" />
                        Okunmamış Yeni Cevap Sayısı: <span className="ml-2 font-bold text-lg">{unreadCount}</span>
                    </span>
                    <button
                        onClick={() => ogrenciEmail ? setIsModalOpen(true) : alert('Lütfen önce öğrenci girişi yapın.')}
                        className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
                    >
                        <PlusCircleIcon className="w-4 h-4" /> Yeni Mesaj Gönder
                    </button>
                </div>
                
                {hata && <div className="text-sm text-red-600 mb-4">{hata}</div>}

                {/* Mesaj Listesi */}
                <div className="space-y-4">
                    {mesajlar.length > 0 ? (
                        mesajlar.map((m) => (
                            <div key={m.id} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                
                                {/* Öğrenci Mesajı */}
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span className="font-semibold text-red-600">
                                            {m.kulup_ad} Kulübüne Gönderildi
                                        </span>
                                        <span>{new Date(m.olusturma_tarihi).toLocaleDateString()}</span>
                                    </div>
                                    <p className="mt-2 text-gray-800 font-medium">{m.mesaj_metni}</p>
                                </div>
                                
                                {/* Başkan Cevabı */}
                                {m.cevaplandi === 1 ? (
                                    <div className="p-4 bg-green-50 border-l-4 border-green-500">
                                        <div className="flex items-center text-sm font-semibold text-green-700">
                                            <CheckCircleIcon className="w-4 h-4 mr-1" />
                                            Başkan Cevabı ({m.cevaplandi === 1 && 'Cevaplandı'})
                                        </div>
                                        <p className="mt-2 text-green-800 italic">{m.cevap_metni}</p>
                                        <p className="mt-2 text-xs text-green-600 text-right">
                                            Cevap Tarihi: {new Date(m.cevap_tarihi).toLocaleDateString()}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-4 text-sm text-gray-500 bg-white">
                                        Başkan tarafından henüz cevaplanmadı.
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-10 text-center text-gray-500">
                            Gönderdiğiniz veya aldığınız mesaj bulunmamaktadır.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}