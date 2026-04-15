// ─── Tipos centrais para integração com redes sociais ───────────────────────
// Esse arquivo define os contratos de dados para Instagram, Facebook e YouTube.
// Quando as APIs reais forem conectadas, os dados retornados devem seguir esses tipos.

export type SocialPlatform = "instagram" | "facebook" | "youtube";

export interface SocialAccount {
  id: string;
  userId: string;              // Supabase user id
  platform: SocialPlatform;
  platformUserId: string;       // ID do perfil na rede social
  username: string;             // @handle
  displayName: string;
  profilePictureUrl?: string;
  accessToken: string;          // Token OAuth da API
  refreshToken?: string;
  tokenExpiresAt?: string;      // ISO date
  connectedAt: string;          // ISO date
  isActive: boolean;
}

// ─── Métricas Genéricas ─────────────────────────────────────────────────────

export interface SocialMetrics {
  followers: number;
  followersGrowth: number;      // percentual ex: 12.5
  engagementRate: number;       // percentual ex: 4.19
  totalPosts: number;
  totalReach: number;
  totalImpressions: number;
  updatedAt: string;            // ISO date
  
  // Array de histórico direto da API (Últimos 28/30 dias)
  historicalData?: Array<{
    date: string;
    followers: number;
    reach: number;
    impressions: number;
    engagement: number;
    views: number;
    likes: number;
  }>;
}

// ─── Métricas por Plataforma ────────────────────────────────────────────────

export interface InstagramMetrics extends SocialMetrics {
  reelsPlays: number;
  storiesViews: number;
  storiesImpressions?: number;
  saves: number;
  shares: number;
  demographics?: {
    gender: Array<{ name: string; value: number }>;
    age: Array<{ name: string; value: number }>;
    cities: Array<{ id: number; name: string; percentage: number }>;
    countries: Array<{ id: number; name: string; percentage: number }>;
  };
}

export interface FacebookMetrics extends SocialMetrics {
  pageViews: number;
  pageLikes: number;
  videoViews: number;
  reactions: number;
}

export interface YouTubeMetrics extends SocialMetrics {
  subscribers: number;
  totalViews: number;
  watchTimeHours: number;
  averageViewDuration: number;  // em segundos
  shortsViews: number;
}

// ─── Post / Conteúdo Genérico ───────────────────────────────────────────────

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  type: "image" | "video" | "carousel" | "reel" | "story" | "short" | "live" | "text";
  caption?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  publishedAt: string;          // ISO date
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
  engagementRate: number;
}

// ─── Resposta Padrão de API ─────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
