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

// ⭐ 1. ADIM: Akademik Takvim bileşenini içeri aktar
import AkademikTakvim from "./sayfalar/AkademikTakvim"; 

// ⭐ 1. ADIM: Yeni Ücret Hesaplama Bileşenini içeri aktar
import UcretHesaplama from "./sayfalar/UcretHesaplama"; 

// 🔥🔥🔥 KULÜP MODÜLÜ IMPORTLARI
import Kulupler from "./sayfalar/Kulupler";
import KulupDetay from "./sayfalar/KulupDetay"; 

// 🔥🔥🔥 YENİ SAYFA: Etkinlikler Modülü Importu 🔥🔥🔥
import Etkinlikler from "./sayfalar/Etkinlikler";
// 🔥🔥 YENİ IMPORT: Başkan Etkinlik Yönetimi 🔥🔥
import AdminEtkinlikler from "./sayfalar/AdminEtkinlikler"; 

// 🔥🔥🔥 YENİ SAYFALAR: Admin Kulüp Yönetimi Importları 🔥🔥🔥
import AdminKulupler from "./sayfalar/AdminKulupler";
import AdminKulupOnay from "./sayfalar/AdminKulupOnay"; 

// 🔥🔥🔥 YENİ SAYFALAR: MESAJ YÖNETİMİ İMPORTLARI
import OgrenciGelenKutusu from "./sayfalar/OgrenciGelenKutusu";
import AdminGelenMesajlar from "./sayfalar/AdminGelenMesajlar"; 
import AdminTopluMesaj from "./sayfalar/AdminTopluMesaj";       

// 🔥🔥🔥 YENİ SAYFA: ÖĞRENCİ ÜYELİKLERİM İMPORTU 🔥🔥🔥
import OgrenciUyeliklerim from "./sayfalar/OgrenciUyeliklerim"; 

// 🔥🔥🔥 YENİ SAYFA: BAŞKAN ÜYE YÖNETİMİ İMPORTU 🔥🔥🔥
import AdminUyeler from "./sayfalar/AdminUyeler"; 

// 🔥🔥🔥 YENİ SİMÜLASYON IMPORTLARI 🔥🔥🔥
import KulupSimulasyon from "./sayfalar/KulupSimulasyon"; 
import SimulasyonSonuc from "./sayfalar/SimulasyonSonuc"; 

// 🔥🔥🔥 SUPER ADMİN HESAP YÖNETİMİ IMPORTU 🔥🔥🔥
import ClubUserManagement from "./sayfalar/ClubUserManagement"; 


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🎓 Genel */}
        <Route path="/" element={<AnaSayfa />} />
        
        {/* ⭐⭐ YENİ ROTA: Akademik Takvim Rotası */}
        <Route path="/akademik/takvim" element={<AkademikTakvim />} />

        {/* ⭐⭐ YENİ ROTA: Ücret Hesaplama Rotası (Hata giderildi) */}
        <Route path="/ucret/hesaplama" element={<UcretHesaplama />} />

        {/* 🔥🔥🔥 KULÜPLER MODÜLÜ ROTASI (ÖĞRENCİ) */}
        <Route path="/kulupler" element={<Kulupler />} /> 
        <Route path="/kulupler/:id" element={<KulupDetay />} /> 
        <Route path="/etkinlikler" element={<Etkinlikler />} /> // Öğrenci Etkinlik Listesi

        {/* 🔥🔥🔥 YENİ SİMÜLASYON ROTASI 🔥🔥🔥 */}
        <Route path="/kulupler/simulasyon" element={<KulupSimulasyon />} />
        <Route path="/kulupler/tavsiye" element={<SimulasyonSonuc />} /> // Sonuç sayfası

        {/* 👨‍🎓 Öğrenci */}
        <Route path="/ogrenci/giris" element={<OgrenciGiris />} />
        <Route path="/ogrenci/kayit" element={<OgrenciKayit />} />
        <Route path="/ogrenci/panel" element={<OgrenciPanel />} />
        <Route path="/ogrenci/ring-saatleri" element={<RingSaatleri />} />

        {/* 🔥🔥🔥 YENİ ROTA: ÖĞRENCİ GELEN KUTUSU ROTASI */}
        <Route path="/ogrenci/gelen-kutusu" element={<OgrenciGelenKutusu />} />
        
        {/* 🔥🔥🔥 YENİ ROTA: ÖĞRENCİ ÜYELİKLERİM ROTASI 🔥🔥🔥 */}
        <Route path="/ogrenci/uyeliklerim" element={<OgrenciUyeliklerim />} /> 

        {/* 🛍️ Mağaza */}
        <Route path="/ogrenci/magaza" element={<KampusMagaza />} />

        {/* 🗺️ Kat Planları */}
        <Route path="/ogrenci/kat-planlari" element={<KatPlanlari />} />

        {/* 🧑‍💼 Admin (Süper Admin & Başkan) */}
        <Route path="/admin/giris" element={<AdminGiris />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
        <Route path="/admin/onay" element={<AdminOnay />} />
        <Route path="/admin/ringler" element={<AdminRingPanel />} />
        {/* 🔥🔥🔥 KULÜP YÖNETİM ROTLARI */}
        <Route path="/admin/kulupler" element={<AdminKulupler />} /> 
        <Route path="/admin/kulup-onay" element={<AdminKulupOnay />} /> 
        
        {/* 🔥🔥 YENİ BAŞKAN ETKİNLİK YÖNETİM ROTASI 🔥🔥 */}
        <Route path="/admin/etkinlikler" element={<AdminEtkinlikler />} />
        
        {/* 🔥🔥🔥 YENİ BAŞKAN MESAJ YÖNETİM ROTLARI */}
        <Route path="/admin/gelen-mesajlar" element={<AdminGelenMesajlar />} />
        <Route path="/admin/toplu-mesaj" element={<AdminTopluMesaj />} />         

        {/* 🔥🔥🔥 YENİ BAŞKAN ÜYE YÖNETİM ROTASI 🔥🔥🔥 */}
        <Route path="/admin/uyeler" element={<AdminUyeler />} /> 

        {/* 🔥🔥🔥 KRİTİK ROTA: KULÜP BAŞKANI HESAP YÖNETİMİ (SÜPER ADMİN) 🔥🔥🔥 */}
        <Route path="/admin/baskan-hesaplari" element={<ClubUserManagement />} />

      </Routes>
    </BrowserRouter>
  );
}