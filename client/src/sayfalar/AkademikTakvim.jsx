import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CalendarDaysIcon, FunnelIcon } from '@heroicons/react/24/outline'; 
import { AIChat } from './AIChat'; // ⭐ AIChat Doğru Konumdan İçeri Aktarıldı.

// ************************************************************
// ⭐⭐ VIZIA KAMPÜS AKADEMİK TAKVİM VERİLERİ (EKSİKSİZ VE HATASIZ) ⭐⭐
// ************************************************************
const akademikYil = "2025 - 2026";
const takvimVerisi = [
    // --- GÜZ DÖNEMİ (Tüm Metinler Tek Satıra İndirildi) ---
    { tarih: '10-30 Temmuz 2025', olay: 'Kurum Dışı Yatay Geçiş (Başarı Ortalaması ile) Başvuru Tarihleri', tur: 'Kayıt', donem: 'Güz', renk: 'bg-indigo-600' },
    { tarih: '06 Ağustos 2025', olay: 'Kurum Dışı Yatay Geçiş (Başarı Ortalaması ile) Başvuru SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz', renk: 'bg-green-700' },
    { tarih: '07-08 Ağustos 2025', olay: 'Kurum Dışı Yatay Geçişe Hak Kazanan Asil Öğrencilerin KAYIT TARİHLERİ', tur: 'Kayıt', donem: 'Güz', renk: 'bg-green-800' },
    { tarih: '01-15 Ağustos 2025', olay: 'Merkezi Yerleştirme Puanına Göre Yatay Geçiş Başvuru Tarihleri (Kurum İçi Ek Madde-1 Başvuruları Dahil)', tur: 'Kayıt', donem: 'Güz', renk: 'bg-indigo-700' },
    { tarih: '12 Ağustos 2025', olay: 'Kurum Dışı Yatay Geçişe Yedek Listeden Hak Kazanan Öğrencilerin KAYIT TARİHİ', tur: 'Kayıt', donem: 'Güz', renk: 'bg-green-600' },
    { tarih: '21 Ağustos 2025', olay: 'Merkezi Yerleştirme Puanına Göre Başvuru SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz', renk: 'bg-green-700' },
    { tarih: '25-26 Ağustos 2025', olay: 'Merkezi Yerleştirme Puanına Göre Geçiş Hakkı Kazanan Öğrencilerin KAYIT TARİHLERİ', tur: 'Kayıt', donem: 'Güz', renk: 'bg-green-800' },
    { tarih: 'ÖSYM', olay: 'ÖSYM Merkezi Yerleştirme ile Yeni Kazanan Öğrenciler İçin Kayıt Tarihleri', tur: 'Kayıt', donem: 'Güz', renk: 'bg-green-900' },
    { tarih: 'ÖSYM', olay: 'İngilizce Hazırlık Okuyacak Öğrenciler İçin Yabancı Dil Seviye Tespit Sınavı', tur: 'Sınav', donem: 'Güz', renk: 'bg-yellow-600' },
    { tarih: '08-10 Eylül 2025', olay: 'Başarı Ortalaması ile Kurum İçi Yatay Geçiş Başvuru Tarihleri', tur: 'Kayıt', donem: 'Güz', renk: 'bg-indigo-500' },
    { tarih: '10-12 Eylül 2025', olay: 'Çift Anadal ve Yandal Programlarına Başvuru Tarihleri', tur: 'Kayıt', donem: 'Güz', renk: 'bg-indigo-500' },
    { tarih: '15 Eylül 2025', olay: 'Kurum İçi Yatay Geçişe Hak Kazanan Asil SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz', renk: 'bg-green-700' },
    { tarih: '17 Eylül 2025', olay: 'Çift Anadal ve Yandal Programlarına Başvuru SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz', renk: 'bg-green-700' },
    { tarih: '16-17 Eylül 2025', olay: 'Kurum İçi Yatay Geçiş Asil Öğrencilerin KAYIT TARİHLERİ (Dilekçe ile)', tur: 'Kayıt', donem: 'Güz', renk: 'bg-green-800' },
    { tarih: '18-19 Eylül 2025', olay: 'Çift Anadal ve Yandal Kabul Edilen Asil Öğrencilerin KAYIT TARİHLERİ (Dilekçe ile)', tur: 'Kayıt', donem: 'Güz', renk: 'bg-green-800' },
    { tarih: '18 Eylül 2025', olay: 'Kurum İçi Yatay Geçişe Hak Kazanan Yedek Öğrencilerin SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz', renk: 'bg-yellow-500' },
    { tarih: '19 Eylül 2025', olay: 'Kurum İçi Yatay Geçişe Hak Kazanan Yedek Öğrencilerin KAYIT TARİHİ (Dilekçe ile)', tur: 'Kayıt', donem: 'Güz', renk: 'bg-orange-500' },
    { tarih: '23 Eylül 2025', olay: 'Çift Anadal ve Yandal Yedek Öğrencilerin KAYIT TARİHİ (Dilekçe ile)', tur: 'Kayıt', donem: 'Güz', renk: 'bg-orange-500' },
    { tarih: '15 Eylül 2025', olay: 'Doğuş Üniversitesi Yeterlik Sınavı (DÜİYES)', tur: 'Sınav', donem: 'Güz', renk: 'bg-yellow-600' },
    { tarih: '19 Eylül 2025', olay: 'DÜİYES SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz', renk: 'bg-green-700' },
    { tarih: '16-19 Eylül 2025', olay: 'Ders Kayıt Tarihleri', tur: 'Kayıt', donem: 'Güz', renk: 'bg-green-600' },
    { tarih: '22 Eylül 2025', olay: 'Güz Dönemi Derslerinin Başlaması (Açılış Töreni-Oryantasyon Programı)', tur: 'Ders', donem: 'Güz', renk: 'bg-red-600' },
    { tarih: '22 Eylül 2025', olay: 'Yeni Kazanan Öğrencilerin İntibak ve Muafiyet Talepleri İçin Başvuru Tarihi', tur: 'Kayıt', donem: 'Güz', renk: 'bg-indigo-500' },
    { tarih: '30 Eylül 2025', olay: 'Türkçe Bölümler ve MYO İngilizce Dersi Muafiyet Sınavı', tur: 'Sınav', donem: 'Güz', renk: 'bg-yellow-600' },
    { tarih: '30 Eylül - 2 Ekim 2025', olay: 'Güz Dönemi Ders Ekleme-Bırakma Tarihleri', tur: 'Kayıt', donem: 'Güz', renk: 'bg-orange-500' },
    { tarih: '10 Kasım 2025', olay: 'Atatürk\'ü Anma Günü', tur: 'Tatil', donem: 'Güz', renk: 'bg-blue-500' },
    { tarih: '3-9 Kasım 2025', olay: 'Ön Lisans Güz Dönemi Ara Sınav Tarihleri', tur: 'Sınav', donem: 'Güz', renk: 'bg-yellow-500' },
    { tarih: '3-16 Kasım 2025', olay: 'Lisans Güz Dönemi Ara Sınav Tarihleri', tur: 'Sınav', donem: 'Güz', renk: 'bg-yellow-500' },
    { tarih: '20 Kasım 2025', olay: 'Ara Sınav Notlarının Sisteme Girişi İçin Son Tarih (Sistem Kapatılacaktır)', tur: 'Sınav', donem: 'Güz', renk: 'bg-gray-600' },
    { tarih: '24 Kasım 2025', olay: 'Ara Sınav Mazeret Başvuruları İçin Son Tarih', tur: 'Sınav', donem: 'Güz', renk: 'bg-yellow-700' },
    { tarih: '26 Kasım 2025', olay: 'Ara Sınav Mazeret Başvuru Sonucu İlan Tarihi', tur: 'İlan', donem: 'Güz', renk: 'bg-green-700' },
    { tarih: '1-3 Aralık 2025', olay: 'Ara Sınav Mazeret Tarihleri', tur: 'Sınav', donem: 'Güz', renk: 'bg-yellow-800' },
    { tarih: '5 Aralık 2025', olay: 'Ara Sınav Mazeret Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Güz', renk: 'bg-gray-700' },
    { tarih: '26 Aralık 2025', olay: 'Güz Yarıyılı Derslerinin Sonu', tur: 'Ders', donem: 'Güz', renk: 'bg-red-800' },
    { tarih: '26 Aralık 2025', olay: 'Dönem İçi Notların (Kısa Sınav-Ödev-Proje) Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Güz', renk: 'bg-gray-600' },
    { tarih: '26 Aralık 2025', olay: 'Devamsızlıkların Sisteme Girişi İçin Son Tarih', tur: 'Ders', donem: 'Güz', renk: 'bg-gray-600' },
    { tarih: '29 Aralık 2025 - 11 Ocak 2026', olay: 'Güz Dönemi Final Sınavı Tarihleri', tur: 'Sınav', donem: 'Güz', renk: 'bg-yellow-900' },
    { tarih: '12 Ocak 2026', olay: 'Bitirme Projesi / Yönlendirilmiş Çalışma Ödevlerinin Son Teslim Günü', tur: 'Sınav', donem: 'Güz', renk: 'bg-orange-600' },
    { tarih: '12-13 Ocak 2026', olay: 'Bitirme Projesi / Yönlendirilmiş Çalışma Ödevlerinin Sunumu', tur: 'Sınav', donem: 'Güz', renk: 'bg-orange-600' },
    { tarih: '13 Ocak 2026', olay: 'Final Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Güz', renk: 'bg-gray-700' },
    { tarih: '19-27 Ocak 2026', olay: 'Güz Dönemi Bütünleme Sınavı Tarihleri', tur: 'Sınav', donem: 'Güz', renk: 'bg-yellow-900' },
    { tarih: '26 Ocak 2026', olay: 'Doğuş Üniversitesi Yeterlik Sınavı (DÜİYES)', tur: 'Sınav', donem: 'Güz', renk: 'bg-yellow-600' },
    { tarih: '30 Ocak 2026', olay: 'DÜİYES SONUÇLARININ İLANI', tur: 'İlan', donem: 'Güz', renk: 'bg-green-700' },
    { tarih: '29 Ocak 2026', olay: 'Bütünleme Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Güz', renk: 'bg-gray-700' },
    { tarih: '30 Ocak 2026', olay: 'Tek Ders Sınavı Başvuruları için Son Tarih', tur: 'Sınav', donem: 'Güz', renk: 'bg-orange-500' },
    { tarih: '3 Şubat 2026', olay: 'Tek Ders Sınavı Değerlendirme Sonucu İlan Tarihi', tur: 'İlan', donem: 'Güz', renk: 'bg-green-700' },
    { tarih: '4 Şubat 2026', olay: 'Tek Ders Sınavı Tarihi', tur: 'Sınav', donem: 'Güz', renk: 'bg-red-500' },
    { tarih: '5 Şubat 2026', olay: 'Tek Ders Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Güz', renk: 'bg-gray-700' },
    { tarih: '30 Ocak 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Ek Sınav Hakkı Başvurusu Son Tarihi', tur: 'Kayıt', donem: 'Güz', renk: 'bg-indigo-600' },
    { tarih: '2 Şubat 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Sınav Başvuru Değerlendirme Sonucu İlanı', tur: 'İlan', donem: 'Güz', renk: 'bg-green-700' },
    { tarih: '4-5 Şubat 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Ek Sınav Tarihleri', tur: 'Sınav', donem: 'Güz', renk: 'bg-yellow-600' },
    { tarih: '5 Şubat 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Sınav Notlarının Sisteme Girişi Son Tarihi', tur: 'Sınav', donem: 'Güz', renk: 'bg-gray-700' },
    
    // --- BAHAR DÖNEMİ (Tüm Metinler Tek Satıra İndirildi) ---
    { tarih: '10-13 Şubat 2026', olay: 'Bahar Dönemi Ders Kayıt Tarihleri', tur: 'Kayıt', donem: 'Bahar', renk: 'bg-green-600' },
    { tarih: '16 Şubat 2026', olay: 'Bahar Dönemi Derslerinin Başlaması', tur: 'Ders', donem: 'Bahar', renk: 'bg-red-600' },
    { tarih: '26 Ocak-06 Şubat 2026', olay: 'Kurum Dışı/İçi Yatay Geçiş Başvuru Tarihleri (Ek Madde-1 Dahil)', tur: 'Kayıt', donem: 'Bahar', renk: 'bg-indigo-700' },
    { tarih: '28 Ocak-06 Şubat 2026', olay: 'Çift Anadal ve Yandal Başvuru Tarihleri', tur: 'Kayıt', donem: 'Bahar', renk: 'bg-indigo-800' },
    { tarih: '17 Şubat 2026', olay: 'Kurum Dışı/İçi Yatay Geçiş Başvuru SONUÇLARININ İLANI', tur: 'İlan', donem: 'Bahar', renk: 'bg-green-700' },
    { tarih: '18 Şubat 2026', olay: 'Çift Anadal ve Yandal Başvuru SONUÇLARININ İLANI', tur: 'İlan', donem: 'Bahar', renk: 'bg-green-700' },
    { tarih: '18-19 Şubat 2026', olay: 'Kurum Dışı/İçi Yatay Geçişe Hak Kazanan Asil Öğrencilerin KAYIT TARİHLERİ', tur: 'Kayıt', donem: 'Bahar', renk: 'bg-green-800' },
    { tarih: '19-20 Şubat 2026', olay: 'Çift Anadal ve Yandal Kabul Edilen Asil Öğrencilerin KAYIT TARİHLERİ (Dilekçe İle)', tur: 'Kayıt', donem: 'Bahar', renk: 'bg-green-800' },
    { tarih: '23 Şubat 2026', olay: 'Yedek Listeden Hak Kazanan Öğrencilerin KAYIT TARİHİ', tur: 'Kayıt', donem: 'Bahar', renk: 'bg-orange-600' },
    { tarih: '25 Şubat 2026', olay: 'İngilizce Dersi Muafiyet Sınavı (Yeni Kayıt Yaptıranlar İçin)', tur: 'Sınav', donem: 'Bahar', renk: 'bg-yellow-600' },
    { tarih: '24-26 Şubat 2026', olay: 'Bahar Dönemi Ders Ekleme-Bırakma Tarihleri', tur: 'Kayıt', donem: 'Bahar', renk: 'bg-orange-500' },
    { tarih: '30 Mart - 11 Nisan 2026', olay: 'Bahar Dönemi Ara Sınav Tarihleri', tur: 'Sınav', donem: 'Bahar', renk: 'bg-yellow-700' },
    { tarih: '15 Nisan 2026', olay: 'Ara Sınav Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Bahar', renk: 'bg-gray-600' },
    { tarih: '20-22 Nisan 2026', olay: 'Ara Sınav Mazeret Sınavı Tarihleri', tur: 'Sınav', donem: 'Bahar', renk: 'bg-yellow-800' },
    { tarih: '25 Mayıs 2026', olay: 'Bahar Yarıyılı Derslerinin Sonu', tur: 'Ders', donem: 'Bahar', renk: 'bg-red-700' },
    { tarih: '25 Mayıs 2026', olay: 'Dönem İçi Notların Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Bahar', renk: 'bg-gray-700' },
    { tarih: '01-14 Haziran 2026', olay: 'Bahar Yarıyılı Final Sınav Tarihleri', tur: 'Sınav', donem: 'Bahar', renk: 'bg-yellow-900' },
    { tarih: '16 Haziran 2026', olay: 'Bitirme Projesi / Yönlendirilmiş Çalışma Ödevlerinin Son Teslim Tarihi', tur: 'Sınav', donem: 'Bahar', renk: 'bg-orange-600' },
    { tarih: '17 Haziran 2026', olay: 'Final Sınav Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Bahar', renk: 'bg-gray-700' },
    { tarih: '22-30 Haziran 2026', olay: 'Bütünleme Sınavı Tarihleri', tur: 'Sınav', donem: 'Bahar', renk: 'bg-yellow-800' },
    { tarih: '22 Haziran 2026', olay: 'Doğuş Üniversitesi İngilizce Yeterlik Sınavı (DÜİYES)', tur: 'Sınav', donem: 'Bahar', renk: 'bg-yellow-600' },
    { tarih: '1 Temmuz 2026', olay: 'Bütünleme Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Bahar', renk: 'bg-gray-700' },
    { tarih: '2 Temmuz 2026', olay: 'Tek Ders Sınavı Başvurusu için Son Tarih', tur: 'Sınav', donem: 'Bahar', renk: 'bg-orange-500' },
    { tarih: '6-7 Temmuz 2026', olay: 'Tek Ders Sınavı Tarihi', tur: 'Sınav', donem: 'Bahar', renk: 'bg-red-500' },
    { tarih: '7 Temmuz 2026', olay: 'Tek Ders Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Bahar', renk: 'bg-gray-700' },
    { tarih: '1 Temmuz 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Ek Sınav Hakkı Başvurusu Son Tarihi', tur: 'Kayıt', donem: 'Bahar', renk: 'bg-indigo-600' },
    { tarih: '2 Temmuz 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Sınav Başvuru Değerlendirme Sonucu İlanı', tur: 'İlan', donem: 'Bahar', renk: 'bg-green-700' },
    { tarih: '6-7 Temmuz 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Sınav Tarihleri', tur: 'Sınav', donem: 'Bahar', renk: 'bg-yellow-600' },
    { tarih: '7 Temmuz 2026', olay: 'Azami Öğrenim Süresini Dolduranlar İçin Sınav Notlarının Sisteme Girişi Son Tarihi', tur: 'Sınav', donem: 'Bahar', renk: 'bg-gray-700' },

    // --- RESMİ TATİLLER VE YAZ OKULU (Tüm Metinler Tek Satıra İndirildi) ---
    { tarih: '28 Ekim 2025 (½ Gün)', olay: 'Cumhuriyet Bayramı', tur: 'Tatil', donem: 'Güz', renk: 'bg-blue-900' },
    { tarih: '29 Ekim 2025', olay: 'Cumhuriyet Bayramı', tur: 'Tatil', donem: 'Güz', renk: 'bg-blue-900' },
    { tarih: '1 Ocak 2026', olay: 'Yılbaşı', tur: 'Tatil', donem: 'Güz', renk: 'bg-blue-900' },
    { tarih: '19 Mart 2026 (Arife ½ Gün)', olay: 'Ramazan Bayramı', tur: 'Tatil', donem: 'Bahar', renk: 'bg-blue-800' },
    { tarih: '20-22 Mart 2026', olay: 'Ramazan Bayramı', tur: 'Tatil', donem: 'Bahar', renk: 'bg-blue-800' },
    { tarih: '23 Nisan 2026', olay: 'Ulusal Egemenlik ve Çocuk Bayramı', tur: 'Tatil', donem: 'Bahar', renk: 'bg-blue-900' },
    { tarih: '1 Mayıs 2026', olay: 'Emek ve Dayanışma Günü', tur: 'Tatil', donem: 'Bahar', renk: 'bg-blue-900' },
    { tarih: '19 Mayıs 2026', olay: 'Atatürk’ü Anma Gençlik ve Spor Bayramı', tur: 'Tatil', donem: 'Bahar', renk: 'bg-blue-900' },
    { tarih: '27-30 Mayıs 2026', olay: 'Kurban Bayramı (Arife dahil)', tur: 'Tatil', donem: 'Bahar', renk: 'bg-blue-800' },
    { tarih: '15 Temmuz 2026', olay: 'Demokrasi ve Milli Birlik Günü', tur: 'Tatil', donem: 'Yaz', renk: 'bg-blue-900' },
    { tarih: '30 Ağustos 2026', olay: 'Zafer Bayramı', tur: 'Tatil', donem: 'Yaz', renk: 'bg-blue-900' },
    
    // Yaz Öğretimi Akademik İşlemler
    { tarih: '7-9 Temmuz 2026', olay: 'Yaz Dönemi Ders Seçimi ve Mali Kayıt', tur: 'Kayıt', donem: 'Yaz', renk: 'bg-green-600' },
    { tarih: '10 Temmuz 2026', olay: 'Yaz Döneminde Açılan Derslerin İlanı', tur: 'İlan', donem: 'Yaz', renk: 'bg-green-700' },
    { tarih: '13 Temmuz 2026', olay: 'Yaz Dönemi Derslerinin Başlangıcı', tur: 'Ders', donem: 'Yaz', renk: 'bg-red-800' },
    { tarih: '16-17 Temmuz 2026', olay: 'Açılan Derslerden Yeni Ders Seçme ve Açılamayan Derslerin Yerine Ders Alma', tur: 'Kayıt', donem: 'Yaz', renk: 'bg-orange-500' },
    { tarih: '27 Temmuz - 1 Ağustos 2026', olay: 'Yaz Dönemi Ara Sınav Tarihleri', tur: 'Sınav', donem: 'Yaz', renk: 'bg-yellow-700' },
    { tarih: '3 Ağustos 2026', olay: 'Ara Sınav Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Yaz', renk: 'bg-gray-600' },
    { tarih: '22 Ağustos 2026', olay: 'Yaz Dönemi Derslerinin Son Günü', tur: 'Ders', donem: 'Yaz', renk: 'bg-red-900' },
    { tarih: '31 Ağustos - 5 Eylül 2026', olay: 'Yaz Dönemi Final Sınavı Tarihleri', tur: 'Sınav', donem: 'Yaz', renk: 'bg-yellow-800' },
    { tarih: '13 Eylül 2026', olay: 'Bütünleme Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Yaz', renk: 'bg-gray-700' },
    { tarih: '14 Eylül 2026', olay: 'Tek Ders Sınavı Başvuruları İçin Son Tarih', tur: 'Sınav', donem: 'Yaz', renk: 'bg-orange-600' },
];


export default function AkademikTakvim() {
    const navigate = useNavigate();
    // Filtreleme state'leri
    const [seciliDonem, setSeciliDonem] = useState('Güz');
    const [seciliTur, setSeciliTur] = useState('Hepsi');

    // Seçenekler, verideki tüm dönemleri ve türleri kapsayacak şekilde güncellendi
    const donemSecenekleri = ['Güz', 'Bahar', 'Yaz'];
    const olayTurleri = ['Hepsi', 'Kayıt', 'Ders', 'Sınav', 'Tatil', 'İlan'];

    // Filtreleme Mantığı (useMemo ile optimize edildi)
    const filtrelenmisOlaylar = useMemo(() => {
        return takvimVerisi.filter(olay => {
            const donemFiltresi = olay.donem === seciliDonem;
            const turFiltresi = seciliTur === 'Hepsi' || olay.tur === seciliTur;
            return donemFiltresi && turFiltresi;
        });
    }, [seciliDonem, seciliTur]);


    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-10 animate-fade-in">
            {/* ⬅️ Başlık ve Geri Dön */}
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-red-200">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Geri Dön</span>
                </button>
                <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
                    <CalendarDaysIcon className="w-8 h-8 mr-2 text-red-600" /> {akademikYil} Akademik Takvim
                </h1>
                <div className="w-20"></div> {/* Hizalama için boşluk */}
            </header>

            {/* 🗓️ Takvim Kartı */}
            <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl border-t-4 border-red-600">
                
                {/* Filtre ve Dönem Seçimi */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-gray-700">Tarih Detayları</h2>
                    
                    <div className="flex gap-4 items-center">
                        <FunnelIcon className="w-5 h-5 text-gray-500" />
                        
                        {/* Dönem Seçimi */}
                        <select 
                            className="p-2 border border-red-300 rounded-lg text-sm font-medium bg-red-50 text-red-800 focus:ring-red-500 focus:border-red-500"
                            value={seciliDonem}
                            onChange={(e) => setSeciliDonem(e.target.value)}
                        >
                            {donemSecenekleri.map(d => (
                                <option key={d} value={d}>{d} Dönemi}</option>
                            ))}
                        </select>
                        
                        {/* Olay Türü Filtresi */}
                        <select 
                            className="p-2 border border-gray-300 rounded-lg text-sm font-medium focus:ring-red-500 focus:border-red-500"
                            value={seciliTur}
                            onChange={(e) => setSeciliTur(e.target.value)}
                        >
                            {olayTurleri.map(tur => (
                                <option key={tur} value={tur}>Tür: {tur}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <ul className="space-y-4 pt-4 border-t border-gray-100">
                    {filtrelenmisOlaylar.map((olay, index) => (
                        <li key={index} className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-red-50 transition-colors">
                            
                            {/* Tarih ve Tür (Sol Kısım) */}
                            <div className="w-full sm:w-1/4 flex items-center gap-3 mb-2 sm:mb-0">
                                <span className={`w-3 h-3 ${olay.renk} rounded-full flex-shrink-0`} title={olay.tur}></span>
                                <p className="text-sm font-bold text-red-700">{olay.tarih}</p>
                            </div>

                            {/* Olay Açıklaması (Orta Kısım) */}
                            <div className="flex-grow">
                                <p className="text-lg font-semibold text-gray-900">{olay.olay}</p>
                            </div>
                            
                            {/* Etiket (Sağ Kısım) */}
                            <span className={`ml-0 sm:ml-4 mt-2 sm:mt-0 text-xs font-medium uppercase px-3 py-1 rounded-full text-white`} style={{ backgroundColor: olay.renk }}>
                                {olay.tur}
                            </span>
                        </li>
                    ))}
                    {filtrelenmisOlaylar.length === 0 && (
                        <li className="text-center py-10 text-gray-500 text-lg font-light">
                            Seçili dönem ve tür için önemli bir olay bulunmamaktadır.
                        </li>
                    )}
                </ul>
            </div>
            
            {/* ℹ️ Not: Detaylı Bilgi Uyarısı */}
            <div className="max-w-6xl mx-auto mt-6 p-4 bg-red-100 border border-red-300 rounded-lg text-sm text-red-800">
                ⚠️ **Not:** Bu takvimdeki veriler üniversitenin resmi duyurularından birebir alınmıştır. En kesin bilgi için lütfen resmi duyuruları kontrol ediniz.
            </div>

            {/* ⭐ AIChat Bileşeni Buraya Yerleştirildi ⭐ */}
            <AIChat />

        </div>
    );
}