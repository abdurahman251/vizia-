import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { ArrowLeftIcon } from "@heroicons/react/24/outline"; 

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

        // 🔥 1. GİRİŞ İŞLEMİ: API'ye Bağlanma 🔥
        try {
            // NOT: Backend'de bu rotayı (/api/yoneticiler/giris) oluşturmanız gerekecektir.
            const response = await fetch(`${API_URL}/api/yoneticiler/giris`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, sifre }),
            });

            const data = await response.json();

            if (response.ok) {
                // 3. Başarılı giriş: Hesap verilerini (role, clubId, adsoyad) LocalStorage'a kaydet
                localStorage.setItem("admin", JSON.stringify(data.yonetici));
                setHata("");
                navigate("/admin/panel");
            } else {
                setHata(data.hata || "Giriş başarısız oldu. Sunucu hatası.");
            }

        } catch (error) {
            console.error("Giriş sırasında sunucu hatası:", error);
            setHata("Sunucuya bağlanılamadı. Backend'in çalıştığından emin olun.");
        } finally {
            setYukleniyor(false);
        }
    };
    
    const navigateToPortal = () => {
        navigate("/");
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
            {/* 🔙 Portala Dön Butonu */}
            <button
                onClick={navigateToPortal}
                className="absolute top-6 left-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Portala Dön</span>
            </button>
            
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center border-t-4 border-red-600">
                <UserCircleIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin / Başkan Girişi</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="E-posta"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Şifre"
                            value={sifre}
                            onChange={(e) => setSifre(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition"
                            required
                        />
                    </div>
                    
                    {hata && (
                        <p className="text-red-500 text-sm mb-4">{hata}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
                        disabled={yukleniyor}
                    >
                        {yukleniyor ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>
                
                <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
                    <p className="font-semibold text-gray-600 mb-2">Hızlı Giriş Simülasyonu (Backend Gerekir):</p>
                    <p>Super Admin: `admin@gmail.com` / `1234`</p>
                    <p>Bilişim Başkanı: `bilisim@vizia.edu` / `1234`</p>
                </div>
            </div>
        </div>
    );
}