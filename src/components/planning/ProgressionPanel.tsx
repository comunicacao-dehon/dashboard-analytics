import { AnimatedCard } from "@/components/AnimatedCard";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, FileEdit, AlertCircle, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressionPanelProps {
  stats: {
    total: number;
    byStatus: Record<string, number>;
    completionRate: number;
  };
}

export function ProgressionPanel({ stats }: ProgressionPanelProps) {
  const statusItems = [
    { id: "draft", label: "Rascunhos", icon: FileEdit, color: "text-muted-foreground" },
    { id: "review", label: "Em Revisão", icon: Clock, color: "text-amber-500" },
    { id: "approved", label: "Aprovados", icon: CheckCircle2, color: "text-green-500" },
    { id: "scheduled", label: "Agendados", icon: Calendar, color: "text-blue-500" },
    { id: "published", label: "Publicados", icon: TrendingUp, color: "text-primary" },
    { id: "failed", label: "Falhas", icon: AlertCircle, color: "text-red-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedCard className="p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
           </div>
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Taxa de Execução</h3>
           <div className="text-4xl font-black tracking-tighter text-foreground">
             {Math.round(stats.completionRate)}%
           </div>
        </AnimatedCard>

        {statusItems.slice(0, 3).map((item, i) => (
          <AnimatedCard key={item.id} delay={i * 0.1} className="p-8 flex flex-col items-center justify-center text-center">
             <div className={cn("w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mb-4", item.color)}>
                <item.icon className="w-6 h-6" />
             </div>
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{item.label}</h3>
             <div className="text-4xl font-black tracking-tighter text-foreground">
               {stats.byStatus?.[item.id] || 0}
             </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Detailed Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <AnimatedCard className="p-8">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-primary" /> Saúde do Planejamento
            </h3>
            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                     <span className="text-muted-foreground">Meta Semanal Publicada</span>
                     <span>{stats.byStatus?.published || 0} / 10</span>
                  </div>
                  <Progress value={(stats.byStatus?.published || 0) * 10} className="h-2" />
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                     <span className="text-muted-foreground">Postagens Aprovadas</span>
                     <span>{Math.round(((stats.byStatus?.approved || 0) / (stats.total || 1)) * 100)}%</span>
                  </div>
                  <Progress value={((stats.byStatus?.approved || 0) / (stats.total || 1)) * 100} className="h-2" />
               </div>
            </div>
         </AnimatedCard>

         <AnimatedCard className="p-8 bg-black/5 dark:bg-white/5 border-none">
            <h3 className="font-bold text-lg mb-4">Insights de Execução</h3>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "Você está com {stats.byStatus?.approved || 0} postagens prontas para entrar no ar. Mantenha a cadência de aprovação para garantir a consistência semanal da marca."
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl bg-white dark:bg-black/20 border border-border/50">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Média Semanal</span>
                  <p className="text-xl font-black mt-1">4.2 posts</p>
               </div>
               <div className="p-4 rounded-2xl bg-white dark:bg-black/20 border border-border/50">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">Melhor Horário</span>
                  <p className="text-xl font-black mt-1 text-primary">18:00</p>
               </div>
            </div>
         </AnimatedCard>
      </div>
    </div>
  );
}
