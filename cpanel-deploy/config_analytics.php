<?php
/**
 * CONFIGURAÇÃO SEGURA DO DASHBOARD UTXICA
 * 
 * INSTRUÇÕES: 
 * Este arquivo deve ser colocado UM NÍVEL ACIMA da pasta public_html 
 * para que não seja acessível via navegador.
 */

// ─── Supabase ────────────────────────────────────────────────────────────────
define('SUPABASE_URL', 'https://vossa_id_supabase.supabase.co');
define('SUPABASE_SERVICE_ROLE_KEY', 'sua_service_role_key_aqui'); // Use Service Role para as APIs

// ─── Google Gemini & YouTube ────────────────────────────────────────────────
define('GEMINI_API_KEY', 'AIzaSyDCjfItKWINyEUh4FDfBNxyCZvB65Iaimw');
define('GOOGLE_API_KEY', 'AIzaSyDCjfItKWINyEUh4FDfBNxyCZvB65Iaimw'); // Geralmente a mesma do Gemini

// ─── Resend (E-mail) ─────────────────────────────────────────────────────────
define('RESEND_API_KEY', 're_X2F2PaHH_BGFVY3vCcuocB3Guzp2Y57Av');

// ─── Configurações Gerais ────────────────────────────────────────────────────
define('ALLOWED_ORIGIN', 'https://sistema.conventinho.org.br'); // Mude para seu domínio em produção
