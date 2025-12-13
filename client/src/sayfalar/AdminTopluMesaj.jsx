import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { PaperAirplaneIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

const API_URL = "http://localhost:5050"; 

// **********************************************
// ADMIN TOPLU MESAJ GÖNDERME SAYFASI
// **********************************************
export default function AdminTopluMesaj() {
    const navigate = useNavigate();
    const [mesajMetni, setMesajMetni] = useState('');
    const [yukleniyor, setYukleniyor] = useState(false);
    const [hata, setHata] = useState('');

    const adminData = JSON.parse(localStorage.getItem("admin"));
    const clubId = adminData?.clubId;
    const role = adminData?.role;
    const clubName = adminData?.clubName;

    // 🔥 Bu rotayı Backend'de bir sonraki adımda tanımlayacağız
    const handleTopluMesajGonder = async (e) => {
        e.preventDefault();
        if (!mesajMetni.trim()) {
            setHata("Mesaj metni boş bırakılamaz.");
            return;
        }

        setYukleniyor(true);
        setHata('');

        try {
            // NOT: Backend'de /api/kulupler/toplu-mesaj rotasını şimdi yapmamız gerekiyor!
            const response = await fetch(`${API_URL}/api/kulupler/toplu-mesaj`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    // Yetkilendirme için header'ları gönderiyoruz
                    'clubId': clubId,
                    'role': role
                },
                body: JSON.stringify({
                    kulup_id: clubId,
                    mesaj_metni: mesajMetni
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`✅ Mesaj, ${clubName} kulübünün tüm onaylı üyelerine başarıyla gönderildi!`);
                setMesajMetni('');
            } else {
                setHata(data.hata || "Toplu mesaj gönderilemedi. Yetkinizi kontrol edin.");
            }
        } catch (error) {
            setHata("Sunucu bağlantı hatası.");
        } finally {
            setYukleniyor(false);
        }
    };


    if (role !== 'ClubPresident') {
        return <div className="p-10 text-center text-red-600">Bu sayfaya erişim yetkiniz yoktur.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <header className="w-full max-w-4xl flex justify-between items-center mb-8 pb-4 border-b border-red-200">
                <button 
                    onClick={() => navigate('/admin/panel')} 
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Panele Dön</span>
                </button>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <MegaphoneIcon className="w-7 h-7 mr-2 text-orange-600" /> Üyelere Toplu Mesaj
                </h1>
                <div className="w-20"></div>
            </header>
            
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 border-t-4 border-orange-600">
                <p className="mb-4 text-gray-600">
                    Başkanlığını yaptığınız **{clubName}** kulübünün tüm onaylanmış üyelerine anında mesaj gönderebilirsiniz.
                </p>

                <form onSubmit={handleTopluMesajGonder}>
                    <textarea
                        value={mesajMetni}
                        onChange={(e) => setMesajMetni(e.target.value)}
                        placeholder="Üyelere duyuru, etkinlik bilgisi veya önemli mesajınızı buraya yazın..."
                        rows="6"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:border-orange-500 transition mb-4"
                        required
                    />
                    
                    {hata && <p className="text-sm text-red-600 mb-4">{hata}</p>}

                    <button
                        type="submit"
                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center gap-2"
                        disabled={yukleniyor}
                    >
                        {yukleniyor ? 'Gönderiliyor...' : <><PaperAirplaneIcon className="w-5 h-5" /> {clubName} Üyelerine Gönder</>}
                    </button>
                </form>
            </div>
        </div>
    );
}