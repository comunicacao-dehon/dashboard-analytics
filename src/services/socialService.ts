// ─── Serviço de Integração Social ───────────────────────────────────────────
// Camada central que gerencia as contas vinculadas e busca métricas de cada rede.

import { supabase } from "@/lib/supabase";
import type {
  SocialPlatform,
  SocialAccount,
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

// ─── Instagram Graph API ────────────────────────────────────────────────────
// Docs: https://developers.facebook.com/docs/instagram-api

export async function fetchInstagramMetrics(account: SocialAccount): Promise<ApiResponse<InstagramMetrics>> {
  try {
    // 1. Buscar dados básicos do perfil
    const profileRes = await fetch(
      `https://graph.facebook.com/v19.0/${account.platformUserId}?fields=followers_count,media_count,username,name,profile_picture_url&access_token=${account.accessToken}`
    );

    if (!profileRes.ok) {
      const err = await profileRes.json();
      return { success: false, error: err.error?.message || "Erro ao buscar perfil Instagram", timestamp: new Date().toISOString() };
    }

    const profile = await profileRes.json();

    // 2. Buscar insights (últimos 28 dias)
    const sinceDate = getDateDaysAgo(28);
    const untilDate = getToday();
    const insightsRes = await fetch(
      `https://graph.facebook.com/v19.0/${account.platformUserId}/insights?metric=reach,impressions,follower_count&period=day&since=${sinceDate}&until=${untilDate}&access_token=${account.accessToken}`
    );

    let totalReach = 0;
    let totalImpressions = 0;

    const historicalData: any[] = [];
    const dateMap = new Map<string, any>();

    // Pré-preencher dateMap para 28 dias
    for(let i = 27; i >= 0; i--) {
        const d = getDateDaysAgo(i);
        dateMap.set(d, {
          date: d,
          followers: profile.followers_count || 0,
          views: 0,
          engagement: 0,
          impressions: 0,
          reach: 0,
          likes: 0
        });
    }

    if (insightsRes.ok) {
      const insights = await insightsRes.json();
      for (const metric of insights.data || []) {
        const values = metric.values || [];
        
        let sum = 0;
        
        for (const v of values) {
           if (!v.end_time) continue;
           sum += (v.value || 0);
           
           const dStr = v.end_time.split('T')[0]; 
           
           if (dateMap.has(dStr)) {
             const entry = dateMap.get(dStr);
             if (metric.name === "reach") entry.reach = v.value;
             if (metric.name === "impressions") {
                entry.impressions = v.value;
                entry.views = v.value; // Alias logic
             }
             if (metric.name === "follower_count") entry.followers = v.value; 
           }
        }

        if (metric.name === "reach") totalReach = sum;
        if (metric.name === "impressions") totalImpressions = sum;
      }
    }

    // Mapear o Map ordenado de volta para um array
    dateMap.forEach((value) => {
        historicalData.push(value);
    });
    historicalData.sort((a,b) => a.date.localeCompare(b.date));

    return {
      success: true,
      data: {
        followers: profile.followers_count || 0,
        followersGrowth: 0, // Calculado via histórico no banco
        engagementRate: 0,  // Calculado a partir dos posts
        totalPosts: profile.media_count || 0,
        totalReach,
        totalImpressions,
        reelsPlays: 0,
        storiesViews: 0,
        saves: 0,
        shares: 0,
        updatedAt: new Date().toISOString(),
        historicalData
      },
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro desconhecido", timestamp: new Date().toISOString() };
  }
}

// ─── Facebook Graph API ─────────────────────────────────────────────────────
// Docs: https://developers.facebook.com/docs/graph-api/reference/page

export async function fetchFacebookMetrics(account: SocialAccount): Promise<ApiResponse<FacebookMetrics>> {
  try {
    // 1. Buscar dados da página
    const pageRes = await fetch(
      `https://graph.facebook.com/v19.0/${account.platformUserId}?fields=fan_count,name,picture&access_token=${account.accessToken}`
    );

    if (!pageRes.ok) {
      const err = await pageRes.json();
      return { success: false, error: err.error?.message || "Erro ao buscar página Facebook", timestamp: new Date().toISOString() };
    }

    const page = await pageRes.json();

    // 2. Buscar insights da página (últimos 28 dias - POR DIA)
    const sinceDate = getDateDaysAgo(28);
    const untilDate = getToday();
    const insightsRes = await fetch(
      `https://graph.facebook.com/v19.0/${account.platformUserId}/insights?metric=page_views_total,page_post_engagements,page_impressions,page_fans&period=day&since=${sinceDate}&until=${untilDate}&access_token=${account.accessToken}`
    );

    let pageViews = 0;
    let engagements = 0;
    let impressions = 0;

    const historicalData: any[] = [];
    const dateMap = new Map<string, any>();

    // Pré-preencher dateMap para 28 dias
    for(let i = 27; i >= 0; i--) {
        const d = getDateDaysAgo(i);
        dateMap.set(d, {
          date: d,
          followers: page.fan_count || 0,
          views: 0,
          engagement: 0,
          impressions: 0,
          reach: 0,
          likes: page.fan_count || 0
        });
    }

    if (insightsRes.ok) {
      const insights = await insightsRes.json();
      for (const metric of insights.data || []) {
        const values = metric.values || [];
        
        let sum = 0;
        let lastValue = 0;

        for (const v of values) {
           if (!v.end_time) continue;
           sum += (v.value || 0);
           lastValue = v.value || 0;
           
           // A API retorna end_time como ISO (e.g. 2023-10-15T07:00:00+0000)
           // Corrigir subtraindo um dia dependendo do timezone ou apenas pegando o dia atual de interesse:
           const dStr = v.end_time.split('T')[0]; 
           
           if (dateMap.has(dStr)) {
             const entry = dateMap.get(dStr);
             if (metric.name === "page_views_total") entry.views = v.value;
             if (metric.name === "page_post_engagements") entry.engagement = v.value;
             if (metric.name === "page_impressions") {
                entry.impressions = v.value;
                entry.reach = Math.floor(v.value * 0.85); 
             }
             if (metric.name === "page_fans") {
                entry.followers = v.value;
                entry.likes = v.value;
             }
           }
        }

        // A soma dos últimos 28 dias para visões globais
        if (metric.name === "page_views_total") pageViews = sum;
        if (metric.name === "page_post_engagements") engagements = sum;
        if (metric.name === "page_impressions") impressions = sum;
      }
    }
    
    // Mapear o Map ordenado de volta para um array
    dateMap.forEach((value) => {
        historicalData.push(value);
    });
    historicalData.sort((a,b) => a.date.localeCompare(b.date));

    return {
      success: true,
      data: {
        followers: page.fan_count || 0,
        followersGrowth: 0,
        engagementRate: 0,
        totalPosts: 0,
        totalReach: impressions,
        totalImpressions: impressions,
        pageViews,
        pageLikes: page.fan_count || 0,
        videoViews: 0,
        reactions: engagements,
        updatedAt: new Date().toISOString(),
        historicalData
      },
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro desconhecido", timestamp: new Date().toISOString() };
  }
}

// ─── YouTube Data API v3 ────────────────────────────────────────────────────
// Docs: https://developers.google.com/youtube/v3

export async function fetchYouTubeMetrics(account: SocialAccount): Promise<ApiResponse<YouTubeMetrics>> {
  try {
    // 1. Buscar dados do canal
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${account.platformUserId}&access_token=${account.accessToken}`
    );

    if (!channelRes.ok) {
      const err = await channelRes.json();
      return { success: false, error: err.error?.message || "Erro ao buscar canal YouTube", timestamp: new Date().toISOString() };
    }

    const channelData = await channelRes.json();
    const channel = channelData.items?.[0];

    if (!channel) {
      return { success: false, error: "Canal não encontrado", timestamp: new Date().toISOString() };
    }

    const stats = channel.statistics;

    return {
      success: true,
      data: {
        followers: parseInt(stats.subscriberCount || "0"),
        followersGrowth: 0,
        engagementRate: 0,
        totalPosts: parseInt(stats.videoCount || "0"),
        totalReach: parseInt(stats.viewCount || "0"),
        totalImpressions: 0,
        subscribers: parseInt(stats.subscriberCount || "0"),
        totalViews: parseInt(stats.viewCount || "0"),
        watchTimeHours: 0,       // Requer YouTube Analytics API
        averageViewDuration: 0,  // Requer YouTube Analytics API
        shortsViews: 0,          // Calculado via listagem de vídeos
        updatedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro desconhecido", timestamp: new Date().toISOString() };
  }
}

// ─── Buscar Posts Recentes (genérico) ───────────────────────────────────────

export async function fetchRecentPosts(account: SocialAccount, limit: number = 10): Promise<ApiResponse<SocialPost[]>> {
  switch (account.platform) {
    case "instagram":
      return fetchInstagramPosts(account, limit);
    case "facebook":
      return fetchFacebookPosts(account, limit);
    case "youtube":
      return fetchYouTubePosts(account, limit);
    default:
      return { success: false, error: "Plataforma não suportada", timestamp: new Date().toISOString() };
  }
}

async function fetchInstagramPosts(account: SocialAccount, limit: number): Promise<ApiResponse<SocialPost[]>> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${account.platformUserId}/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count&limit=${limit}&access_token=${account.accessToken}`
    );

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.error?.message || "Erro ao buscar posts", timestamp: new Date().toISOString() };
    }

    const data = await res.json();
    const posts: SocialPost[] = (data.data || []).map((post: any) => ({
      id: post.id,
      platform: "instagram" as const,
      type: mapInstagramMediaType(post.media_type),
      caption: post.caption || "",
      mediaUrl: post.media_url || "",
      thumbnailUrl: post.thumbnail_url || "",
      publishedAt: post.timestamp,
      likes: post.like_count || 0,
      comments: post.comments_count || 0,
      shares: 0,
      reach: 0,
      impressions: 0,
      engagementRate: 0,
    }));

    return { success: true, data: posts, timestamp: new Date().toISOString() };
  } catch (err: any) {
    return { success: false, error: err.message, timestamp: new Date().toISOString() };
  }
}

async function fetchFacebookPosts(account: SocialAccount, limit: number): Promise<ApiResponse<SocialPost[]>> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${account.platformUserId}/posts?fields=id,message,created_time,full_picture,shares,reactions.summary(true),comments.summary(true)&limit=${limit}&access_token=${account.accessToken}`
    );

    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.error?.message || "Erro ao buscar posts", timestamp: new Date().toISOString() };
    }

    const data = await res.json();
    const posts: SocialPost[] = (data.data || []).map((post: any) => ({
      id: post.id,
      platform: "facebook" as const,
      type: "text" as const,
      caption: post.message || "",
      mediaUrl: post.full_picture || "",
      thumbnailUrl: post.full_picture || "",
      publishedAt: post.created_time,
      likes: post.reactions?.summary?.total_count || 0,
      comments: post.comments?.summary?.total_count || 0,
      shares: post.shares?.count || 0,
      reach: 0,
      impressions: 0,
      engagementRate: 0,
    }));

    return { success: true, data: posts, timestamp: new Date().toISOString() };
  } catch (err: any) {
    return { success: false, error: err.message, timestamp: new Date().toISOString() };
  }
}

async function fetchYouTubePosts(account: SocialAccount, limit: number): Promise<ApiResponse<SocialPost[]>> {
  try {
    // Buscar uploads playlist
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${account.platformUserId}&access_token=${account.accessToken}`
    );
    const channelData = await channelRes.json();
    const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return { success: false, error: "Playlist de uploads não encontrada", timestamp: new Date().toISOString() };
    }

    // Buscar vídeos recentes
    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${limit}&access_token=${account.accessToken}`
    );
    const videosData = await videosRes.json();

    const videoIds = (videosData.items || []).map((v: any) => v.snippet.resourceId.videoId).join(",");

    // Buscar estatísticas dos vídeos
    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&access_token=${account.accessToken}`
    );
    const statsData = await statsRes.json();

    const posts: SocialPost[] = (statsData.items || []).map((video: any) => ({
      id: video.id,
      platform: "youtube" as const,
      type: "video" as const,
      caption: video.snippet.title || "",
      mediaUrl: `https://www.youtube.com/watch?v=${video.id}`,
      thumbnailUrl: video.snippet.thumbnails?.high?.url || "",
      publishedAt: video.snippet.publishedAt,
      likes: parseInt(video.statistics.likeCount || "0"),
      comments: parseInt(video.statistics.commentCount || "0"),
      shares: 0,
      reach: parseInt(video.statistics.viewCount || "0"),
      impressions: parseInt(video.statistics.viewCount || "0"),
      engagementRate: 0,
    }));

    return { success: true, data: posts, timestamp: new Date().toISOString() };
  } catch (err: any) {
    return { success: false, error: err.message, timestamp: new Date().toISOString() };
  }
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

function mapInstagramMediaType(mediaType: string): SocialPost["type"] {
  switch (mediaType) {
    case "IMAGE": return "image";
    case "VIDEO": return "reel";
    case "CAROUSEL_ALBUM": return "carousel";
    default: return "image";
  }
}

function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}
