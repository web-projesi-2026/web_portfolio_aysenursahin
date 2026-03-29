<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = sanitize($_GET['action'] ?? 'me');

if ($method === 'GET' && $action === 'me') {
    $user = currentUser();
    jsonResponse([
        'ok' => true,
        'authenticated' => (bool) $user,
        'user' => $user
    ]);
}

if ($method !== 'POST') {
    jsonResponse([
        'ok' => false,
        'message' => 'Geçersiz istek metodu.'
    ], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    $input = $_POST;
}

switch ($action) {
    case 'register':
        handleRegister($input);
        break;

    case 'login':
        handleLogin($input);
        break;

    case 'logout':
        handleLogout();
        break;

    default:
        jsonResponse([
            'ok' => false,
            'message' => 'Geçersiz işlem.'
        ], 400);
}

function handleRegister(array $input): void
{
    $name = sanitize($input['name'] ?? '');
    $email = mb_strtolower(sanitize($input['email'] ?? ''));
    $password = (string) ($input['password'] ?? '');

    if (mb_strlen($name) < 2) {
        jsonResponse(['ok' => false, 'message' => 'İsim en az 2 karakter olmalı.'], 422);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['ok' => false, 'message' => 'Geçerli bir e-posta gir.'], 422);
    }

    if (strlen($password) < 6) {
        jsonResponse(['ok' => false, 'message' => 'Şifre en az 6 karakter olmalı.'], 422);
    }

    $pdo = db();

    $exists = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
    $exists->execute([':email' => $email]);

    if ($exists->fetch()) {
        jsonResponse(['ok' => false, 'message' => 'Bu e-posta zaten kayıtlı.'], 409);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :password_hash)'
    );
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':password_hash' => password_hash($password, PASSWORD_DEFAULT)
    ]);

    $_SESSION['user_id'] = (int) $pdo->lastInsertId();

    jsonResponse([
        'ok' => true,
        'message' => 'Kayıt başarılı.',
        'user' => currentUser()
    ], 201);
}

function handleLogin(array $input): void
{
    $email = mb_strtolower(sanitize($input['email'] ?? ''));
    $password = (string) ($input['password'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        jsonResponse(['ok' => false, 'message' => 'E-posta ve şifre gerekli.'], 422);
    }

    $stmt = db()->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, (string) $user['password_hash'])) {
        jsonResponse(['ok' => false, 'message' => 'E-posta veya şifre hatalı.'], 401);
    }

    $_SESSION['user_id'] = (int) $user['id'];

    jsonResponse([
        'ok' => true,
        'message' => 'Giriş başarılı.',
        'user' => currentUser()
    ]);
}

function handleLogout(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            (string) $params['path'],
            (string) $params['domain'],
            (bool) $params['secure'],
            (bool) $params['httponly']
        );
    }
    session_destroy();

    jsonResponse([
        'ok' => true,
        'message' => 'Çıkış yapıldı.'
    ]);
}
