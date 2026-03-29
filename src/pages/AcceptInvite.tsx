import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Users, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedCard } from "@/components/AnimatedCard";
import { toast } from "sonner";
import { slideUp } from "@/lib/animations";

export default function AcceptInvite() {
  const [, params] = useRoute("/invite/:id");
  const [, setLocation] = useLocation();
  const { user, session, loading: authLoading } = useAuth();
  
  const [invite, setInvite] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const inviteId = params?.id;

  useEffect(() => {
    if (inviteId) {
      loadInviteDetails();
    } else {
      setLoading(false);
      setErrorMsg("Link de convite inválido ou corrompido.");
    }
  }, [inviteId]);

  const loadInviteDetails = async () => {
    try {
      // 1. Fetch Invite (We use admin proxy or normal fetch if RLS allows it. Actually, RLS might block reading 'invitations' if not team member)
      // Wait, ANYONE can't read an invite by ID due to RLS unless they are in the team!
      // So fetching the invite directly from Supabase via client might fail!
      // Let's use an EDGE or just try bypassing, or let the user click accept directly.
      // What if we just call the API directly?
      const { data: invData, error } = await supabase
        .from('invitations')
        .select('*, teams(name)')
        .eq('id', inviteId)
        .single();
      
      if (error) {
         // Se o RLS bloquear, o usuário talvez já tenha aceitado (e por isso sumiu) ou não tem permissão.
         throw error;
      }
      
      setInvite(invData);
      setTeam(invData.teams);
    } catch (err: any) {
      console.warn("Lendo invite:", err);
      // Se RLS bloquear a leitura do convite para o anônimo, mostramos a tela genérica de Aceite Segura
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!session) {
      toast.error("Você precisa criar uma conta ou fazer login primeiro.");
      // Salva a intenção para depois do login (Pode ser melhorado com localStorage)
      localStorage.setItem("pending_invite", inviteId as string);
      setLocation("/login");
      return;
    }

    setAccepting(true);
    try {
      const res = await fetch('/api/accept-invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: session.access_token })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Falha ao aceitar o convite");
      }
      
      toast.success("Convite aceito com sucesso! Bem-vindo(a) à equipe.");
      setLocation("/dashboard");
      
    } catch (error: any) {
      toast.error(error.message);
      setErrorMsg(error.message);
    } finally {
      setAccepting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-amber-500/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={slideUp} 
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-2xl mb-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
              C
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-3">
            Convite de Equipe
          </h1>
          <p className="text-white/50 text-sm">
            Você foi convidado para colaborar no Conventinho Analytics.
          </p>
        </div>

        <AnimatedCard className="p-8 backdrop-blur-xl bg-white/[0.02] border-white/[0.08]">
          {errorMsg && !invite ? (
             <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h3 className="text-white font-bold text-lg">Convite Indisponível</h3>
                <p className="text-sm text-white/50">{errorMsg}</p>
                <p className="text-xs text-white/30 mt-4">Pode ser que você já tenha aceitado este convite ou ele foi cancelado pelo administrador.</p>
                <div className="pt-6">
                  <Button onClick={() => setLocation("/login")} className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold">
                    Ir para Login
                  </Button>
                </div>
             </div>
          ) : (
             <div className="space-y-8">
               <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2">
                     <Users className="w-8 h-8 text-amber-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                     {team?.name || "Equipe Parceira"}
                  </h2>
                  <p className="text-sm font-medium px-3 py-1 bg-white/5 border border-white/10 rounded-full text-amber-400 uppercase tracking-widest text-[10px]">
                     Nível: {invite?.role || "Colaborador"}
                  </p>
               </div>

               <div className="bg-[#0f0f0f] border border-white/5 rounded-[1rem] p-4 text-center">
                  <p className="text-sm text-white/50">O acesso requer uma conta vinculada ao e-mail:</p>
                  <p className="text-white font-bold mt-1 text-sm">{invite?.email || user?.email || "Seu e-mail de acesso"}</p>
               </div>

               <div className="pt-2">
                  {!user ? (
                     <div className="space-y-3">
                        <Button 
                           onClick={() => {
                             localStorage.setItem("pending_invite", inviteId as string);
                             setLocation("/login");
                           }} 
                           className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#050505] font-black uppercase tracking-widest"
                        >
                           Fazer Login / Criar Conta
                        </Button>
                        <p className="text-xs text-center text-white/40">Você precisará autenticar para aceitar o convite.</p>
                     </div>
                  ) : (
                     <Button 
                        onClick={handleAccept} 
                        disabled={accepting}
                        className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#050505] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                     >
                        {accepting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                        {accepting ? "Aceitando..." : "Aceitar e Entrar na Equipe"}
                     </Button>
                  )}
               </div>
             </div>
          )}
        </AnimatedCard>
      </motion.div>
    </div>
  );
}
