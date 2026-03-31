import { useAuth } from "@/contexts/AuthContext";
import { Globe, Users, MousePointerClick, TrendingUp, Clock, Activity, ArrowUpRight, BarChart3, Star } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/AnimatedCard";
import { slideUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";

export default function Website() {
  const { user } = useAuth();
  const isConventinho = user?.email?.toLowerCase() === 'comunicacao@conventinho.org.br';

  if (!isConventinho) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center min-h-[70vh] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-20 h-20 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
        >
          <Globe className="w-8 h-8 text-emerald-500" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-black tracking-tight text-foreground mb-3"
        >
          Site não vinculado
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-md mb-10 font-medium"
        >
          Insira a URL do seu site para começar a rastrear visitantes, páginas acessadas e tempo de permanência de forma automática.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="flex bg-muted p-1.5 rounded-2xl border border-border mb-4 focus-within:border-emerald-500/50 transition-colors shadow-inner">
            <span className="flex items-center pl-4 pr-2 text-muted-foreground font-bold">https://</span>
            <input 
                type="text" 
                placeholder="seusite.com.br"
                className="flex-1 bg-transparent border-none outline-none text-foreground font-bold tracking-tight placeholder:text-muted-foreground/50 h-12"
            />
            <Button className="rounded-xl h-12 px-6 ml-1 bg-emerald-500 hover:bg-emerald-600 text-foreground font-black uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
              Vincular
            </Button>
          </div>
          <p className="text-[10px] text-foreground/30 uppercase tracking-widest font-black flex items-center justify-center gap-1.5 mt-4">
             <Activity className="w-3 h-3" /> Integração via Pixel de Análise
          </p>
        </motion.div>
      </div>
    );
  }

  const metrics = [
    { label: "Visitantes Únicos", value: "24.593", icon: Users, trend: "+15.2%", color: "text-blue-400" },
    { label: "Visualizações de Página", value: "89.102", icon: Globe, trend: "+22.4%", color: "text-emerald-400" },
    { label: "Taxa de Rejeição", value: "42.8%", icon: MousePointerClick, trend: "-2.1%", color: "text-amber-400" },
    { label: "Tempo Médio", value: "2m 45s", icon: Clock, trend: "+12s", color: "text-violet-400" },
  ];

  const topPages = [
    { path: "/", views: "45.210", bounce: "38%", time: "1m 20s" },
    { path: "/doacoes", views: "12.845", bounce: "25%", time: "3m 45s" },
    { path: "/vocacao", views: "9.620", bounce: "45%", time: "2m 15s" },
    { path: "/sobre-nos", views: "6.430", bounce: "51%", time: "1m 50s" },
  ];

  return (
    <div className="min-h-screen bg-transparent pb-12 selection:bg-emerald-500/20">
      <div className="absolute top-0 inset-x-0 h-[250px] bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none -z-10 blur-3xl" />

      <main className="container pt-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
          
          {/* Header */}
          <motion.div variants={slideUp} className="flex flex-col md:flex-row items-center justify-between shadow-xl bg-card border border-border rounded-3xl p-6 gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />
            
            <div className="flex items-center gap-5 relative z-10 w-full justify-center md:justify-start text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] shrink-0 border border-emerald-400/20 relative group overflow-hidden">
                <div className="absolute inset-0 bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <Globe className="w-7 h-7 text-foreground relative z-10" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                   <h1 className="text-2xl font-black tracking-tight text-foreground mb-0.5">conventinho.com.br</h1>
                   <div className="bg-emerald-500/20 rounded-full p-1 opacity-80" aria-label="Verificado">
                     <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                   </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest text-foreground/40 justify-center md:justify-start mt-1">
                   <div className="flex items-center gap-1.5 text-emerald-400">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                     Rastreamento Ativo
                   </div>
                   <span>•</span>
                   <span>Últimos 30 dias</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <motion.div key={i} variants={slideUp}>
                <AnimatedCard className="p-6 border-border relative overflow-hidden group hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between text-foreground/40 mb-3 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <m.icon className={`w-4 h-4 text-emerald-500`} />
                    </div>
                  </div>
                  <div className="space-y-1 relative z-10">
                    <p className="text-2xl font-black tracking-tight text-foreground">{m.value}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400">
                        <ArrowUpRight className="w-2.5 h-2.5" />
                        {m.trend}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60 uppercase font-bold tracking-wider">vs per. anterior</span>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AnimatedCard className="lg:col-span-2 p-6 md:p-8 bg-card border-border shadow-md">
              <div className="flex items-center gap-2 mb-8">
                <BarChart3 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-xl font-bold tracking-tight text-foreground">Tráfego por Página</h3>
              </div>
              <div className="space-y-6">
                {topPages.map((page, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors relative overflow-hidden group">
                     {/* Progress bar background */}
                     <div className="absolute top-0 left-0 h-full bg-emerald-500/5 transition-all duration-1000 -z-10" style={{ width: `${100 - (i * 15)}%` }} />
                     
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-black text-foreground/40 border border-white/5">0{i+1}</div>
                        <p className="font-bold text-foreground font-mono text-sm tracking-tight">{page.path}</p>
                     </div>
                     <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                           <p className="text-[10px] font-black uppercase text-foreground/30 tracking-widest mb-1">Visualizações</p>
                           <p className="font-bold text-foreground">{page.views}</p>
                        </div>
                        <div className="text-center hidden sm:block">
                           <p className="text-[10px] font-black uppercase text-foreground/30 tracking-widest mb-1">Rejeição</p>
                           <p className="font-bold text-amber-400">{page.bounce}</p>
                        </div>
                        <div className="text-center hidden sm:block">
                           <p className="text-[10px] font-black uppercase text-foreground/30 tracking-widest mb-1">Duração</p>
                           <p className="font-bold text-foreground/70">{page.time}</p>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </AnimatedCard>
            
            <AnimatedCard className="p-6 md:p-8 bg-card border-border shadow-md flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/30 mb-6 drop-shadow-xl relative group">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Activity className="w-8 h-8 text-indigo-400 relative z-10" />
               </div>
               <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Análise de IA</h3>
               <p className="text-sm font-medium text-foreground/50 mb-8 leading-relaxed">
                 O tráfego da página <strong>/doacoes</strong> teve um aumento de 145% nos últimos 7 dias. Recomendamos adicionar um CTA mais visível no banner pincipal.
               </p>
               <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-foreground font-bold h-12 shadow-[0_0_15px_rgba(99,102,241,0.3)] rounded-xl uppercase tracking-widest text-[10px]">
                 Ver mais análises
               </Button>
            </AnimatedCard>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
