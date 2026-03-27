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

export default function Home() {
  const { user } = useAuth();
  const avatarUrl = user?.user_metadata?.avatar_url;
  const instagramMetrics = [
    { label: "Seguidores", value: "5.395", icon: Heart, trend: "+12%", href: "/instagram" },
    { label: "Taxa de Engajamento", value: "4,19%", icon: TrendingUp, trend: "+0.8%" },
    { label: "Alcance Médio", value: "2.482", icon: BarChart3, trend: "+24%" },
    { label: "Posts Totais", value: "838", icon: Share2, trend: "+5" },
  ];

  const platformSummary = [
    { label: "Instagram", subLabel: "Seguidores", value: "5.395", icon: Instagram, color: "text-pink-500 bg-pink-50", href: "/instagram", trend: "+12%" },
    { label: "Facebook", subLabel: "Seguidores", value: "17 mil", icon: Facebook, color: "text-blue-500 bg-blue-50", href: "/facebook", trend: "+4,2%" },
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
    <div className="min-h-screen bg-transparent selection:bg-amber-500/20 font-['Outfit']">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-50 pointer-events-none -z-10 blur-3xl" />

      {/* Profile Card */}
      <section className="container pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full rounded-[2.5rem] overflow-hidden bg-white/[0.04] backdrop-blur-[40px] border border-white/[0.08] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col"
        >
          <div className="relative px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-[1.5rem] border border-white/10 bg-white/5 backdrop-blur-md shadow-xl flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 cursor-pointer group/avatar relative">
                <div className="absolute inset-0 bg-amber-500/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity blur-xl z-0" />
                <img
                  src="/logo.png"
                  alt="Logotipo"
                  loading="lazy"
                  className="w-full h-full object-contain p-2 group-hover/avatar:scale-110 transition-transform duration-500 relative z-10 brightness-110"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-4xl text-primary font-bold">C</span>';
                  }}
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Conventinho</h1>
                <p className="text-base font-medium text-muted-foreground mt-0.5">@amigosdocoracao_conventinho</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <Link href="/settings">
                  <button className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors" title="Configurações">
                    <Settings className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/profile">
                  <button className="w-8 h-8 rounded-full overflow-hidden border border-border hover:border-primary transition-all flex items-center justify-center bg-muted" title="Meu Perfil">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </Link>
              </div>
              <div className="flex gap-3">
                <Link href="/reports">
                  <Button className="rounded-xl px-6 bg-amber-500 hover:bg-amber-600 text-[#050505] font-black h-12 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver Dados
                  </Button>
                </Link>
                <Link href="/comparison">
                  <Button variant="outline" className="rounded-xl px-5 h-12 border-white/20 text-white hover:bg-white/10 font-bold bg-white/5">
                    Comparar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Platform Quick Links */}
      <section className="container pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {platformSummary.map((p, i) => (
            <Link key={p.label} href={p.href}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.04] backdrop-blur-[30px] p-5 flex items-center justify-between shadow-xl hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] hover:bg-white/[0.06] hover:-translate-y-1 cursor-pointer transition-all duration-300"
              >
                {/* Subtle background glow */}
                <div className={cn(
                  "absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full",
                  p.label === "Instagram" ? "bg-pink-500" : p.label === "Facebook" ? "bg-blue-500" : "bg-red-500"
                )} />

                <div className="flex items-center gap-4 relative z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-[1rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm border border-white/10 relative z-10",
                    p.label === "Instagram" ? "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white" :
                    p.label === "Facebook" ? "bg-gradient-to-br from-[#1877f2] to-[#0a52b3] text-white" :
                    "bg-gradient-to-br from-[#ff0000] to-[#b30000] text-white"
                  )}>
                    <p.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xl tracking-tight mb-0.5 text-white">{p.value}</p>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{p.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full relative z-10">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {p.trend}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hero */}
      <section className="container py-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <SparklesIcon className="w-4 h-4" />
            <span>Novo Relatório Disponível</span>
          </motion.div>

          <motion.h2 variants={slideUp} className="text-4xl md:text-6xl font-black tracking-tighter mb-8 text-white">
            Evolução de <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Performance</span> <br className="hidden md:block" />Digital Integrada
          </motion.h2>

          <motion.p variants={slideUp} className="text-lg text-white/50 mb-8 max-w-2xl leading-relaxed font-medium">
            Sincronize <strong className="text-white">Instagram, Facebook e YouTube</strong> com Inteligência Artificial, detectando padrões virais e anomalias 24/7.
          </motion.p>

          <motion.div variants={slideUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/comparison">
              <Button size="lg" className="rounded-xl px-8 h-12 text-base shadow-[0_0_20px_rgba(245,158,11,0.2)] bg-amber-500 hover:bg-amber-600 text-[#050505] font-black uppercase tracking-widest">
                Visão Global
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/insights">
              <Button size="lg" variant="outline" className="rounded-xl px-8 h-12 text-base border-white/20 text-white font-bold bg-white/[0.04] hover:bg-white/[0.08] uppercase tracking-widest">
                Utxica IA
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Instagram Metrics Bento Grid */}
      <section className="container py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shadow-[0_0_15px_rgba(225,48,108,0.3)]">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Métricas do Instagram</h2>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {instagramMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            const cardContent = (
              <AnimatedCard delay={idx * 0.1} className={`p-6 ${metric.href ? "hover:border-amber-500/50 cursor-pointer" : ""}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <Icon className="w-5 h-5 text-white/70" />
                  </div>
                  <span className="flex items-center text-[10px] font-black tracking-wider uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    {metric.trend}
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tighter text-white mb-1 drop-shadow-md">{metric.value}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{metric.label}</p>
                </div>
              </AnimatedCard>
            );
            if (metric.href) return <Link key={idx} href={metric.href}>{cardContent}</Link>;
            return <div key={idx}>{cardContent}</div>;
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
          <div className="absolute inset-0 bg-amber-500/5 blur-[100px] rounded-[3rem] -z-10" />
          <div className="rounded-[2.5rem] border border-white/[0.08] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] bg-white/[0.04] backdrop-blur-[30px] overflow-hidden">
            <div className="h-12 border-b border-white/[0.08] bg-white/[0.02] flex items-center px-4 gap-2">
              <div className="flex gap-1.5 ml-2">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-inner" />
              </div>
              <div className="mx-auto flex items-center text-[10px] uppercase tracking-widest font-black text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                <BarChart className="w-3 h-3 mr-1.5 text-amber-500" />
                Performance Engine
              </div>
            </div>
            <div className="p-2 md:p-8 bg-transparent">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663439065181/9gdiPYzXKpmkHD9boSKSRi/chart1_performance_cc4535d6.png"
                alt="Análise de Desempenho"
                className="w-full h-auto rounded-xl filter invert hue-rotate-180 opacity-80 mix-blend-screen"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Strategies */}
      <section className="bg-muted/30 py-20 border-y border-border/40">
        <div className="container">
          <div className="max-w-xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Estratégias de Crescimento</h2>
            <p className="text-lg text-muted-foreground">
              Ações táticas recomendadas para maximizar o alcance das publicações.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {strategies.map((strategy, idx) => (
              <AnimatedCard key={idx} delay={idx * 0.15} className="p-8 group">
                <div className="text-4xl font-bold text-primary/10 mb-6 group-hover:text-primary/20 transition-colors">
                  {strategy.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{strategy.title}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">{strategy.description}</p>
                <div className="pt-4 border-t border-border/50">
                  <span className="inline-flex items-center text-sm font-medium text-primary bg-primary/5 px-2.5 py-1 rounded-md">
                    <Target className="w-4 h-4 mr-1.5" />
                    {strategy.highlight}
                  </span>
                </div>
              </AnimatedCard>
            ))}
          </div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Pronto para Escalar?</h2>
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
                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base border-gray-700 text-white hover:bg-gray-800">
                  Baixar Relatório
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-transparent py-10 mt-10">
        <div className="container text-center text-white/40 text-[10px] uppercase tracking-widest font-black flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <p>© 2026 Utxica · Conventinho SCJ. Todos os direitos reservados.</p>
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
