<?php
/**
 * PONTE DE AUTENTICAÇÃO (SSO) com Debug
 */
session_start();

// Procura o arquivo de configuração em mais de um lugar por conta do subdomínio
$possiblePaths = [
    dirname(__DIR__, 2) . '/config_analytics.php', // public_html/sistema.conventinho.org.br/
    dirname(__DIR__, 3) . '/config_analytics.php'  // public_html/
];

$configFile = '';
$hasConfig = false;

foreach ($possiblePaths as $path) {
    if (file_exists($path)) {
        $configFile = $path;
        $hasConfig = true;
        break;
    }
}

if ($hasConfig) {
    require_once $configFile;
    // Tenta usar a ALLOWED_ORIGIN se existir, senão permite baseada na requisição
    $origin = defined('ALLOWED_ORIGIN') ? ALLOWED_ORIGIN : ($_SERVER['HTTP_ORIGIN'] ?? '*');
    header("Access-Control-Allow-Origin: " . $origin);
} else {
    // Fallback absoluto para debug
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    header("Access-Control-Allow-Origin: " . $origin);
}

header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$isLoggedIn = false;
$userData = null;

// Tenta achar as chaves
if (isset($_SESSION['usuario_id']) || isset($_SESSION['logado'])) {
    $isLoggedIn = true;
    $userData = [
        'id' => $_SESSION['usuario_id'] ?? 'ext-user',
        'email' => $_SESSION['usuario_email'] ?? 'comunicacao@conventinho.org.br',
        'name' => $_SESSION['usuario_nome'] ?? 'Usuário Conventinho'
    ];
}

// Retornar Resultado com debug pesado
echo json_encode([
    'authenticated' => $isLoggedIn,
    'method' => 'php_session',
    'user' => $userData,
    'debug_config_found' => $hasConfig,
    'debug_config_path_tested' => $configFile,
    'debug_session_active' => !empty($_SESSION),
    'debug_session_keys' => empty($_SESSION) ? [] : array_keys($_SESSION)
]);
