import { useState, useEffect } from "react";
import {
  BuildingOffice2Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const KATLAR = [
  {
    id: "B4",
    ad: "B4",
    image: "/b4.jpg",
    alanlar: ["Otopark"],
  },
  {
    id: "B3",
    ad: "B3",
    image: "/b3.jpg",
    alanlar: ["Otopark", "Mescid", "Abdesthane"],
  },
  {
    id: "B2",
    ad: "B2",
    image: "/b2.jpg",
    alanlar: [
      "Makine İleri Teknolojiler Laboratuvarı",
      "Spor Salonu",
      "Dans ve Drama Salonu",
      "Yoga Salonu",
      "Amfiler",
    ],
  },
  {
    id: "B1",
    ad: "B1",
    image: "/b1.jpg",
    alanlar: [
      "Hemşirelik LAB",
      "Robot ve Teknoloji Yazılım LAB",
      "Mutfak",
      "Gastronomi",
      "Yemekhane",
      "Bilgi İşlem Akademik Ofisler",
    ],
  },
  {
    id: "Z",
    ad: "Zemin Kat",
    image: "/zemin.jpg",
    alanlar: [
      "Tanıtım ve Halkla İlişkiler",
      "Psikolojik Danışmanlık",
      "Engelli Öğrenci Birimi",
      "Dikiş Atölyesi",
      "Kariyer Merkezi",
      "Kafe",
      "Sergi Alanı",
    ],
  },
  {
    id: "1",
    ad: "1. Kat",
    image: "/kat1.jpg",
    alanlar: [
      "Derslikler",
      "SBYO Müdürlüğü",
      "MYO Müdürlüğü",
      "Fakülte Dekanlıkları",
      "Teknoloji Transfer Ofisi",
    ],
  },
  {
    id: "2",
    ad: "2. Kat",
    image: "/kat2.jpg",
    alanlar: [
      "Rektörlük",
      "Genel Sekreterlik",
      "Personel Müdürlüğü",
      "Bilgi İşlem Müdürlüğü",
      "Teras Kafe",
    ],
  },
  {
    id: "3",
    ad: "3. Kat",
    image: "/kat3.jpg",
    alanlar: ["Derslikler", "Spor Koordinatörlüğü", "Ofisler"],
  },
];

export default function KatPlanlari() {
  const [aktifKat, setAktifKat] = useState(KATLAR[0]);
  const [anim, setAnim] = useState(true);
  const [popupAlan, setPopupAlan] = useState(null);

  // kat geçiş animasyonu
  const katDegistir = (kat) => {
    setAnim(false);
    setTimeout(() => {
      setAktifKat(kat);
      setAnim(true);
    }, 200);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      
      {/* SOL PANEL */}
      <aside className="w-56 bg-white/80 backdrop-blur-md border-r p-4">
        <h2 className="text-lg font-bold mb-4">Katlar</h2>
        {KATLAR.map((kat) => (
          <button
            key={kat.id}
            onClick={() => katDegistir(kat)}
            className={`block w-full text-left px-4 py-2 rounded-xl mb-2 transition-all
              ${
                aktifKat.id === kat.id
                  ? "bg-blue-600 text-white scale-105 shadow-lg"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
          >
            {kat.ad}
          </button>
        ))}
      </aside>

      {/* ANA */}
      <main className="flex-1 p-8 relative">

        {/* PLAN */}
        <div
          className={`bg-white rounded-2xl shadow-xl p-6 mb-8 transition-all duration-500
          ${anim ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          <img
            src={aktifKat.image}
            alt={aktifKat.ad}
            className="w-full object-contain rounded-xl"
          />
        </div>

        {/* ALANLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {aktifKat.alanlar.map((alan, i) => (
            <div
              key={i}
              onClick={() => setPopupAlan(alan)}
              className="cursor-pointer flex items-center gap-3 p-4 bg-white rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <BuildingOffice2Icon className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-gray-800">{alan}</span>
            </div>
          ))}
        </div>

        {/* POPUP */}
        {popupAlan && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{popupAlan}</h3>
                <button onClick={() => setPopupAlan(null)}>
                  <XMarkIcon className="w-6 h-6 text-gray-500 hover:text-red-500" />
                </button>
              </div>
              <p className="text-gray-600">
                {popupAlan} hakkında bilgi burada gösterilebilir.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
