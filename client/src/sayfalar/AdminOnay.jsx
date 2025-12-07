import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [ogrenciler, setOgrenciler] = useState([]);
  const [mesaj, setMesaj] = useState("");
  const navigate = useNavigate();

  const API = "http://localhost:5050";

  async function listeyiYukle() {
    try {
      const res = await fetch(`${API}/api/yoneticiler/ogrenciler`);
      const data = await res.json();
      setOgrenciler(data);
    } catch (e) {
      setMesaj("Liste alınamadı.");
      console.error(e);
    }
  }

  async function onayla(id) {
    try {
      const res = await fetch(`${API}/api/yoneticiler/onayla`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        setMesaj(data.mesaj);
        listeyiYukle();
      } else {
        setMesaj(data.hata);
      }
    } catch (e) {
      setMesaj("Sunucu hatası.");
    }
  }

  useEffect(() => {
    listeyiYukle();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-white to-red-200 p-6">
      <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-red-700">Admin Paneli</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
          >
            Portala Dön
          </button>
        </div>

        {mesaj && (
          <div className="mb-4 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded p-3">
            {mesaj}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">ID</th>
                <th className="py-2">Ad Soyad</th>
                <th className="py-2">E-posta</th>
                <th className="py-2">Durum</th>
                <th className="py-2 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {ogrenciler.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-2">{o.id}</td>
                  <td className="py-2">{o.adsoyad}</td>
                  <td className="py-2">{o.email}</td>
                  <td className="py-2">
                    {o.dogrulandi === 1 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Onaylı
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        Bekliyor
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-right">
                    {o.dogrulandi === 0 ? (
                      <button
                        onClick={() => onayla(o.id)}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Onayla
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-3 py-1.5 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                      >
                        Onaylı
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {ogrenciler.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">
                    Kayıt bulunamadı.
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
