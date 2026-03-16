import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Target, Share2, Heart, ArrowRight, Activity, ArrowUpRight, BarChart, Instagram, Facebook, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { slideUp, staggerContainer } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { SocialGrowthChart } from "@/components/charts/SocialGrowthChart";
import { InsightsPanel } from "@/components/social/InsightsPanel";
import { cn } from "@/lib/utils";

export default function Home() {
  const instagramMetrics = [
    { label: "Seguidores", value: "5.377", icon: Heart, trend: "+12%", href: "/instagram" },
    { label: "Taxa de Engajamento", value: "4,19%", icon: TrendingUp, trend: "+0.8%" },
    { label: "Alcance Médio", value: "2.482", icon: BarChart3, trend: "+24%" },
    { label: "Posts Totais", value: "838", icon: Share2, trend: "+5" },
  ];

  const platformSummary = [
    { label: "Instagram", subLabel: "Seguidores", value: "5.377", icon: Instagram, color: "text-pink-500 bg-pink-50", href: "/instagram", trend: "+12%" },
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
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none -z-10" />

      {/* Profile Card */}
      <section className="container pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full rounded-3xl overflow-hidden glass border border-background/20 shadow-2xl flex flex-col bg-card"
        >
          <div className="relative px-6 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full border-4 border-primary/20 bg-white shadow-xl flex items-center justify-center overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 cursor-pointer group/avatar">
                <img
                  src="/logo.png"
                  alt="Logotipo"
                  loading="lazy"
                  className="w-full h-full object-contain p-2 group-hover/avatar:scale-110 transition-transform duration-500"
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
            <div className="flex gap-3 shrink-0">
              <Link href="/reports">
                <Button className="rounded-full px-6 shadow-md">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Dados
                </Button>
              </Link>
              <Link href="/comparison">
                <Button variant="outline" className="rounded-full px-5">
                  Comparar
                </Button>
              </Link>
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
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-5 flex items-center justify-between shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer transition-all duration-300"
              >
                {/* Subtle background glow */}
                <div className={cn(
                  "absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full",
                  p.label === "Instagram" ? "bg-pink-500" : p.label === "Facebook" ? "bg-blue-500" : "bg-red-500"
                )} />

                <div className="flex items-center gap-4 relative z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm",
                    p.label === "Instagram" ? "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white" :
                    p.label === "Facebook" ? "bg-gradient-to-br from-[#1877f2] to-[#0a52b3] text-white" :
                    "bg-gradient-to-br from-[#ff0000] to-[#b30000] text-white"
                  )}>
                    <p.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xl tracking-tight mb-0.5">{p.value}</p>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest opacity-80">{p.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full relative z-10">
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
          <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <SparklesIcon className="w-4 h-4" />
            <span>Novo Relatório Disponível - Março 2026</span>
          </motion.div>

          <motion.h2 variants={slideUp} className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            Análise de <span className="text-gradient-primary">Crescimento</span> <br className="hidden md:block" />para Social Media
          </motion.h2>

          <motion.p variants={slideUp} className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
            Acompanhe <strong className="text-foreground">Instagram, Facebook e YouTube</strong> em um único painel analítico premium. Insights automáticos e relatórios profissionais.
          </motion.p>

          <motion.div variants={slideUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/comparison">
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
                Ver Comparação
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/insights">
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base bg-white/50 hover:bg-white/80">
                Explorar Insights
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Instagram Metrics Bento Grid */}
      <section className="container py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center">
            <Instagram className="w-4 h-4 text-pink-500" />
          </div>
          <h2 className="text-xl font-bold">Métricas do Instagram</h2>
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
              <AnimatedCard delay={idx * 0.1} className={`p-6 ${metric.href ? "hover:border-primary/50 cursor-pointer" : ""}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    {metric.trend}
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold tracking-tight mb-1">{metric.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
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
          <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-[3rem] -z-10" />
          <div className="rounded-2xl border border-white/20 shadow-2xl bg-white/50 backdrop-blur-xl overflow-hidden glass">
            <div className="h-12 border-b border-border/50 bg-white/40 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto flex items-center text-xs font-medium text-muted-foreground bg-white/50 px-3 py-1 rounded-md">
                <BarChart className="w-3 h-3 mr-1.5" />
                Visão Geral de Desempenho
              </div>
            </div>
            <div className="p-2 md:p-8 bg-[#FAFAFA]">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663439065181/9gdiPYzXKpmkHD9boSKSRi/chart1_performance_cc4535d6.png"
                alt="Análise de Desempenho"
                className="w-full h-auto rounded-lg shadow-sm border border-border/50"
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
      <footer className="border-t border-border/40 bg-background py-10">
        <div className="container text-center text-muted-foreground text-sm flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <p>© 2026 Painel Analítico · Conventinho. Todos os direitos reservados.</p>
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
