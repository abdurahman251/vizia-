import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ClockIcon } from "@heroicons/react/24/solid";

export default function RingSaatleri() {
  const navigate = useNavigate();

  // ✅ API verisi state'leri
  const [ringler, setRingler] = useState({});      // { "Dudullu → Kampüs": ["08:15", ...], ... }
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState("");

  // ✅ UI ve hesap state'leri
  const [saat, setSaat] = useState(new Date());
  const [seciliYon, setSeciliYon] = useState(null);
  const [siradaki, setSiradaki] = useState(null);
  const [kalan, setKalan] = useState("");
  const [tabloGoster, setTabloGoster] = useState(false);

  // 1) Saati canlı güncelle (her 1 sn)
  useEffect(() => {
    const t = setInterval(() => setSaat(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // 2) API'den ring saatlerini çek
  useEffect(() => {
    async function yukle() {
      try {
        setYukleniyor(true);
        setHata("");
        const res = await fetch("http://localhost:5050/api/ringler");
        if (!res.ok) throw new Error("Sunucudan veri alınamadı");
        const data = await res.json();

        // Dizi → gruplu objeye çevir
        const gruplanmis = data.reduce((acc, item) => {
          if (!acc[item.yon]) acc[item.yon] = [];
          acc[item.yon].push(item.saat);
          return acc;
        }, {});

        // Saatleri sıralı tut (08:15, 10:15 gibi)
        Object.keys(gruplanmis).forEach((yon) => {
          gruplanmis[yon].sort((a, b) => {
            const [ha, ma] = a.split(":").map(Number);
            const [hb, mb] = b.split(":").map(Number);
            return ha * 60 + ma - (hb * 60 + mb);
          });
        });

        setRingler(gruplanmis);

        // Eğer henüz yön seçilmediyse, ilk yönü otomatik seç
        const ilkYon = Object.keys(gruplanmis)[0] || null;
        setSeciliYon((prev) => prev ?? ilkYon);
      } catch (err) {
        setHata(err.message || "Bilinmeyen hata");
      } finally {
        setYukleniyor(false);
      }
    }

    yukle();

    // (Opsiyonel) 30 sn'de bir veriyi tazele
    const poll = setInterval(yukle, 30000);
    return () => clearInterval(poll);
  }, []);

  // 3) Sıradaki seferi hesapla (seciliYon veya saat değişince)
  useEffect(() => {
    if (!seciliYon || !ringler[seciliYon]) {
      setSiradaki(null);
      setKalan("");
      return;
    }

    const liste = ringler[seciliYon];
    const simdiDakika = saat.getHours() * 60 + saat.getMinutes();

    // "şu andan sonraki ilk saat"
    const sonraki = liste.find((t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m > simdiDakika;
    });

    if (!sonraki) {
      setSiradaki(null);
      setKalan("");
      return;
    }

    const [h, m] = sonraki.split(":").map(Number);
    const hedef = new Date(saat);
    hedef.setHours(h, m, 0, 0);

    const diffMs = Math.max(0, hedef.getTime() - saat.getTime());
    const dk = Math.floor(diffMs / 60000);
    const sn = Math.floor((diffMs % 60000) / 1000);

    setSiradaki(sonraki);
    setKalan(`${dk} dk ${sn} sn`);
  }, [seciliYon, ringler, saat]);

  // 4) Yön butonları
  const yonler = useMemo(() => Object.keys(ringler), [ringler]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-red-50 via-white to-red-100 text-gray-800 relative overflow-hidden">
      {/* Üst Menü */}
      <div className="w-full flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-10">
        <button
          onClick={() => navigate("/ogrenci/panel")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Geri
        </button>
        <h1 className="text-lg font-bold text-red-700 drop-shadow-sm">
          Vizia Kampüs Ring Sistemi
        </h1>
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <ClockIcon className="w-4 h-4" /> {saat.toLocaleTimeString("tr-TR")}
        </span>
      </div>

      {/* Yükleniyor / Hata */}
      {yukleniyor && (
        <div className="mt-10 text-gray-600">Veriler yükleniyor…</div>
      )}
      {hata && !yukleniyor && (
        <div className="mt-10 text-red-600 font-medium">
          Hata: {hata} — Lütfen daha sonra tekrar deneyin.
        </div>
      )}

      {/* 🚌 Seçim Butonları */}
      {!yukleniyor && !hata && yonler.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 w-[90%] max-w-2xl">
          {yonler.map((yon) => (
            <button
              key={yon}
              onClick={() => setSeciliYon(yon)}
              className={`p-6 rounded-2xl shadow-lg text-lg font-semibold transition-all transform hover:scale-105 backdrop-blur-md border ${
                seciliYon === yon
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white/90 hover:bg-red-50 border-gray-200 text-gray-700"
              }`}
            >
              {yon}
            </button>
          ))}
        </div>
      )}

      {/* 🕓 Sıradaki Sefer Bilgisi */}
      {seciliYon && !yukleniyor && !hata && (
        <div className="mt-12 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-[90%] max-w-lg text-center border-t-4 border-red-600">
          <h2 className="text-xl font-bold text-red-700 mb-3">{seciliYon}</h2>
          {siradaki ? (
            <>
              <p className="text-6xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">
                {siradaki}
              </p>
              <p className="text-gray-700 text-lg">
                Kalkışa{" "}
                <span className="text-red-600 font-semibold text-xl">
                  {kalan}
                </span>
              </p>
              <p className="mt-3 text-sm text-gray-500 italic">
                Ring aracı yaklaşıyor, zamanında durakta ol 🎓
              </p>
            </>
          ) : (
            <p className="text-gray-500 text-lg mt-2">
              🎓 Bugün için {seciliYon} yönünde sefer kalmadı.
            </p>
          )}
        </div>
      )}

      {/* 📅 Haftalık Tablo (Toggle) */}
      {!yukleniyor && !hata && yonler.length > 0 && (
        <>
          <button
            onClick={() => setTabloGoster((v) => !v)}
            className="mt-10 px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 transition"
          >
            {tabloGoster ? "📘 Haftalık Takvimi Gizle" : "📅 Haftalık Takvimi Göster"}
          </button>

          {tabloGoster && (
            <div className="mt-8 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg p-6 w-[90%] max-w-4xl mb-12 overflow-x-auto">
              <h3 className="text-lg font-semibold text-red-700 mb-4 text-center">
                Haftalık Ring Takvimi
              </h3>
              <table className="w-full text-sm text-center border-collapse">
                <thead>
                  <tr className="bg-red-50 text-red-700 border-b">
                    <th className="py-2">Yön</th>
                    <th className="py-2">Saatler</th>
                  </tr>
                </thead>
                <tbody>
                  {yonler.map((yon, i) => (
                    <tr
                      key={yon}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b hover:bg-red-50 transition`}
                    >
                      <td className="py-2 font-medium">{yon}</td>
                      <td className="py-2 text-gray-600">{ringler[yon].join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
