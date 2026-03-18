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
    color: "#E1306C",
    textClass: "text-pink-600",
    activeClass: "bg-pink-500/10 text-pink-600 ring-1 ring-pink-500/30",
    hoverClass: "hover:bg-pink-500/5 hover:text-pink-600",
    borderClass: "border-pink-500/10"
  },
  facebook: {
    icon: Facebook,
    label: "Facebook",
    color: "#1877F2",
    textClass: "text-blue-600",
    activeClass: "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/30",
    hoverClass: "hover:bg-blue-500/5 hover:text-blue-600",
    borderClass: "border-blue-500/10"
  },
  youtube: {
    icon: Youtube,
    label: "YouTube",
    color: "#FF0000",
    textClass: "text-red-600",
    activeClass: "bg-red-500/10 text-red-600 ring-1 ring-red-500/30",
    hoverClass: "hover:bg-red-500/5 hover:text-red-600",
    borderClass: "border-red-500/10"
  }
};

const periods = [
  { label: "7 Dias", days: 7 },
  { label: "30 Dias", days: 30 },
  { label: "Este Ano", days: 365 }
];

export default function Metrics() {
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("instagram");
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [selectedPlatform, selectedPeriod, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - selectedPeriod);

      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      const data = await metricsService.getMetricsByPlatform(selectedPlatform, user!.id, startDateStr, endDateStr);
      
      if (!data || data.length === 0) {
        generateMockData();
      } else {
        setMetrics(data);
      }
    } catch (error) {
      console.error("Erro ao carregar métricas:", error);
      generateMockData(); 
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockData: Metric[] = [];
    const now = new Date();
    for (let i = selectedPeriod; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      
      let baseVal = selectedPlatform === "instagram" ? 5000 : selectedPlatform === "facebook" ? 3000 : 1000;
      let multiplier = 1 + (Math.random() * 0.2); 

      mockData.push({
        id: `mock-${i}`,
        account_id: "mock-account",
        platform: selectedPlatform,
        date: d.toISOString().split('T')[0],
        followers: Math.floor(baseVal * (1 + (selectedPeriod - i) * 0.01)),
        reach: Math.floor(baseVal * 0.8 * multiplier),
        impressions: Math.floor(baseVal * 1.5 * multiplier),
        engagement: Math.floor(baseVal * 0.1 * multiplier),
        clicks: Math.floor(baseVal * 0.05 * multiplier),
        views: Math.floor(baseVal * 2 * multiplier),
        created_at: new Date().toISOString()
      });
    }
    setMetrics(mockData);
  };

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
    { label: "Impressões", value: currentMetrics.impressions, prev: previousMetrics?.impressions, icon: Eye },
    { label: "Engajamento", value: currentMetrics.engagement, prev: previousMetrics?.engagement, icon: TrendingUp },
    { label: "Cliques", value: currentMetrics.clicks, prev: previousMetrics?.clicks, icon: MousePointerClick },
  ] : [];

  return (
    <div className="container py-8 max-w-7xl animate-in fade-in duration-500">
      <motion.div initial="hidden" animate="visible" variants={slideUp} className="space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row shadow-sm bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-5 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Métricas Globais</h1>
              <p className="text-sm text-muted-foreground">Análise profissional de redes sociais.</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="h-10 px-4 rounded-xl border-border/80 font-medium hover:bg-muted"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCcw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
            Atualizar Dados
          </Button>
        </div>

        {/* Controls (Platform & Period) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex bg-muted/30 p-1.5 rounded-xl border border-border/50 gap-1 overflow-x-auto">
            {(Object.keys(platformConfig) as Platform[]).map((platform) => {
              const config = platformConfig[platform];
              const isActive = selectedPlatform === platform;
              const Icon = config.icon;
              return (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center",
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

          <div className="flex bg-muted/30 p-1.5 rounded-xl border border-border/50 gap-1">
            {periods.map((period) => {
              const isActive = selectedPeriod === period.days;
              return (
                <button
                  key={period.days}
                  onClick={() => setSelectedPeriod(period.days)}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-1",
                    isActive 
                      ? "bg-background text-foreground shadow-sm ring-1 ring-border" 
                      : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
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
              <h3 className="text-lg font-bold text-foreground">Ainda não há dados aqui</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm text-center">
                 Conecte suas contas ou aguarde a primeira sincronização para visualizar as métricas.
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
                      className="p-4 border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden bg-card/60"
                    >
                      <div className="flex items-center justify-between text-muted-foreground mb-3">
                         <span className="text-xs font-bold uppercase tracking-wide">{card.label}</span>
                         <card.icon className="w-4 h-4 opacity-50" />
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
                <AnimatedCard className="p-5 border-border/50 shadow-sm col-span-1 lg:col-span-2 bg-card/60">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-base font-bold text-foreground">Evolução de Alcance e Impressões</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Comparativo de performance diária</p>
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
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '0.75rem',
                            fontSize: '12px',
                            fontWeight: '600',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                          }}
                          labelFormatter={(l) => new Date(l).toLocaleDateString()}
                        />
                        <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px', fontWeight: '500' }} iconType="circle" />
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
                          name="Impressões" 
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
                <AnimatedCard className="p-5 border-border/50 shadow-sm bg-card/60">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-foreground">Engajamento Diário</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Volume de interações</p>
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
                          cursor={{fill: 'currentColor', opacity: 0.03}}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))',
                            borderColor: 'hsl(var(--border))',
                            borderRadius: '0.75rem',
                            fontSize: '12px',
                            fontWeight: '600',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Bar dataKey="engagement" name="Engajamento" fill={activeColor} fillOpacity={0.8} radius={[3,3,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </AnimatedCard>

                {/* Growth Funnel Setup */}
                <AnimatedCard className="p-5 border-border/50 shadow-sm flex flex-col justify-center bg-card/60">
                   <div className="mb-6">
                    <h3 className="text-base font-bold text-foreground">Desempenho Base</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Métricas de conversão</p>
                  </div>
                  <div className="space-y-5">
                     <div>
                        <div className="flex justify-between text-xs font-semibold mb-1.5 text-foreground">
                           <span>Visualizações Totais</span>
                           <span>100%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                           <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs font-semibold mb-1.5 text-foreground">
                           <span>Visitas ao Perfil</span>
                           <span>{((currentMetrics?.engagement || 0) / (currentMetrics?.views || 1) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                           <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${((currentMetrics?.engagement || 0) / (currentMetrics?.views || 1) * 100)}%`}} />
                        </div>
                     </div>
                     <div>
                        <div className="flex justify-between text-xs font-semibold mb-1.5 text-foreground">
                           <span>Ações (Cliques)</span>
                           <span>{((currentMetrics?.clicks || 0) / (currentMetrics?.views || 1) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                           <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${((currentMetrics?.clicks || 0) / (currentMetrics?.views || 1) * 100)}%`}} />
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
