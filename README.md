Yapılacaklar Listesi (Gelişmiş To-Do List Uygulaması)
Bu proje, modern web teknolojileri kullanılarak geliştirilmiş, zengin özelliklere sahip, dinamik ve interaktif bir yapılacaklar listesi uygulamasıdır. Kullanıcıların görevlerini verimli bir şekilde yönetmelerine, organize etmelerine ve önceliklendirmelerine olanak tanır. Kişisel gelişime katkı sağlamak ve günlük görev yönetimi ihtiyacına çözüm bulmak amacıyla geliştirilmiştir.

✨ Öne Çıkan Özellikler
Bu uygulama, standart bir yapılacaklar listesinden çok daha fazlasını sunar:

Kullanıcı Yönetimi:

E-posta ve şifre ile kayıt olma ve giriş yapma.

Tek tıkla Google ile Giriş yapma.

Liste ve Görev Yönetimi (CRUD):

Sınırsız sayıda yapılacaklar listesi oluşturma, yeniden adlandırma ve silme.

Görevlere bitiş tarihi (due date) ekleme.

Görevleri öncelik seviyesine (Düşük, Orta, Yüksek) göre sınıflandırma.

Ana görevler altında alt görevler oluşturarak işleri hiyerarşik olarak düzenleme.

Silinen görevler için 5 saniye içinde Geri Alma (Undo) imkanı.

Gelişmiş Fonksiyonlar:

Görevleri filtreleme (Tümü, Aktif, Tamamlanan).

Görevleri farklı kriterlere göre sıralama (Manuel, Eklenme Tarihi, Bitiş Tarihi, Öncelik).

Kullanıcı dostu, modern ve karanlık/aydınlık mod destekli arayüz.

🤖 Gemini AI Entegrasyonu:

Görevi Parçala: Karmaşık bir görevi, yapay zeka yardımıyla daha küçük ve yönetilebilir alt görevlere ayırma.

Görevi Detaylandır: Bir görev hakkında yapay zekadan fikirler, notlar veya sorular alarak görevi daha anlaşılır hale getirme.

Kullanıcıların kendi Gemini API anahtarlarını güvenli bir şekilde kaydetmeleri için arayüz.

🛠️ Kullanılan Teknolojiler
Frontend: HTML5, Tailwind CSS, vanilla JavaScript (ES Modules)

Backend & Veritabanı: Google Firebase

Firestore: Görev ve liste verilerini gerçek zamanlı olarak saklamak için.

Firebase Authentication: Güvenli kullanıcı kimlik doğrulama işlemleri için.

AI: Google Gemini API

🚀 Başlarken
Bu projeyi kendi Firebase hesabınızla çalıştırmak için aşağıdaki adımları izleyin.

Ön Gereksinimler
Bir Google Firebase hesabı.

Akıllı özellikleri kullanmak için bir Google AI Studio üzerinden alınmış Gemini API anahtarı.

Kurulum
Projeyi Klonlayın:

Bash

git clone https://github.com/kullanici-adiniz/yapilacaklar-listesi-todolist.git

Firebase Projesi Oluşturun:

Firebase konsolunda yeni bir proje oluşturun.

Projenize bir Web Uygulaması ekleyin.

Proje ayarlarından firebaseConfig nesnesini kopyalayın.

Firebase Yapılandırmasını Ekleyin:
index.html dosyasını açın ve aşağıdaki firebaseConfig değişkenini kendi projenizin bilgileriyle güncelleyin:

JavaScript

// --- Firebase & App Config ---
const firebaseConfig = {
  apiKey: "SENİN_API_KEYİN",
  authDomain: "SENİN_AUTH_DOMAINİN",
  projectId: "SENİN_PROJE_IDN",
  storageBucket: "SENİN_STORAGE_BUCKETİN",
  messagingSenderId: "SENİN_MESSAGING_SENDER_IDN",
  appId: "SENİN_APP_IDN"
};
Firebase Kurallarını Ayarlayın:

Firestore Database'i oluşturun ve kurallarını aşağıdaki gibi güncelleyerek sadece oturum açmış kullanıcıların kendi verilerine erişmesini sağlayın:

JSON

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
Authentication sekmesinden E-posta/Şifre ve Google sağlayıcılarını aktif hale getirin.

Uygulamayı Çalıştırın:
index.html dosyasını bir tarayıcıda açarak uygulamayı kullanmaya başlayabilirsiniz.

✍️ Yazar
mes41c - Proje Sahibi
