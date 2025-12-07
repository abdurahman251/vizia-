import { useEffect, useState } from "react";
import { ArrowLeftIcon, PlusCircleIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

export default function AdminRingPanel() {
  const navigate = useNavigate();
  const [veriler, setVeriler] = useState([]);
  const [yeni, setYeni] = useState({ yon: "", saat: "" });
  const [duzenlenen, setDuzenlenen] = useState(null);
  const [hata, setHata] = useState("");

  const fetchVeri = async () => {
    try {
      const res = await fetch("http://localhost:5050/api/ringler");
      const data = await res.json();
      setVeriler(data);
    } catch {
      setHata("Veriler alınamadı");
    }
  };

  useEffect(() => {
    fetchVeri();
  }, []);

  const ekle = async () => {
    if (!yeni.yon || !yeni.saat) return alert("Yön ve saat zorunlu.");
    await fetch("http://localhost:5050/api/ringler/ekle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(yeni),
    });
    setYeni({ yon: "", saat: "" });
    fetchVeri();
  };

  const sil = async (id) => {
    if (!window.confirm("Silmek istediğine emin misin?")) return;
    await fetch(`http://localhost:5050/api/ringler/${id}`, { method: "DELETE" });
    fetchVeri();
  };

  const guncelle = async () => {
    if (!duzenlenen.yon || !duzenlenen.saat) return alert("Yön ve saat zorunlu.");
    await fetch(`http://localhost:5050/api/ringler/${duzenlenen.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(duzenlenen),
    });
    setDuzenlenen(null);
    fetchVeri();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 p-6">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/admin/giris")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Geri
        </button>
        <h1 className="text-2xl font-bold text-red-700">🚌 Ring Saat Yönetimi</h1>
      </div>

      {hata && <p className="text-red-600 mb-4">{hata}</p>}

      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Yeni Saat Ekle</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Yön (örn: Dudullu → Kampüs)"
            value={yeni.yon}
            onChange={(e) => setYeni({ ...yeni, yon: e.target.value })}
            className="border p-3 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="Saat (örn: 08:30)"
            value={yeni.saat}
            onChange={(e) => setYeni({ ...yeni, saat: e.target.value })}
            className="border p-3 rounded-lg w-full"
          />
          <button
            onClick={ekle}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-3 rounded-lg flex items-center gap-2"
          >
            <PlusCircleIcon className="w-5 h-5" /> Ekle
          </button>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 overflow-x-auto">
        <table className="w-full text-sm text-center border-collapse">
          <thead>
            <tr className="bg-red-50 text-red-700 border-b">
              <th className="py-2 px-3">ID</th>
              <th className="py-2 px-3">Yön</th>
              <th className="py-2 px-3">Saat</th>
              <th className="py-2 px-3">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {veriler.map((r) => (
              <tr key={r.id} className="border-b hover:bg-red-50 transition">
                <td className="py-2 px-3">{r.id}</td>
                <td className="py-2 px-3">
                  {duzenlenen?.id === r.id ? (
                    <input
                      value={duzenlenen.yon}
                      onChange={(e) =>
                        setDuzenlenen({ ...duzenlenen, yon: e.target.value })
                      }
                      className="border rounded p-1 text-sm"
                    />
                  ) : (
                    r.yon
                  )}
                </td>
                <td className="py-2 px-3">
                  {duzenlenen?.id === r.id ? (
                    <input
                      value={duzenlenen.saat}
                      onChange={(e) =>
                        setDuzenlenen({ ...duzenlenen, saat: e.target.value })
                      }
                      className="border rounded p-1 text-sm"
                    />
                  ) : (
                    r.saat
                  )}
                </td>
                <td className="py-2 px-3 flex justify-center gap-3">
                  {duzenlenen?.id === r.id ? (
                    <button
                      onClick={guncelle}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700"
                    >
                      Kaydet
                    </button>
                  ) : (
                    <button
                      onClick={() => setDuzenlenen(r)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => sil(r.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
