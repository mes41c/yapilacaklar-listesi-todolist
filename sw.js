const CACHE_NAME = 'matrix-offline-v1';
const ASSETS_TO_CACHE = [
  './matrix.html',
  './index.html',
  // Tailwind ve FontAwesome gibi dış kaynakları da ekliyoruz
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Kurulum: Dosyaları önbelleğe al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// İstekleri Yakala: İnternet yoksa önbellekten ver
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Önbellekte varsa onu döndür, yoksa internetten çek
      return cachedResponse || fetch(event.request);
    })
  );
});