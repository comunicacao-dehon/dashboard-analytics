import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Sparkles, Building, Briefcase, Infinity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { billingService, SAAS_PLANS, PlanId } from "@/services/billingService";
import { AnimatedCard } from "@/components/AnimatedCard";
import { slideUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Billing() {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<PlanId>("free");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<PlanId | null>(null);

  useEffect(() => {
    if (user) loadSubscription();
  }, [user]);

  const loadSubscription = async () => {
    setLoading(true);
    try {
       const sub = await billingService.getCurrentSubscription(user!.id);
       setCurrentPlan(sub.plan_id);
    } catch(e) {
       console.error(e);
       toast.error("Erro ao carregar detalhes do plano.");
    } finally {
       setLoading(false);
    }
  }

  const handleUpgrade = async (plan: PlanId) => {
    if (plan === currentPlan) return;
    setIsProcessing(plan);
    try {
      const checkout = await billingService.createCheckoutSession(user!.id, plan);
      toast.success("Redirecionando para o pagamento seguro...");
      // Simulate real redirect
      setCurrentPlan(plan); // optimistic UI for the mockup
    } catch(e) {
      toast.error("Erro ao processar checkout.");
    } finally {
      setIsProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-60 mb-4" />
        <p className="font-bold text-muted-foreground animate-pulse">Carregando informações financeiras...</p>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-6xl animate-in fade-in duration-500">
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-center space-y-4 mb-14">
         <motion.div variants={slideUp} className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 shadow-inner">
            <CreditCard className="w-8 h-8" />
         </motion.div>
         <motion.h1 variants={slideUp} className="text-4xl md:text-5xl font-black tracking-tighter">Assinaturas e Planos</motion.h1>
         <motion.p variants={slideUp} className="text-lg text-muted-foreground max-w-xl mx-auto">
            Faça um upgrade para acessar o motor de Inteligência Artificial, gerenciar clientes e extrair insights profundos.
         </motion.p>
      </motion.div>

      <motion.div 
         variants={staggerContainer} initial="hidden" animate="visible"
         className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end"
      >
         {(Object.keys(SAAS_PLANS) as PlanId[]).map((planKey) => {
            const plan = SAAS_PLANS[planKey];
            const isCurrent = currentPlan === plan.id;
            const isPro = plan.id === "pro";

            return (
               <AnimatedCard 
                  key={plan.id}
                  className={cn(
                     "flex flex-col p-8 transition-all duration-300 transform",
                     isPro 
                        ? "border-primary shadow-2xl relative scale-105 bg-card" 
                        : "border-border/50 bg-card/40 hover:bg-card hover:border-border"
                  )}
               >
                  {isPro && (
                     <div className="absolute -top-4 w-full left-0 flex justify-center">
                        <span className="bg-gradient-to-r from-primary to-amber-500 text-white text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg flex items-center gap-1.5">
                           <Sparkles className="w-3.5 h-3.5" />
                           Mais Popular
                        </span>
                     </div>
                  )}

                  <div className="mb-6">
                     <h3 className="text-2xl font-bold">{plan.name}</h3>
                     <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-black tracking-tighter">R$ {plan.price.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground font-semibold">/mês</span>
                     </div>
                  </div>

                  <div className="space-y-4 mb-8 flex-1">
                     {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-3">
                           <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5", isPro ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                              <Check className="w-3 h-3 font-bold" />
                           </div>
                           <span className={cn("text-sm font-medium", isPro ? "text-foreground" : "text-muted-foreground")}>{feat}</span>
                        </div>
                     ))}
                  </div>

                  <Button 
                     variant={isCurrent ? "outline" : isPro ? "default" : "secondary"}
                     className={cn("w-full h-12 rounded-xl font-bold", isCurrent && "opacity-50 cursor-default")}
                     disabled={isCurrent || isProcessing !== null}
                     onClick={() => handleUpgrade(plan.id)}
                  >
                     {isProcessing === plan.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                     ) : isCurrent ? (
                        "Plano Atual"
                     ) : (
                        "Assinar " + plan.name
                     )}
                  </Button>
               </AnimatedCard>
            )
         })}
      </motion.div>

      <div className="mt-20 text-center">
         <p className="text-sm text-muted-foreground">Precisa de um plano Enterprise para mais de 10 contas? <a href="#" className="text-primary hover:underline font-bold">Fale com vendas</a>.</p>
      </div>
    </div>
  );
}
