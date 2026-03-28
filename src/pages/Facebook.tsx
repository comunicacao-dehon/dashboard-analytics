import { motion } from "framer-motion";
import { Facebook as FacebookIcon, Users, TrendingUp, Heart, Share2, BarChart3, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { staggerContainer, slideUp } from "@/lib/animations";
import { PlatformCard } from "@/components/social/PlatformCard";
import { AnimatedCard } from "@/components/AnimatedCard";
import { FacebookAnalyticsCard } from "@/components/facebook/FacebookAnalyticsCard";
import type { FacebookAnalyticsDataPoint } from "@/components/facebook/FacebookAnalyticsChart";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── Dados gerais limpos (Aguradando motor de sincronização) ────────────────────
const followersData: any[] = [];
const reachData: any[] = [];
const topPosts: any[] = [];

const tooltipStyle = {
  contentStyle: {
    borderRadius: "12px",
    border: "1px solid var(--color-border)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    fontSize: "12px",
  },
};

// ─── Arrays Limpos (Substituídos por dados reais da API ou Arrays Vazios) ─────────────────
const fbFollowersData: FacebookAnalyticsDataPoint[] = [];
const fbVisitsData: FacebookAnalyticsDataPoint[] = [];
const fbClicksData: FacebookAnalyticsDataPoint[] = [];
const fbInteractionsData: FacebookAnalyticsDataPoint[] = [];
const fbViewsData: FacebookAnalyticsDataPoint[] = [];

const analyticsMetrics = [
  {
    title: "Seguidores do Facebook",
    value: "17 mil",
    trend: "+4,2%",
    positive: true,
    chartLabel: "Seguidores do Facebook",
    data: fbFollowersData,
  },
  {
    title: "Curtidas na Página",
    value: "9,1 mil",
    trend: "+5,8%",
    positive: true,
    chartLabel: "Curtidas no Facebook",
    data: fbVisitsData,
  },
  {
    title: "Cliques no link",
    value: "2",
    trend: "100%",
    positive: true,
    chartLabel: "Cliques no link do Facebook",
    data: fbClicksData,
  },
  {
    title: "Engajamento Total",
    value: "1.079",
    trend: "+7%",
    positive: true,
    chartLabel: "Interações com o conteúdo",
    data: fbInteractionsData,
  },
  {
    title: "Visualizações de conteúdo",
    value: "37.074",
    trend: "52%",
    positive: true,
    chartLabel: "Visualizações",
    data: fbViewsData,
  },
];

import { useAuth } from "@/contexts/AuthContext";
import { EmptyPlatformState } from "@/components/layout/EmptyPlatformState";
import { useEffect, useState } from "react";
import { getConnectedAccounts, fetchFacebookMetrics, fetchRecentPosts } from "@/services/socialService";
import type { SocialAccount, FacebookMetrics, SocialPost } from "@/types/social";
import { Activity } from "lucide-react";

// Helper function to format big numbers
const formatCompactValue = (num: number) => 
  new Intl.NumberFormat('pt-BR', { notation: "compact", maximumFractionDigits: 1 }).format(num);

// Component
export default function Facebook() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<FacebookMetrics | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isFetchingMetrics, setIsFetchingMetrics] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const result = await getConnectedAccounts(user.id);
      setAccounts(result);
      setLoading(false);

      // Fetch live Facebook metrics
      const fbAccount = result.find(a => a.platform === "facebook");
      if (fbAccount) {
        setIsFetchingMetrics(true);
        const fbData = await fetchFacebookMetrics(fbAccount);
        if (fbData.success && fbData.data) {
          setMetrics(fbData.data);
        }
        
        const fbPosts = await fetchRecentPosts(fbAccount, 5);
        if (fbPosts.success && fbPosts.data) {
          setPosts(fbPosts.data);
        }
        
        setIsFetchingMetrics(false);
      }
    }
    load();
  }, [user]);

  const isConventinho = user?.email?.toLowerCase() === 'comunicacao@conventinho.org.br';
  const hasFacebook = accounts.some(a => a.platform === "facebook");

  if (loading) return null;

  if (!hasFacebook && !isConventinho) {
    return <EmptyPlatformState platform="Facebook" icon={<FacebookIcon className="w-8 h-8 text-blue-500" />} description="Vincule sua página do Facebook para ver métricas de alcance, curtidas e engajamento." />;
  }

  const chartPosts = posts.length > 0 ? posts.map(p => ({
    title: p.caption ? p.caption.substring(0, 15) + (p.caption.length > 15 ? '...' : '') : 'Post Media',
    reach: p.reach || (p.likes + p.comments) * 3, // Fallback estimator
    engagement: p.likes + p.comments + p.shares
  })) : topPosts;

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="absolute top-0 inset-x-0 h-[250px] bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none -z-10" />

      <main className="container py-10 max-w-7xl">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4 mb-10"
        >
          <motion.div variants={slideUp} className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <FacebookIcon className="w-6 h-6 text-blue-500" />
          </motion.div>
          <div>
            <motion.h1 variants={slideUp} className="text-3xl font-bold tracking-tight">Facebook Analytics</motion.h1>
            <motion.p variants={slideUp} className="text-muted-foreground">Análise completa da sua página no Facebook</motion.p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <PlatformCard 
            label="Seguidores da Página" 
            value={metrics ? formatCompactValue(metrics.followers) : "..."} 
            icon={Users} 
            trend="+4,2%" trendUp accentColor="bg-blue-50 text-blue-500" delay={0.1} 
          />
          <PlatformCard 
            label="Curtidas Totais" 
            value={metrics ? formatCompactValue(metrics.pageLikes) : "..."} 
            icon={Heart} 
            trend="+5,8%" trendUp accentColor="bg-blue-50 text-blue-500" delay={0.2} 
          />
          <PlatformCard 
            label="Visualizações" 
            value={metrics ? formatCompactValue(metrics.pageViews) : "..."} 
            icon={Eye} 
            trend="+52%" trendUp accentColor="bg-blue-50 text-blue-500" delay={0.3} 
          />
          <PlatformCard 
            label="Engajamento" 
            value={metrics ? formatCompactValue(metrics.reactions) : "..."} 
            icon={TrendingUp} 
            trend="+7%" trendUp accentColor="bg-blue-50 text-blue-500" delay={0.4} 
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="analytics">
          <TabsList className="mb-6 bg-muted/50 rounded-xl">
            <TabsTrigger value="analytics" className="rounded-lg">Facebook Analytics</TabsTrigger>
            <TabsTrigger value="publico" className="rounded-lg">Público</TabsTrigger>
            <TabsTrigger value="tendencias" className="rounded-lg">Tendências</TabsTrigger>
            <TabsTrigger value="posts" className="rounded-lg">Posts</TabsTrigger>
            <TabsTrigger value="engajamento" className="rounded-lg">Engajamento</TabsTrigger>
          </TabsList>

          {/* ─── Tab: Facebook Analytics ─────────────────────────────────── */}
          <TabsContent value="analytics">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Sincronização Ativa</span> · O histórico do motor de telemetria é populado diaramente.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {/* Injecting dynamic summary directly using the real metrics to replace hardcoded strings */}
              <FacebookAnalyticsCard title="Seguidores do Facebook" value={metrics ? formatCompactValue(metrics.followers) : "..."} trend="+4,2%" positive={true} chartLabel="Seguidores do Facebook" data={fbFollowersData} delay={0.0} />
              <FacebookAnalyticsCard title="Curtidas na Página" value={metrics ? formatCompactValue(metrics.pageLikes) : "..."} trend="+5,8%" positive={true} chartLabel="Curtidas no Facebook" data={fbVisitsData} delay={0.07} />
              <FacebookAnalyticsCard title="Cliques no link" value="2" trend="100%" positive={true} chartLabel="Cliques no link do Facebook" data={fbClicksData} delay={0.14} />
              <FacebookAnalyticsCard title="Engajamento Total" value={metrics ? formatCompactValue(metrics.reactions) : "..."} trend="+7%" positive={true} chartLabel="Interações com o conteúdo" data={fbInteractionsData} delay={0.21} />
              <FacebookAnalyticsCard title="Visualizações de conteúdo" value={metrics ? formatCompactValue(metrics.pageViews) : "..."} trend="+52%" positive={true} chartLabel="Visualizações" data={fbViewsData} delay={0.28} />
            </div>
          </TabsContent>

          {/* ─── Tab: Público ─────────────────────────────────────────────── */}
          <TabsContent value="publico">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatedCard className="p-6">
                <h3 className="font-semibold mb-1">Crescimento de Seguidores</h3>
                <p className="text-sm text-muted-foreground mb-5">Evolução dos últimos 6 meses</p>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={followersData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                      <Tooltip {...tooltipStyle} />
                      <Line type="monotone" dataKey="value" name="Seguidores" stroke="#1877f2" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </AnimatedCard>

              <AnimatedCard className="p-6" delay={0.1}>
                <h3 className="font-semibold mb-1">Alcance Semanal</h3>
                <p className="text-sm text-muted-foreground mb-5">Pessoas alcançadas por semana</p>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reachData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="fbReach" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1877f2" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#1877f2" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} dy={8} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                      <Tooltip {...tooltipStyle} />
                      <Area type="monotone" dataKey="value" name="Alcance" stroke="#1877f2" strokeWidth={2.5} fill="url(#fbReach)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </AnimatedCard>
            </div>
          </TabsContent>

          {/* ─── Tab: Tendências ──────────────────────────────────────────── */}
          <TabsContent value="tendencias">
            <AnimatedCard className="p-6">
              <h3 className="font-semibold mb-5">Evolução de Crescimento</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={followersData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fbGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1877f2" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#1877f2" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                    <Tooltip {...tooltipStyle} />
                    <Area type="monotone" dataKey="value" name="Seguidores" stroke="#1877f2" strokeWidth={2.5} fill="url(#fbGrowth)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </AnimatedCard>
          </TabsContent>

          {/* ─── Tab: Posts ───────────────────────────────────────────────── */}
          <TabsContent value="posts">
            <AnimatedCard className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Ranking de Posts</h3>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartPosts} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                    <YAxis type="category" dataKey="title" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} width={150} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="reach" name="Alcance" fill="#1877f2" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AnimatedCard>
          </TabsContent>

          {/* ─── Tab: Engajamento ─────────────────────────────────────────── */}
          <TabsContent value="engajamento">
            <AnimatedCard className="p-6">
              <h3 className="font-semibold mb-5">Engajamento por Post</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartPosts} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} interval={0} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                    <Tooltip {...tooltipStyle} />
                    <Bar dataKey="engagement" name="Engajamento" fill="#1877f2" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AnimatedCard>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
