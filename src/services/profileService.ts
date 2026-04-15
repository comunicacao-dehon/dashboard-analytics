import { supabase } from "@/lib/supabase";

export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  role?: string;
  phone?: string;
  location?: string;
}

export const profileService = {
  /**
   * Busca o perfil unificado do banco de dados baseado no stableUserId (email)
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao buscar perfil:", error);
      return null;
    }

    if (!data) return null;

    return {
      userId: data.user_id,
      fullName: data.full_name,
      email: data.email,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      role: data.role,
      phone: data.phone,
      location: data.location,
    };
  },

  /**
   * Salva ou atualiza os dados do perfil unificado
   */
  async upsertProfile(profile: UserProfile): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from("user_profiles")
      .upsert({
        user_id: profile.userId,
        full_name: profile.fullName,
        email: profile.email,
        avatar_url: profile.avatarUrl,
        bio: profile.bio,
        role: profile.role,
        phone: profile.phone,
        location: profile.location,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (error) {
      console.error("Erro ao salvar perfil:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  }
};
