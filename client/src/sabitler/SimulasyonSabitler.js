// ============================================================
// /src/sabitler/SimulasyonSabitler.js
// 8 AŞAMALI YENİ SORU SETİ (HEPSİ 4 KISA ŞIKLI)
// ============================================================

// 1. KULÜP KATEGORİLERİ VE ID'LERİ (Aynı kalır)
export const KULUPLER = [
    { id: 1, ad: "BİLİŞİM KULÜBÜ", tur: "Teknoloji", puanKategori: "AKADEMİ_TEK" },
    { id: 2, ad: "HUKUK KULÜBÜ", tur: "Akademik", puanKategori: "AKADEMİ_KARİYER" },
    { id: 3, ad: "AKIL OYUNLARI KULÜBÜ", tur: "Zeka", puanKategori: "SANAT_MANTIK" },
    { id: 4, ad: "DOĞUŞTAN FENERBAHÇELİLER", tur: "Taraftar", puanKategori: "SPOR_SOSYAL" },
    { id: 5, ad: "GASTROSANAT KULÜBÜ", tur: "Yaratıcılık", puanKategori: "SANAT_YEMEK" },
    { id: 6, ad: "BİYOTEKNOLOJİ VE İNOVASYON KULÜBÜ", tur: "Bilim", puanKategori: "AKADEMİ_TEK" },
    { id: 9, ad: "KARİYER VE GELİŞİM KULÜBÜ", tur: "Kariyer", puanKategori: "AKADEMİ_KARİYER" },
    { id: 11, ad: "DOĞUŞTAN GÖNÜLLÜLER KULÜBÜ", tur: "Sosyal Sorumluluk", puanKategori: "SOSYAL_GÖNÜLLÜ" },
    { id: 12, ad: "DOĞA SPORLARI KULÜBÜ", tur: "Aksiyon", puanKategori: "SPOR_AKSIYON" },
    { id: 13, ad: "DOĞUŞTAN BEŞİKTAŞLILAR", tur: "Taraftar", puanKategori: "SPOR_SOSYAL" },
    { id: 14, ad: "DOĞUŞTAN GALATASARAYLILAR", tur: "Taraftar", puanKategori: "SPOR_SOSYAL" },
];

// 2. PUAN KATEGORİLERİ (Aynı kalır)
export const PUAN_KATEGORILERI = {
    AKADEMİ_TEK: 0,
    AKADEMİ_KARİYER: 0,
    SANAT_MANTIK: 0,
    SANAT_YEMEK: 0,
    SPOR_SOSYAL: 0,
    SPOR_AKSIYON: 0,
    SOSYAL_GÖNÜLLÜ: 0,
};

// 3. SORU AKIŞI (8 Yeni, 4 Şıklı Soru)
export const SORU_AKISI = [
    {
        id: 1,
        soru: "Yeni beceriler kazanmak için motivasyonun nedir?",
        cevaplar: [
            { metin: "Kariyerime yatırım yapmak.", puanlama: { AKADEMİ_KARİYER: 5, AKADEMİ_TEK: 3 } },
            { metin: "Kişisel tatmin ve hobi.", puanlama: { SANAT_MANTIK: 3, SANAT_YEMEK: 3 } },
            { metin: "Topluma fayda sağlamak.", puanlama: { SOSYAL_GÖNÜLLÜ: 4 } },
            { metin: "Rekabet etmek ve enerji atmak.", puanlama: { SPOR_SOSYAL: 3, SPOR_AKSIYON: 3 } },
        ],
    },
    {
        id: 2,
        soru: "Haftalık ne kadar zaman ayırabilirsin?",
        cevaplar: [
            { metin: "3+ saat, aktif rol alırım.", puanlama: { AKADEMİ_TEK: 3, SOSYAL_GÖNÜLLÜ: 3, SPOR_AKSIYON: 3 } },
            { metin: "1-2 saat, düzenli katılım.", puanlama: { AKADEMİ_KARİYER: 2, SANAT_YEMEK: 2, SPOR_SOSYAL: 2 } },
            { metin: "Sadece ara sıra, sosyal buluşmalar.", puanlama: { SPOR_SOSYAL: 4 } },
            { metin: "Çok az, sadece etkinlik takibi.", puanlama: { SOSYAL_GÖNÜLLÜ: 1 } },
        ],
    },
    {
        id: 3,
        soru: "Hangi alanda problem çözmek seni heyecanlandırır?",
        cevaplar: [
            { metin: "Mantık, kodlama ve bilim.", puanlama: { AKADEMİ_TEK: 5, SANAT_MANTIK: 3 } },
            { metin: "Hukuki ve etik ikilemler.", puanlama: { AKADEMİ_KARİYER: 5 } },
            { metin: "Sokaktaki sosyal sorunlar.", puanlama: { SOSYAL_GÖNÜLLÜ: 4 } },
            { metin: "Fiziksel ve sportif mücadeleler.", puanlama: { SPOR_AKSIYON: 4, SPOR_SOSYAL: 2 } },
        ],
    },
    {
        id: 4,
        soru: "Yeni insanlarla nasıl tanışmayı tercih edersin?",
        cevaplar: [
            { metin: "Beceriler üzerine çalışırken.", puanlama: { AKADEMİ_TEK: 3, SANAT_YEMEK: 3 } },
            { metin: "Takım veya spor etkinliklerinde.", puanlama: { SPOR_SOSYAL: 5, SPOR_AKSIYON: 3 } },
            { metin: "Seminer ve panellerde.", puanlama: { AKADEMİ_KARİYER: 3 } },
            { metin: "Gönüllülük projelerinde sahada.", puanlama: { SOSYAL_GÖNÜLLÜ: 3 } },
        ],
    },
    {
        id: 5,
        soru: "Kariyer hedefin nedir?",
        cevaplar: [
            { metin: "Teknolojik liderlik.", puanlama: { AKADEMİ_TEK: 5 } },
            { metin: "Hukuk veya şirket yönetimi.", puanlama: { AKADEMİ_KARİYER: 5 } },
            { metin: "Sanatsal veya yaratıcı bir meslek.", puanlama: { SANAT_YEMEK: 4, SANAT_MANTIK: 3 } },
            { metin: "Sosyal sorumluluk alanında ilerleme.", puanlama: { SOSYAL_GÖNÜLLÜ: 3 } },
        ],
    },
    {
        id: 6,
        soru: "Boş zamanlarında ne yaparsın?",
        cevaplar: [
            { metin: "Stratejik oyunlar oynarım.", puanlama: { SANAT_MANTIK: 5 } },
            { metin: "Yeni yemek tarifleri denerim.", puanlama: { SANAT_YEMEK: 5 } },
            { metin: "Doğada vakit geçiririm.", puanlama: { SPOR_AKSIYON: 4 } },
            { metin: "Maç izlerim/spor yaparım.", puanlama: { SPOR_SOSYAL: 4 } },
        ],
    },
    {
        id: 7,
        soru: "Kulüp etkinliklerinde rolün ne olsun?",
        cevaplar: [
            { metin: "Organize eden (Liderlik).", puanlama: { SOSYAL_GÖNÜLLÜ: 4, AKADEMİ_KARİYER: 2 } },
            { metin: "Katılımcı ve öğrenen.", puanlama: { AKADEMİ_TEK: 3, SANAT_YEMEK: 3 } },
            { metin: "Rekabet eden (Oyuncu).", puanlama: { SPOR_SOSYAL: 3, SPOR_AKSIYON: 3 } },
            { metin: "Arka planda teknik destek.", puanlama: { AKADEMİ_TEK: 2 } },
        ],
    },
    {
        id: 8,
        soru: "Hangi ortam sana daha çekici geliyor?",
        cevaplar: [
            { metin: "Konferans salonları, amfiler.", puanlama: { AKADEMİ_KARİYER: 3 } },
            { metin: "Açık hava, dağlar, orman.", puanlama: { SPOR_AKSIYON: 5 } },
            { metin: "Sosyal tesisler, kantinler.", puanlama: { SPOR_SOSYAL: 3 } },
            { metin: "Mutfaklar, atölyeler.", puanlama: { SANAT_YEMEK: 4 } },
        ],
    },
];

// 4. SONUÇ TAVSİYE EŞLEŞTİRMESİ (Aynı kalır)
export const SONUC_ESLESTIRME = {
    AKADEMİ_TEK: [1, 6],        
    AKADEMİ_KARİYER: [2, 9],    
    SANAT_MANTIK: [3],          
    SANAT_YEMEK: [5],           
    SPOR_SOSYAL: [4, 13, 14],   
    SPOR_AKSIYON: [12],         
    SOSYAL_GÖNÜLLÜ: [11],       
};