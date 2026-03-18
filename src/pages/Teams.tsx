import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users,
  Shield, 
  Mail, 
  UserPlus, 
  MoreVertical,
  Trash2,
  Edit2,
  RefreshCcw,
  Loader2,
  CheckCircle2,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { teamService, Team, Role, Invitation } from "@/services/teamService";
import { AnimatedCard } from "@/components/AnimatedCard";
import { slideUp } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Componente simples de Dropdown customizado para não depender de libs complexas (mantendo o projeto leve)
const RoleSelect = ({ value, onChange, disabled }: { value: Role, onChange: (r: Role) => void, disabled?: boolean }) => {
  return (
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value as Role)}
      disabled={disabled}
      className={cn(
        "bg-muted/50 border border-border/50 text-foreground text-sm rounded-lg focus:ring-primary/50 focus:border-primary block w-full p-2 outline-none transition-all cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <option value="admin">Admin (Acesso Total)</option>
      <option value="editor">Editor (Pode Editar Dados)</option>
      <option value="viewer">Visualizador (Apenas Leitura)</option>
    </select>
  );
};

export default function Teams() {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<Role>("viewer");

  // Modal State
  const [isInviteModalOpen,setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("editor");
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    if (user) {
      loadTeamData();
    }
  }, [user]);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      const currentTeam = await teamService.getCurrentUserTeam(user!.id);
      
      if (currentTeam) {
        setTeam(currentTeam);
        
        // Puxa Membros e Convites em paralelo
        const [membersData, invitesData] = await Promise.all([
          teamService.getTeamMembers(currentTeam.id),
          teamService.getInvitations(currentTeam.id)
        ]);
        
        setMembers(membersData);
        setInvitations(invitesData);

        // Descobre a role do usuário logado nesta equipe
        if (currentTeam.owner_id === user!.id) {
          setCurrentUserRole("admin");
        } else {
          const myMember = membersData.find(m => m.user_id === user!.id);
          if (myMember) setCurrentUserRole(myMember.role);
        }

      } else {
        // Mock fallback/Start state: se o usuário não tem time no DB real (pq o schema acabou de ser criado e não houveram triggers).
        // Na vida real, haveria um fluxo de "Criar Time". Mas simularemos aqui um time padrão dele mesmo para manter o dashboard funcional.
        setTeam({
           id: "mock-team-id",
           name: "Meu Time Princiapl",
           owner_id: user!.id,
           created_at: new Date().toISOString()
        });
        setMembers([{
           id: "mock-member-id",
           team_id: "mock-team-id",
           user_id: user!.id,
           role: "admin",
           created_at: new Date().toISOString(),
           profiles: { id: user!.id, name: user?.user_metadata?.full_name || "Você", email: user!.email }
        }]);
        setInvitations([]);
        setCurrentUserRole("admin");
      }
    } catch (error) {
      console.error("Erro ao carregar equipe:", error);
      toast.error("Erro ao tentar carregar informações da equipe.");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !team) return;

    if (currentUserRole !== "admin") {
      toast.error("Apenas administradores podem convidar membros.");
      return;
    }

    setIsInviting(true);
    try {
      // Mock para não crashar enquanto APIs não estão integradas 100% (caso mock-team)
      if (team.id === "mock-team-id") {
         setInvitations(prev => [{
            id: `mock-inv-${Date.now()}`,
            team_id: team.id,
            email: inviteEmail,
            role: inviteRole,
            status: "pending",
            created_at: new Date().toISOString()
         }, ...prev]);
         toast.success(`Convite enviado para ${inviteEmail}`);
      } else {
         const newInvite = await teamService.inviteUser(team.id, inviteEmail, inviteRole);
         setInvitations([newInvite, ...invitations]);
         toast.success("Convite enviado com sucesso!");
      }
      setInviteEmail("");
      setIsInviteModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao convidar usuário.");
    } finally {
      setIsInviting(false);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: Role) => {
     if (currentUserRole !== "admin") return;
     try {
        if (team?.id !== "mock-team-id") {
           await teamService.updateMemberRole(memberId, newRole);
        }
        setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
        toast.success("Permissão atualizada com sucesso.");
     } catch(error) {
        toast.error("Erro ao atualizar permissão.");
     }
  };

  const handleRemoveMember = async (memberId: string) => {
     if (currentUserRole !== "admin") return;
     if (!confirm("Tem certeza que deseja remover este membro da equipe? O acesso será revogado imediatamente.")) return;

     try {
        if (team?.id !== "mock-team-id") {
           await teamService.removeMember(memberId);
        }
        setMembers(members.filter(m => m.id !== memberId));
        toast.success("Membro removido da equipe.");
     } catch(error) {
        toast.error("Erro ao remover membro.");
     }
  };

  const handleCancelInvite = async (invId: string) => {
     if (currentUserRole !== "admin") return;
     try {
        if (team?.id !== "mock-team-id") {
           await teamService.cancelInvitation(invId);
        }
        setInvitations(invitations.filter(i => i.id !== invId));
        toast.success("Convite cancelado.");
     } catch(error) {
        toast.error("Erro ao cancelar convite.");
     }
  }

  const roleColors = {
    admin: "bg-red-500/10 text-red-500 ring-red-500/20",
    editor: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
    viewer: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
  };

  const roleLabels = {
    admin: "Admin",
    editor: "Editor",
    viewer: "Viewer",
  };

  const isAdmin = currentUserRole === "admin";

  return (
    <div className="container py-8 max-w-5xl animate-in fade-in duration-500 relative">
      <motion.div initial="hidden" animate="visible" variants={slideUp} className="space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row shadow-sm bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-5 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Equipe e Permissões</h1>
              <p className="text-sm text-muted-foreground">Gerencie acessos e colabore na análise de métricas.</p>
            </div>
          </div>
          <div className="flex gap-3">
             <Button 
               variant="outline" 
               size="sm"
               className="h-10 px-4 rounded-xl border-border/80 font-medium hover:bg-muted"
               onClick={loadTeamData}
               disabled={loading}
             >
               <RefreshCcw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
               Atualizar
             </Button>
             {isAdmin && (
                <Button 
                   size="sm"
                   className="h-10 px-5 rounded-xl font-semibold bg-foreground text-background hover:bg-foreground/90 shadow-sm"
                   onClick={() => setIsInviteModalOpen(true)}
                 >
                   <UserPlus className="w-4 h-4 mr-2" />
                   Convidar
                 </Button>
             )}
          </div>
        </div>

        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="font-medium text-muted-foreground animate-pulse">Carregando permissões...</p>
          </div>
        ) : (
          <div className="space-y-8">
             {/* Membros Ativos */}
             <div className="space-y-4">
                <h3 className="text-base font-bold px-1">Membros Ativos ({members.length})</h3>
                <div className="grid grid-cols-1 gap-3">
                   {members.map((member) => {
                      const isMe = member.user_id === user!.id;
                      const isOwner = team?.owner_id === member.user_id;

                      return (
                         <AnimatedCard key={member.id} className="p-4 border-border/50 bg-card/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                                  <span className="text-sm font-bold text-foreground capitalize">
                                     {member.profiles?.name?.charAt(0) || member.profiles?.email?.charAt(0) || "U"}
                                  </span>
                               </div>
                               <div>
                                  <div className="flex items-center gap-2">
                                     <span className="font-bold text-sm text-foreground">
                                        {member.profiles?.name || "Usuário"} {isMe && "(Você)"}
                                     </span>
                                     {isOwner && (
                                        <span title="Dono da Equipe">
                                           <Shield className="w-3.5 h-3.5 text-amber-500" />
                                        </span>
                                     )}
                                  </div>
                                  <span className="text-xs text-muted-foreground font-medium">{member.profiles?.email}</span>
                               </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                               <div className={cn("px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-widest ring-1", roleColors[member.role as keyof typeof roleColors])}>
                                  {roleLabels[member.role as keyof typeof roleLabels]}
                               </div>

                               {/* Ações (Apenas Admin vê) */}
                               {isAdmin && !isOwner && !isMe && (
                                  <div className="flex items-center gap-2 ml-2 pl-4 border-l border-border/50">
                                     <RoleSelect 
                                        value={member.role} 
                                        onChange={(r) => handleUpdateRole(member.id, r)} 
                                     />
                                     <button 
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Remover Membro"
                                     >
                                        <Trash2 className="w-4 h-4" />
                                     </button>
                                  </div>
                               )}
                            </div>
                         </AnimatedCard>
                      );
                   })}
                </div>
             </div>

             {/* Convites Pendentes (Mostra apenas se houver ou se for admin pra entender que tá vazio) */}
             {(invitations.length > 0 || isAdmin) && (
                <div className="space-y-4 pt-4 border-t border-border/30">
                   <h3 className="text-base font-bold px-1 flex items-center gap-2">
                      Convites Pendentes
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{invitations.length}</span>
                   </h3>

                   {invitations.length === 0 ? (
                      <div className="p-6 border border-dashed border-border/50 rounded-2xl bg-muted/10 text-center flex flex-col items-center">
                         <Mail className="w-6 h-6 text-muted-foreground/30 mb-2" />
                         <span className="text-sm font-medium text-foreground">Nenhum convite pendente.</span>
                         <span className="text-xs text-muted-foreground mt-1">Clique em "Convidar" no topo para adicionar mais pessoas.</span>
                      </div>
                   ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {invitations.map((inv) => (
                            <AnimatedCard key={inv.id} className="p-4 border-border/50 bg-card/40 flex items-center justify-between gap-3 border-dashed">
                               <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                     <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                  </div>
                                  <div className="truncate">
                                     <p className="text-sm font-semibold truncate max-w-[150px]">{inv.email}</p>
                                     <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-0.5">
                                        Como: <span className="text-foreground">{roleLabels[inv.role as keyof typeof roleLabels]}</span>
                                     </p>
                                  </div>
                               </div>
                               
                               {isAdmin && (
                                  <button 
                                     onClick={() => handleCancelInvite(inv.id)}
                                     className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                                     title="Cancelar Convite"
                                  >
                                     <X className="w-4 h-4" />
                                  </button>
                               )}
                            </AnimatedCard>
                         ))}
                      </div>
                   )}
                </div>
             )}
          </div>
        )}
      </motion.div>

      {/* Modal de Convite (Custom made para manter o estilo limpo) */}
      <AnimatePresence>
         {isInviteModalOpen && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsInviteModalOpen(false)}
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
               >
                  <motion.div 
                     initial={{ scale: 0.95, opacity: 0, y: 20 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 0.95, opacity: 0, y: 20 }}
                     onClick={(e) => e.stopPropagation()}
                     className="bg-card w-full max-w-md border border-border shadow-2xl shadow-black/5 rounded-[2rem] overflow-hidden"
                  >
                     <div className="p-6 border-b border-border/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserPlus className="w-4 h-4 text-primary" />
                           </div>
                           <h2 className="text-lg font-bold">Convidar Membro</h2>
                        </div>
                        <button onClick={() => setIsInviteModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted">
                           <X className="w-5 h-5"/>
                        </button>
                     </div>
                     
                     <form onSubmit={handleInvite} className="p-6 space-y-5">
                        <div className="space-y-2">
                           <Label htmlFor="email" className="text-xs font-black text-muted-foreground uppercase tracking-widest">E-mail do Colaborador</Label>
                           <Input 
                              id="email"
                              type="email"
                              placeholder="colaborador@agencia.com"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              required
                              className="h-12 rounded-xl bg-muted/30 border-border/50 focus:bg-background transition-all"
                           />
                        </div>

                        <div className="space-y-2">
                           <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Nível de Permissão</Label>
                           <div className="grid grid-cols-1 gap-2">
                              {[
                                 { id: 'admin', title: 'Admin', desc: 'Acesso total, convida/remove membros.' },
                                 { id: 'editor', title: 'Editor', desc: 'Edita dados e visualiza métricas.' },
                                 { id: 'viewer', title: 'Viewer', desc: 'Apenas visualiza (Modo Leitura).' }
                              ].map((role) => (
                                 <div 
                                    key={role.id}
                                    onClick={() => setInviteRole(role.id as Role)}
                                    className={cn(
                                       "p-3 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-3",
                                       inviteRole === role.id 
                                          ? "bg-primary/5 border-primary shadow-sm"
                                          : "bg-muted/20 border-border/50 hover:bg-muted/50"
                                    )}
                                 >
                                    <div className={cn(
                                       "w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0",
                                       inviteRole === role.id ? "border-primary" : "border-muted-foreground/40"
                                    )}>
                                       {inviteRole === role.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                    </div>
                                    <div>
                                       <p className={cn("text-sm font-bold", inviteRole === role.id ? "text-foreground" : "text-muted-foreground")}>
                                          {role.title}
                                       </p>
                                       <p className="text-xs text-muted-foreground/70 mt-0.5">{role.desc}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                           <Button type="button" variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setIsInviteModalOpen(false)}>
                              Cancelar
                           </Button>
                           <Button type="submit" className="flex-1 rounded-xl h-12 bg-foreground text-background hover:bg-foreground/90 font-bold" disabled={isInviting || !inviteEmail}>
                              {isInviting ? (
                                 <Loader2 className="w-5 h-5 animate-spin" />
                              ) : "Enviar Convite"}
                           </Button>
                        </div>
                     </form>
                  </motion.div>
               </motion.div>
            </>
         )}
      </AnimatePresence>

    </div>
  );
}
