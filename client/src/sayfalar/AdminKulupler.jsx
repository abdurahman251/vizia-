import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// ChatBubbleLeftRightIcon kaldırıldı
import { ArrowLeftIcon, WrenchScrewdriverIcon, PencilIcon, CheckCircleIcon, PlusCircleIcon, KeyIcon } from '@heroicons/react/24/outline'; 

// API Sabiti
const API_URL = "https://vizia-server.onrender.com"; 

// Varsayılan tema renkleri (Super Admin için)
const SUPER_ADMIN_THEME = {
    bg: "bg-purple-600",
    hover: "hover:bg-purple-700",
    text: "text-purple-600",
};

export default function AdminKulupler() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [clubData, setClubData] = useState([]);
    const [messages, setMessages] = useState([]);
    const [editingClub, setEditingClub] = useState(null);
    const [hata, setHata] = useState("");
    const [basariMesaji, setBasariMesaji] = useState("");
    const [yukleniyor, setYukleniyor] = useState(true);

    // 🔥 YENİ KULÜP OLUŞTURMA STATE'İ
    const [yeniKulupVeri, setYeniKulupVeri] = useState({
        ad: '',
        baskan_email: '',
        baskan_sifre: '',
    });

    // **********************************************
    // YARDIMCI FONKSİYONLAR
    // **********************************************
    
    // Yetkilendirme için Admin bilgilerini header'a ekler
    const getAuthHeaders = (adminInfo) => ({
        'Content-Type': 'application/json',
        // Backend'e yetki bilgisini taşıyoruz:
        'clubid': adminInfo?.clubId || '',
        'role': adminInfo?.role || '',
    });

    // **********************************************
    // API ÇAĞRILARI
    // **********************************************

    // 1. Kulüp Bilgilerini Çekme (Madde III)
    const fetchClubData = async (adminInfo) => {
        setHata("");
        try {
            const response = await fetch(`${API_URL}/api/kulupler/bilgiler`, {
                headers: getAuthHeaders(adminInfo),
            });

            if (response.ok) {
                const data = await response.json();
                setClubData(data);
                if (adminInfo.role === 'ClubPresident' && data.length > 0) {
                    setEditingClub(data[0]); 
                }
            } else {
                const errorData = await response.json();
                setHata(errorData.hata || "Kulüp bilgileri alınamadı.");
            }
        } catch (error) {
            console.error("Kulüp verisi çekme hatası:", error);
            setHata("Sunucu bağlantı hatası.");
        } finally {
            setYukleniyor(false); 
        }
    };
    
    // 2. Mesajları Çekme (Madde 2 ve 4) - Başkan için tutuldu, Super Admin için kaldırıldı
    const fetchMessages = async (adminInfo) => {
        try {
            const response = await fetch(`${API_URL}/api/kulupler/mesaj/gelenler`, {
                headers: getAuthHeaders(adminInfo),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                // Hata durumunda sadece loglama
            }
        } catch (error) {
            console.error("Mesaj verisi çekme hatası:", error);
        }
    };


    // **********************************************
    // BAŞLANGIÇ YÜKLEME (useEffect)
    // **********************************************
    useEffect(() => {
        const adminData = JSON.parse(localStorage.getItem("admin"));
        if (!adminData) {
            navigate("/admin/giris");
            return;
        }
        setAdmin(adminData);

        fetchClubData(adminData);
        if (adminData.role === 'ClubPresident') {
            fetchMessages(adminData);
            const intervalId = setInterval(() => {
                fetchMessages(adminData);
            }, 30000); 
            return () => clearInterval(intervalId);
        }
    }, [navigate]);

    if (!admin) return <div className="p-10 text-center">Yetkilendirme Kontrol Ediliyor...</div>;

    const isAdmin = admin.role === 'SuperAdmin';
    const isPresident = admin.role === 'ClubPresident';
    
    // Başkanın kulüp verisi
    const currentClub = isPresident && clubData.length > 0 ? clubData[0] : null;


    // **********************************************
    // AKSİYON FONKSİYONLARI 
    // **********************************************

    // 🔥 YENİ: KULÜP OLUŞTURMA FONKSİYONU
    const handleKulupOlustur = async (e) => {
        e.preventDefault();
        setYukleniyor(true);
        setHata("");
        setBasariMesaji("");

        if (!yeniKulupVeri.ad || !yeniKulupVeri.baskan_email || !yeniKulupVeri.baskan_sifre) {
            setHata("Tüm alanlar (Ad, E-posta, Şifre) zorunludur.");
            setYukleniyor(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/kulupler/olustur`, {
                method: 'POST',
                headers: getAuthHeaders(admin),
                body: JSON.stringify(yeniKulupVeri),
            });

            const data = await response.json();

            if (response.ok) {
                setBasariMesaji(data.mesaj); 
                setYeniKulupVeri({ ad: '', baskan_email: '', baskan_sifre: '' }); 
                fetchClubData(admin); 
            } else {
                setHata(data.hata || "Yeni kulüp oluşturulurken hata oluştu.");
            }
        } catch (error) {
            console.error("Kulüp oluşturma hatası:", error);
            setHata("Sunucu bağlantı hatası veya beklenmeyen hata.");
        } finally {
            setYukleniyor(false);
        }
    };

    // Madde III: Kulüp Bilgilerini Kaydetme (API Bağlantısı)
    const handleSaveClub = async (e) => {
        e.preventDefault();
        setYukleniyor(true);
        setHata("");
        setBasariMesaji("");
        
        try {
            // editingClub'daki son güncel değerleri kullanıyoruz
            const clubToSave = {
                id: editingClub.id,
                ad: editingClub.ad,
                slogan: editingClub.slogan,
                aciklama: editingClub.aciklama, 
                logo_yolu: editingClub.logo_yolu, 
                baskan_adsoyad: editingClub.baskan_adsoyad, 
            };
            
            const response = await fetch(`${API_URL}/api/kulupler/bilgiler/guncelle`, {
                method: 'PUT',
                headers: getAuthHeaders(admin),
                body: JSON.stringify(clubToSave),
            });

            const data = await response.json();

            if (response.ok) {
                setBasariMesaji(data.mesaj); 
                fetchClubData(admin);
                setEditingClub(null);
            } else {
                setHata(data.hata || "Kulüp bilgileri güncellenirken hata oluştu.");
            }
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            setHata("Sunucu bağlantı hatası.");
        } finally {
            setYukleniyor(false);
        }
    };

    // Madde IV: Mesaj Cevaplama (API Bağlantısı) - Sadece Başkan kullanır
    const handleReply = async (e, mesaj_id, cevap_metni) => {
        e.preventDefault();
        if (!cevap_metni.trim()) return alert("Cevap alanı boş bırakılamaz.");

        setYukleniyor(true);
        setHata("");
        setBasariMesaji("");

        try {
            const response = await fetch(`${API_URL}/api/kulupler/mesaj/cevapla`, {
                method: 'PUT',
                headers: getAuthHeaders(admin),
                body: JSON.stringify({
                    mesaj_id,
                    cevap_metni
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setBasariMesaji(data.mesaj);
                fetchMessages(admin);
            } else {
                setHata(data.hata || "Mesaj cevaplanırken hata oluştu.");
            }

        } catch (error) {
            console.error("Cevaplama hatası:", error);
            setHata("Sunucu bağlantı hatası.");
        } finally {
            setYukleniyor(false);
        }
    };


    // **********************************************
    // BİLEŞENLER
    // **********************************************

    // Kulüp Bilgi Düzenleme Formu (Madde III)
    const ClubEditForm = () => (
        <div className="bg-white p-6 rounded-xl shadow-xl mt-6 border border-red-200">
            <h3 className="text-xl font-bold text-red-700 mb-4 border-b pb-2">
                {editingClub.ad} Bilgilerini Düzenle
            </h3>
            <form onSubmit={handleSaveClub} className="space-y-4">
                
                {/* ID ve AD alanı (Sadece Super Admin değiştirebilir) */}
                {isAdmin && (
                    <input
                        type="text"
                        value={editingClub.ad}
                        onChange={(e) => setEditingClub({ ...editingClub, ad: e.target.value })}
                        placeholder="Kulüp Adı"
                        className="w-full p-2 border rounded"
                        required
                    />
                )}
                
                 <input
                    type="text"
                    value={editingClub.baskan_adsoyad} // baskan_adsoyad
                    onChange={(e) => setEditingClub({ ...editingClub, baskan_adsoyad: e.target.value })}
                    placeholder="Kulüp Başkanı"
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    value={editingClub.slogan} // slogan
                    onChange={(e) => setEditingClub({ ...editingClub, slogan: e.target.value })}
                    placeholder="Slogan"
                    className="w-full p-2 border rounded"
                    required
                />
                <textarea
                    value={editingClub.aciklama} // aciklama
                    onChange={(e) => setEditingClub({ ...editingClub, aciklama: e.target.value })}
                    placeholder="Açıklama Metni"
                    rows="3"
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    value={editingClub.logo_yolu} // logo_yolu
                    onChange={(e) => setEditingClub({ ...editingClub, logo_yolu: e.target.value })}
                    placeholder="Logo Yolu (ör: /images/yeni_logo.jpg)"
                    className="w-full p-2 border rounded"
                />
                <div className="flex gap-4">
                    <button 
                        type="submit" 
                        className="flex-grow bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
                        disabled={yukleniyor}
                    >
                        {yukleniyor ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                    <button type="button" onClick={() => setEditingClub(null)} className="flex-grow bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400">
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );

    // 🔥 YENİ: KULÜP OLUŞTURMA FORMU
    const KulupOlusturmaFormu = () => (
        <div className="bg-white p-6 rounded-xl shadow-xl mt-6 border-t-4 border-purple-500 mb-10">
            <h3 className={`text-xl font-bold ${SUPER_ADMIN_THEME.text} mb-4 border-b pb-2 flex items-center`}>
                <PlusCircleIcon className="w-6 h-6 mr-2" /> Yeni Kulüp ve Başkan Hesabı Oluşturma
            </h3>
            <form onSubmit={handleKulupOlustur} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Kulüp Adı */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Kulüp Adı</label>
                    <input
                        type="text"
                        value={yeniKulupVeri.ad}
                        onChange={(e) => setYeniKulupVeri({ ...yeniKulupVeri, ad: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Örn: Yapay Zeka Kulübü"
                        required
                        disabled={yukleniyor}
                    />
                </div>

                {/* Başkan E-posta */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Başkan E-posta (Giriş)</label>
                    <input
                        type="email"
                        value={yeniKulupVeri.baskan_email}
                        onChange={(e) => setYeniKulupVeri({ ...yeniKulupVeri, baskan_email: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="baskan@kulup.com"
                        required
                        disabled={yukleniyor}
                    />
                </div>

                {/* Şifre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Şifre (Min. 4 Karakter)</label>
                    <input
                        type="password"
                        value={yeniKulupVeri.baskan_sifre}
                        onChange={(e) => setYeniKulupVeri({ ...yeniKulupVeri, baskan_sifre: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                        disabled={yukleniyor}
                    />
                </div>
                
                {/* Buton */}
                <div className="flex items-end">
                    <button
                        type="submit"
                        className={`w-full ${SUPER_ADMIN_THEME.bg} text-white py-2 px-4 rounded-md shadow-md ${SUPER_ADMIN_THEME.hover} transition`}
                        disabled={yukleniyor}
                    >
                        <KeyIcon className="w-5 h-5 inline mr-2"/> {yukleniyor ? 'Oluşturuluyor...' : 'Kulübü Oluştur & Ata'}
                    </button>
                </div>
            </form>
        </div>
    );
    
    // Mesaj Yönetim Kartı (Madde IV) - Super Admin için kaldırıldı, sadece Başkan için kalacak
    const MessageManagement = () => {
        // Cevaplanmamış mesajlar
        const unrepliedMessages = messages.filter(m => m.cevaplandi === 0);

        return (
            <div className="bg-white p-6 rounded-xl shadow-xl mt-6 border border-blue-200">
                <h3 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2 flex items-center">
                    Gelen Öğrenci Mesajları 
                    <span className="ml-3 px-3 py-1 text-sm font-bold bg-red-100 text-red-700 rounded-full">{unrepliedMessages.length} Yeni</span>
                </h3>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {unrepliedMessages.length > 0 ? (
                        unrepliedMessages.map(msg => (
                            <div key={msg.id} className={`p-3 rounded-lg bg-yellow-50 border border-yellow-200`}>
                                <p className="text-sm font-semibold text-gray-800 flex justify-between">
                                    <span>{msg.ogrenci_email} ({msg.kulup_ad})</span>
                                    <span className="text-xs text-gray-500">{new Date(msg.olusturma_tarihi).toLocaleDateString()}</span>
                                </p>
                                <p className="mt-1 text-gray-700 italic border-l-2 border-red-500 pl-2">{msg.mesaj_metni}</p>
                                
                                <form onSubmit={(e) => handleReply(e, msg.id, e.target.reply.value)}>
                                    <textarea
                                        name="reply"
                                        placeholder="Cevabınızı buraya yazın..."
                                        rows="2"
                                        className="w-full p-2 border rounded mt-3 text-sm focus:border-blue-500"
                                        required
                                        disabled={yukleniyor}
                                    />
                                    <button 
                                        type="submit" 
                                        className="w-full bg-blue-600 text-white text-sm py-1 rounded hover:bg-blue-700 transition"
                                        disabled={yukleniyor}
                                    >
                                        {yukleniyor ? 'Gönderiliyor...' : 'Cevap Gönder'}
                                    </button>
                                </form>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">Cevaplanmayı bekleyen mesaj bulunmamaktadır.</p>
                    )}
                     <hr className="my-4" />
                     <h4 className="text-lg font-semibold text-green-700 mb-3">Cevaplanan Mesajlar</h4>
                     {messages.filter(m => m.cevaplandi === 1).length > 0 ? (
                        messages.filter(m => m.cevaplandi === 1).map(msg => (
                            <div key={msg.id} className={`p-3 rounded-lg bg-gray-50 border border-gray-200`}>
                                <p className="text-sm font-semibold text-gray-600 flex justify-between">
                                    <span>{msg.ogrenci_email}</span>
                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                </p>
                                <p className="mt-1 text-gray-700 italic border-l-2 border-red-500 pl-2 text-sm">{msg.mesaj_metni}</p>
                                <div className="mt-2 p-2 bg-green-50 rounded text-green-700 text-xs">
                                    Cevabınız: {msg.cevap_metni}
                                </div>
                            </div>
                        ))
                     ) : (
                        <p className="text-center text-gray-500 py-2 text-sm">Cevaplanan mesajınız yok.</p>
                     )}
                </div>
            </div>
        );
    };

    // Kulüpleri Yönetme Tablosu (Sadece Super Admin Görür)
    const SuperAdminClubTable = () => (
        <div className="bg-white shadow-lg rounded-xl p-6 overflow-x-auto mt-8">
            <h2 className="text-2xl font-bold text-red-700 mb-4">Tüm Kulüpleri Yönet</h2>
            <table className="w-full text-sm text-left border-collapse">
                <thead>
                    <tr className="bg-red-50 text-red-700 border-b">
                        <th className="py-2 px-3">ID / Ad</th>
                        <th className="py-2 px-3">Başkan / Email</th>
                        <th className="py-2 px-3">Kategori</th>
                        <th className="py-2 px-3">Üye</th>
                        <th className="py-2 px-3">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {clubData.map((club) => (
                        <tr key={club.id} className="border-b hover:bg-red-50 transition">
                            <td className="py-2 px-3">#{club.id} - {club.ad}</td>
                            <td className="py-2 px-3">{club.baskan_adsoyad} / {club.baskan_email || 'HESAP YOK'}</td>
                            <td className="py-2 px-3">{club.kategori}</td>
                            <td className="py-2 px-3">{club.aktif_uye_sayisi}</td>
                            <td className="py-2 px-3 flex gap-2">
                                <button
                                    onClick={() => handleDuzenleClick(club)}
                                    className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    <PencilIcon className="w-4 h-4 mr-1" /> Düzenle
                                </button>
                                {/* Silme ve Yeni Kulüp Ekleme rotaları sonra eklenebilir */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
    // Düzenleme butonuna basıldığında çağrılır
    const handleDuzenleClick = (kulup) => {
        setEditingClub(kulup);
        // Süper Admin bu sayfadan kulüp adı, sloganı vb. değiştirebilir.
    };


    // **********************************************
    // ANA RENDER ALANI
    // **********************************************

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-6">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate("/admin/panel")}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Panele Geri Dön
                </button>
                <h1 className="text-3xl font-bold text-red-700 flex items-center">
                    <WrenchScrewdriverIcon className="w-7 h-7 mr-2" /> Kulüp Yönetimi
                </h1>
            </div>

            {/* Hata ve Başarı Mesajları */}
            {hata && (
                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{hata}</span>
                </div>
            )}
            {basariMesaji && (
                 <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{basariMesaji}</span>
                </div>
            )}


            {/* 🔥 Kulüp Bilgisi Düzenleme Modülü (Madde III) */}
            {editingClub && <ClubEditForm />}


            {/* Başkan Paneli (Sınırlı Yetki) */}
            {isPresident && currentClub && (
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                        {currentClub.ad} Yönetim Alanı
                    </h2>
                    
                    {/* Başkan Kulüp Bilgisi Düzenleme Tetikleyici */}
                    {!editingClub && (
                         <button 
                            onClick={() => handleDuzenleClick(currentClub)}
                            className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                            <PencilIcon className="w-5 h-5 inline-block mr-2" /> Bilgileri Düzenle
                        </button>
                    )}
                    
                    {/* Mesaj Yönetimi (Sadece Başkan için kalır) */}
                    <MessageManagement />
                </div>
            )}

            {/* Super Admin Paneli (Sınırsız Yetki) */}
            {isAdmin && (
                <div className="max-w-6xl mx-auto">
                    {/* 🔥 YENİ: KULÜP OLUŞTURMA FORMU (En üstte) */}
                    <KulupOlusturmaFormu />
                    
                    {/* Tüm Kulüpleri Yönetme Tablosu */}
                    <SuperAdminClubTable />
                </div>
            )}
        </div>
    );
}