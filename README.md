# Ayşenur Şahin — Kişisel Portfolyo Sitesi

## Proje Açıklaması

Ayşenur Şahin'in kişisel portfolyo sitesi. Modern ve animasyonlu bir web uygulamasıdır. Hem statik ön yüz sayfalarını hem de PHP + MySQL tabanlı bir backend API'sini barındırır.

---

## Yeni Eklenen Özellikler (Final)

### 1. Kullanıcı Deneyimi
- 🔍 **Arama kutusu** — Projeler sayfasında anlık arama (ad, açıklama, teknoloji)
- 🔃 **Sıralama** — İsim A→Z, Z→A ve teknoloji sayısına göre
- 🏷️ **Kategori filtreleme** — Tümü / Web / Full Stack / Java / Favoriler

### 2. Harici API
- 💱 **Canlı Döviz Kurları** — `open.er-api.com` API'si ile USD, EUR, GBP, JPY, SAR ana sayfada

### 3. Veritabanı İşlemleri
- ✅ Kullanıcı kayıt & giriş (PHP session)
- ✅ İletişim formu mesajı ekleme
- ✅ Projeleri veritabanından listeleme
- ✅ Proje güncelleme (PUT endpoint)
- ✅ Proje silme (DELETE endpoint)
- ✅ Admin panelinde tam CRUD

### 4. Profesyonelleştirme
- 🔖 Tüm sayfalara `favicon.svg` eklendi
- 📝 Tüm `<title>` etiketleri eksiksiz
- 🧹 Kod tekrarları azaltıldı
- 🔗 Kırık linkler düzeltildi

---

## Kullanılan Teknolojiler

| Katman     | Teknoloji                          |
|------------|-------------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JavaScript     |
| Fontlar    | Outfit, Fraunces, JetBrains Mono    |
| İkonlar    | Lucide Icons (CDN)                  |
| Backend    | PHP 8+                              |
| Veritabanı | MySQL 5.7+ / 8.0+ (PDO)            |
| Harici API | open.er-api.com (döviz kurları)     |

---

## Klasör Yapısı

```
portfolio/
├── index.html               # Ana sayfa
├── README.md
├── assets/
│   ├── favicon.svg
│   ├── css/
│   │   ├── style.css
│   │   ├── responsive.css
│   │   └── interactions.css
│   └── js/
│       ├── main.js
│       └── interactions.js
├── backend/php/
│   ├── config.php
│   ├── auth.php
│   ├── contact.php
│   └── projects.php         # GET/POST/PUT/DELETE
├── data/
│   └── projeler.json
└── pages/
    ├── about.html
    ├── admin.html            # Proje CRUD paneli
    ├── blog.html
    ├── contact.html
    ├── login.html
    ├── projeler.html         # Arama + filtre + sıralama
    └── register.html
```

---

## Kurulum

1. XAMPP'ta Apache ve MySQL başlatın
2. `phpMyAdmin` → Yeni veritabanı: `portfolio_db`
3. `backend/php/config.php` içine DB bilgilerini girin
4. Dosyaları `C:\xampp\htdocs\portfolio\` altına kopyalayın
5. `http://localhost/portfolio/` adresini açın (tablolar otomatik oluşur)

**Admin:** Giriş sayfası → 🔐 Admin Girişi → `aysenur` / `aysenur123`

---

## Canlı Link

> https://aysenuursahin.com *(yakında)*
