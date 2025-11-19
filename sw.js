const CACHE_NAME = 'komuta-merkezi-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/matrix.html',
  '/style.css', // Varsa
  '/script.js', // Varsa
  // Dış Kaynaklar (CDN'ler)
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// 1. Yükleme: Dosyaları Önbelleğe Al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Önbellek oluşturuluyor...');
      return cache.addAll(ASSETS);
    })
  );
});

// 2. Aktifleştirme: Eski Önbellekleri Temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 3. İstekleri Yakala: İnternet Yoksa Önbellekten Ver
self.addEventListener('fetch', (event) => {
  // Firestore isteklerini pas geç (Firebase kendi yönetir)
  if (event.request.url.includes('firestore.googleapis.com')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        // İnternet yoksa ve önbellekte de yoksa, offline.html (opsiyonel) döndürebiliriz
        // Şimdilik mevcut sayfayı döndürmeye çalışıyoruz.
      });
    })
  );
});
