<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    jsonResponse([
        'ok' => false,
        'message' => 'Geçersiz istek metodu.'
    ], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    $input = $_POST;
}

$name = sanitize($input['name'] ?? '');
$email = mb_strtolower(sanitize($input['email'] ?? ''));
$subject = sanitize($input['subject'] ?? '');
$message = sanitize($input['message'] ?? '');

if (mb_strlen($name) < 2) {
    jsonResponse(['ok' => false, 'message' => 'Ad en az 2 karakter olmalı.'], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['ok' => false, 'message' => 'Geçerli bir e-posta gir.'], 422);
}

if (mb_strlen($message) < 10) {
    jsonResponse(['ok' => false, 'message' => 'Mesaj en az 10 karakter olmalı.'], 422);
}

if (mb_strlen($message) > 1000) {
    jsonResponse(['ok' => false, 'message' => 'Mesaj en fazla 1000 karakter olmalı.'], 422);
}

$user = currentUser();
$userId = $user ? (int) $user['id'] : null;

$stmt = db()->prepare(
    'INSERT INTO messages (name, email, subject, message, user_id) 
     VALUES (:name, :email, :subject, :message, :user_id)'
);

$stmt->bindValue(':name', $name, PDO::PARAM_STR);
$stmt->bindValue(':email', $email, PDO::PARAM_STR);
$stmt->bindValue(':subject', $subject, PDO::PARAM_STR);
$stmt->bindValue(':message', $message, PDO::PARAM_STR);
if ($userId === null) {
    $stmt->bindValue(':user_id', null, PDO::PARAM_NULL);
} else {
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
}
$stmt->execute();

jsonResponse([
    'ok' => true,
    'message' => 'Mesajın başarıyla alındı. En kısa sürede dönüş yapılacak.'
], 201);
