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
   * "Motor de IA Simulado" - Analisa os dados localmente e gera percepções acionáveis 
   * Na versão final SaaS, isso deve bater numa rota no Node.js/Python que usa OpenAI/Gemini
   */
  async simulateLiveAnalysis(teamId: string, userId: string): Promise<AIInsight[]> {
      const pastMonthStart = new Date();
      pastMonthStart.setDate(pastMonthStart.getDate() - 30);
      const strStart = pastMonthStart.toISOString().split('T')[0];
      const strEnd = new Date().toISOString().split('T')[0];

      // Pegando apenas Instagram para teste
      const metrics = await metricsService.getMetricsByPlatform("instagram", userId, strStart, strEnd);
      const latest = metrics.length > 0 ? metrics[metrics.length - 1] : null;
      
      const insights: AIInsight[] = [];
      const timestamp = new Date().toISOString();

      if (metrics.length > 5 && latest) {
         // Calcular variação simples
         const first = metrics[0];
         
         if (latest.engagement > (first.engagement * 1.5)) {
            insights.push({
               id: `gen-1-${timestamp}`,
               team_id: teamId,
               platform: "instagram",
               insight_type: "viral",
               title: "Estouro de Engajamento Detectado! 🚀",
               description: "A IA identificou um aumento súbito e orgânico nas taxas de interações em relação à semana passada.",
               actionable_step: "Reposte o conteúdo nos Stories em horários de pico ou impulsione por R$ 50 para alavancar visibilidade.",
               metrics_snapshot: { engagement: latest.engagement },
               created_at: timestamp
            });
         }

         if (latest.reach < first.reach) {
            insights.push({
               id: `gen-2-${timestamp}`,
               team_id: teamId,
               platform: "instagram",
               insight_type: "drop",
               title: "Queda na Entrega Orgânica 📉",
               description: "O algoritmo distribuiu 20% a menos o seu conteúdo recente nas abas explorar e reels.",
               actionable_step: "Teste alterar os horários de postagem (sugerido: 18h e 21h) e reforce o Call-To-Action focado em 'Salvar' post.",
               metrics_snapshot: { reach: latest.reach },
               created_at: timestamp
            });
         }
      }

      insights.push({
         id: `gen-3-${timestamp}`,
         team_id: teamId,
         platform: "instagram",
         insight_type: "suggestion",
         title: "Oportunidade Analítica",
         description: "Perfis da sua categoria histórica (" + (latest?.platform || "Religioso") + ") têm dobrado a conversão rodando Lives semanais com convidados.",
         actionable_step: "Programe 1 collab live por semana e anuncie no Feed.",
         metrics_snapshot: null,
         created_at: timestamp
      });

      return insights;
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
