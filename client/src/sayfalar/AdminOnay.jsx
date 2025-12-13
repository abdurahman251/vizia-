import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const API = "http://localhost:5050";

export default function AdminOnay() {
  const [ogrenciler, setOgrenciler] = useState([]);
  const [mesaj, setMesaj] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const navigate = useNavigate();

  // Liste Yükleme Fonksiyonu
  async function listeyiYukle() {
    setYukleniyor(true);
    setMesaj("");
    try {
      // Sadece BEKLEYEN öğrencileri listelemek için rotayı kullanıyoruz.
      // Backend'de bu rota listeleme işini yapıyor.
      const res = await fetch(`${API}/api/yoneticiler/ogrenciler`);
      const data = await res.json();
      
      if (res.ok) {
           // Frontend'deki dogrulandi=0 kontrolünü kaldırdık, çünkü backend sadece bekleyenleri döndürüyor.
           setOgrenciler(data);
      } else {
          setMesaj(data.hata || "Öğrenci listesi alınamadı.");
      }

    } catch (e) {
      setMesaj("Sunucuya bağlanılamadı. Backend'in çalıştığından emin olun.");
      console.error(e);
    } finally {
        setYukleniyor(false);
    }
  }

  // Onaylama Fonksiyonu (Butonun Bağlandığı Yer)
  async function onayla(id) {
    if (!window.confirm("Bu öğrenciyi onaylamak istediğinizden emin misiniz?")) return;
    setYukleniyor(true);
    setMesaj("");
    
    try {
      const res = await fetch(`${API}/api/yoneticiler/onayla`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setMesaj(data.mesaj);
        listeyiYukle(); // Onayladıktan sonra listeyi yenile
      } else {
        setMesaj(data.hata);
      }
    } catch (e) {
      setMesaj("Sunucu hatası: Onaylama başarısız.");
    } finally {
        setYukleniyor(false);
    }
  }

  useEffect(() => {
    listeyiYukle();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-white to-red-200 p-6">
      <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-red-700">Öğrenci Onay Paneli</h1>
          <button
            onClick={() => navigate("/admin/panel")}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
          >
            Panele Dön
          </button>
        </div>

        {mesaj && (
          <div className={`mb-4 text-sm font-medium ${mesaj.includes('başarıyla onaylandı') ? 'text-green-700 bg-green-50 border border-green-200' : 'text-red-700 bg-red-50 border border-red-200'} rounded p-3`}>
            {mesaj}
          </div>
        )}
        
        {yukleniyor && <p className="text-center text-gray-500 mb-4">Yükleniyor...</p>}


        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b bg-red-50 text-red-700">
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Ad Soyad</th>
                <th className="py-2 px-3">E-posta</th>
                <th className="py-2 px-3 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {ogrenciler.map((o) => (
                <tr key={o.id} className="border-b hover:bg-red-50 transition">
                  <td className="py-2 px-3">{o.id}</td>
                  <td className="py-2 px-3">{o.adsoyad}</td>
                  <td className="py-2 px-3">{o.email}</td>
                  <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => onayla(o.id)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        disabled={yukleniyor}
                      >
                        Onayla
                      </button>
                  </td>
                </tr>
              ))}
              {ogrenciler.length === 0 && !yukleniyor && (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    Onay bekleyen yeni kayıt bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}