import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Instagram, Facebook, Youtube, Sparkles, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const STEPS = [
  { id: "profile", title: "Complete seu Perfil" },
  { id: "business", title: "Seu Negócio" },
  { id: "connect", title: "Conecte as Redes" }
];

export default function Onboarding() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form Data
  const [name, setName] = useState(user?.user_metadata?.full_name || "");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("marketing");
  const [connected, setConnected] = useState<string[]>([]);

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      await finishOnboarding();
    }
  };

  const handleConnect = (platform: string) => {
    // Simulação de OAUTH Connect Modal
    const isConn = connected.includes(platform);
    if (!isConn) {
       toast.promise(
          new Promise(resolve => setTimeout(resolve, 1500)),
          {
             loading: `Aguardando autorização ${platform}...`,
             success: () => {
                setConnected([...connected, platform]);
                return `Acesso ${platform} autorizado!`;
             },
             error: "Falha na conexão"
          }
       );
    }
  };

  const finishOnboarding = async () => {
    setLoading(true);
    try {
      // Aqui integrariamos com profiles / teamService -> createTeam
      const { error } = await supabase
        .from('profiles')
        .update({ name: name, role: role })
        .eq('id', user!.id);
      
      if (error && error.code !== "42P01") throw error; // Ignore se n existe ainda

      // Redireciona para o Painel logado 🎉
      setTimeout(() => {
         toast.success("Plataforma configurada com sucesso! Bem vindo.");
         setLocation("/dashboard");
      }, 1000);

    } catch (error) {
       toast.error("Erro finalizando onboarding.");
    } finally {
      // setLoading(false); // Mantém true enquanto redireciona
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none -z-10 blur-3xl" />
      
      {/* Progress Tracker */}
      <div className="w-full max-w-md mb-12 flex justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-border/50 -translate-y-1/2 -z-10 rounded-full overflow-hidden">
           <motion.div 
             className="h-full bg-primary origin-left"
             initial={{ scaleX: 0 }}
             animate={{ scaleX: step / (STEPS.length - 1) }}
             transition={{ duration: 0.5, ease: "easeInOut" }}
           />
        </div>
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center gap-2">
            <motion.div 
               className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-500", 
                  step >= i ? "bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]" : "bg-card border-border text-muted-foreground"
               )}
            >
               {step > i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           transition={{ duration: 0.3 }}
           className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl rounded-[2rem] p-8"
        >
          {step === 0 && (
             <div className="space-y-6">
                <div className="mb-8">
                   <h1 className="text-2xl font-black mb-2">Bem-vindo a nova era! 🚀</h1>
                   <p className="text-muted-foreground text-sm">Vamos configurar seu painel analítico em 3 passos rápidos. Primeiro, como as pessoas devem te chamar?</p>
                </div>
                <div className="space-y-4">
                   <div className="space-y-2">
                     <Label className="uppercase text-xs font-black tracking-widest text-muted-foreground">Nome Completo</Label>
                     <Input required value={name} onChange={e => setName(e.target.value)} className="h-12 rounded-xl bg-muted/30 focus:bg-background" placeholder="João Silva" />
                   </div>
                </div>
             </div>
          )}

          {step === 1 && (
             <div className="space-y-6">
                <div className="mb-8 flex items-start gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6" />
                   </div>
                   <div>
                     <h1 className="text-xl font-bold mb-1">Sobre sua empresa</h1>
                     <p className="text-muted-foreground text-sm">Isso nos ajuda a calibrar a Inteligência Artificial para o seu nicho.</p>
                   </div>
                </div>
                <div className="space-y-4">
                   <div className="space-y-2">
                     <Label className="uppercase text-xs font-black tracking-widest text-muted-foreground">Nome da Empresa / Projeto</Label>
                     <Input value={company} onChange={e => setCompany(e.target.value)} className="h-12 rounded-xl bg-muted/30 focus:bg-background" placeholder="Sua Agência" />
                   </div>
                   <div className="space-y-2">
                     <Label className="uppercase text-xs font-black tracking-widest text-muted-foreground">Sua Função</Label>
                     <select value={role} onChange={e => setRole(e.target.value)} className="w-full h-12 rounded-xl bg-muted/30 border border-border/50 px-3 text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary/50">
                        <option value="marketing">Analista / Especialista em Marketing</option>
                        <option value="owner">Dono do Negócio / Diretor</option>
                        <option value="creator">Criador de Conteúdo</option>
                        <option value="other">Outro</option>
                     </select>
                   </div>
                </div>
             </div>
          )}

          {step === 2 && (
             <div className="space-y-6">
                <div className="mb-6 flex items-start gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6" />
                   </div>
                   <div>
                     <h1 className="text-xl font-bold mb-1">Ative as Engrenagens</h1>
                     <p className="text-muted-foreground text-sm">Conecte pelo menos 1 fonte de dados para o sistema começar a puxar o histórico.</p>
                   </div>
                </div>
                
                <div className="space-y-3">
                   {[
                      { id: "instagram", name: "Instagram Business", desc: "Métricas de Posts, Stories e Reels", icon: Instagram, color: "hover:border-pink-500 hover:bg-pink-500/5 text-pink-600" },
                      { id: "facebook", name: "Página do Facebook", desc: "Alcance, interações e cliques da página", icon: Facebook, color: "hover:border-blue-500 hover:bg-blue-500/5 text-blue-600" },
                      { id: "youtube", name: "Canal do YouTube", desc: "Views, retenção e inscritos do canal", icon: Youtube, color: "hover:border-red-500 hover:bg-red-500/5 text-red-600" }
                   ].map(plat => {
                      const isConn = connected.includes(plat.id);
                      return (
                         <div 
                           key={plat.id} 
                           onClick={() => handleConnect(plat.id)}
                           className={cn(
                              "border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-300",
                              isConn ? "border-emerald-500 bg-emerald-500/5" : `border-border/50 bg-muted/20 ${plat.color}`
                           )}
                         >
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", isConn ? "bg-emerald-500/20 text-emerald-600" : "bg-card border")}>
                               {isConn ? <CheckCircle2 className="w-5 h-5" /> : <plat.icon className="w-5 h-5 current-color" />}
                            </div>
                            <div className="flex-1">
                               <h3 className={cn("text-sm font-bold", isConn && "text-emerald-700 dark:text-emerald-400")}>{plat.name}</h3>
                               <p className="text-xs text-muted-foreground opacity-80">{plat.desc}</p>
                            </div>
                            {!isConn && <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-lg pointer-events-none">Conectar</Button>}
                         </div>
                      )
                   })}
                </div>
             </div>
          )}

          <div className="mt-8 pt-6 border-t border-border/50 flex flex-col gap-3">
             <Button 
                onClick={handleNext} 
                disabled={loading || (step === 0 && !name)}
                className="w-full h-12 rounded-xl text-base font-bold bg-foreground text-background hover:bg-foreground/90 shadow-[0_4px_14px_rgba(255,255,255,0.05)] transition-all flex items-center justify-center"
             >
                {loading ? (
                   <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                   step === STEPS.length - 1 ? "Acessar Dashboard" : "Continuar"
                )}
                {!loading && step < STEPS.length - 1 && <ArrowRight className="w-4 h-4 ml-2" />}
             </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
