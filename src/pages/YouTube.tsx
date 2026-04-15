import { motion } from "framer-motion";
import { Youtube as YoutubeIcon, Users, Eye, Play, TrendingUp, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { staggerContainer, slideUp } from "@/lib/animations";
import { PlatformCard } from "@/components/social/PlatformCard";
import { AnimatedCard } from "@/components/AnimatedCard";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const subscriberData = [
  { month: "Out", value: 1100 },
  { month: "Nov", value: 1250 },
  { month: "Dez", value: 1320 },
  { month: "Jan", value: 1480 },
  { month: "Fev", value: 1650 },
  { month: "Mar", value: 1820 },
];

const viewsData = [
  { week: "Sem 1", value: 3400 },
  { week: "Sem 2", value: 5100 },
  { week: "Sem 3", value: 4200 },
  { week: "Sem 4", value: 6800 },
  { week: "Sem 5", value: 7200 },
  { week: "Sem 6", value: 9400 },
];

const topVideos = [
  { title: "Votos Perpétuos - ao vivo", views: 9800, retention: 72 },
  { title: "Reflexão - Quaresma 2026", views: 7200, retention: 68 },
  { title: "Novena de Nossa Senhora", views: 5400, retention: 65 },
  { title: "Testemunho de conversão", views: 3900, retention: 58 },
  { title: "Oração da manhã - série", views: 2800, retention: 54 },
];

const retentionData = [
  { second: "0s", value: 100 },
  { second: "30s", value: 82 },
  { second: "1min", value: 73 },
  { second: "2min", value: 65 },
  { second: "3min", value: 58 },
  { second: "5min", value: 51 },
  { second: "8min", value: 44 },
  { second: "10min", value: 38 },
];

const tooltipStyle = {
  contentStyle: {
    borderRadius: "12px",
    border: "1px solid var(--color-border)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    fontSize: "12px",
  },
};
import { useAuth } from "@/contexts/AuthContext";
import { useStableUserId } from "@/hooks/useStableUserId";
import { EmptyPlatformState } from "@/components/layout/EmptyPlatformState";
import { useEffect, useState } from "react";
import { getConnectedAccounts } from "@/services/socialService";
import type { SocialAccount } from "@/types/social";

export default function YouTube() {
  const { user } = useAuth();
  const stableUserId = useStableUserId();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!stableUserId) return;
      const result = await getConnectedAccounts(stableUserId);
      setAccounts(result);
      setLoading(false);
    }
    load();
  }, [stableUserId]);

  const isConventinho = user?.email?.toLowerCase() === 'comunicacao@conventinho.org.br';
  const hasYouTube = accounts.some(a => a.platform === "youtube");

  if (loading) return null;

  if (!hasYouTube && !isConventinho) {
    return <EmptyPlatformState platform="YouTube" icon={<YoutubeIcon className="w-8 h-8 text-red-500" />} description="Vincule seu canal do YouTube para ver métricas de vídeos, inscritos e engajamento." />;
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="absolute top-0 inset-x-0 h-[250px] bg-gradient-to-br from-red-500/5 via-transparent to-transparent pointer-events-none -z-10" />

      <main className="container py-10 max-w-7xl">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4 mb-10"
        >
          <motion.div variants={slideUp} className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <YoutubeIcon className="w-6 h-6 text-red-500" />
          </motion.div>
          <div>
            <motion.h1 variants={slideUp} className="text-3xl font-bold tracking-tight">YouTube Analytics</motion.h1>
            <motion.p variants={slideUp} className="text-muted-foreground">Análise completa do seu canal no YouTube</motion.p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <PlatformCard label="Inscritos" value="1.820" icon={Users} trend="+10,3%" trendUp accentColor="bg-red-50 text-red-500" delay={0.1} />
          <PlatformCard label="Visualizações Totais" value="36.800" icon={Eye} trend="+22%" trendUp accentColor="bg-red-50 text-red-500" delay={0.2} />
          <PlatformCard label="Vídeos Publicados" value="8" icon={Play} trend="+2" trendUp accentColor="bg-red-50 text-red-500" delay={0.3} />
          <PlatformCard label="Retenção Média" value="64%" icon={TrendingUp} trend="+5%" trendUp accentColor="bg-red-50 text-red-500" delay={0.4} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="inscritos">
          <TabsList className="mb-6 bg-muted/50 rounded-xl">
            <TabsTrigger value="inscritos" className="rounded-lg">Inscritos</TabsTrigger>
            <TabsTrigger value="visualizacoes" className="rounded-lg">Visualizações</TabsTrigger>
            <TabsTrigger value="videos" className="rounded-lg">Vídeos</TabsTrigger>
            <TabsTrigger value="retencao" className="rounded-lg">Retenção</TabsTrigger>
          </TabsList>

          <TabsContent value="inscritos">
            <AnimatedCard className="p-6">
              <h3 className="font-semibold mb-1">Evolução de Inscritos</h3>
              <p className="text-sm text-muted-foreground mb-5">Crescimento dos últimos 6 meses</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={subscriberData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ytSubs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff0000" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#ff0000" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                    <Tooltip {...tooltipStyle} />
                    <Area type="monotone" dataKey="value" name="Inscritos" stroke="#ff0000" strokeWidth={2.5} fill="url(#ytSubs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="visualizacoes">
            <AnimatedCard className="p-6">
              <h3 className="font-semibold mb-1">Visualizações por Semana</h3>
              <p className="text-sm text-muted-foreground mb-5">Total de views semanais</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={viewsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="value" name="Visualizações" fill="#ff4444" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="videos">
            <AnimatedCard className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold">Ranking de Vídeos</h3>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topVideos} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                    <YAxis type="category" dataKey="title" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} width={180} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="views" name="Visualizações" fill="#ff4444" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AnimatedCard>
          </TabsContent>

          <TabsContent value="retencao">
            <AnimatedCard className="p-6">
              <h3 className="font-semibold mb-1">Retenção de Audiência</h3>
              <p className="text-sm text-muted-foreground mb-5">Percentual de espectadores por momento do vídeo</p>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retentionData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ytRetention" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff0000" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#ff0000" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis dataKey="second" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} unit="%" />
                    <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, "Retenção"]} />
                    <Area type="monotone" dataKey="value" name="Retenção" stroke="#ff0000" strokeWidth={2.5} fill="url(#ytRetention)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </AnimatedCard>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
