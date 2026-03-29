# Ayşenur Şahin — Kişisel Portfolyo Sitesi

## Proje Açıklaması

Ayşenur Şahin'in kişisel portfolyo sitesi. Yazılım geliştirici kimliğini yansıtan, modern ve animasyonlu bir web uygulamasıdır. Hem statik ön yüz sayfalarını hem de PHP + MySQL tabanlı bir backend API'sini barındırır.

---

## Hedef Kullanıcı

- **Ziyaretçiler:** Portfolyoyu inceleyen işverenler, iş ortakları ve meraklı kullanıcılar.
- **Mesaj Gönderenler:** İletişim formu üzerinden proje iş birliği veya geri bildirim göndermek isteyenler.
- **Admin (Site Sahibi):** Proje ve mesaj yönetimi için admin paneline erişen Ayşenur Şahin.

---

## Temel Özellikler

- 🎨 Karanlık temalı, modern ve animasyonlu tasarım (scroll reveal, orb efektleri, grain texture)
- 📄 Hakkında, Projeler, Blog ve İletişim sayfaları
- 💬 İletişim formu (PHP + MySQL backend ile mesaj kaydı)
- 🔐 Kullanıcı kayıt / giriş sistemi (session tabanlı PHP auth)
- 👑 Admin girişi (localStorage tabanlı, ayrı modal)
- 📊 Admin paneli (proje listesi, istatistikler)
- 👍 Proje beğeni / beğenmeme sistemi (IP + User-Agent tabanlı, tekrar oy önleme)
- 📱 Tam responsive tasarım (mobil menü, hamburger)
- ⭐ Blog yazılarına puan verme

---

## Kullanılan Teknolojiler

| Katman     | Teknoloji                          |
|------------|------------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript    |
| Fontlar    | Outfit, Fraunces, JetBrains Mono   |
| İkonlar    | Lucide Icons (CDN)                 |
| Backend    | PHP 8+                             |
| Veritabanı | MySQL 5.7+ / 8.0+ (PDO)           |

---

## Klasör Yapısı

```
portfolio/
├── index.html               # Ana sayfa
├── README.md
│
├── assets/
│   ├── css/
│   │   ├── style.css        # Ana stil dosyası
│   │   └── responsive.css   # Responsive overrides
│   └── js/
│       └── main.js          # Sayfa etkileşimleri, animasyonlar
│
├── backend/
│   └── php/
│       ├── config.php       # DB bağlantısı, yardımcı fonksiyonlar, seed
│       ├── auth.php         # Kayıt / giriş / çıkış API
│       ├── contact.php      # İletişim formu API
│       └── projects.php     # Proje listesi + oy API
│
└── pages/
    ├── about.html           # Hakkında
    ├── admin.html           # Admin paneli
    ├── blog.html            # Blog
    ├── contact.html         # İletişim
    ├── login.html           # Giriş
    ├── projeler.html        # Projeler
    └── register.html        # Kayıt
```

---

## Kurulum

### Gereksinimler
- PHP 8.0+
- MySQL 5.7+ veya 8.0+
- XAMPP (veya herhangi bir Apache + MySQL ortamı)

### Adımlar

1. **XAMPP'ı başlatın:**
   Apache ve MySQL servislerini açın.

2. **phpMyAdmin'de veritabanını oluşturun:**
   - `http://localhost/phpmyadmin` adresine gidin.
   - Sol üstten **Yeni** (New) butonuna tıklayın.
   - Veritabanı adı: `portfolio_db`
   - Karakter seti: `utf8mb4_unicode_ci`
   - **Oluştur** butonuna tıklayın.

3. **`backend/php/config.php` dosyasını açın ve bağlantı bilgilerini girin:**
   ```php
   define('DB_HOST', 'localhost');     // Genellikle localhost
   define('DB_NAME', 'portfolio_db'); // Oluşturduğunuz veritabanı adı
   define('DB_USER', 'root');          // MySQL kullanıcı adı
   define('DB_PASS', '');              // MySQL şifresi (XAMPP'ta varsayılan boş)
   ```

4. **Proje dosyalarını XAMPP klasörüne kopyalayın:**
   ```
   C:\xampp\htdocs\portfolio\
   ```

5. **Tarayıcıdan açın:**
   ```
   http://localhost/portfolio/
   ```
   İlk açılışta tablolar ve örnek projeler otomatik oluşturulur, elle SQL çalıştırmanıza gerek yoktur.

6. **Admin girişi:**
   - Giriş sayfasındaki **🔐 Admin Girişi** butonuna tıklayın.
   - Kullanıcı adı: `aysenur`
   - Şifre: `aysenur123`

---

## Veritabanı Tabloları

Tablolar ilk çalıştırmada `config.php` içindeki `initializeDatabase()` fonksiyonu tarafından otomatik oluşturulur.

| Tablo           | Açıklama                                      |
|-----------------|-----------------------------------------------|
| `users`         | Kayıtlı kullanıcılar                          |
| `messages`      | İletişim formundan gelen mesajlar             |
| `projects`      | Proje listesi ve beğeni sayaçları             |
| `project_votes` | Tekrar oy önleme (IP + User-Agent bazlı)      |

---

## Canlı Link

> https://aysenuursahin.com *(yakında)*
