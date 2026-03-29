import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  Instagram, 
  Facebook, 
  Youtube, 
  Zap, 
  AlertTriangle, 
  CheckCircle2,
  Sparkles,
  RefreshCcw,
  Loader2
} from "lucide-react";
import { slideUp } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { useAuth } from "@/contexts/AuthContext";
import { teamService } from "@/services/teamService";
import { insightsService, AIInsight } from "@/services/insightsService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const typeConfig = {
  growth: { icon: TrendingUp, color: "text-emerald-500", text: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  drop: { icon: TrendingDown, color: "text-rose-500", text: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  viral: { icon: Zap, color: "text-amber-500", text: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  suggestion: { icon: Lightbulb, color: "text-blue-500", text: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
};

const platformIcons = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube
};

export default function Insights() {
  const { user, session } = useAuth();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (user) {
      loadInsights();
    }
  }, [user]);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const team = await teamService.getCurrentUserTeam(user!.id);
      if (team) {
         const data = await insightsService.getInsightsHistory(team.id);
         setInsights(data);
      }
    } catch (error) {
       console.error(error);
       toast.error("Erro ao carregar histórico da IA.");
    } finally {
      setLoading(false);
    }
  };

  const runLiveAnalysis = async () => {
    setAnalyzing(true);
    try {
      const team = await teamService.getCurrentUserTeam(user!.id);
      if (team) {
         // Rodando motor estocástico
         const liveData = await insightsService.simulateLiveAnalysis(team.id, user!.id, session!.access_token);
         
         if (liveData && liveData.length > 0) {
             setInsights(prev => [...liveData, ...prev]);
             toast.success("Nova análise de IA completada com sucesso.");
         } else {
             toast.info("A IA não detectou variações significativas hoje.");
         }
      }
    } catch (error) {
      toast.error("Motor de IA temporariamente indisponível.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container py-8 max-w-6xl animate-in fade-in duration-500">
      <motion.div initial="hidden" animate="visible" variants={slideUp} className="space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row shadow-sm bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle gradient flash in background simulating AI */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
          
          <div className="flex items-center gap-5 z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <h1 className="text-xl font-bold tracking-tight">Dehon IA Insights</h1>
                 <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-primary/20">Beta</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Nosso motor de análise identifica padrões de crescimento 24/7 de forma preditiva.</p>
            </div>
          </div>
          
          <div className="z-10 flex gap-3">
             <Button 
               variant="outline" 
               className="h-11 px-6 rounded-xl border-primary/30 text-primary hover:bg-primary/5 font-bold shadow-sm"
               onClick={runLiveAnalysis}
               disabled={analyzing || loading}
             >
               <RefreshCcw className={cn("w-4 h-4 mr-2", analyzing && "animate-spin")} />
               {analyzing ? "Processando Algoritmo..." : "Rodar Análise Dinâmica"}
             </Button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="font-medium text-muted-foreground animate-pulse">Carregando cérebro de inteligência conectada...</p>
          </div>
        ) : insights.length === 0 ? (
           <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-border/50 rounded-2xl bg-muted/10">
              <Sparkles className="w-10 h-10 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-bold text-foreground">Sem dados para análise</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center">
                 A Inteligência Artificial precisa de pelo menos 30 dias de métricas preenchidas para conseguir ver o futuro das suas contas e encontrar pontos fracos.
              </p>
           </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
               {insights.map((insight, index) => {
                  const config = typeConfig[insight.insight_type];
                  const Icon = config.icon;
                  const PlatIcon = platformIcons[insight.platform as keyof typeof platformIcons] || Instagram;

                  return (
                     <AnimatedCard 
                        key={insight.id} 
                        delay={index * 0.1}
                        className={cn("p-6 border shadow-sm flex flex-col justify-between bg-card/60 relative overflow-hidden group transition-all", config.border)}
                     >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-transform scale-150 transform translate-x-4 -translate-y-4">
                           <Icon className={cn("w-24 h-24", config.color)} />
                        </div>
                        
                        <div className="relative z-10">
                           <div className="flex justify-between items-start mb-4">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border", config.bg, config.text, config.border)}>
                                 <Icon className={cn("w-5 h-5", config.color)} />
                              </div>
                              <div className="flex items-center gap-1.5 opacity-60">
                                 <PlatIcon className="w-4 h-4" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">{insight.platform}</span>
                              </div>
                           </div>

                           <h3 className="text-lg font-bold text-foreground mb-2 leading-tight">
                              {insight.title}
                           </h3>
                           <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                              {insight.description}
                           </p>

                           <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                              <div className="flex items-center gap-2 mb-2">
                                 <CheckCircle2 className="w-4 h-4 text-primary" />
                                 <span className="text-xs font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-500">
                                    O que fazer agora?
                                 </span>
                              </div>
                              <p className="text-sm font-semibold leading-relaxed">
                                 {insight.actionable_step}
                              </p>
                           </div>
                        </div>
                        <div className="relative z-10 mt-6 pt-4 border-t border-border/20 flex justify-between items-center opacity-40">
                           <span className="text-[10px] font-medium">Hash: #{insight.id.split('-')[1] || "MOCK"}</span>
                           <span className="text-[10px] font-medium">{new Date(insight.created_at).toLocaleDateString()} ás {new Date(insight.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                     </AnimatedCard>
                  );
               })}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
