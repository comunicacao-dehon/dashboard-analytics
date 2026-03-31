<?php
/**
 * PONTE DE AUTENTICAÇÃO (SSO)
 * 
 * Este script verifica se o usuário já está logado no sistema principal (PHP)
 * e retorna os dados básicos para o Dashboard Analytics (React).
 */

// 1. Iniciar a sessão do PHP (deve ser a mesma do sistema principal)
session_start();

require_once dirname(__DIR__, 2) . '/config_analytics.php';

// 2. Configurações de CORS (Permitir que o React leia esta API)
header("Access-Control-Allow-Origin: " . ALLOWED_ORIGIN);
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// 3. Lógica de Verificação
// Ajuste os nomes das variáveis abaixo conforme o seu sistema atual usa!
$isLoggedIn = false;
$userData = null;

// Exemplo comum: verificar se existe um ID de usuário na sessão
if (isset($_SESSION['id_usuario']) || isset($_SESSION['user_id']) || isset($_SESSION['logged_in'])) {
    $isLoggedIn = true;
    $userData = [
        'id' => $_SESSION['id_usuario'] ?? $_SESSION['user_id'] ?? 'ext-user',
        'email' => $_SESSION['email'] ?? $_SESSION['user_email'] ?? 'comunicacao@conventinho.org.br',
        'name' => $_SESSION['nome_usuario'] ?? $_SESSION['user_name'] ?? 'Usuário Conventinho'
    ];
}

// 4. Retornar Resultado
echo json_encode([
    'authenticated' => $isLoggedIn,
    'method' => 'php_session',
    'user' => $userData,
    'debug_session_active' => !empty($_SESSION)
]);
