import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointerClick,
  Activity,
  Calendar,
  Loader2,
  RefreshCcw
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { metricsService, Platform, Metric } from "@/services/metricsService";
import { AnimatedCard } from "@/components/AnimatedCard";
import { slideUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

const platformConfig = {
  instagram: {
    icon: Instagram,
    label: "Instagram",
    color: "#f59e0b", // Amber theme override
    textClass: "text-amber-500",
    activeClass: "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30",
    hoverClass: "hover:bg-muted hover:text-foreground",
    borderClass: "border-amber-500/10"
  },
  facebook: {
    icon: Facebook,
    label: "Facebook",
    color: "#f59e0b",
    textClass: "text-amber-500",
    activeClass: "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30",
    hoverClass: "hover:bg-muted hover:text-foreground",
    borderClass: "border-amber-500/10"
  },
  youtube: {
    icon: Youtube,
    label: "YouTube",
    color: "#f59e0b",
    textClass: "text-amber-500",
    activeClass: "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30",
    hoverClass: "hover:bg-muted hover:text-foreground",
    borderClass: "border-amber-500/10"
  }
};

const periods = [
  { label: "7 Dias", days: 7 },
  { label: "30 Dias", days: 30 },
  { label: "Este Ano", days: 365 }
];
import { EmptyPlatformState } from "@/components/layout/EmptyPlatformState";
import { getConnectedAccounts } from "@/services/socialService";
import type { SocialAccount } from "@/types/social";

export default function Metrics() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("instagram");
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    let active = true;

    async function init() {
      if (user) {
        const accs = await getConnectedAccounts(user.id);
        if (active) {
           setAccounts(accs);
           setLoadingAccounts(false);
           await loadMetrics();
        }
      } else {
        if (active) setLoadingAccounts(false);
      }
    }

    async function loadMetrics() {
        if (!user) return;
        setLoading(true);
        try {
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(endDate.getDate() - selectedPeriod);

          const startDateStr = startDate.toISOString().split('T')[0];
          const endDateStr = endDate.toISOString().split('T')[0];

          const data = await metricsService.getMetricsByPlatform(selectedPlatform, user.id, startDateStr, endDateStr);
          
          if (active) {
             if (!data || data.length === 0) {
               setMetrics([]);
             } else {
               setMetrics(data);
             }
          }
        } catch (error) {
          console.error("Erro critico ao carregar mÃ©tricas (Metrics.tsx):", error);
          if (active) setMetrics([]); 
        } finally {
          if (active) setLoading(false);
        }
    }

    init();

    return () => { active = false; };
  }, [selectedPlatform, selectedPeriod, user]);

  const fetchData = async () => {
     // Alias for manual button refresh
     if (!user) return;
     setLoading(true);
     try {
       const endDate = new Date();
       const startDate = new Date();
       startDate.setDate(endDate.getDate() - selectedPeriod);

       const startDateStr = startDate.toISOString().split('T')[0];
       const endDateStr = endDate.toISOString().split('T')[0];

       const data = await metricsService.getMetricsByPlatform(selectedPlatform, user.id, startDateStr, endDateStr);
       setMetrics(data || []);
     } catch(e) {
       console.error("Refresh Error:", e);
       setMetrics([]);
     } finally {
       setLoading(false);
     }
  };

  const hasAccounts = accounts.length > 0;
  const isConventinho = user?.email?.toLowerCase() === 'comunicacao@conventinho.org.br';

  if (loadingAccounts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="w-8 h-8 text-amber-500 animate-pulse" />
      </div>
    );
  }

  if (!isConventinho && !hasAccounts) {
    return <EmptyPlatformState platform="MÃ©tricas Globais" icon={<Activity className="w-8 h-8 text-amber-500" />} description="Vincule suas redes sociais para acessar mÃ©tricas detalhadas de seguidores, alcance e engajamento." />;
  }

  const currentMetrics = metrics.length > 0 ? metrics[metrics.length - 1] : null;
  const previousMetrics = metrics.length > 1 ? metrics[0] : null;

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const activeColor = platformConfig[selectedPlatform].color;

  const summaryCards = currentMetrics ? [
    { label: "Seguidores", value: currentMetrics.followers, prev: previousMetrics?.followers, icon: Users },
    { label: "Alcance", value: currentMetrics.reach, prev: previousMetrics?.reach, icon: Activity },
    { label: "ImpressÃµes", value: currentMetrics.impressions, prev: previousMetrics?.impressions, icon: Eye },
    { label: "Engajamento", value: currentMetrics.engagement, prev: previousMetrics?.engagement, icon: TrendingUp },
    { label: "Cliques", value: currentMetrics.clicks, prev: previousMetrics?.clicks, icon: MousePointerClick },
  ] : [];

  return (
    <div className="container py-8 max-w-7xl animate-in fade-in duration-500">
      <motion.div initial="hidden" animate="visible" variants={slideUp} className="space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)] bg-white/[0.04] backdrop-blur-[40px] border border-white/[0.08] rounded-[2rem] p-6 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground mb-1">MÃ©tricas Globais</h1>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AnÃ¡lise profissional de redes sociais</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="h-12 px-6 rounded-xl border-border bg-muted text-foreground hover:bg-secondary font-bold shadow-sm"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCcw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Atualizar Dados
          </Button>
        </div>

        {/* Controls (Platform & Period) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex bg-white/[0.02] p-1.5 rounded-[1.5rem] border border-white/[0.08] gap-1 overflow-x-auto shadow-inner">
            {(Object.keys(platformConfig) as Platform[]).map((platform) => {
              const config = platformConfig[platform];
              const isActive = selectedPlatform === platform;
              const Icon = config.icon;
              return (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-1 justify-center",
                    isActive 
                      ? config.activeClass 
                      : `text-muted-foreground ${config.hoverClass}`
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {config.label}
                </button>
              );
            })}
          </div>

          <div className="flex bg-white/[0.02] p-1.5 rounded-[1.5rem] border border-white/[0.08] gap-1 shadow-inner">
            {periods.map((period) => {
              const isActive = selectedPeriod === period.days;
              return (
                <button
                  key={period.days}
                  onClick={() => setSelectedPeriod(period.days)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex-1",
                    isActive 
                      ? "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {period.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="font-medium text-muted-foreground animate-pulse">Sintetizando os dados...</p>
          </div>
        ) : metrics.length === 0 ? (
           <div className="h-[400px] flex flex-col items-center justify-center border border-dashed border-border/50 rounded-2xl bg-muted/10">
              <Activity className="w-10 h-10 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-bold text-foreground">Ainda nÃ£o hÃ¡ dados aqui</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center">
                 Conecte suas contas ou aguarde a primeira sincronizaÃ§Ã£o para visualizar as mÃ©tricas.
              </p>
           </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedPlatform}-${selectedPeriod}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {summaryCards.map((card, i) => {
                  const growth = calculateGrowth(card.value, card.prev || 0);
                  const isPositive = Number(growth) >= 0;
                  return (
                    <AnimatedCard 
                      key={i} 
                      className="p-5 border-white/[0.08] relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-muted-foreground mb-3">
                         <span className="text-[10px] font-black uppercase tracking-widest">{card.label}</span>
                         <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center">
                             <card.icon className="w-4 h-4 text-muted-foreground" />
                         </div>
                      </div>
                      <div className="space-y-1">
                         <p className="text-2xl font-bold tracking-tight text-foreground">{card.value.toLocaleString()}</p>
                         <div className="flex items-center gap-1.5">
                            <span className={cn(
                               "text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5",
                               isPositive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            )}>
                               <TrendingUp className={cn("w-3 h-3", !isPositive && "rotate-180")} />
                               {Math.abs(Number(growth))}%
                            </span>
                            <span className="text-[10px] text-muted-foreground uppercase font-medium">vs per. anterior</span>
                         </div>
                      </div>
                    </AnimatedCard>
                  );
                })}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Evolution Chart */}
                <AnimatedCard className="p-6 border-white/[0.08] col-span-1 lg:col-span-2">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-foreground tracking-tight">EvoluÃ§Ã£o de Alcance e ImpressÃµes</h3>
                      <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1">Comparativo de performance diÃ¡ria</p>
                    </div>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-[0.05]" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(val) => {
                            const d = new Date(val);
                            return `${d.getDate()}/${d.getMonth()+1}`;
                          }}
                          stroke="currentColor" 
                          className="text-[11px] font-medium opacity-50" 
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis 
                          tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
                          stroke="currentColor" 
                          className="text-[11px] font-medium opacity-50"
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: '#050505',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '1rem',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)'
                          }}
                          labelFormatter={(l) => new Date(l).toLocaleDateString()}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }} iconType="circle" />
                        <Line 
                          type="monotone" 
                          dataKey="reach" 
                          name="Alcance" 
                          stroke={activeColor} 
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="impressions" 
                          name="ImpressÃµes" 
                          stroke="hsl(var(--muted-foreground))" 
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={false}
                          className="opacity-40"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </AnimatedCard>

                {/* Engagement Bar Chart */}
                <AnimatedCard className="p-6 border-white/[0.08]">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-foreground tracking-tight">Engajamento DiÃ¡rio</h3>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1">Volume de interaÃ§Ãµes</p>
                  </div>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metrics} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-[0.05]" />
                         <XAxis dataKey="date" hide />
                         <YAxis 
                          stroke="currentColor" 
                          className="text-[11px] font-medium opacity-50"
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
                        />
                        <RechartsTooltip 
                          cursor={{fill: 'rgba(255,255,255,0.05)'}}
                          contentStyle={{ 
                            backgroundColor: '#050505',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '1rem',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)'
                          }}
                        />
                        <Bar dataKey="engagement" name="Engajamento" fill={activeColor} fillOpacity={0.8} radius={[3,3,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </AnimatedCard>

                {/* Growth Funnel Setup */}
                <AnimatedCard className="p-6 border-white/[0.08] flex flex-col justify-center">
                   <div className="mb-8">
                    <h3 className="text-xl font-bold text-foreground tracking-tight">Desempenho Base</h3>
                    <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mt-1">MÃ©tricas de conversÃ£o</p>
                  </div>
                  <div className="space-y-5">
                     <div>
                        <div className="flex justify-between text-[10px] font-black tracking-widest uppercase mb-2 text-foreground/70">
                           <span>VisualizaÃ§Ãµes Totais</span>
                           <span className="text-foreground">100%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden shadow-inner flex">
                           <div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '100%' }} />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-[10px] font-black tracking-widest uppercase mb-2 text-foreground/70">
                           <span>Visitas ao Perfil</span>
                           <span className="text-foreground">{((currentMetrics?.engagement || 0) / (currentMetrics?.views || 1) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden shadow-inner flex">
                           <div className="h-full bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all" style={{ width: `${((currentMetrics?.engagement || 0) / (currentMetrics?.views || 1) * 100)}%`}} />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-[10px] font-black tracking-widest uppercase mb-2 text-foreground/70">
                           <span>AÃ§Ãµes EstratÃ©gicas (Cliques)</span>
                           <span className="text-foreground">{((currentMetrics?.clicks || 0) / (currentMetrics?.views || 1) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden shadow-inner flex">
                           <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all" style={{ width: `${((currentMetrics?.clicks || 0) / (currentMetrics?.views || 1) * 100)}%`}} />
                        </div>
                     </div>
                  </div>
                </AnimatedCard>

              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}

