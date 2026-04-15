<?php
/**
 * CRON JOB PHP PARA SINCRONIZAÇÃO DE MÉTRICAS (FACEBOOK/INSTAGRAM)
 * 
 * Substitui o Vercel Cron. Deve ser agendado no cPanel Cron Jobs.
 * Exemplo de comando no cPanel: /usr/local/bin/php /home/user/public_html/api/cron.php > /dev/null 2>&1
 */

require_once dirname(__DIR__, 3) . '/config_analytics.php';

// Segurança opcional: verificar secret via GET se rodar via URL
// if ($_GET['secret'] !== 'seu_cron_secret') { die('Unauthorized'); }

header("Content-Type: application/json");

// Função Auxiliar para cURL
function fetch_curl($url) {
    if (!$url) return null;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'User-Agent: Analytics-Dashboard-Cpanel'
    ]);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ($status === 200) ? $response : null;
}

try {
    // 1. Buscar contas ativas no Supabase
    $supabase_url = SUPABASE_URL . "/rest/v1/social_accounts?is_active=eq.true";
    
    $ch = curl_init($supabase_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . SUPABASE_SERVICE_ROLE_KEY,
        'Authorization: Bearer ' . SUPABASE_SERVICE_ROLE_KEY
    ]);
    
    $acc_response_raw = curl_exec($ch);
    $acc_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($acc_status !== 200) {
        throw new Exception("Falha ao buscar contas: " . $acc_response_raw);
    }

    $accounts = json_decode($acc_response_raw, true);
    if (empty($accounts)) {
        echo json_encode(['success' => true, 'message' => 'Sem contas ativas.']);
        exit;
    }

    $yesterdayDate = date('Y-m-d', strtotime('yesterday'));
    $results = [];

    // 2. Iterar e buscar dados das APIs
    foreach ($accounts as $account) {
        $followers = 0; $reach = 0; $impressions = 0; $engagement = 0; $views = 0; $clicks = 0;
        $token = $account['access_token'];
        $pid = $account['platform_user_id'];
        $platform = $account['platform'];

        try {
            if ($platform === "facebook") {
                // Seguidores
                $fb_url = "https://graph.facebook.com/v19.0/$pid?fields=fan_count&access_token=$token";
                $res = fetch_curl($fb_url);
                if ($res) $followers = json_decode($res, true)['fan_count'] ?? 0;

                // Insights
                $ins_url = "https://graph.facebook.com/v19.0/$pid/insights?metric=page_views_total,page_post_engagements,page_impressions&period=day&date_preset=yesterday&access_token=$token";
                $ins_res = fetch_curl($ins_url);
                if ($ins_res) {
                    $iData = json_decode($ins_res, true);
                    foreach ($iData['data'] ?? [] as $m) {
                        $val = $m['values'][0]['value'] ?? 0;
                        if ($m['name'] === "page_views_total") $views = $val;
                        if ($m['name'] === "page_post_engagements") $engagement = $val;
                        if ($m['name'] === "page_impressions") {
                            $impressions = $val;
                            $reach = floor($val * 0.85);
                        }
                    }
                }
            } 
            else if ($platform === "instagram") {
                // Seguidores
                $ig_url = "https://graph.facebook.com/v19.0/$pid?fields=followers_count&access_token=$token";
                $res = fetch_curl($ig_url);
                if ($res) $followers = json_decode($res, true)['followers_count'] ?? 0;

                // Insights
                $ins_url = "https://graph.facebook.com/v19.0/$pid/insights?metric=reach,impressions&period=day&date_preset=yesterday&access_token=$token";
                $ins_res = fetch_curl($ins_url);
                if ($ins_res) {
                    $iData = json_decode($ins_res, true);
                    foreach ($iData['data'] ?? [] as $m) {
                        $val = $m['values'][0]['value'] ?? 0;
                        if ($m['name'] === "reach") $reach = $val;
                        if ($m['name'] === "impressions") {
                            $impressions = $val;
                            $views = $val;
                        }
                    }
                }
            }
            else if ($platform === "youtube") {
                // Seguidores (Subscribers)
                $yt_url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=$pid&key=" . GOOGLE_API_KEY;
                $res = fetch_curl($yt_url);
                if ($res) {
                    $yt_data = json_decode($res, true);
                    $followers = $yt_data['items'][0]['statistics']['subscriberCount'] ?? 0;
                    $views = $yt_data['items'][0]['statistics']['viewCount'] ?? 0;
                }
            }

            // 3. Upsert no Supabase
            $upsert_url = SUPABASE_URL . "/rest/v1/metrics";
            $metricData = [
                'account_id' => $account['id'],
                'platform' => $platform,
                'date' => $yesterdayDate,
                'followers' => $followers,
                'reach' => $reach,
                'impressions' => $impressions,
                'engagement' => $engagement,
                'views' => $views,
                'clicks' => $clicks
            ];

            $ch = curl_init($upsert_url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($metricData));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'apikey: ' . SUPABASE_SERVICE_ROLE_KEY,
                'Authorization: Bearer ' . SUPABASE_SERVICE_ROLE_KEY,
                'Prefer: resolution=merge-duplicates'
            ]);
            curl_exec($ch);
            curl_close($ch);

            $results[] = ['accountId' => $account['id'], 'status' => 'success'];
        } catch (Exception $e) {
            $results[] = ['accountId' => $account['id'], 'status' => 'error', 'error' => $e->getMessage()];
        }
    }

    echo json_encode(['success' => true, 'processed' => count($accounts), 'results' => $results]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
