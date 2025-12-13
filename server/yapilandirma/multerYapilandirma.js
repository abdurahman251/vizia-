// =============================
// server/yapilandirma/multerYapilandirma.js
// =============================
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Dosya sistemini kullanmak için

const uploadDir = 'uploads/events'; // Resimlerin kaydedileceği klasör

// Klasörün varlığını kontrol et ve yoksa oluştur
if (!fs.existsSync(uploadDir)) {
    // uploads/events klasörünü oluşturur
    fs.mkdirSync(uploadDir, { recursive: true }); 
}

// Resim Yükleme Ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Resimlerin yükleneceği dizin
    },
    filename: function (req, file, cb) {
        // Dosya adını benzersiz hale getiriyoruz: etkinlik-timestamp-random.jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Dosya uzantısını koru
        const fileExtension = path.extname(file.originalname); 
        cb(null, 'etkinlik-' + uniqueSuffix + fileExtension);
    }
});

// Resim Filtresi (Sadece görsel dosyalarına izin vermek için)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        // Dosya resim değilse hata mesajı döndür
        cb(new Error('Sadece resim dosyaları yüklenebilir.'), false);
    }
};

export const uploadEventImage = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 1024 * 1024 * 5 // Maksimum 5 MB limit
    }
});