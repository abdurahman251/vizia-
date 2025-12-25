import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CalendarDaysIcon, 
    ArrowLeftIcon, 
    PlusCircleIcon, 
    PencilSquareIcon, 
    TrashIcon,
    PhotoIcon,
    ClockIcon,
    MapPinIcon,
    UsersIcon,
    XMarkIcon,
    ClipboardDocumentListIcon 
} from '@heroicons/react/24/outline';

// API Sabiti ve Kategoriler
const API_URL = "https://vizia-server.onrender.com"; 
const Categories = ["AKADEMI", "SPOR", "SANAT", "SOSYAL"];


// **********************************************
// YENİ ETKİNLİK EKLEME/DÜZENLEME MODALI
// **********************************************
const EventFormModal = ({ eventToEdit, onClose, onSaveSuccess, clubId }) => {
    const [formData, setFormData] = useState({
        ad: '', aciklama: '', tarih: '', saat: '', yer: '', kapasite: 0, 
        resim_url: '', resimDosyasi: null,
        kulup_id: clubId 
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (eventToEdit) {
            setFormData({
                ad: eventToEdit.ad || '',
                aciklama: eventToEdit.aciklama || '',
                tarih: eventToEdit.tarih || '',
                saat: eventToEdit.saat || '',
                yer: eventToEdit.yer || '',
                kapasite: eventToEdit.kapasite || 0,
                resim_url: eventToEdit.resim_url || '',
                resimDosyasi: null,
                kulup_id: clubId 
            });
        } else {
            // Yeni etkinlik için formu sıfırla
            setFormData({ ad: '', aciklama: '', tarih: '', saat: '', yer: '', kapasite: 0, resim_url: '', resimDosyasi: null, kulup_id: clubId });
        }
    }, [eventToEdit, clubId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, resimDosyasi: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSaving(true);

        try {
            // 1. Resim Yükleme için FormData kullanıyoruz (Backend'de Multer gerektirir)
            const formPayload = new FormData();
            
            // Tüm metin alanlarını FormData'ya ekle
            for (const key in formData) {
                if (key !== 'resimDosyasi') {
                    formPayload.append(key, formData[key]);
                }
            }
            
            // Eğer yeni resim dosyası seçildiyse onu ekle
            if (formData.resimDosyasi) {
                formPayload.append('resimDosyasi', formData.resimDosyasi);
            }
            // Eğer sadece URL'yi koruyorsak (düzenleme modunda ve resim seçilmediyse) onu göndeririz.
            
            // 2. API Çağrısı
            const url = eventToEdit 
                ? `${API_URL}/api/kulupler/admin/etkinlikler/${eventToEdit.id}` // PUT
                : `${API_URL}/api/kulupler/admin/etkinlikler`; // POST

            const method = eventToEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                // Resim yüklendiği için 'Content-Type' header'ı belirtilmez (tarayıcı halleder)
                body: formPayload, 
                // Yetkilendirme header'ları
                headers: {
                    'clubid': clubId.toString(), // 🔥 Düzeltme: clubId'yi kesinlikle String olarak gönder
                    'role': 'ClubPresident'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.hata || `${method === 'POST' ? 'Ekleme' : 'Güncelleme'} başarısız oldu.`);
            }

            alert(data.mesaj);
            onSaveSuccess(); // Ana listeyi yenile
            onClose();

        } catch (err) {
            console.error("Etkinlik Kayıt Hatası:", err);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                
                <div className="flex justify-between items-center p-5 border-b">
                    <h3 className="text-xl font-bold text-red-700 flex items-center">
                        <CalendarDaysIcon className="w-6 h-6 mr-2" />
                        {eventToEdit ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-600"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

                    {/* Etkinlik Adı */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Etkinlik Adı</label>
                        <input type="text" name="ad" value={formData.ad} onChange={handleChange} required className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                    </div>

                    {/* Açıklama */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                        <textarea name="aciklama" value={formData.aciklama} onChange={handleChange} required rows="3" className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                    </div>

                    {/* Tarih, Saat, Yer */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tarih</label>
                            <input type="date" name="tarih" value={formData.tarih} onChange={handleChange} required className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Saat</label>
                            <input type="time" name="saat" value={formData.saat} onChange={handleChange} required className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Yer/Mekan</label>
                            <input type="text" name="yer" value={formData.yer} onChange={handleChange} required className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kapasite</label>
                            <input type="number" name="kapasite" value={formData.kapasite} onChange={handleChange} min="1" required className="w-full mt-1 border border-gray-300 rounded-md p-2" />
                        </div>
                    </div>

                    {/* Resim Yükleme Alanı */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                            <PhotoIcon className="w-5 h-5 mr-1" /> Etkinlik Görseli
                        </label>
                        <input type="file" name="resimDosyasi" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"/>
                        {(formData.resim_url && !formData.resimDosyasi) && (
                            <p className="mt-2 text-xs text-gray-500">Mevcut Resim: {formData.resim_url} (Yenisini seçmezseniz bu kalır)</p>
                        )}
                        {formData.resimDosyasi && (
                             <p className="mt-2 text-xs text-green-600">Yeni Resim Seçildi: {formData.resimDosyasi.name}</p>
                        )}
                    </div>
                    
                    {/* Kaydet Butonu */}
                    <div className="pt-4 border-t">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`w-full py-3 rounded-lg font-semibold transition ${isSaving ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
                        >
                            {isSaving ? 'Kaydediliyor...' : (eventToEdit ? 'Değişiklikleri Kaydet' : 'Etkinliği Yayınla')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// **********************************************
// 2. ADMIN ETKİNLİK LİSTELEME SAYFASI
// **********************************************
export default function AdminEtkinlikler() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);


    useEffect(() => {
        const adminData = localStorage.getItem("admin");
        if (adminData) {
            const parsedAdmin = JSON.parse(adminData);
            if (parsedAdmin.role !== 'ClubPresident') {
                setError("Bu sayfaya erişim yetkiniz yok.");
            }
            setAdmin(parsedAdmin);
            if (parsedAdmin.clubId) {
                // clubId'yi string olarak gönderiyoruz
                fetchClubEvents(parsedAdmin.clubId.toString());
            }
        } else {
            navigate("/admin/giris");
        }
    }, [navigate]);

    // 🔥 API'dan Kulübe Ait Etkinlikleri Çekme
    const fetchClubEvents = async (clubId) => {
        setIsLoading(true);
        setError(null);
        try {
            // clubId'yi URL'ye string olarak gönderiyoruz
            const response = await fetch(`${API_URL}/api/kulupler/admin/etkinlikler/${clubId}`, {
                headers: {
                    // clubid'yi Header olarak da gönderiyoruz (Backend yetki kontrolü için)
                    'clubid': clubId, // clubId zaten string (parsedAdmin.clubId.toString() ile geldi)
                    'role': 'ClubPresident', 
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.hata || 'Etkinlikler yüklenemedi.');
            }
            
            const data = await response.json();
            setEvents(data);

        } catch (err) {
            console.error("Etkinlik yükleme hatası:", err);
            // Hata bir JSON parse hatası değilse (örn: Ağ hatası)
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔥 API'a Etkinlik Silme İsteği
    const handleDelete = async (eventId) => {
        if (!window.confirm("Bu etkinliği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) return;

        try {
            const response = await fetch(`${API_URL}/api/kulupler/admin/etkinlikler/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'clubid': admin.clubId.toString(), // 🔥 Düzeltme: clubId'yi kesinlikle String olarak gönder
                    'role': 'ClubPresident', 
                }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.hata || "Silme işlemi başarısız oldu.");
            }

            alert(data.mesaj);
            fetchClubEvents(admin.clubId.toString()); // Listeyi yeniden çek

        } catch (err) {
            console.error("Silme hatası:", err);
            alert(`Hata: ${err.message}`);
        }
    };
    
    // Modal Açma Fonksiyonları
    const handleAddEvent = () => {
        setEditingEvent(null);
        setIsModalOpen(true);
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setIsModalOpen(true);
    };


    if (isLoading || !admin) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xl font-semibold text-red-600">Yükleniyor...</div>;
    }
    
    if (error && error !== "Yetkiniz yok veya oturum açılmamış.") { // Yetkisiz erişim hatası gösterilmez
        return <div className="p-10 text-center text-red-700 text-xl">Hata: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-10">
            
            {/* Etkinlik Ekleme/Düzenleme Modalı */}
            {isModalOpen && (
                <EventFormModal 
                    eventToEdit={editingEvent}
                    onClose={() => setIsModalOpen(false)}
                    onSaveSuccess={() => fetchClubEvents(admin.clubId.toString())} // Kayıt sonrası listeyi yeniler
                    clubId={admin.clubId}
                />
            )}

            {/* Başlık ve Butonlar */}
            <header className="flex justify-between items-center mb-8 pb-4 border-b border-red-200">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 transition font-medium"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Admin Panel</span>
                </button>
                <h1 className="text-3xl font-extrabold text-gray-800 flex items-center tracking-tight">
                    <ClipboardDocumentListIcon className="w-8 h-8 mr-2 text-red-600" /> {admin.clubName} Etkinlik Yönetimi
                </h1>
                <button
                    onClick={handleAddEvent}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Yeni Etkinlik Ekle</span>
                </button>
            </header>
            
            {/* Etkinlik Listesi */}
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etkinlik</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih/Saat</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yer/Kapasite</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Katılım/Oylama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksiyon</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {events.length > 0 ? (
                            events.map((event) => (
                                <tr key={event.id} className="hover:bg-red-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">{event.ad}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-xs">{event.aciklama}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div className="flex items-center gap-1"><CalendarDaysIcon className="w-4 h-4 text-red-500" /> {event.tarih}</div>
                                        <div className="flex items-center gap-1"><ClockIcon className="w-4 h-4 text-red-500" /> {event.saat}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                         <div className="flex items-center gap-1"><MapPinIcon className="w-4 h-4 text-red-500" /> {event.yer}</div>
                                         <div className="flex items-center gap-1"><UsersIcon className="w-4 h-4 text-red-500" /> {event.kapasite} Kişi</div>
                                    </td>
                                    {/* Katılım ve Oylama Sayısı (Öğrenci tarafındaki API'den farklı bir sorgu veya yeni bir API gerektirir) */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                        <span className="text-blue-600">{event.registered_count || 0} Katılım</span> 
                                        <br/>
                                        <span className="text-green-600">{event.like_count || 0} Beğeni</span> / 
                                        <span className="text-red-600"> {event.dislike_count || 0} Beğenmeme</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                        <button
                                            onClick={() => handleEditEvent(event)}
                                            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition"
                                        >
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500">
                                    Henüz yayınlanmış bir etkinliğiniz bulunmamaktadır.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}