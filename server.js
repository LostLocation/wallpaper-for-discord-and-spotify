const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 8800;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

// Desteklenen tüm dosya uzantılarını listeye ekle
const supportedExtensions = ['.gif', '.mp4', '.png', '.jpg', '.jpeg', '.webp'];

// Medya listesini döndürür.
app.get('/list-media', (req, res) => {
  const publicDir = path.join(__dirname, 'public');
  fs.readdir(publicDir, (err, files) => {
    if (err) {
      console.error("Klasör okunurken hata oluştu:", err);
      return res.status(500).send('Dosya listesi alınamadı.');
    }
    const mediaFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      // Kontrolü güncellenmiş listeyle yap
      return supportedExtensions.includes(ext);
    });
    res.json(mediaFiles);
  });
});

// Dosya yükleme için yeni POST rotası
app.post('/upload', upload.single('mediaFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Lütfen yüklenecek bir dosya seçin.');
    }
    res.send('Dosya başarıyla yüklendi: ' + req.file.originalname);
});

// Ana HTML sayfasını sunar.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Sunucuyu başlat.
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});