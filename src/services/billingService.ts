import { supabase } from "@/lib/supabase";

export type PlanId = "free" | "pro" | "team";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  features: string[];
  maxAccounts: number;
  maxTeamMembers: number;
  aiInsights: boolean;
}

export const SAAS_PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Starter",
    price: 0,
    features: ["Até 3 contas socias", "Histórico de 30 dias", "Relatórios básicos", "1 Usuário"],
    maxAccounts: 3,
    maxTeamMembers: 1,
    aiInsights: false,
  },
  pro: {
    id: "pro",
    name: "Profissional",
    price: 79.9,
    features: ["Até 10 contas sociais", "Histórico de 1 ano", "Insights com IA avançada", "Relatórios em PDF customizados", "Suporte prioritário"],
    maxAccounts: 10,
    maxTeamMembers: 1,
    aiInsights: true,
  },
  team: {
    id: "team",
    name: "Agência / Equipe",
    price: 199.9,
    features: ["Contas ilimitadas", "Histórico total", "Insights com IA avançada", "Gestão de até 10 colaboradores", "API de dados direta", "Painel White-label"],
    maxAccounts: 999,
    maxTeamMembers: 10,
    aiInsights: true,
  }
};

export const billingService = {
  /**
   * Obtém a assinatura atual do usuário. Se não existir, retorna um mock "free" inicial (Trial).
   */
  async getCurrentSubscription(userId: string) {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") { // Erro que não seja row not found
      throw error;
    }

    if (!data) {
       // Assinatura padrão Free (Exemplo mock se não tem registro via Stripe ainda)
       return {
          id: "sub_mock_starter",
          user_id: userId,
          plan_id: "free" as PlanId,
          status: "active",
          created_at: new Date().toISOString()
       };
    }

    return data;
  },

  /**
   * Gera um link de checkout MOCK para o plano selecionado. 
   * Na vida real, isso chamaria uma Cloud Function para gerar a Stripe Checkout Session.
   */
  async createCheckoutSession(userId: string, planId: PlanId) {
    // Mock simulation
    return new Promise<{url: string}>((resolve) => {
       setTimeout(() => {
          resolve({ url: `/billing?success=true&plan=${planId}` }); // Redirect simulado interno 
       }, 1500);
    });
  },

  /**
   * Cancela assinatura
   */
  async cancelSubscription(subId: string) {
    // Mock
    return new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 1200));
  }
};
