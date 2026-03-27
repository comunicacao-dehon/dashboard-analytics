// ─── Serviço de Integração Social ───────────────────────────────────────────
// Camada central que gerencia as contas vinculadas e busca métricas de cada rede.
// Quando as APIs reais forem conectadas, basta substituir os métodos abaixo.

import { supabase } from "@/lib/supabase";
import type {
  SocialPlatform,
  SocialAccount,
  SocialMetrics,
  InstagramMetrics,
  FacebookMetrics,
  YouTubeMetrics,
  SocialPost,
  ApiResponse,
} from "@/types/social";

// ─── Contas Vinculadas (CRUD via Supabase) ──────────────────────────────────

export async function getConnectedAccounts(userId: string): Promise<SocialAccount[]> {
  const { data, error } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true);

  if (error) {
    console.error("Erro ao buscar contas vinculadas:", error);
    return [];
  }

  return (data ?? []).map(mapDbToSocialAccount);
}

export async function connectAccount(account: Omit<SocialAccount, "id">): Promise<ApiResponse<SocialAccount>> {
  const { data, error } = await supabase
    .from("social_accounts")
    .upsert({
      user_id: account.userId,
      platform: account.platform,
      platform_user_id: account.platformUserId,
      username: account.username,
      display_name: account.displayName,
      profile_picture_url: account.profilePictureUrl,
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
      token_expires_at: account.tokenExpiresAt,
      connected_at: new Date().toISOString(),
      is_active: true,
    }, { onConflict: "user_id,platform" })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message, timestamp: new Date().toISOString() };
  }

  return { success: true, data: mapDbToSocialAccount(data), timestamp: new Date().toISOString() };
}

export async function disconnectAccount(userId: string, platform: SocialPlatform): Promise<ApiResponse<null>> {
  const { error } = await supabase
    .from("social_accounts")
    .update({ is_active: false })
    .eq("user_id", userId)
    .eq("platform", platform);

  if (error) {
    return { success: false, error: error.message, timestamp: new Date().toISOString() };
  }

  return { success: true, timestamp: new Date().toISOString() };
}

// ─── Buscar Métricas (Placeholder para APIs Reais) ──────────────────────────
// TODO: Substituir por chamadas reais às APIs do Instagram Graph, Facebook Graph e YouTube Data API.

export async function fetchInstagramMetrics(_account: SocialAccount): Promise<ApiResponse<InstagramMetrics>> {
  // Placeholder — será substituído pela chamada real à Instagram Graph API
  return {
    success: false,
    error: "Instagram API ainda não configurada. Configure o token de acesso nas configurações.",
    timestamp: new Date().toISOString(),
  };
}

export async function fetchFacebookMetrics(_account: SocialAccount): Promise<ApiResponse<FacebookMetrics>> {
  // Placeholder — será substituído pela chamada real à Facebook Graph API
  return {
    success: false,
    error: "Facebook API ainda não configurada. Configure o token de acesso nas configurações.",
    timestamp: new Date().toISOString(),
  };
}

export async function fetchYouTubeMetrics(_account: SocialAccount): Promise<ApiResponse<YouTubeMetrics>> {
  // Placeholder — será substituído pela chamada real à YouTube Data API v3
  return {
    success: false,
    error: "YouTube API ainda não configurada. Configure o token de acesso nas configurações.",
    timestamp: new Date().toISOString(),
  };
}

export async function fetchRecentPosts(_account: SocialAccount, _limit: number = 10): Promise<ApiResponse<SocialPost[]>> {
  // Placeholder — será substituído pela chamada real
  return {
    success: false,
    error: "API de posts ainda não configurada.",
    timestamp: new Date().toISOString(),
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function mapDbToSocialAccount(row: any): SocialAccount {
  return {
    id: row.id,
    userId: row.user_id,
    platform: row.platform,
    platformUserId: row.platform_user_id,
    username: row.username,
    displayName: row.display_name,
    profilePictureUrl: row.profile_picture_url,
    accessToken: row.access_token,
    refreshToken: row.refresh_token,
    tokenExpiresAt: row.token_expires_at,
    connectedAt: row.connected_at,
    isActive: row.is_active,
  };
}
