<?php
/**
 * PROXY PHP PARA ENVIO DE CONVITES (RESEND + SUPABASE)
 * 
 * Substitui o endpoint Vercel /api/send-invite
 */

require_once dirname(__DIR__, 2) . '/config_analytics.php';

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
$teamId = $data['teamId'] ?? null;
$email = $data['email'] ?? null;
$role = $data['role'] ?? null;
$teamName = $data['teamName'] ?? 'Sua Equipe';

if (!$token || !$teamId || !$email || !$role) {
    http_response_code(400);
    echo json_encode(['error' => 'Parâmetros ausentes no corpo da requisição']);
    exit;
}

try {
    // 1. Inserir no Supabase (tabela invitations)
    $supabase_url = SUPABASE_URL . "/rest/v1/invitations";
    $inviteData = [
        'team_id' => $teamId,
        'email' => $email,
        'role' => $role
    ];

    $ch = curl_init($supabase_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($inviteData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'apikey: ' . SUPABASE_SERVICE_ROLE_KEY,
        'Authorization: Bearer ' . $token,
        'Prefer: return=representation, resolution=merge-duplicates'
    ]);

    $db_response_raw = curl_exec($ch);
    $db_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($db_status >= 300) {
        throw new Exception("Erro ao criar convite no Supabase: " . $db_response_raw);
    }

    $db_data = json_decode($db_response_raw, true);
    $invId = $db_data[0]['id'] ?? null;

    if (!$invId) {
        throw new Exception("ID do convite não retornada.");
    }

    // 2. Produzir URL de Aceite
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'];
    $acceptLink = $protocol . "://" . $host . "/invite/" . $invId;

    // 3. Disparar Email via Resend
    $resend_url = "https://api.resend.com/emails";
    
    $emailHtml = '
    <div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; padding: 40px 20px; background-color: #050505; color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Conventinho <span style="color: #f59e0b;">Analytics</span></h1>
        </div>
        
        <div style="background-color: #111111; padding: 30px; border-radius: 12px; border: 1px solid #333333;">
            <h2 style="margin-top: 0; color: #ffffff; font-size: 20px;">Você recebeu um convite!</h2>
            <p style="color: #a1a1aa; line-height: 1.6; font-size: 15px;">
                Você foi convidado para colaborar e acessar o painel de métricas da equipe <strong>' . htmlspecialchars($teamName) . '</strong> como <strong><span style="color: #f59e0b; text-transform: uppercase; font-size: 13px;">' . htmlspecialchars($role) . '</span></strong>.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
                <a href="' . $acceptLink . '" style="background-color: #f59e0b; color: #050505; padding: 14px 28px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 8px; display: inline-block;">Visualizar Convite</a>
            </div>
            
            <p style="color: #71717a; font-size: 13px; margin-bottom: 0;">
                Se você não possui uma conta, ela será criada gratuitamente ao clicar no link. Caso não reconheça este convite, sinta-se livre para ignorá-lo.
            </p>
        </div>
    </div>';

    $payload = [
        'from' => 'Conventinho App <onboarding@resend.dev>',
        'to' => $email,
        'subject' => "Você foi convidado para a equipe $teamName",
        'html' => $emailHtml
    ];

    $ch = curl_init($resend_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . RESEND_API_KEY
    ]);

    $mail_response = curl_exec($ch);
    $mail_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($mail_status >= 300) {
        // Convite criado mas e-mail falhou
        echo json_encode([
            'success' => true, 
            'message' => 'Convite criado, mas falha ao entregar e-mail físico', 
            'details' => json_decode($mail_response)
        ]);
        exit;
    }

    echo json_encode([
        'success' => true, 
        'message' => 'Convite enviado com e-mail!', 
        'data' => $db_data[0]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Falha ao processar convite', 'details' => $e->getMessage()]);
}
