import { supabase } from "@/lib/supabase";
import { Branding } from "@/config/branding";

export const brandingService = {
  /**
   * Busca as configurações de marca do banco de dados
   */
  async getBranding(tenantId: string): Promise<Branding | null> {
    const { data, error } = await supabase
      .from("tenant_branding")
      .select("*")
      .eq("tenant_id", tenantId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar branding:", error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.tenant_id,
      name: data.name,
      motto: data.motto,
      welcomeMessage: data.welcome_message,
      footerText: data.footer_text,
      primaryColor: data.primary_color,
      logo: data.logo_url || "logo.png",
      sidebarLogo: data.sidebar_logo_url || "logo.png",
    };
  },

  /**
   * Salva ou atualiza as configurações de marca
   */
  async upsertBranding(branding: Branding): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from("tenant_branding")
      .upsert({
        tenant_id: branding.id,
        name: branding.name,
        motto: branding.motto,
        welcome_message: branding.welcomeMessage,
        footer_text: branding.footerText,
        primary_color: branding.primaryColor,
        logo_url: branding.logo,
        sidebar_logo_url: branding.sidebarLogo,
        updated_at: new Date().toISOString(),
      }, { onConflict: "tenant_id" });

    if (error) {
      console.error("Erro ao salvar branding:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }
};
