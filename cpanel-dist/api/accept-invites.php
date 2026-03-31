<?php
/**
 * PROXY PHP PARA ACEITAÇÃO DE CONVITES (SUPABASE AUTH + DB)
 * 
 * Substitui o endpoint Vercel /api/accept-invites
 */

require_once '../config.php';

header("Access-Control-Allow-Origin: " . ALLOWED_ORIGIN);
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$json_input = file_get_contents('php://input');
$data = json_decode($json_input, true);
$token = $data['token'] ?? null;

if (!$token) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing auth token']);
    exit;
}

try {
    // 1. Verificar autenticidade do usuário via Supabase Auth
    // Endpoint: https://ID.supabase.co/auth/v1/user
    $auth_url = SUPABASE_URL . "/auth/v1/user";
    
    $ch = curl_init($auth_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . SUPABASE_SERVICE_ROLE_KEY, // Service role to access Auth
        'Authorization: Bearer ' . $token
    ]);
    
    $auth_response_raw = curl_exec($ch);
    $auth_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($auth_status !== 200) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized', 'details' => $auth_response_raw]);
        exit;
    }

    $user_data = json_decode($auth_response_raw, true);
    $email = $user_data['email'] ?? null;
    $userId = $user_data['id'] ?? null;

    if (!$email) {
        throw new Exception("User has no email");
    }

    // 2. Buscar convites pendentes
    $query_url = SUPABASE_URL . "/rest/v1/invitations?email=eq." . urlencode($email) . "&status=eq.pending";
    
    $ch = curl_init($query_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . SUPABASE_SERVICE_ROLE_KEY,
        'Authorization: Bearer ' . SUPABASE_SERVICE_ROLE_KEY // Use service role for admin access
    ]);
    
    $inv_response_raw = curl_exec($ch);
    curl_close($ch);
    
    $pendingInvites = json_decode($inv_response_raw, true);

    if (empty($pendingInvites)) {
        echo json_encode(['message' => 'No pending invitations found', 'processed' => 0]);
        exit;
    }

    $processedCount = 0;

    // 3. Aceitar cada convite
    foreach ($pendingInvites as $invite) {
        // Inserir em team_members
        $member_url = SUPABASE_URL . "/rest/v1/team_members";
        $memberData = [
            'team_id' => $invite['team_id'],
            'user_id' => $userId,
            'role' => $invite['role']
        ];

        $ch = curl_init($member_url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($memberData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'apikey: ' . SUPABASE_SERVICE_ROLE_KEY,
            'Authorization: Bearer ' . SUPABASE_SERVICE_ROLE_KEY,
            'Prefer: resolution=merge-duplicates'
        ]);
        curl_exec($ch);
        $m_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($m_status < 400 || $m_status === 409) { // 409 is conflict (already member)
            // Marcar convite como aceito
            $update_url = SUPABASE_URL . "/rest/v1/invitations?id=eq." . $invite['id'];
            
            $ch = curl_init($update_url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PATCH");
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['status' => 'accepted']));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'apikey: ' . SUPABASE_SERVICE_ROLE_KEY,
                'Authorization: Bearer ' . SUPABASE_SERVICE_ROLE_KEY
            ]);
            curl_exec($ch);
            curl_close($ch);
            
            $processedCount++;
        }
    }

    echo json_encode([
        'success' => true, 
        'message' => "Processed $processedCount invitations.",
        'processed' => $processedCount
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
