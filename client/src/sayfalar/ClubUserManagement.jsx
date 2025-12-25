import React, { useState, useEffect } from 'react';
import { PencilSquareIcon, BuildingOffice2Icon, EnvelopeIcon, KeyIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// API Sabiti (Backend'inizin çalıştığı adresi kontrol edin)
const API_URL = "https://vizia-server.onrender.com"; 

// **********************************************
// KULÜP BAŞKANI HESAP YÖNETİM PANELİ (SÜPER ADMİN)
// **********************************************
export default function ClubUserManagement() {
    const [clubUsers, setClubUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    
    // 🔥 HATA DÜZELTİLDİ: useState'in doğru tanımlaması yapıldı
    const [isSaving, setIsSaving] = useState(false); 
    
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Backend'den gerçek veriyi çekme fonksiyonu
    const fetchClubUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Yetkilendirme header'ları local storage'dan alınmalıdır
            const adminData = JSON.parse(localStorage.getItem('admin'));
            
            if (!adminData || adminData.role !== 'SuperAdmin') {
                throw new Error("Yetkiniz yok veya oturum açılmamış.");
            }

            const response = await fetch(`${API_URL}/api/kulupler/admin/baskanlar`, {
                headers: {
                    'Role': 'SuperAdmin', 
                    // Backend'deki yetki kontrolü için header gönderilir
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.hata || 'Başkan listesi yüklenemedi.');
            }
            
            const data = await response.json();
            setClubUsers(data);

        } catch (err) {
            console.error("Başkan Listesi Yüklenirken Hata:", err);
            setError(err.message);
        } finally {
             setIsLoading(false);
        }
    }
    
    // Bileşen yüklendiğinde veriyi çek
    useEffect(() => {
        fetchClubUsers();
    }, []);


    const handleEditClick = (user) => {
        setEditingUser(user);
        setNewEmail(user.baskan_email);
        setNewPassword(''); 
        setError(null);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!editingUser) return;
        setError(null);

        if (newPassword && newPassword.length < 4) { 
             setError("Şifre en az 4 karakter olmalıdır.");
             return;
        }

        setIsSaving(true);
        
        try {
            const dataToSubmit = {
                baskan_email: newEmail,
                new_password: newPassword || null, 
            };
            
            const response = await fetch(`${API_URL}/api/kulupler/admin/baskanlar/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Role': 'SuperAdmin', 
                },
                body: JSON.stringify(dataToSubmit)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.hata || "Hesap güncellenirken sunucu hatası oluştu.");
            }

            // Başarılı olursa, listedeki e-postayı güncelle ve modalı kapat
            setClubUsers(prev => prev.map(user => 
                user.id === editingUser.id 
                    ? { ...user, baskan_email: newEmail } 
                    : user
            ));
            
            alert(data.mesaj); // Backend'den gelen başarı mesajını göster
            setIsModalOpen(false);
            
        } catch (err) {
            console.error("Güncelleme hatası:", err);
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
         return <div className="p-8 text-center text-lg font-semibold text-red-600">Başkanlar Listesi Yükleniyor...</div>;
    }
    
    if (error && !clubUsers.length) {
         return <div className="p-8 text-center text-red-700 font-semibold">Hata: {error}. Lütfen Backend'in çalıştığından ve Süper Admin olarak giriş yaptığınızdan emin olun.</div>;
    }


    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                    <BuildingOffice2Icon className="w-8 h-8 mr-3 text-red-600" />
                    Kulüp Başkanları Hesap Yönetimi
                </h1>
                <p className="text-gray-500 mt-1">Süper Admin Paneli: Kulüp başkanlarının giriş e-posta ve şifrelerini yönetin.</p>
            </header>

            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kulüp Adı</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başkan Adı Soyadı</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta (Giriş)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {clubUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-red-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                                    {user.club_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.baskan_adsoyad}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{user.baskan_email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        className="text-red-600 hover:text-red-900 flex items-center gap-1 bg-red-100 px-3 py-1 rounded-full text-xs font-bold transition"
                                    >
                                        <PencilSquareIcon className="w-4 h-4" /> Düzenle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Düzenleme Modalı */}
            {isModalOpen && editingUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-xl font-bold text-red-700">Başkan Bilgilerini Düzenle</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-600">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {error && (
                             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center gap-2 text-sm">
                                <ExclamationTriangleIcon className="w-5 h-5" />
                                {error}
                            </div>
                        )}
                        
                        <p className="mb-4 text-sm text-gray-600">
                            **{editingUser.club_name}** kulübü başkanı için e-posta ve şifre bilgilerini güncelleyin.
                        </p>

                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <div className="space-y-4">
                                
                                {/* E-posta Alanı */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                                        <EnvelopeIcon className="w-4 h-4 mr-1 text-red-500" /> Yeni Giriş E-postası
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>
                                
                                {/* Şifre Alanı */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center">
                                        <KeyIcon className="w-4 h-4 mr-1 text-red-500" /> Yeni Şifre (Boş bırakırsanız değişmez)
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className={`px-4 py-2 text-sm font-medium text-white rounded-md transition ${isSaving ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    {isSaving ? 'Kaydediliyor...' : 'Kaydet ve Güncelle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}