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
        "bg-white/[0.04] border border-border text-white text-[10px] font-black uppercase tracking-widest rounded-xl focus:ring-amber-500/50 focus:border-amber-500 block w-full p-2.5 outline-none transition-all cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <option value="admin" className="bg-background text-foreground">Admin (Total)</option>
      <option value="editor" className="bg-background text-foreground">Editor (Ação)</option>
      <option value="viewer" className="bg-background text-foreground">View (Leitura)</option>
    </select>
  );
};

export default function Teams() {
  const { user, session } = useAuth();
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
        toast.error("Nenhuma equipe encontrada para a sua conta.");
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
      const resp = await fetch('/api/send-invite', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           token: session?.access_token,
           teamId: team.id,
           teamName: team.name,
           email: inviteEmail,
           role: inviteRole
         })
      });

      const body = await resp.json();
      if (!resp.ok) throw new Error(body.error || "Erro ao emitir o E-mail de Convite.");

      setInvitations([body.data, ...invitations]);
      toast.success("E-mail com Convite de Equipe disparado com sucesso!");
      
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
        await teamService.updateMemberRole(memberId, newRole);
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
        await teamService.removeMember(memberId);
        setMembers(members.filter(m => m.id !== memberId));
        toast.success("Membro removido da equipe.");
     } catch(error) {
        toast.error("Erro ao remover membro.");
     }
  };

  const handleCancelInvite = async (invId: string) => {
     if (currentUserRole !== "admin") return;
     try {
        await teamService.cancelInvitation(invId);
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
        <div className="flex flex-col md:flex-row shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)] bg-white/[0.04] backdrop-blur-[40px] border border-border rounded-[2rem] p-6 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">Equipe e Permissões</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gerencie acessos e colabore</p>
            </div>
          </div>
          <div className="flex gap-3">
             <Button 
               variant="outline" 
               size="sm"
               className="h-12 px-6 rounded-xl border-white/20 bg-white/[0.04] text-white hover:bg-white/[0.08] font-bold shadow-lg shadow-black/20"
               onClick={loadTeamData}
               disabled={loading}
             >
               <RefreshCcw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
               Atualizar
             </Button>
             {isAdmin && (
                <Button 
                   size="sm"
                   className="h-12 px-6 rounded-xl font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-[#050505] shadow-[0_0_20px_rgba(16,185,129,0.2)]"
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
                <h3 className="text-[10px] font-black uppercase tracking-widest px-1 text-muted-foreground mb-2">Membros Ativos ({members.length})</h3>
                <div className="grid grid-cols-1 gap-3">
                   {members.map((member) => {
                      const isMe = member.user_id === user!.id;
                      const isOwner = team?.owner_id === member.user_id;

                      return (
                         <AnimatedCard key={member.id} className="p-5 border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center border border-amber-500/10 shrink-0 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                  <span className="text-xs font-black uppercase tracking-widest">
                                     {member.profiles?.name?.charAt(0) || member.profiles?.email?.charAt(0) || "U"}
                                  </span>
                               </div>
                               <div>
                                  <div className="flex items-center gap-2">
                                     <span className="font-bold text-sm text-white">
                                        {member.profiles?.name || "Usuário"} {isMe && <span className="text-muted-foreground font-normal">(Você)</span>}
                                     </span>
                                     {isOwner && (
                                        <span title="Dono da Equipe">
                                           <Shield className="w-3.5 h-3.5 text-amber-500" />
                                        </span>
                                     )}
                                  </div>
                                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">{member.profiles?.email}</span>
                               </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                               <div className={cn("px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-widest ring-1", roleColors[member.role as keyof typeof roleColors])}>
                                  {roleLabels[member.role as keyof typeof roleLabels]}
                               </div>

                               {/* Ações (Apenas Admin vê) */}
                               {isAdmin && !isOwner && !isMe && (
                                  <div className="flex items-center gap-2 ml-2 pl-4 border-l border-border">
                                     <RoleSelect 
                                        value={member.role} 
                                        onChange={(r) => handleUpdateRole(member.id, r)} 
                                     />
                                     <button 
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="p-2.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors shrink-0 outline-none"
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

             {/* Convites Pendentes */}
             {(invitations.length > 0 || isAdmin) && (
                <div className="space-y-4 pt-6 mt-6 border-t border-border">
                   <h3 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground px-1 mb-2 flex items-center gap-2">
                      Convites Pendentes
                      <span className="text-[10px] bg-white/[0.08] text-white/70 px-2 py-0.5 rounded-full">{invitations.length}</span>
                   </h3>

                   {invitations.length === 0 ? (
                      <div className="p-8 border border-dashed border-border rounded-[2rem] bg-card text-center flex flex-col items-center justify-center">
                         <Mail className="w-6 h-6 text-white/20 mb-3" />
                         <span className="text-sm font-bold text-muted-foreground">Nenhum convite pendente.</span>
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-2">Clique em "Convidar" no topo para adicionar.</span>
                      </div>
                   ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {invitations.map((inv) => (
                            <AnimatedCard key={inv.id} className="p-5 border-border border-dashed flex items-center justify-between gap-3 bg-card">
                               <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="w-10 h-10 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                     <Mail className="w-4 h-4 text-white/40" />
                                  </div>
                                  <div className="truncate">
                                     <p className="text-sm font-bold text-white truncate max-w-[150px]">{inv.email}</p>
                                     <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mt-1">
                                        Como: <span className="text-amber-500">{roleLabels[inv.role as keyof typeof roleLabels]}</span>
                                     </p>
                                  </div>
                               </div>
                               
                               {isAdmin && (
                                  <button 
                                     onClick={() => handleCancelInvite(inv.id)}
                                     className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors shrink-0 outline-none"
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
                  className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
               >
                  <motion.div 
                     initial={{ scale: 0.95, opacity: 0, y: 20 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 0.95, opacity: 0, y: 20 }}
                     onClick={(e) => e.stopPropagation()}
                     className="bg-card w-full max-w-md border border-border shadow-xl rounded-[2rem] overflow-hidden"
                  >
                     <div className="p-6 border-b border-border flex justify-between items-center bg-card">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                              <UserPlus className="w-4 h-4 text-amber-500" />
                           </div>
                           <h2 className="text-lg font-bold text-white tracking-tight">Convidar Membro</h2>
                        </div>
                        <button onClick={() => setIsInviteModalOpen(false)} className="text-white/40 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/[0.06]">
                           <X className="w-5 h-5"/>
                        </button>
                     </div>
                     
                     <form onSubmit={handleInvite} className="p-6 space-y-6">
                        <div className="space-y-3">
                           <Label htmlFor="email" className="text-[10px] font-black text-white/50 uppercase tracking-widest pl-1">E-mail do Colaborador</Label>
                           <Input 
                              id="email"
                              type="email"
                              placeholder="colaborador@agencia.com"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              required
                              className="h-12 rounded-xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus:border-amber-500 focus:ring-amber-500/20"
                           />
                        </div>

                        <div className="space-y-3">
                           <Label className="text-[10px] font-black text-white/50 uppercase tracking-widest pl-1">Nível de Permissão</Label>
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
                                       "p-4 rounded-[1.25rem] border cursor-pointer transition-all duration-300 flex items-start gap-4",
                                       inviteRole === role.id 
                                          ? "bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                                          : "bg-card border-border hover:bg-white/[0.04] hover:border-white/[0.15]"
                                    )}
                                 >
                                    <div className={cn(
                                       "w-5 h-5 rounded-full mt-0.5 border-2 flex items-center justify-center shrink-0 transition-colors duration-300",
                                       inviteRole === role.id ? "border-amber-500 bg-amber-500/20" : "border-white/20"
                                    )}>
                                       {inviteRole === role.id && <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
                                    </div>
                                    <div>
                                       <p className={cn("text-sm font-bold tracking-tight", inviteRole === role.id ? "text-white" : "text-white/70")}>
                                          {role.title}
                                       </p>
                                       <p className="text-[10px] uppercase font-black tracking-wider text-white/40 mt-1 leading-relaxed">{role.desc}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div className="pt-6 flex gap-3">
                           <Button type="button" variant="outline" className="flex-1 rounded-xl h-12 border-white/20 bg-transparent hover:bg-white/5 text-white font-bold" onClick={() => setIsInviteModalOpen(false)}>
                              Cancelar
                           </Button>
                           <Button type="submit" className="flex-1 rounded-xl h-12 bg-amber-500 hover:bg-amber-600 text-[#050505] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]" disabled={isInviting || !inviteEmail}>
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
