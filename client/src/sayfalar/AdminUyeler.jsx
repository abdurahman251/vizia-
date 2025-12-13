import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { UserGroupIcon, TrashIcon, UserMinusIcon, CheckCircleIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

const API_URL = "http://localhost:5050"; 

export default function AdminUyeler() {
    const navigate = useNavigate();
    const [uyeler, setUyeler] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [hata, setHata] = useState('');
    
    // Admin verileri
    const adminData = JSON.parse(localStorage.getItem("admin"));
    const clubId = adminData?.clubId;
    const role = adminData?.role;
    const clubName = adminData?.clubName;

    const fetchUyeler = async () => {
        if (role !== 'ClubPresident' || !clubId) {
            setHata("Bu sayfayı görüntüleme yetkiniz yok.");
            setYukleniyor(false);
            return;
        }

        setYukleniyor(true);
        setHata('');

        try {
            // Backend rotası: Sadece onaylanmış üyeleri çeker.
            // Yetki kontrolü (clubId ve role) Backend'de header üzerinden yapılacaktır.
            const response = await fetch(`${API_URL}/api/kulupler/uyelik/onaylananlar`, {
                headers: {
                    'clubId': clubId,
                    'role': role
                }
            });
            const data = await response.json();

            if (response.ok) {
                setUyeler(data); 
            } else {
                setHata(data.hata || "Üye listesi alınamadı.");
            }
        } catch (error) {
            setHata("Sunucu bağlantı hatası.");
        } finally {
            setYukleniyor(false);
        }
    };

    useEffect(() => {
        fetchUyeler();
    }, []); 

    // Üye Atma (Çıkarma) Fonksiyonu
    const handleUyeCikar = async (uyelikId, ogrenciAd) => {
        if (!window.confirm(`${ogrenciAd} adlı üyeyi kulüpten çıkarmak istediğinizden emin misiniz?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/kulupler/uyelik/cikar`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'clubId': clubId, // Yetki için gönderiliyor
                    'role': role
                },
                body: JSON.stringify({
                    uyelik_id: uyelikId,
                    durum: 'Reddedildi' // Çıkarma işlemini 'Reddedildi' olarak simüle ediyoruz.
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`✅ Üye başarıyla çıkarıldı!`);
                fetchUyeler(); // Listeyi yenile
            } else {
                alert(data.hata || "Üye çıkarma başarısız.");
            }
        } catch (error) {
            alert("Sunucu bağlantı hatası: Üye çıkarılamadı.");
        }
    };
    
    // Eğer yetkisi yoksa, erken dönsün
    if (role !== 'ClubPresident') {
        return <div className="p-10 text-center text-red-600 font-bold text-xl">Bu sayfayı görme yetkiniz yok.</div>;
    }

    if (yukleniyor) return <div className="p-10 text-center">Üyeler yükleniyor...</div>;
    if (hata) return <div className="p-10 text-center text-red-600 font-semibold">{hata}</div>;


    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            
            <header className="w-full max-w-6xl flex justify-between items-center mb-8 pb-4 border-b border-red-200">
                <button 
                    onClick={() => navigate('/admin/panel')} 
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Admin Panele Dön</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <UserGroupIcon className="w-7 h-7 mr-2 text-red-600" /> {clubName} Üyeleri ({uyeler.length})
                </h1>
                <div className="w-20"></div>
            </header>
            
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl p-6">
                
                {uyeler.length > 0 ? (
                    <div className="space-y-4">
                        {uyeler.map((uye) => (
                            <div key={uye.id} className="border border-gray-200 p-4 rounded-lg shadow-md bg-white flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                    <div>
                                        <p className="font-semibold text-lg text-gray-900">{uye.ogrenci_adsoyad}</p>
                                        <p className="text-sm text-gray-600 italic">{uye.ogrenci_email}</p>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                    {/* Toplu mesaj rotasına yönlendirme (Bu üyeye özel değil, tüm kulüp üyelerine gönderir) */}
                                    <button
                                        onClick={() => navigate('/admin/toplu-mesaj')}
                                        className="flex items-center gap-1 bg-orange-500 text-white text-sm px-3 py-2 rounded-lg hover:bg-orange-600 transition"
                                    >
                                        <MegaphoneIcon className="w-4 h-4" /> Toplu Mesaj
                                    </button>

                                    {/* Üyeyi Kulüpten Çıkarma Butonu */}
                                    <button
                                        onClick={() => handleUyeCikar(uye.id, uye.ogrenci_adsoyad)}
                                        className="flex items-center gap-1 bg-red-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-red-700 transition"
                                    >
                                        <UserMinusIcon className="w-4 h-4" /> Çıkar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-10 text-center text-gray-500 text-xl">
                        Kulübünüzde onaylanmış hiçbir üye bulunmamaktadır.
                    </div>
                )}
            </div>
        </div>
    );
}