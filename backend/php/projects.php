<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    listProjects();
}

if ($method === 'POST') {
    handleVote();
}

jsonResponse([
    'ok' => false,
    'message' => 'Geçersiz istek yöntemi.'
], 405);

function listProjects(): void
{
    $stmt = db()->query(
        'SELECT id, slug, title, category, description, tech_stack, github_url, demo_url, status, likes_count, dislikes_count
         FROM projects
         ORDER BY id ASC'
    );
    $projects = $stmt->fetchAll();

    foreach ($projects as &$project) {
        $project['tech_stack'] = array_values(array_filter(array_map('trim', explode(',', (string) $project['tech_stack']))));
    }

    jsonResponse([
        'ok' => true,
        'projects' => $projects
    ]);
}

function handleVote(): void
{
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        jsonResponse(['ok' => false, 'message' => 'Geçersiz JSON içeriği.'], 422);
    }

    $projectId = (int) ($input['project_id'] ?? 0);
    $voteType = sanitize((string) ($input['vote_type'] ?? ''));

    if ($projectId < 1) {
        jsonResponse(['ok' => false, 'message' => 'Geçerli bir proje seçmelisin.'], 422);
    }

    if (!in_array($voteType, ['like', 'dislike'], true)) {
        jsonResponse(['ok' => false, 'message' => 'Oy tipi like veya dislike olmalı.'], 422);
    }

    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown-agent';
    $voterKey = hash('sha256', $ip . '|' . $agent);

    $pdo = db();
    $pdo->beginTransaction();

    try {
        $check = $pdo->prepare('SELECT id, vote_type FROM project_votes WHERE project_id = :project_id AND voter_key = :voter_key LIMIT 1');
        $check->execute([
            ':project_id' => $projectId,
            ':voter_key' => $voterKey
        ]);
        $existing = $check->fetch();

        if (!$existing) {
            $insertVote = $pdo->prepare(
                'INSERT INTO project_votes (project_id, vote_type, voter_key) VALUES (:project_id, :vote_type, :voter_key)'
            );
            $insertVote->execute([
                ':project_id' => $projectId,
                ':vote_type' => $voteType,
                ':voter_key' => $voterKey
            ]);

            $field = $voteType === 'like' ? 'likes_count' : 'dislikes_count';
            $pdo->prepare("UPDATE projects SET {$field} = {$field} + 1 WHERE id = :id")->execute([':id' => $projectId]);
        } elseif ($existing['vote_type'] !== $voteType) {
            $pdo->prepare('UPDATE project_votes SET vote_type = :vote_type WHERE id = :id')->execute([
                ':vote_type' => $voteType,
                ':id' => (int) $existing['id']
            ]);

            if ($voteType === 'like') {
                $pdo->prepare('UPDATE projects SET likes_count = likes_count + 1, dislikes_count = CASE WHEN dislikes_count > 0 THEN dislikes_count - 1 ELSE 0 END WHERE id = :id')
                    ->execute([':id' => $projectId]);
            } else {
                $pdo->prepare('UPDATE projects SET dislikes_count = dislikes_count + 1, likes_count = CASE WHEN likes_count > 0 THEN likes_count - 1 ELSE 0 END WHERE id = :id')
                    ->execute([':id' => $projectId]);
            }
        }

        $countStmt = $pdo->prepare('SELECT likes_count, dislikes_count FROM projects WHERE id = :id LIMIT 1');
        $countStmt->execute([':id' => $projectId]);
        $counts = $countStmt->fetch();

        $pdo->commit();

        jsonResponse([
            'ok' => true,
            'message' => 'Oyun kaydedildi.',
            'counts' => [
                'likes' => (int) ($counts['likes_count'] ?? 0),
                'dislikes' => (int) ($counts['dislikes_count'] ?? 0),
            ]
        ]);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        jsonResponse([
            'ok' => false,
            'message' => 'Oy işlemi sırasında bir hata oluştu.'
        ], 500);
    }
}
