import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { UserGroupIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const API_URL = "https://vizia-server.onrender.com"; 

export default function AdminKulupOnay() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [basvurular, setBasvurular] = useState([]);
    const [yukleniyor, setYukleniyor] = useState(true);
    const [hata, setHata] = useState("");

    // Yetkilendirme için Admin bilgilerini header'a ekler
    const getAuthHeaders = (adminInfo) => ({
        'Content-Type': 'application/json',
        'clubid': adminInfo?.clubId || '',
        'role': adminInfo?.role || '',
    });

    // **********************************************
    // API ÇAĞRILARI
    // **********************************************

    // Bekleyen üyelikleri çeker
    const fetchBasvurular = async (adminInfo) => {
        setHata("");
        try {
            const response = await fetch(`${API_URL}/api/kulupler/uyelik/bekleyenler`, {
                headers: getAuthHeaders(adminInfo),
            });

            if (response.ok) {
                const data = await response.json();
                setBasvurular(data);
            } else {
                const errorData = await response.json();
                setHata(errorData.hata || "Başvurular alınamadı.");
            }
        } catch (error) {
            setHata("Sunucu bağlantı hatası.");
        }
    };
    
    // Üyelik durumunu günceller (Onayla/Reddet)
    const handleOnay = async (basvuru_id, durum) => {
        setYukleniyor(true);
        setHata("");
        try {
            const response = await fetch(`${API_URL}/api/kulupler/uyelik/onayla`, {
                method: 'PUT',
                headers: getAuthHeaders(admin),
                body: JSON.stringify({ basvuru_id, durum }),
            });

            const data = await response.json();
            
            if (response.ok) {
                alert(data.mesaj);
                fetchBasvurular(admin); // Listeyi yenile
            } else {
                setHata(data.hata || "Durum güncellenirken hata oluştu.");
            }

        } catch (error) {
            setHata("Sunucu bağlantı hatası.");
        } finally {
            setYukleniyor(false);
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
        fetchBasvurular(adminData);
        setYukleniyor(false);
    }, [navigate]);

    if (!admin) return <div className="p-10 text-center">Yükleniyor...</div>;

    // **********************************************
    // ANA RENDER ALANI
    // **********************************************

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <header className="w-full max-w-6xl flex justify-between items-center mb-8 pb-4 border-b border-blue-200">
                <button 
                    onClick={() => navigate('/admin/panel')} 
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Panele Dön</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <UserGroupIcon className="w-7 h-7 mr-2 text-red-600" /> Üyelik Başvuruları
                </h1>
                <div className="w-20"></div>
            </header>
            
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl p-6">
                {hata && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{hata}</div>
                )}
                
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                    Bekleyen Başvurular 
                    <span className="ml-2 px-3 py-1 text-sm font-bold bg-yellow-100 text-yellow-700 rounded-full">{basvurular.length}</span>
                </h2>
                
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-blue-50 text-blue-700 border-b">
                            <th className="py-2 px-3">Başvuru ID</th>
                            <th className="py-2 px-3">Kulüp</th>
                            <th className="py-2 px-3">Öğrenci Ad/Email</th>
                            <th className="py-2 px-3">Başvuru Tarihi</th>
                            <th className="py-2 px-3 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {basvurular.map((b) => (
                            <tr key={b.id} className="border-b hover:bg-gray-50 transition">
                                <td className="py-2 px-3">#{b.id}</td>
                                <td className="py-2 px-3 font-semibold">{b.kulup_ad}</td>
                                <td className="py-2 px-3">{b.ogrenci_adsoyad} ({b.ogrenci_email})</td>
                                <td className="py-2 px-3 text-gray-500">{new Date(b.basvuru_tarihi).toLocaleDateString()}</td>
                                <td className="py-2 px-3 flex justify-end gap-2">
                                    <button
                                        onClick={() => handleOnay(b.id, 'Onaylandı')}
                                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 disabled:bg-gray-400"
                                        disabled={yukleniyor}
                                    >
                                        <CheckCircleIcon className="w-4 h-4" /> Onayla
                                    </button>
                                    <button
                                        onClick={() => handleOnay(b.id, 'Reddedildi')}
                                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-700 disabled:bg-gray-400"
                                        disabled={yukleniyor}
                                    >
                                        <XCircleIcon className="w-4 h-4" /> Reddet
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {basvurular.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-6 text-center text-gray-500">
                                    Bekleyen üyelik başvurusu bulunmamaktadır.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}