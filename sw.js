const CACHE_NAME = 'komuta-merkezi-v2'; // Versiyonu değiştirdim
const ASSETS = [
  './',
  './index.html',
  './matrix.html',
  './192x192.png',   // <-- YENİ EKLENDİ
  './512x512a.jpg',
  // SADECE kesin var olanları ve dış kaynakları ekliyoruz
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// 1. Yükleme
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Yeni SW'yi hemen aktif et
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Önbellek oluşturuluyor...');
      return cache.addAll(ASSETS).catch(err => {
        console.error("Önbellek hatası! Bir dosya bulunamadı:", err);
      });
    })
  );
});

// 2. Aktifleştirme
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Tüm sekmeleri hemen kontrol altına al
});

// 3. İstekleri Yakala
self.addEventListener('fetch', (event) => {
  // Firestore ve dış API isteklerini pas geç
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('google.com') ||
      event.request.method !== 'GET') {
      return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Varsa önbellekten ver, yoksa internetten çek
      return cachedResponse || fetch(event.request).catch(() => {
        console.log("Offline ve önbellekte yok:", event.request.url);
      });
    })
  );
});

