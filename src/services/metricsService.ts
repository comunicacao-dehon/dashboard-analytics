import { supabase } from "@/lib/supabase";
import { getConnectedAccounts } from "./socialService";

export type Platform = "instagram" | "facebook" | "youtube";

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: Platform;
  account_name: string;
  account_id: string;
  created_at: string;
}

export interface Metric {
  id: string;
  account_id: string;
  platform: Platform;
  followers: number;
  reach: number;
  impressions: number;
  engagement: number;
  clicks: number;
  views: number;
  date: string;
  created_at: string;
}

export const metricsService = {
  /**
   * Obtém as contas sociais do usuário atual
   */
  async getAccounts(platform?: Platform) {
    let query = supabase.from("social_accounts").select("*");
    if (platform) {
      query = query.eq("platform", platform);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as SocialAccount[];
  },

  /**
   * Obtém as métricas de uma conta em um período de datas
   */
  async getMetricsByAccount(accountId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from("metrics")
      .select("*")
      .eq("account_id", accountId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) throw error;
    return data as Metric[];
  },

  /**
   * Obtém métricas globais pela plataforma do usuário (considerando toda a Equipe/Time)
   */
  async getMetricsByPlatform(platform: Platform, userId: string, startDate: string, endDate: string) {
    // 1. Pega as contas da equipe toda e filtra pela plataforma
    const allAccounts = await getConnectedAccounts(userId);
    const accounts = allAccounts.filter(a => a.platform === platform);
    
    if (!accounts || accounts.length === 0) return [];

    const accountIds = accounts.map(a => a.id);

    // 2. Busca as métricas nas contas
    const { data, error } = await supabase
      .from("metrics")
      .select("*")
      .in("account_id", accountIds)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true });

    if (error) throw error;
    return data as Metric[];
  },

  /**
   * Insere ou atualiza uma métrica (preparado para Jobs/APIs)
   */
  async upsertMetric(metricData: Omit<Metric, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("metrics")
      .upsert(metricData, { onConflict: "account_id,date" }) // Se configurado limite duplo no banco
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
