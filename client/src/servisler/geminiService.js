// ************************************************************
// ⭐⭐ VIZIA KAMPÜS PORTAL ASİSTANI - NİHAİ VERİ SETİ ⭐⭐
// Robot, hem mağaza hem de takvim verilerini bilir.
// ************************************************************

// 1. MAĞAZA ÜRÜN VERİLERİ (Aynı kalır)
const PRODUCTS = [
    { id: 1, name: "Vizia Logolu Sweatshirt", price: 450, category: "Giyim", renk: "Kırmızı", description: "Oversize kesim, kalın kumaş, sırtta üniversite logosu baskılı.", colors: ["Kırmızı", "Beyaz", "Siyah"], sizes: ["S", "M", "L", "XL"] },
    { id: 2, name: "Kampüs T-Shirt (Beyaz)", price: 200, category: "Giyim", renk: "Beyaz", description: "Laptop ve kitaplar için geniş hacimli, dayanıklı kanvas omuz çantası.", colors: ["Ham Bez", "Siyah"], sizes: ["Standart"] },
    { id: 3, name: "Çelik Termos", price: 450, category: "İçecek", renk: "Kırmızı", description: "Ders aralarında kahvenizi 6 saat sıcak tutan çift katmanlı termos.", colors: ["Kırmızı", "Gümüş"], sizes: ["500ml"] },
    { id: 4, name: "Powerbank", price: 850, category: "Teknoloji", renk: "Gri", description: "Pil Gücü (mAh) : 10000 mAh", colors: ["Gri"], sizes: ["Siyah Taşınabilir Şarj Aleti"] },
    { id: 5, name: "Akademik Ajanda", price: 180, category: "Kırtasiye", renk: "Kırmızı", description: "Haftalık planlayıcı, sert kapak ve lastikli akademik ajanda.", colors: ["Kırmızı"], sizes: ["A5"] },
    { id: 6, name: "Logolu Şapka", price: 200, category: "Aksesuar", renk: "Kırmızı", description: "Nakış işlemeli, ayarlanabilir pamuklu beyzbol şapkası.", colors: ["Kırmızı", "Beyaz"], sizes: ["Standart"] },
    { id: 7, name: "Kolej Ceket", price: 1200, category: "Giyim", renk: "Kırmızı", description: "Kolej stili, deri kollu, armalı klasik kampüs ceketi.", colors: ["Kırmızı-Beyaz"], sizes: ["S", "M", "L", "XL"] },
    { id: 8, name: "Kablosuz Kulaklık", price: 950, category: "Teknoloji", renk: "Beyaz", description: "Kütüphane kullanımına uygun, gürültü önleyici özellikli kulaklık.", colors: ["Beyaz"], sizes: ["Standart"] }
];

// 2. AKADEMİK TAKVİM VERİLERİ (Aynı kalır)
const takvimVerisi = [
    { tarih: '10-30 Temmuz 2025', olay: 'Kurum Dışı Yatay Geçiş (Başarı Ortalaması ile) Başvuru Tarihleri', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '06 Ağustos 2025', olay: 'Kurum Dışı Yatay Geçiş (Başarı Ortalaması ile) Başvuru SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz' },
    { tarih: '07-08 Ağustos 2025', olay: 'Kurum Dışı Yatay Geçişe Hak Kazanan Asil Öğrencilerin KAYIT TARİHLERİ', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '01-15 Ağustos 2025', olay: 'Merkezi Yerleştirme Puanına Göre Yatay Geçiş Başvuru Tarihleri (Kurum İçi Ek Madde-1 Başvuruları Dahil)', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '12 Ağustos 2025', olay: 'Kurum Dışı Yatay Geçişe Yedek Listeden Hak Kazanan Öğrencilerin KAYIT TARİHİ', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '21 Ağustos 2025', olay: 'Merkezi Yerleştirme Puanına Göre Başvuru SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz' },
    { tarih: '25-26 Ağustos 2025', olay: 'Merkezi Yerleştirme Puanına Göre Geçiş Hakkı Kazanan Öğrencilerin KAYIT TARİHLERİ', tur: 'Kayıt', donem: 'Güz' },
    { tarih: 'ÖSYM', olay: 'ÖSYM Merkezi Yerleştirme ile Yeni Kazanan Öğrenciler İçin Kayıt Tarihleri', tur: 'Kayıt', donem: 'Güz' },
    { tarih: 'ÖSYM', olay: 'İngilizce Hazırlık Okuyacak Öğrenciler İçin Yabancı Dil Seviye Tespit Sınavı', tur: 'Sınav', donem: 'Güz' },
    { tarih: '08-10 Eylül 2025', olay: 'Başarı Ortalaması ile Kurum İçi Yatay Geçiş Başvuru Tarihleri', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '10-12 Eylül 2025', olay: 'Çift Anadal ve Yandal Programlarına Başvuru Tarihleri', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '15 Eylül 2025', olay: 'Kurum İçi Yatay Geçişe Hak Kazanan Asil SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz' },
    { tarih: '17 Eylül 2025', olay: 'Çift Anadal ve Yandal Programlarına Başvuru SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz' },
    { tarih: '16-17 Eylül 2025', olay: 'Kurum İçi Yatay Geçiş Asil Öğrencilerin KAYIT TARİHLERİ (Dilekçe ile)', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '18-19 Eylül 2025', olay: 'Çift Anadal ve Yandal Kabul Edilen Asil Öğrencilerin KAYIT TARİHLERİ (Dilekçe ile)', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '18 Eylül 2025', olay: 'Kurum İçi Yatay Geçişe Hak Kazanan Yedek Öğrencilerin SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz' },
    { tarih: '19 Eylül 2025', olay: 'Kurum İçi Yatay Geçişe Hak Kazanan Yedek Öğrencilerin KAYIT TARİHİ (Dilekçe ile)', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '23 Eylül 2025', olay: 'Çift Anadal ve Yandal Yedek Öğrencilerin KAYIT TARİHİ (Dilekçe ile)', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '15 Eylül 2025', olay: 'Doğuş Üniversitesi Yeterlik Sınavı (DÜİYES)', tur: 'Sınav', donem: 'Güz' },
    { tarih: '19 Eylül 2025', olay: 'DÜİYES SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz' },
    { tarih: '16-19 Eylül 2025', olay: 'Ders Kayıt Tarihleri', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '22 Eylül 2025', olay: 'Güz Dönemi Derslerinin Başlaması (Açılış Töreni-Oryantasyon Programı)', tur: 'Ders', donem: 'Güz' },
    { tarih: '22 Eylül 2025', olay: 'Yeni Kazanan Öğrencilerin İntibak ve Muafiyet Talepleri İçin Başvuru Tarihi', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '30 Eylül 2025', olay: 'Türkçe Bölümler ve MYO İngilizce Dersi Muafiyet Sınavı', tur: 'Sınav', donem: 'Güz' },
    { tarih: '30 Eylül - 2 Ekim 2025', olay: 'Güz Dönemi Ders Ekleme-Bırakma Tarihleri', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '10 Kasım 2025', olay: 'Atatürk\'ü Anma Günü', tur: 'Tatil', donem: 'Güz' },
    { tarih: '3-9 Kasım 2025', olay: 'Ön Lisans Güz Dönemi Ara Sınav Tarihleri', tur: 'Sınav', donem: 'Güz' },
    { tarih: '3-16 Kasım 2025', olay: 'Lisans Güz Dönemi Ara Sınav Tarihleri', tur: 'Sınav', donem: 'Güz' },
    { tarih: '20 Kasım 2025', olay: 'Ara Sınav Notlarının Sisteme Girişi İçin Son Tarih (Sistem Kapatılacaktır)', tur: 'Sınav', donem: 'Güz' },
    { tarih: '24 Kasım 2025', olay: 'Ara Sınav Mazeret Başvuruları İçin Son Tarih', tur: 'Sınav', donem: 'Güz' },
    { tarih: '26 Kasım 2025', olay: 'Ara Sınav Mazeret Başvuru Sonucu İlan Tarihi', tur: 'İlan', donem: 'Güz' },
    { tarih: '1-3 Aralık 2025', olay: 'Ara Sınav Mazeret Tarihleri', tur: 'Sınav', donem: 'Güz' },
    { tarih: '5 Aralık 2025', olay: 'Ara Sınav Mazeret Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Güz' },
    { tarih: '26 Aralık 2025', olay: 'Güz Yarıyılı Derslerinin Sonu', tur: 'Ders', donem: 'Güz' },
    { tarih: '26 Aralık 2025', olay: 'Dönem İçi Notların (Kısa Sınav-Ödev-Proje) Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Güz' },
    { tarih: '26 Aralık 2025', olay: 'Devamsızlıkların Sisteme Girişi İçin Son Tarih', tur: 'Ders', donem: 'Güz' },
    { tarih: '29 Aralık 2025 - 11 Ocak 2026', olay: 'Güz Dönemi Final Sınavı Tarihleri', tur: 'Sınav', donem: 'Güz' },
    { tarih: '12 Ocak 2026', olay: 'Bitirme Projesi / Yönlendirilmiş Çalışma Ödevlerinin Son Teslim Günü', tur: 'Sınav', donem: 'Güz' },
    { tarih: '12-13 Ocak 2026', olay: 'Bitirme Projesi / Yönlendirilmiş Çalışma Ödevlerinin Sunumu', tur: 'Sınav', donem: 'Güz' },
    { tarih: '13 Ocak 2026', olay: 'Final Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Güz' },
    { tarih: '19-27 Ocak 2026', olay: 'Güz Dönemi Bütünleme Sınavı Tarihleri', tur: 'Sınav', donem: 'Güz' },
    { tarih: '26 Ocak 2026', olay: 'Doğuş Üniversitesi Yeterlik Sınavı (DÜİYES)', tur: 'Sınav', donem: 'Güz' },
    { tarih: '30 Ocak 2026', olay: 'DÜİYES SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz' },
    { tarih: '29 Ocak 2026', olay: 'Bütünleme Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Güz' },
    { tarih: '30 Ocak 2026', olay: 'Tek Ders Sınavı Başvuruları için Son Tarih', tur: 'Sınav', donem: 'Güz' },
    { tarih: '3 Şubat 2026', olay: 'Tek Ders Sınavı Değerlendirme Sonucu İlan Tarihi', tur: 'İlan', donem: 'Güz' },
    { tarih: '4 Şubat 2026', olay: 'Tek Ders Sınavı Tarihi', tur: 'Sınav', donem: 'Güz' },
    { tarih: '5 Şubat 2026', olay: 'Tek Ders Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Güz' },
    { tarih: '30 Ocak 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Ek Sınav Hakkı Başvurusu Son Tarihi', tur: 'Kayıt', donem: 'Güz' },
    { tarih: '2 Şubat 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Sınav Başvuru Değerlendirme Sonucu İlanı', tur: 'İlan', donem: 'Güz' },
    { tarih: '4-5 Şubat 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Ek Sınav Tarihleri', tur: 'Sınav', donem: 'Güz' },
    { tarih: '5 Şubat 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Sınav Notlarının Sisteme Girişi Son Tarihi', tur: 'Sınav', donem: 'Güz' },
    
    // --- BAHAR DÖNEMİ ---
    { tarih: '10-13 Şubat 2026', olay: 'Bahar Dönemi Ders Kayıt Tarihleri', tur: 'Kayıt', donem: 'Bahar' },
    { tarih: '16 Şubat 2026', olay: 'Bahar Dönemi Derslerinin Başlaması', tur: 'Ders', donem: 'Bahar' },
    { tarih: '26 Ocak-06 Şubat 2026', olay: 'Kurum Dışı/İçi Yatay Geçiş Başvuru Tarihleri (Ek Madde-1 Dahil)', tur: 'Kayıt', donem: 'Bahar' },
    { tarih: '28 Ocak-06 Şubat 2026', olay: 'Çift Anadal ve Yandal Başvuru Tarihleri', tur: 'Kayıt', donem: 'Bahar' },
    { tarih: '17 Şubat 2026', olay: 'Kurum Dışı/İçi Yatay Geçiş Başvuru SONUÇLARININ İLANI', tur: 'İlan', donem: 'Bahar' },
    { tarih: '18 Şubat 2026', olay: 'Çift Anadal ve Yandal Başvuru SONUÇLARININ İLANI', tur: 'İlan', donem: 'Bahar' },
    { tarih: '18-19 Şubat 2026', olay: 'Kurum Dışı/İçi Yatay Geçişe Hak Kazanan Asil Öğrencilerin KAYIT TARİHLERİ', tur: 'Kayıt', donem: 'Bahar' },
    { tarih: '19-20 Şubat 2026', olay: 'Çift Anadal ve Yandal Kabul Edilen Asil Öğrencilerin KAYIT TARİHLERİ (Dilekçe İle)', tur: 'Kayıt', donem: 'Bahar' },
    { tarih: '23 Şubat 2026', olay: 'Yedek Listeden Hak Kazanan Öğrencilerin KAYIT TARİHİ', tur: 'Kayıt', donem: 'Bahar' },
    { tarih: '25 Şubat 2026', olay: 'İngilizce Dersi Muafiyet Sınavı (Yeni Kayıt Yaptıranlar İçin)', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '24-26 Şubat 2026', olay: 'Bahar Dönemi Ders Ekleme-Bırakma Tarihleri', tur: 'Kayıt', donem: 'Bahar' },
    { tarih: '30 Mart - 11 Nisan 2026', olay: 'Bahar Dönemi Ara Sınav Tarihleri', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '15 Nisan 2026', olay: 'Ara Sınav Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '20-22 Nisan 2026', olay: 'Ara Sınav Mazeret Sınavı Tarihleri', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '25 Mayıs 2026', olay: 'Bahar Yarıyılı Derslerinin Sonu', tur: 'Ders', donem: 'Bahar' },
    { tarih: '25 Mayıs 2026', olay: 'Dönem İçi Notların Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '01-14 Haziran 2026', olay: 'Bahar Yarıyılı Final Sınav Tarihleri', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '16 Haziran 2026', olay: 'Bitirme Projesi / Yönlendirilmiş Çalışma Ödevlerinin Son Teslim Tarihi', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '17 Haziran 2026', olay: 'Final Sınav Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '22-30 Haziran 2026', olay: 'Bütünleme Sınavı Tarihleri', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '22 Haziran 2026', olay: 'Doğuş Üniversitesi İngilizce Yeterlik Sınavı (DÜİYES)', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '1 Temmuz 2026', olay: 'Bütünleme Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '2 Temmuz 2026', olay: 'Tek Ders Sınavı Başvurusu için Son Tarih', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '6-7 Temmuz 2026', olay: 'Tek Ders Sınavı Tarihi', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '7 Temmuz 2026', olay: 'Tek Ders Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '1 Temmuz 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Ek Sınav Hakkı Başvurusu Son Tarihi', tur: 'Kayıt', donem: 'Bahar' },
    { tarih: '2 Temmuz 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Sınav Başvuru Değerlendirme Sonucu İlanı', tur: 'İlan', donem: 'Bahar' },
    { tarih: '6-7 Temmuz 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Sınav Tarihleri', tur: 'Sınav', donem: 'Bahar' },
    { tarih: '7 Temmuz 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Sınav Notlarının Sisteme Girişi Son Tarihi', tur: 'Sınav', donem: 'Bahar' },

    // --- RESMİ TATİLLER VE YAZ OKULU ---
    { tarih: '28 Ekim 2025 (½ Gün)', olay: 'Cumhuriyet Bayramı', tur: 'Tatil', donem: 'Güz' },
    { tarih: '29 Ekim 2025', olay: 'Cumhuriyet Bayramı', tur: 'Tatil', donem: 'Güz' },
    { tarih: '1 Ocak 2026', olay: 'Yılbaşı', tur: 'Tatil', donem: 'Güz' },
    { tarih: '19 Mart 2026 (Arife ½ Gün)', olay: 'Ramazan Bayramı', tur: 'Tatil', donem: 'Bahar' },
    { tarih: '20-22 Mart 2026', olay: 'Ramazan Bayramı', tur: 'Tatil', donem: 'Bahar' },
    { tarih: '23 Nisan 2026', olay: 'Ulusal Egemenlik ve Çocuk Bayramı', tur: 'Tatil', donem: 'Bahar' },
    { tarih: '1 Mayıs 2026', olay: 'Emek ve Dayanışma Günü', tur: 'Tatil', donem: 'Bahar' },
    { tarih: '19 Mayıs 2026', olay: 'Atatürk’ü Anma Gençlik ve Spor Bayramı', tur: 'Tatil', donem: 'Bahar' },
    { tarih: '27-30 Mayıs 2026', olay: 'Kurban Bayramı (Arife dahil)', tur: 'Tatil', donem: 'Bahar' },
    { tarih: '15 Temmuz 2026', olay: 'Demokrasi ve Milli Birlik Günü', tur: 'Tatil', donem: 'Yaz' },
    { tarih: '30 Ağustos 2026', olay: 'Zafer Bayramı', tur: 'Tatil', donem: 'Yaz' },
    
    // Yaz Öğretimi Akademik İşlemler
    { tarih: '7-9 Temmuz 2026', olay: 'Yaz Dönemi Ders Seçimi ve Mali Kayıt', tur: 'Kayıt', donem: 'Yaz' },
    { tarih: '10 Temmuz 2026', olay: 'Yaz Döneminde Açılan Derslerin İlanı', tur: 'İlan', donem: 'Yaz' },
    { tarih: '13 Temmuz 2026', olay: 'Yaz Dönemi Derslerinin Başlangıcı', tur: 'Ders', donem: 'Yaz' },
    { tarih: '16-17 Temmuz 2026', olay: 'Açılan Derslerden Yeni Ders Seçme ve Açılamayan Derslerin Yerine Ders Alma', tur: 'Kayıt', donem: 'Yaz' },
    { tarih: '27 Temmuz - 1 Ağustos 2026', olay: 'Yaz Dönemi Ara Sınav Tarihleri', tur: 'Sınav', donem: 'Yaz' },
    { tarih: '3 Ağustos 2026', olay: 'Ara Sınav Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Yaz' },
    { tarih: '22 Ağustos 2026', olay: 'Yaz Dönemi Derslerinin Son Günü', tur: 'Ders', donem: 'Yaz' },
    { tarih: '31 Ağustos - 5 Eylül 2026', olay: 'Yaz Dönemi Final Sınavı Tarihleri', tur: 'Sınav', donem: 'Yaz' },
    { tarih: '13 Eylül 2026', olay: 'Bütünleme Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Yaz' },
    { tarih: '14 Eylül 2026', olay: 'Tek Ders Sınavı Başvuruları İçin Son Tarih', tur: 'Sınav', donem: 'Yaz' },
];


// UTILITY FONKSİYONLARI
const aramaMetniniTemizle = (text) => {
    // Türkçe karakterleri (ğ, ç, ş, ı, ö, ü) normalleştirir ve küçük harfe çevirir.
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

const urunArama = (query) => {
    const temizQuery = aramaMetniniTemizle(query);
    
    // Sorgudaki önemli kelimeleri ayır (ör: 'kırmızı sweatshirt' -> ['kırmızı', 'sweatshirt'])
    const queryKelimeleri = temizQuery.split(/\s+/).filter(k => k.length > 2);

    const eslesenUrun = PRODUCTS.find(p => 
        queryKelimeleri.some(kelime => aramaMetniniTemizle(p.name).includes(kelime))
    );
    
    if (eslesenUrun) {
        return `${eslesenUrun.name} ürünümüzün fiyatı ${eslesenUrun.price.toLocaleString('tr-TR')} ₺'dir. Ürün Özellikleri: ${eslesenUrun.description}. Mevcut renkler: ${eslesenUrun.colors.join(', ')}. Mevcut bedenler: ${eslesenUrun.sizes.join(', ')}.`;
    }
    return null;
};

// 🔥 GÜÇLENDİRİLMİŞ TAKVİM ARAMA FONKSİYONU
const takvimArama = (query) => {
    const temizQuery = aramaMetniniTemizle(query);
    
    // 'Tarihi' veya 'ne zaman' gibi gereksiz kelimeleri atarak sorguyu temizle
    const temizlenmisSorgu = temizQuery.replace(/(tarihi|ne zaman|hangi gün)/g, '').trim();

    // Sorguyu kelimelere ayır (2 karakterden kısa kelimeleri at)
    const queryKelimeleri = temizlenmisSorgu.split(/\s+/).filter(k => k.length > 2);
    
    if (queryKelimeleri.length === 0) return null;

    let eslesenOlaylar = [];

    // Her bir akademik olayı kontrol et
    for (const olay of takvimVerisi) {
        const temizOlay = aramaMetniniTemizle(olay.olay);
        
        // Olayın ne kadar eşleştiğini say
        const eslesmeSayisi = queryKelimeleri.filter(kelime => temizOlay.includes(kelime)).length;

        // 🔥 KRİTİK: Sorgudaki kelimelerin en az yarısı eşleşirse, olayı dahil et
        if (eslesmeSayisi >= Math.ceil(queryKelimeleri.length / 2)) {
             eslesenOlaylar.push(olay);
        }
    }

    eslesenOlaylar = eslesenOlaylar.slice(0, 5); // İlk 5 eşleşmeyi göster (Daha kapsamlı sonuç)

    if (eslesenOlaylar.length === 0) {
        return `Aradığınız kelimelerle ("${queryKelimeleri.join(', ')}") eşleşen yakın bir akademik olay bulunamadı. Lütfen tam olay adını veya dönemi belirtin.`;
    }

    let yanit = `Akademik Takvim'de bulduğum ilgili olaylar:\n`;
    eslesenOlaylar.forEach(olay => {
        yanit += `\n* **${olay.olay}** (${olay.donem} Dönemi)\n  Tarih: **${olay.tarih}**\n`;
    });
    yanit += "\nDaha fazla detay için lütfen akademik takvime bakınız.";
    
    return yanit;
};


export const sendMessageToGemini = async (messages) => {
    const sonKullaniciMesaji = messages[messages.length - 1]?.parts[0]?.text.toLowerCase();

    // 1 saniyelik gecikme simülasyonu
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    let responseText = "Üzgünüm, sorunuzu tam olarak anlayamadım. Mağaza ürünleri, kargo, iade veya Akademik Takvimdeki tarihler hakkında bir soru sorun.";

    if (!sonKullaniciMesaji) {
        return "Merhaba! Ben Vizia Kampüs Portal Asistanıyım. Size ürünler ve akademik tarihler hakkında yardımcı olabilirim. Nasıl yardımcı olabilirim?";
    }

    // ⭐ 1. ÖNCELİK: AKADEMİK TAKVİM VE TARİH ARAMA
    const takvimYaniti = takvimArama(sonKullaniciMesaji);
    if (takvimYaniti) return takvimYaniti;

    // ⭐ 2. ÖNCELİK: ÜRÜN BİLGİSİ (Spesifik Ürün Arama)
    const urunYaniti = urunArama(sonKullaniciMesaji);
    if (urunYaniti) return urunYaniti;


    // ⭐ 3. ÖNCELİK: GENEL MAĞAZA VE SİSTEM İŞLEVLERİ
    
    // Beden ve Ölçü
    if (sonKullaniciMesaji.includes("beden") || sonKullaniciMesaji.includes("ölçü")) {
        responseText = "Beden tablomuz standart Avrupa kesimlerine uygundur. Oversize kesim ürünler için bir beden küçük sipariş etmeniz önerilir.";
    } 
    
    // Kargo ve Teslimat
    else if (sonKullaniciMesaji.includes("kargo") || sonKullaniciMesaji.includes("teslimat")) {
        responseText = "Kargo ücreti 100 TL üzeri siparişlerde ücretsizdir. Teslimatlar 3-5 iş günü sürer.";
    } 
    
    // İade ve Değişim
    else if (sonKullaniciMesaji.includes("iade") || sonKullaniciMesaji.includes("değişim")) {
        responseText = "Kullanılmamış ürünler için iade ve değişim süresi faturasıyla birlikte 14 gündür.";
    }
    
    // Ödeme ve Fiyat (Katalog Uyarısı)
    else if (sonKullaniciMesaji.includes("ödeme") || sonKullaniciMesaji.includes("fiyat")) {
        responseText = "Mağazamız sadece katalog görüntüleme amaçlıdır ve satış yapılmamaktadır. Ödeme işlemi gerçekleştirilemez.";
    }
    
    // Eğer yukarıdaki filtrelerin hiçbirine takılmazsa, varsayılan cevabı döner.
    return responseText;
};