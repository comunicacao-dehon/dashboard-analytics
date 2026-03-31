<?php
/**
 * PROXY PHP PARA GOOGLE GEMINI AI + SUPABASE
 * 
 * Substitui o endpoint Vercel /api/generate-insights
 */

require_once '../config.php';

// Configurações de CORS
header("Access-Control-Allow-Origin: " . ALLOWED_ORIGIN);
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Responder pré-vôo OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Obter corpo da requisição
$json_input = file_get_contents('php://input');
$data = json_decode($json_input, true);

$token = $data['token'] ?? null;
$teamId = $data['teamId'] ?? null;
$metricsPayload = $data['metricsPayload'] ?? null;

if (!$token || !$teamId || !$metricsPayload) {
    http_response_code(400);
    echo json_encode(['error' => 'Parâmetros ausentes no corpo da requisição']);
    exit;
}

try {
    // 1. Preparar Prompt para o Gemini
    $prompt = "Você é o Assessor Chefe de Marketing da agência Conventinho Analytics.\n"
            . "Aqui estão os dados sintéticos/reais de tráfego de nossos clientes das últimas semanas:\n"
            . json_encode($metricsPayload) . "\n\n"
            . "Sua missão é agir de forma inteligente e analisar os picos ou quedas de Engajamento, Alcance ou Seguidores.\n"
            . "Com base NESSES DADOS ESTRITAMENTE, crie 3 (três) insights curtos e agressivamente úteis.\n\n"
            . "Retorne EXATAMENTE um array JSON puro (sem marcação markdown como ```json). O formato de cada objeto do array deve ser:\n"
            . "{\n"
            . '  "insight_type": "growth" | "drop" | "viral" | "suggestion",' . "\n"
            . '  "title": "Título Curto (Ex: Alta de Reels)",' . "\n"
            . '  "description": "O que causou isso de forma direta (Ex: Notei que a retenção subiu 30% nos dias X).",' . "\n"
            . '  "actionable_step": "O que o time deve fazer AGORA (Ex: Impulsione este conteúdo urgentemente com R$ 50).",' . "\n"
            . '  "platform": "instagram" | "facebook" | "youtube"' . "\n"
            . "}\n"
            . "Não escreva NENHUM TEXTO fora do Array JSON.";

    // 2. Chamar Gemini API via cURL
    // Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY
    $gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . GEMINI_API_KEY;
    
    $payload = [
        "contents" => [
            [
                "parts" => [
                    ["text" => $prompt]
                ]
            ]
        ]
    ];

    $ch = curl_init($gemini_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $ai_response_raw = curl_exec($ch);
    $ai_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($ai_status !== 200) {
        throw new Exception("Erro na API do Gemini: " . $ai_response_raw);
    }

    $ai_data = json_decode($ai_response_raw, true);
    $responseText = $ai_data['candidates'][0]['content']['parts'][0]['text'] ?? '';

    // 3. Limpar JSON retornado pela IA
    $cleanJSON = trim(str_replace(['```json', '```'], '', $responseText));
    $generatedArray = json_decode($cleanJSON, true);

    if (!is_array($generatedArray)) {
        throw new Exception("A IA não retornou um array de insights válido: " . $responseText);
    }

    // 4. Preparar para inserir no Supabase
    $timestamp = date('c');
    $rowsToInsert = [];
    foreach ($generatedArray as $index => $aiItem) {
        $rowsToInsert[] = [
            'id' => 'ai-' . time() . '-' . $index,
            'team_id' => $teamId,
            'platform' => $aiItem['platform'] ?? 'instagram',
            'insight_type' => $aiItem['insight_type'] ?? 'suggestion',
            'title' => $aiItem['title'],
            'description' => $aiItem['description'],
            'actionable_step' => $aiItem['actionable_step'],
            'metrics_snapshot' => new stdClass(),
            'created_at' => $timestamp
        ];
    }

    // 5. Inserir no Supabase via REST API
    // Endpoint: https://ID.supabase.co/rest/v1/ai_insights_history
    $supabase_url = SUPABASE_URL . "/rest/v1/ai_insights_history";
    
    $ch = curl_init($supabase_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($rowsToInsert));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'apikey: ' . SUPABASE_SERVICE_ROLE_KEY,
        'Authorization: Bearer ' . $token,
        'Prefer: return=representation'
    ]);

    $db_response = curl_exec($ch);
    $db_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($db_status >= 300) {
        // Se falhar em salvar, retornamos o que a IA gerou de qualquer forma (como no TS original)
        echo json_encode([
            'success' => true, 
            'data' => $rowsToInsert, 
            'dbWarning' => "Falha ao persistir no DB: " . $db_response
        ]);
        exit;
    }

    echo json_encode(['success' => true, 'data' => json_decode($db_response)]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Falha ao processar Inteligência Artificial', 'details' => $e->getMessage()]);
}
