import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnaSayfa from "./sayfalar/AnaSayfa";
import AdminGiris from "./sayfalar/AdminGiris";
import OgrenciGiris from "./sayfalar/OgrenciGiris";
import OgrenciKayit from "./sayfalar/OgrenciKayit";
import OgrenciPanel from "./sayfalar/OgrenciPanel";
import RingSaatleri from "./sayfalar/RingSaatleri";
import AdminPanel from "./sayfalar/AdminPanel";     
import AdminOnay from "./sayfalar/AdminOnay";       
import AdminRingPanel from "./sayfalar/AdminRingPanel";

// ⭐⭐ YENİ SAYFA EKLEME: Kampüs Mağazası
import KampusMagaza from "./sayfalar/KampusMagaza";

// ⭐⭐⭐ BİZİM EKLEDİĞİMİZ YENİ SAYFA
import KatPlanlari from "./sayfalar/KatPlanlari";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🎓 Genel */}
        <Route path="/" element={<AnaSayfa />} />
        <Route path="/ogrenci/giris" element={<OgrenciGiris />} />
        <Route path="/ogrenci/kayit" element={<OgrenciKayit />} />
        <Route path="/ogrenci/panel" element={<OgrenciPanel />} />
        <Route path="/ogrenci/ring-saatleri" element={<RingSaatleri />} />

        {/* 🛍️ ⭐⭐ YENİ ROTA: Kampüs Mağazası Rotası */}
        <Route path="/ogrenci/magaza" element={<KampusMagaza />} />

        {/* 🗺️ ⭐⭐⭐ YENİ EKLEDİĞİMİZ ROTAMIZ */}
        <Route path="/ogrenci/kat-planlari" element={<KatPlanlari />} />

        {/* 🧑‍💼 Admin */}
        <Route path="/admin/giris" element={<AdminGiris />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
        <Route path="/admin/onay" element={<AdminOnay />} />
        <Route path="/admin/ringler" element={<AdminRingPanel />} />
      </Routes>
    </BrowserRouter>
  );
}