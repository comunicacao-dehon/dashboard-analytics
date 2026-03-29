import { supabase } from "@/lib/supabase";

export type Role = "admin" | "editor" | "viewer";

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: Role;
  created_at: string;
  profiles?: Profile; // Relacionamento mock ou real
}

export interface Invitation {
  id: string;
  team_id: string;
  email: string;
  role: Role;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export const teamService = {
  /**
   * Obtém a equipe padrão do usuário (se não tiver, o ideal seria criar uma)
   */
  async getCurrentUserTeam(userId: string) {
    // 1. Busca equipes nas quais o usuário é dono (owner)
    const { data: ownedTeams } = await supabase
      .from("teams")
      .select("*")
      .eq("owner_id", userId);

    if (ownedTeams && ownedTeams.length > 0) {
      return ownedTeams[0] as Team;
    }

    // 2. Busca equipes em que o usuário foi convidado e já aceitou (team_member)
    const { data: memberTeams } = await supabase
      .from("team_members")
      .select("teams(*)")
      .eq("user_id", userId);

    if (memberTeams && memberTeams.length > 0) {
      return (memberTeams[0] as any).teams as Team;
    }

    // 3. (Fallback) Se o usuário NÃO é dono nem membro de nenhum time, cria um time default para ele.
    // Assim, removemos a necessidade de "Mock-Teams" no frontend.
    const { data: userProfile } = await supabase.from("profiles").select("name").eq("id", userId).single();
    const teamName = userProfile?.name ? `Equipe de ${userProfile.name}` : "Meu Time Principal";

    const { data: newTeam, error: teamErr } = await supabase
      .from("teams")
      .insert({ name: teamName, owner_id: userId })
      .select("*")
      .single();

    if (teamErr) {
      console.error("Faield to auto-create team:", teamErr);
      return null;
    }

    // Vincula o usuário como admin da sua própria equipe.
    await supabase.from("team_members").insert({
      team_id: newTeam.id,
      user_id: userId,
      role: "admin"
    });

    return newTeam as Team;
  },

  /**
   * Obtém os membros de uma equipe
   */
  async getTeamMembers(teamId: string) {
    const { data, error } = await supabase
      .from("team_members")
      .select(`*, profiles(id, name, email)`)
      .eq("team_id", teamId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as any[]; 
  },

  /**
   * Obtém os convites pendentes de uma equipe
   */
  async getInvitations(teamId: string) {
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("team_id", teamId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Invitation[];
  },

  /**
   * Envia um convite (Cria registro no DB para que o usuário aceite depois)
   */
  async inviteUser(teamId: string, email: string, role: Role) {
    // 1. Verifica se já existe o convite
    const { data: currInv } = await supabase
      .from("invitations")
      .select("*")
      .eq("team_id", teamId)
      .eq("email", email)
      .eq("status", "pending");

    if (currInv && currInv.length > 0) throw new Error("Usuário já possui um convite pendente para esta equipe.");

    const { data, error } = await supabase
      .from("invitations")
      .insert({ team_id: teamId, email, role })
      .select()
      .single();

    if (error) throw error;
    return data as Invitation;
  },

  /**
   * Altera a função de um membro na equipe
   */
  async updateMemberRole(memberId: string, role: Role) {
    const { data, error } = await supabase
      .from("team_members")
      .update({ role })
      .eq("id", memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Remove um membro da equipe
   */
  async removeMember(memberId: string) {
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", memberId);

    if (error) throw error;
    return true;
  },

  /**
   * Cancela um convite pendente
   */
  async cancelInvitation(invitationId: string) {
    const { error } = await supabase
      .from("invitations")
      .delete()
      .eq("id", invitationId);

    if (error) throw error;
    return true;
  }
};
