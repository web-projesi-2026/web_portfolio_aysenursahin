<?php
declare(strict_types=1);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

date_default_timezone_set('Europe/Istanbul');

/* ══════════════════════════════════════════════
   MySQL Bağlantı Ayarları
   — Bu 4 satırı kendi bilgilerinizle doldurun —
   ══════════════════════════════════════════════ */
define('DB_HOST', 'localhost');       // Genellikle localhost
define('DB_NAME', 'portfolio_db');    // phpMyAdmin'de oluşturduğunuz veritabanı adı
define('DB_USER', 'root');            // MySQL kullanıcı adı (XAMPP'ta varsayılan: root)
define('DB_PASS', '');                // MySQL şifresi (XAMPP'ta varsayılan: boş)
define('DB_CHARSET', 'utf8mb4');

function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        DB_HOST,
        DB_NAME,
        DB_CHARSET
    );

    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    initializeDatabase($pdo);

    return $pdo;
}

function initializeDatabase(PDO $pdo): void
{
    $pdo->exec('SET FOREIGN_KEY_CHECKS = 0');

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS users (
            id            INT AUTO_INCREMENT PRIMARY KEY,
            name          VARCHAR(100) NOT NULL,
            email         VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS messages (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            name       VARCHAR(100) NOT NULL,
            email      VARCHAR(255) NOT NULL,
            subject    VARCHAR(255),
            message    TEXT NOT NULL,
            user_id    INT DEFAULT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_messages_user
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS projects (
            id             INT AUTO_INCREMENT PRIMARY KEY,
            slug           VARCHAR(100) NOT NULL UNIQUE,
            title          VARCHAR(255) NOT NULL,
            category       VARCHAR(50)  NOT NULL,
            description    TEXT NOT NULL,
            tech_stack     VARCHAR(500) NOT NULL,
            github_url     VARCHAR(500) DEFAULT NULL,
            demo_url       VARCHAR(500) DEFAULT NULL,
            status         VARCHAR(50)  NOT NULL DEFAULT "active",
            likes_count    INT NOT NULL DEFAULT 0,
            dislikes_count INT NOT NULL DEFAULT 0,
            created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS project_votes (
            id         INT AUTO_INCREMENT PRIMARY KEY,
            project_id INT NOT NULL,
            vote_type  ENUM("like","dislike") NOT NULL,
            voter_key  VARCHAR(64) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_vote (project_id, voter_key),
            CONSTRAINT fk_votes_project
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $pdo->exec('SET FOREIGN_KEY_CHECKS = 1');

    seedProjects($pdo);
}

function seedProjects(PDO $pdo): void
{
    $count = (int) $pdo->query('SELECT COUNT(*) AS total FROM projects')->fetch()['total'];
    if ($count > 0) {
        return;
    }

    $projects = [
        [
            'slug'       => 'cinetrack',
            'title'      => 'CineTrack',
            'category'   => 'fullstack',
            'description'=> 'Film ve dizi takip platformu; listeleme, puanlama ve durum yönetimi içerir.',
            'tech_stack' => 'HTML,CSS,JavaScript,PHP,MySQL',
            'github_url' => 'https://github.com/aysenuursahin',
            'demo_url'   => null,
            'status'     => 'active',
        ],
        [
            'slug'       => 'portfolio',
            'title'      => 'Portfolyo Sitesi',
            'category'   => 'web',
            'description'=> 'Modern, animasyonlu ve responsive kişisel portfolyo deneyimi.',
            'tech_stack' => 'HTML,CSS,JavaScript',
            'github_url' => 'https://github.com/aysenuursahin/portfolyo',
            'demo_url'   => null,
            'status'     => 'completed',
        ],
        [
            'slug'       => 'taskflow',
            'title'      => 'TaskFlow',
            'category'   => 'fullstack',
            'description'=> 'Ekip görev ve ilerleme takibi için panel tabanlı proje yönetimi uygulaması.',
            'tech_stack' => 'PHP,JavaScript,MySQL,CSS',
            'github_url' => 'https://github.com/aysenuursahin',
            'demo_url'   => null,
            'status'     => 'active',
        ],
        [
            'slug'       => 'notesphere',
            'title'      => 'NoteSphere',
            'category'   => 'web',
            'description'=> 'Etiketleme ve hızlı arama özellikli akıllı not yönetim uygulaması.',
            'tech_stack' => 'HTML,CSS,JavaScript',
            'github_url' => 'https://github.com/aysenuursahin',
            'demo_url'   => null,
            'status'     => 'active',
        ],
        [
            'slug'       => 'javahub-api',
            'title'      => 'JavaHub API',
            'category'   => 'java',
            'description'=> 'REST prensipli backend servis katmanı ve rol tabanlı kimlik doğrulama.',
            'tech_stack' => 'Java,Spring,PostgreSQL',
            'github_url' => 'https://github.com/aysenuursahin',
            'demo_url'   => null,
            'status'     => 'planning',
        ],
        [
            'slug'       => 'shopwise',
            'title'      => 'ShopWise',
            'category'   => 'web',
            'description'=> 'Ürün listeleme, favori ve sepet akışları içeren e-ticaret arayüz prototipi.',
            'tech_stack' => 'HTML,CSS,JavaScript',
            'github_url' => 'https://github.com/aysenuursahin',
            'demo_url'   => null,
            'status'     => 'completed',
        ],
    ];

    $stmt = $pdo->prepare(
        'INSERT INTO projects (slug, title, category, description, tech_stack, github_url, demo_url, status)
         VALUES (:slug, :title, :category, :description, :tech_stack, :github_url, :demo_url, :status)'
    );

    foreach ($projects as $project) {
        $stmt->execute([
            ':slug'        => $project['slug'],
            ':title'       => $project['title'],
            ':category'    => $project['category'],
            ':description' => $project['description'],
            ':tech_stack'  => $project['tech_stack'],
            ':github_url'  => $project['github_url'],
            ':demo_url'    => $project['demo_url'],
            ':status'      => $project['status'],
        ]);
    }
}

function jsonResponse(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function sanitize(?string $value): string
{
    return trim((string) $value);
}

function currentUser(): ?array
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    $stmt = db()->prepare('SELECT id, name, email, created_at FROM users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => (int) $_SESSION['user_id']]);
    $user = $stmt->fetch();

    return $user ?: null;
}

function requireAuth(): array
{
    $user = currentUser();
    if (!$user) {
        jsonResponse([
            'ok'      => false,
            'message' => 'Bu işlem için giriş yapmalısın.',
        ], 401);
    }
    return $user;
}
