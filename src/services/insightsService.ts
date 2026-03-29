import { supabase } from "@/lib/supabase";
import { Metric, metricsService } from "./metricsService";

export type InsightType = "growth" | "drop" | "viral" | "suggestion";

export interface AIInsight {
  id: string;
  team_id: string;
  platform: string;
  insight_type: InsightType;
  title: string;
  description: string;
  actionable_step: string;
  metrics_snapshot: any;
  created_at: string;
}

export const insightsService = {
  /**
   * Obtém o histórico de insights analisados pela IA para a equipe.
   */
  async getInsightsHistory(teamId: string, limit = 10) {
    const { data, error } = await supabase
      .from("ai_insights_history")
      .select("*")
      .eq("team_id", teamId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error && error.code !== "42P01") { // If table not created yet, mock it
       console.error("Erro ao buscar insights do BD", error);
    }
    
    // Se a tabela tá limpa ou der erro de tabela nova, geramos mocks "ao vivo"
    if (!data || data.length === 0) {
       return this.generateMockInsights(teamId);
    }
    
    return data as AIInsight[];
  },

  /**
   * Dispara a leitura real e contata o Google Gemini via Serverless API.
   */
  async simulateLiveAnalysis(teamId: string, userId: string, token: string): Promise<AIInsight[]> {
      const pastMonthStart = new Date();
      pastMonthStart.setDate(pastMonthStart.getDate() - 30);
      const strStart = pastMonthStart.toISOString().split('T')[0];
      const strEnd = new Date().toISOString().split('T')[0];

      // Coletar escopo do ecossistema todo para que a IA tenha um julgamento contextual
      const instaMetrics = await metricsService.getMetricsByPlatform("instagram", userId, strStart, strEnd);
      const fbMetrics = await metricsService.getMetricsByPlatform("facebook", userId, strStart, strEnd);

      const metricsPayload = {
         instagramData: instaMetrics,
         facebookData: fbMetrics
      };

      try {
         const resp = await fetch("/api/generate-insights", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ token, teamId, metricsPayload })
         });
         
         const result = await resp.json();
         if (resp.ok && result.success) {
            return result.data as AIInsight[];
         }
         console.warn("A IA retornou um aviso ou erro parcial:", result);
         throw new Error(result.error);
      } catch (err: any) {
         console.error("Falha no Motor Conectivo de IA:", err);
         return [];
      }
  },

  generateMockInsights(teamId: string): AIInsight[] {
     const t = new Date().toISOString();
     return [
      {
         id: "mock-1", team_id: teamId, platform: "instagram", insight_type: "viral", 
         title: "Engajamento Acima da Média: +12% 🚀",
         description: "Reels identificados gerando alto alcance orgânico. O formato em retrato curto está atraindo novo público.",
         actionable_step: "Dobre a produção do formato de vídeo. Reutilize o áudio em alta no seu próximo Reel.",
         metrics_snapshot: {}, created_at: t
      },
      {
         id: "mock-2", team_id: teamId, platform: "facebook", insight_type: "growth", 
         title: "Alcance Consistente no Face",
         description: "Os posts da manhã estão estabilizando a base. Retenção excelente.",
         actionable_step: "Inclua links para site nos comentários do primeiro bloco.",
         metrics_snapshot: {}, created_at: t
      },
      {
         id: "mock-3", team_id: teamId, platform: "youtube", insight_type: "drop", 
         title: "Falta de Recorrência",
         description: "O algoritmo YouTube cortou a impressão da home por conta de inatividade > 5 dias.",
         actionable_step: "Agende ao menos 2 Shorts se não puder postar vídeos longos.",
         metrics_snapshot: {}, created_at: t
      }
     ];
  }
};
