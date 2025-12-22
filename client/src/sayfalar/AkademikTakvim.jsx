import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeftIcon, 
    CalendarDaysIcon, 
    FunnelIcon, 
    ClockIcon, 
    ArrowDownTrayIcon,
    CheckBadgeIcon,
    BellAlertIcon
} from '@heroicons/react/24/outline'; 
import { AIChat } from './AIChat';

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
    { tarih: '28 Ekim 2025', olay: 'Cumhuriyet Bayramı (1/2 Gün)', tur: 'Tatil', donem: 'Güz', renk: 'bg-blue-900' },
    { tarih: '29 Ekim 2025', olay: 'Cumhuriyet Bayramı', tur: 'Tatil', donem: 'Güz', renk: 'bg-blue-900' },
    { tarih: '1 Ocak 2026', olay: 'Yılbaşı', tur: 'Tatil', donem: 'Güz', renk: 'bg-blue-900' },
    { tarih: '19 Mart 2026', olay: 'Ramazan Bayramı (Arife 1/2 Gün)', tur: 'Tatil', donem: 'Bahar', renk: 'bg-blue-800' },
    { tarih: '20 Mart 2026', olay: 'Ramazan Bayramı Başlangıcı', tur: 'Tatil', donem: 'Bahar', renk: 'bg-blue-800' },
    { tarih: '23 Nisan 2026', olay: 'Ulusal Egemenlik ve Çocuk Bayramı', tur: 'Tatil', donem: 'Bahar', renk: 'bg-blue-900' },
    { tarih: '1 Mayıs 2026', olay: 'Emek ve Dayanışma Günü', tur: 'Tatil', donem: 'Bahar', renk: 'bg-blue-900' },
    { tarih: '19 Mayıs 2026', olay: 'Atatürk’ü Anma Gençlik ve Spor Bayramı', tur: 'Tatil', donem: 'Bahar', renk: 'bg-blue-900' },
    { tarih: '27 Mayıs 2026', olay: 'Kurban Bayramı (Arife dahil)', tur: 'Tatil', donem: 'Bahar', renk: 'bg-blue-800' },
    { tarih: '15 Temmuz 2026', olay: 'Demokrasi ve Milli Birlik Günü', tur: 'Tatil', donem: 'Yaz', renk: 'bg-blue-900' },
    { tarih: '30 Ağustos 2026', olay: 'Zafer Bayramı', tur: 'Tatil', donem: 'Yaz', renk: 'bg-blue-900' },
    
    // Yaz Öğretimi Akademik İşlemler
    { tarih: '7 Temmuz 2026', olay: 'Yaz Dönemi Ders Seçimi ve Mali Kayıt', tur: 'Kayıt', donem: 'Yaz', renk: 'bg-green-600' },
    { tarih: '10 Temmuz 2026', olay: 'Yaz Döneminde Açılan Derslerin İlanı', tur: 'İlan', donem: 'Yaz', renk: 'bg-green-700' },
    { tarih: '13 Temmuz 2026', olay: 'Yaz Dönemi Derslerinin Başlangıcı', tur: 'Ders', donem: 'Yaz', renk: 'bg-red-800' },
    { tarih: '16 Temmuz 2026', olay: 'Açılan Derslerden Yeni Ders Seçme İşlemleri', tur: 'Kayıt', donem: 'Yaz', renk: 'bg-orange-500' },
    { tarih: '27 Temmuz 2026', olay: 'Yaz Dönemi Ara Sınav Tarihleri Başlangıcı', tur: 'Sınav', donem: 'Yaz', renk: 'bg-yellow-700' },
    { tarih: '3 Ağustos 2026', olay: 'Ara Sınav Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Yaz', renk: 'bg-gray-600' },
    { tarih: '22 Ağustos 2026', olay: 'Yaz Dönemi Derslerinin Son Günü', tur: 'Ders', donem: 'Yaz', renk: 'bg-red-900' },
    { tarih: '31 Ağustos 2026', olay: 'Yaz Dönemi Final Sınavı Tarihleri Başlangıcı', tur: 'Sınav', donem: 'Yaz', renk: 'bg-yellow-800' },
    { tarih: '13 Eylül 2026', olay: 'Bütünleme Sınavı Notlarının Sisteme Girişi İçin Son Tarih', tur: 'Sınav', donem: 'Yaz', renk: 'bg-gray-700' },
    { tarih: '14 Eylül 2026', olay: 'Tek Ders Sınavı Başvuruları İçin Son Tarih', tur: 'Sınav', donem: 'Yaz', renk: 'bg-orange-600' },
];

export default function AkademikTakvim() {
    const navigate = useNavigate();
    const [seciliDonem, setSeciliDonem] = useState('Güz');
    const [seciliTur, setSeciliTur] = useState('Hepsi');
    const [bugun, setBugun] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setBugun(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // 🕒 AKILLI GÜN HESAPLAYICI (FIXED)
    const gunFarkiHesapla = (tarihMetni) => {
        if (!tarihMetni || tarihMetni === 'ÖSYM') return { metin: "TARİH BEKLENİYOR", stil: "bg-gray-100 text-gray-400" };

        const ayIsimleri = {
            "Ocak": 0, "Şubat": 1, "Mart": 2, "Nisan": 3, "Mayıs": 4, "Haziran": 5,
            "Temmuz": 6, "Ağustos": 7, "Eylül": 8, "Ekim": 9, "Kasım": 10, "Aralık": 11
        };

        // 1. "10-30 Temmuz 2025" gibi aralıkları temizle, sadece başlangıç gününü al (10 Temmuz 2025)
        let parca = tarihMetni.split('-')[0].trim().split(' ');
        
        // 2. Eğer ilk parça sadece sayıysa (örn: "30 Eylül - 2 Ekim" deki 30) ve ay yoksa, ay olan parçayı bul
        let gun, ayString, yil;

        if (parca.length === 1) { // Sadece gün sayısı gelmiş olabilir
             parca = tarihMetni.split(' ').filter(p => p !== '-');
        }

        gun = parseInt(parca[0]);
        // Ay ismini bul (Dizi içinde "Ocak" "Temmuz" gibi bir kelime ara)
        ayString = parca.find(p => ayIsimleri.hasOwnProperty(p.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ]/g, "")));
        // Yılı bul (4 haneli sayıyı al)
        yil = parseInt(parca.find(p => /^\d{4}$/.test(p)) || 2025);

        if (isNaN(gun) || !ayString) return { metin: "TARİH BELİRSİZ", stil: "bg-gray-100 text-gray-300" };

        const hedef = new Date(yil, ayIsimleri[ayString.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ]/g, "")], gun);
        const simdi = new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate());
        const fark = Math.ceil((hedef - simdi) / (1000 * 60 * 60 * 24));

        if (fark === 0) return { metin: "BUGÜN", stil: "bg-red-600 text-white animate-pulse" };
        if (fark < 0) return { metin: "GEÇTİ", stil: "bg-gray-200 text-gray-500" };
        return { metin: `${fark} GÜN KALDI`, stil: "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm" };
    };

    const ilerlemeYuzdesi = useMemo(() => {
        const start = new Date(seciliDonem === 'Güz' ? 2025 : 2026, seciliDonem === 'Güz' ? 8 : 1, 22);
        const end = new Date(seciliDonem === 'Güz' ? 2026 : 2026, seciliDonem === 'Güz' ? 0 : 5, 30);
        const total = end - start;
        const current = bugun - start;
        return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
    }, [seciliDonem, bugun]);

    const filtrelenmisOlaylar = useMemo(() => {
        return takvimVerisi.filter(o => o.donem === seciliDonem && (seciliTur === 'Hepsi' || o.tur === seciliTur));
    }, [seciliDonem, seciliTur]);

    const enYakinOlay = useMemo(() => {
        return takvimVerisi.find(o => {
            const res = gunFarkiHesapla(o.tarih);
            return res.metin.includes("KALDI") || res.metin === "BUGÜN";
        });
    }, [bugun, seciliDonem]);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-red-200 overflow-x-hidden pb-20">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <header className="relative z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 p-6 sticky top-0 shadow-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-red-600 transition-all font-black text-xs tracking-widest">
                        <ArrowLeftIcon className="w-4 h-4" /> GERİ DÖN
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl font-[1000] italic tracking-tighter uppercase leading-none">AKADEMİK <span className="text-red-600">TAKVİM</span></h1>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1 italic">Vizia Sync Engine</p>
                    </div>
                    <div className="bg-slate-900 px-4 py-2 rounded-2xl shadow-xl border border-white/10 hidden md:flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[11px] font-black text-white italic tracking-widest uppercase">
                            {bugun.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-6xl mx-auto p-6 pt-10">
                {enYakinOlay && (
                    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-white rounded-[3rem] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] mb-12 relative overflow-hidden group">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div>
                                <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block italic">Gelecek İlk Durak</span>
                                <h2 className="text-4xl font-[1000] italic text-slate-900 leading-tight uppercase tracking-tighter">{enYakinOlay.olay}</h2>
                            </div>
                            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-center min-w-[220px]">
                                <div className="text-4xl font-[1000] text-white italic tracking-tighter">
                                    {gunFarkiHesapla(enYakinOlay.tarih).metin}
                                </div>
                                <p className="text-[9px] font-black text-red-500 uppercase tracking-[0.3em] mt-2 italic">Harekete Geç</p>
                            </div>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full mt-10 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${ilerlemeYuzdesi}%` }} className="h-full bg-red-600" />
                        </div>
                    </motion.div>
                )}

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-[2rem] border border-white shadow-sm">
                        {['Güz', 'Bahar', 'Yaz'].map(d => (
                            <button key={d} onClick={() => setSeciliDonem(d)} className={`px-10 py-3 rounded-[1.8rem] text-[11px] font-black uppercase italic transition-all duration-500 ${seciliDonem === d ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                                {d} Dönemi
                            </button>
                        ))}
                    </div>
                    <select onChange={(e) => setSeciliTur(e.target.value)} className="bg-white border-none rounded-[1.5rem] px-8 py-3 text-[11px] font-black uppercase italic shadow-sm outline-none focus:ring-2 focus:ring-red-600">
                        {['Hepsi', 'Kayıt', 'Ders', 'Sınav', 'Tatil', 'İlan'].map(t => <option key={t} value={t}>{t} Modu</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filtrelenmisOlaylar.map((olay, idx) => {
                            const durum = gunFarkiHesapla(olay.tarih);
                            return (
                                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={olay.tarih + idx} className="group bg-white hover:bg-slate-50 border border-white rounded-[2.5rem] p-6 shadow-sm transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6 w-full md:w-1/3 text-left">
                                        <div className={`w-14 h-14 rounded-2xl ${olay.renk} flex items-center justify-center text-white shadow-lg shrink-0`}>
                                            <ClockIcon className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{olay.tarih}</p>
                                            <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase mt-1 inline-block tracking-widest ${durum.stil}`}>{durum.metin}</span>
                                        </div>
                                    </div>
                                    <div className="flex-grow w-full md:w-auto text-left">
                                        <h3 className="text-lg font-[1000] text-slate-800 italic uppercase tracking-tighter leading-tight group-hover:text-red-600 transition-colors">{olay.olay}</h3>
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{olay.tur}</span>
                                        <button onClick={() => window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(olay.olay)}&details=Vizia Akademik Takvim`, '_blank')} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </main>
            <AIChat />
        </div>
    );
}