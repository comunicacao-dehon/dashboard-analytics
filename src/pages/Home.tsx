import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Target, Share2, Heart, ArrowRight, Activity, ArrowUpRight, BarChart, Instagram, Facebook, Youtube, Settings, User } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { slideUp, staggerContainer } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { SocialGrowthChart } from "@/components/charts/SocialGrowthChart";
import { InsightsPanel } from "@/components/social/InsightsPanel";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useProfile } from "@/hooks/useProfile";
import { useStableUserId } from "@/hooks/useStableUserId";
import { EmptyDashboard } from "@/components/layout/EmptyDashboard";
import { getConnectedAccounts } from "@/services/socialService";
import type { SocialAccount } from "@/types/social";
import { useBranding } from "@/hooks/useBranding";

export default function Home() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const branding = useBranding();
  const stableUserId = useStableUserId();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    async function load() {
      if (!stableUserId) {
        console.log("Dashboard: No user found");
        setLoadingAccounts(false);
        return;
      }
      console.log("Dashboard: Loading accounts for user", stableUserId);
      const result = await getConnectedAccounts(stableUserId);
      console.log("Dashboard: Found accounts:", result.length);
      setAccounts(result);
      setLoadingAccounts(false);
    }
    load();
  }, [stableUserId]);

  // Show loading spinner while checking for accounts
  if (loadingAccounts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  // If no accounts connected yet AND not the demo user, show empty state
  const isConventinho = user?.email?.toLowerCase() === 'comunicacao@conventinho.org.br';
  const hasAccounts = accounts.length > 0;
  const igAccount = accounts.find(a => a.platform === "instagram");
  const fbAccount = accounts.find(a => a.platform === "facebook");

  if (!hasAccounts && !isConventinho) {
    return <EmptyDashboard />;
  }

  // ─── Dashboard ──────────────────────────────────────────────────────────────

  const avatarUrl = user?.user_metadata?.avatar_url;
  const primaryAccount = accounts[0];
  const displayAvatar = primaryAccount?.profilePictureUrl || avatarUrl || "logo.png";
  const displayName = primaryAccount?.displayName || user?.user_metadata?.full_name || "Comunicação";
  const displayUsername = primaryAccount?.username ? `@${primaryAccount.username}` : (user?.email || "");

  // Real Values from screenshots for Conventinho
  const igFollowers = isConventinho ? "5.434" : "5.395";
  const fbFollowers = isConventinho ? "17.662" : "17 mil";

  const instagramMetrics = [
    { label: "Seguidores", value: igFollowers, icon: Heart, trend: isConventinho ? "-65%" : "+12%", href: "/instagram" },
    { label: "Taxa de Engajamento", value: "4,19%", icon: TrendingUp, trend: "+0.8%" },
    { label: "Alcance Médio", value: "2.482", icon: BarChart3, trend: "+24%" },
    { label: "Posts Totais", value: "838", icon: Share2, trend: "+5" },
  ];

  const platformSummary = [
    { label: "Instagram", subLabel: "Seguidores", value: igFollowers, icon: Instagram, color: "text-pink-500 bg-pink-50", href: "/instagram", trend: isConventinho ? "-65,7%" : "+12%" },
    { label: "Facebook", subLabel: "Seguidores", value: fbFollowers, icon: Facebook, color: "text-blue-500 bg-blue-50", href: "/facebook", trend: isConventinho ? "+300%" : "+4,2%" },
    { label: "YouTube", subLabel: "Inscritos", value: "1.820", icon: Youtube, color: "text-red-500 bg-red-50", href: "/youtube", trend: "+10,3%" },
  ];

  const strategies = [
    {
      number: "01",
      title: "Regra do 3 para 1",
      description: "Implementar proporção de 3 Reels para cada 1 Carrossel por semana",
      highlight: "Reels geram 685% mais alcance",
    },
    {
      number: "02",
      title: "Otimização de CTAs",
      description: "Toda legenda deve terminar com uma Chamada para Ação clara",
      highlight: "Aumenta compartilhamentos e salvamentos",
    },
    {
      number: "03",
      title: "Hashtags Estratégicas",
      description: "Utilizar 5 a 8 hashtags altamente segmentadas no final da legenda",
      highlight: "#catolicos #vocacao",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent selection:bg-primary/20 font-['Outfit'] pb-20">
      {/* Dashboard Header - Hidden on mobile, global header takes over */}
      <header className="container pt-8 pb-6 hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Visão Geral</h1>
          <p className="text-sm text-muted-foreground">Bem-vindo de volta, {profile?.fullName || user?.user_metadata?.full_name || "Comunicação"}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <BarChart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Pesquisar métricas..." 
              className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-100 dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <Link href="/profile">
            <button className="w-10 h-10 rounded-full border border-border overflow-hidden hover:border-primary transition-all">
              <img src={profile?.avatarUrl || displayAvatar} alt="Profile" className="w-full h-full object-cover" />
            </button>
          </Link>
        </div>
      </header>

      {/* Mobile Title - Simple and elegant when global header is visible */}
      <div className="md:hidden px-6 pt-6 pb-2">
         <h2 className="text-2xl font-black tracking-tighter text-foreground">Visão Geral</h2>
         <p className="text-xs text-muted-foreground font-medium">Benvindo, {profile?.fullName?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || "Comunicação"}</p>
      </div>

      {/* Connected Accounts Cards - Compact */}
      {hasAccounts && (
        <section className="container px-4 md:px-6 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {accounts.map((acc, i) => (
              <motion.div
                key={acc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => window.location.href = `/${acc.platform === 'youtube' ? 'youtube' : acc.platform === 'facebook' ? 'facebook' : 'instagram'}`}
                className={cn(
                  "cursor-pointer bg-white dark:bg-slate-900 border border-border/40 rounded-2xl p-2.5 flex items-center gap-2.5 group shadow-sm hover:shadow-md transition-all duration-300",
                  acc.platform === "instagram" && "hover:border-pink-500/30",
                  acc.platform === "facebook" && "hover:border-blue-500/30",
                  acc.platform === "youtube" && "hover:border-red-500/30"
                )}
              >
                <div className="relative shrink-0">
                  {acc.profilePictureUrl ? (
                    <img
                      src={acc.profilePictureUrl}
                      alt={acc.displayName}
                      className="w-7 h-7 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-white",
                      acc.platform === "instagram" && "bg-pink-500",
                      acc.platform === "facebook" && "bg-blue-600",
                      acc.platform === "youtube" && "bg-red-600",
                    )}>
                      {acc.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -right-0.5 -bottom-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-foreground truncate">{acc.displayName}</p>
                  <p className="text-[8px] text-muted-foreground truncate uppercase tracking-tighter font-black">{acc.platform}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Platform Quick Links */}
      <section className="container px-4 md:px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {platformSummary.map((p, i) => (
            <Link key={p.label} href={p.href}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 md:p-5 flex items-center justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer transition-all duration-300"
              >
                {/* Subtle background glow */}
                <div className={cn(
                  "absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full",
                  p.label === "Instagram" ? "bg-pink-500" : p.label === "Facebook" ? "bg-blue-500" : "bg-red-500"
                )} />

                <div className="flex items-center gap-3 md:gap-4 relative z-10">
                  <div className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-md border border-white/20 relative z-10",
                    p.label === "Instagram" ? "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white" :
                    p.label === "Facebook" ? "bg-gradient-to-br from-[#1877f2] to-[#0a52b3] text-white" :
                    "bg-gradient-to-br from-[#ff0000] to-[#b30000] text-white"
                  )}>
                    <p.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="font-extrabold text-lg md:text-xl tracking-tight mb-0.5 text-foreground">{p.value}</p>
                    <p className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">{p.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 md:px-3 rounded-full relative z-10">
                  <ArrowUpRight className="w-3 md:w-3.5 h-3 md:h-3.5" />
                  {p.trend}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>



      {/* Metrics Section */}
      <section className="container py-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Métricas de Instagram</h2>
          <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">Ver Histórico</span>
        </div>
        
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {instagramMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={idx}
                variants={slideUp}
                className="bg-white dark:bg-slate-900 p-5 rounded-[1.5rem] border border-border/40 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
                    <ArrowUpRight className="w-3 h-3" />
                    {metric.trend}
                  </div>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground">{metric.value}</h3>
                <p className="text-[11px] font-semibold text-muted-foreground mt-1">{metric.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Growth Chart + Insights Row */}
      <section className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SocialGrowthChart />
          </div>
          <div>
            <InsightsPanel />
          </div>
        </div>
      </section>

      {/* MacOS Window Performance Chart */}
      <section className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-[3rem] -z-10" />
          <div className="rounded-[2.5rem] border border-border shadow-xl overflow-hidden">
            <div className="h-12 border-b border-border bg-muted flex items-center px-4 gap-2">
              <div className="flex gap-1.5 ml-2">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-inner" />
              </div>
              <div className="mx-auto flex items-center text-[10px] uppercase tracking-widest font-black text-foreground/60 bg-muted border border-border px-3 py-1 rounded-full">
                <BarChart className="w-3 h-3 mr-1.5 text-primary" />
                Performance Engine
              </div>
            </div>
            <div className="p-2 md:p-8 bg-transparent">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663439065181/9gdiPYzXKpmkHD9boSKSRi/chart1_performance_cc4535d6.png"
                alt="Análise de Desempenho"
                className="w-full h-auto rounded-xl dark:invert dark:hue-rotate-180 opacity-80 dark:mix-blend-screen transition-all duration-500"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Strategy Section Slim */}
      <section className="container py-12">
        <div className="max-w-2xl mb-8 px-2">
          <h2 className="text-xl font-bold mb-2 text-foreground">Estratégias Ativas</h2>
          <p className="text-sm text-muted-foreground">Recomendações táticas para aumentar seu engajamento.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {strategies.map((s, idx) => (
            <div key={idx} className="p-6 rounded-[2rem] border border-border/50 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-sm group">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mb-4 group-hover:scale-110 transition-transform">
                {s.number}
              </div>
              <h3 className="font-bold mb-2 text-foreground">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gray-900 border border-gray-800"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
          <div className="relative z-10 p-12 md:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Pronto para Escalar?</h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Implemente nossas estratégias e acompanhe o crescimento exponencial em todas as redes sociais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/insights">
                <Button size="lg" className="rounded-full px-8 h-12 text-base bg-white text-gray-900 hover:bg-gray-100">
                  Ver Insights
                </Button>
              </Link>
              <Link href="/reports">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-gray-700 text-foreground hover:bg-gray-800">
                  Baixar Relatório
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-transparent py-10 mt-10">
        <div className="container text-center text-white/40 text-[10px] uppercase tracking-widest font-black flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-muted border border-border flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <p>{branding.footerText} · <span className="opacity-50 text-foreground/30">v1.1.0-Fixed</span></p>
        </div>
      </footer>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
