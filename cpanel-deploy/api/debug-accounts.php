<?php
/**
 * DIAGNÓSTICO: Ver o que está salvo no banco de dados (social_accounts)
 * Acesse: https://sistema.conventinho.org.br/analise/api/debug-accounts.php
 * REMOVA ESSE ARQUIVO APÓS O DIAGNÓSTICO!
 */
session_start();

$possiblePaths = [
    dirname(__DIR__, 2) . '/config_analytics.php',
    dirname(__DIR__, 3) . '/config_analytics.php'
];

foreach ($possiblePaths as $path) {
    if (file_exists($path)) {
        require_once $path;
        break;
    }
}

header("Content-Type: application/json");
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: " . $origin);
header("Access-Control-Allow-Credentials: true");

// Conectar ao Supabase via REST API
$supabaseUrl = defined('SUPABASE_URL') ? SUPABASE_URL : '';
$supabaseKey = defined('SUPABASE_SERVICE_KEY') ? SUPABASE_SERVICE_KEY : '';

if (!$supabaseUrl || !$supabaseKey) {
    echo json_encode([
        'error' => 'Supabase não configurado no config_analytics.php',
        'hint' => 'Verifique as constantes SUPABASE_URL e SUPABASE_SERVICE_KEY'
    ]);
    exit;
}

// Buscar todas as contas vinculadas
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $supabaseUrl . '/rest/v1/social_accounts?select=user_id,platform,platform_user_id,username,display_name,connected_at,is_active&order=connected_at.desc&limit=10');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'apikey: ' . $supabaseKey,
    'Authorization: Bearer ' . $supabaseKey,
    'Content-Type: application/json'
]);
$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo json_encode([
    'http_code' => $httpCode,
    'accounts' => json_decode($result),
    'timestamp' => date('c')
], JSON_PRETTY_PRINT);
