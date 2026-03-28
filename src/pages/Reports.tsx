import { Button } from "@/components/ui/button";
import { RefreshCcw, FileText, Download, Activity, Target, Share2, MessageSquare, Heart, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { ReportMetricCard } from "@/components/reports/ReportMetricCard";
import { PostCard } from "@/components/reports/PostCard";
import { EngagementChart } from "@/components/reports/EngagementChart";
import { PerformanceAnalysis } from "@/components/reports/PerformanceAnalysis";
import { useState, useEffect } from "react";
import { getConnectedAccounts } from "@/services/socialService";
import type { SocialAccount } from "@/types/social";
import { useAuth } from "@/contexts/AuthContext";
import { EmptyPlatformState } from "@/components/layout/EmptyPlatformState";

export default function Reports() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoadingAccounts(false);
        return;
      }
      const result = await getConnectedAccounts(user.id);
      setAccounts(result);
      setLoadingAccounts(false);
    }
    load();
  }, [user]);

  if (loadingAccounts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="w-8 h-8 text-amber-500 animate-pulse" />
      </div>
    );
  }

  const isConventinho = user?.email?.toLowerCase() === 'comunicacao@conventinho.org.br';
  const hasAccounts = accounts.length > 0;

  if (!isConventinho && !hasAccounts) {
    return <EmptyPlatformState platform="Relatórios" icon={<FileText className="w-8 h-8 text-amber-500" />} description="Vincule suas redes sociais para gerar relatórios consolidados com análise de IA." />;
  }

  const topPosts = [
    { previewText: "Votos Perpétuos - Um chamado para a eternidade", reach: "9,974", interactions: "996", followersGained: "2", rank: 1 },
    { previewText: "Testemunho: Como descobri minha vocação", reach: "3,210", interactions: "412", followersGained: "1", rank: 2 },
    { previewText: "Rotina no convento - Ora et Labora", reach: "2,850", interactions: "315", followersGained: "0", rank: 3 },
  ];

  const worstPosts = [
    { previewText: "Aviso: Horário de missa alterado neste domingo", reach: "312", interactions: "15", followersGained: "0", rank: 1, isTop: false },
    { previewText: "Foto da fachada em reforma", reach: "420", interactions: "22", followersGained: "0", rank: 2, isTop: false },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 pb-24">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

      <main className="container pt-12">
        {/* Report Header */}
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="mb-12 border-b border-border/40 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <FileText className="w-4 h-4" />
              <span>Relatório Consolidado</span>
            </motion.div>
            <motion.h1 variants={slideUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              Visão Geral do Relatório
            </motion.h1>
            <motion.p variants={slideUp} className="text-lg text-muted-foreground">
              Período: 01/12/2025 – 28/02/2026
            </motion.p>
          </div>
          <motion.div variants={fadeIn} className="flex gap-3">
            <Button variant="outline" className="rounded-full shadow-sm bg-white/50">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Atualizar Dados
            </Button>
            <Button className="rounded-full shadow-md">
              <Download className="w-4 h-4 mr-2" />
              Exportar PDF
            </Button>
          </motion.div>
        </motion.div>

        {/* Summary Metrics Grid */}
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12"
        >
          <ReportMetricCard label="Total de Posts" value="18" icon={Share2} trend="+2" delay={0.1} />
          <ReportMetricCard label="Total de Curtidas" value="2,060" icon={Heart} trend="+14%" delay={0.2} />
          <ReportMetricCard label="Total de Comentários" value="131" icon={MessageSquare} trend="+5%" delay={0.3} />
          <ReportMetricCard label="Engajamento Total" value="1,593" icon={TrendingUp} trend="+22%" delay={0.4} />
          <ReportMetricCard label="Engajamento Médio / Post" value="41.50" icon={Activity} trend="6.45%" delay={0.5} />
        </motion.div>

        {/* Funnel & Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Follower Funnel */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Funil de Conversão
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <ReportMetricCard label="Visualizações" value="301,060" icon={Users} trend="+24.76%" delay={0.1} />
              <ReportMetricCard label="Alcance" value="24,679" icon={TrendingUp} trend="+209.11%" delay={0.2} />
              <ReportMetricCard label="Pessoas Engajadas" value="1,593" icon={Heart} trend="+234.66%" delay={0.3} />
              <ReportMetricCard label="Novos Seguidores" value="3" icon={Target} trend="+300%" delay={0.4} />
            </div>
          </div>
          
          {/* Chart Section */}
          <div className="lg:col-span-2 flex flex-col h-full gap-4">
            <EngagementChart />
            
            {/* Engagement Analysis (AI) */}
            <AnimatedCard delay={0.5} className="p-6 md:p-8 flex-1 glass-dark mt-2 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-xl shrink-0">
                  <Activity className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Análise de Engajamento (IA)</h3>
                  <p className="text-gray-300 leading-relaxed">
                    O alcance cresceu exponencialmente (+209%) impulsionado principalmente pelo formato de Reels, que gerou 685% mais alcance do que imagens estáticas. Apesar do forte alcance orgânico e alto engajamento bruto, a taxa de conversão em novos seguidores permanece baixa (apenas 3 novos seguidores no período analisado). Recomenda-se a inclusão de CTAs claros ("Siga para mais") nos vídeos de maior alcance.
                  </p>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Posts Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 5 Posts */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Top Posts com Melhor Desempenho
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {topPosts.map((post, idx) => (
                <PostCard key={idx} {...post} delay={idx * 0.15} />
              ))}
            </div>
          </section>

          {/* Worst 5 Posts */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2 text-muted-foreground">
                Posts com Menor Desempenho
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {worstPosts.map((post, idx) => (
                <PostCard key={idx} {...post} delay={idx * 0.15} />
              ))}
            </div>
          </section>
        </div>

        {/* Performance Analysis — 4 Charts */}
        <div className="mt-16 border-t border-border/40 pt-12">
          <PerformanceAnalysis />
        </div>
      </main>
    </div>
  );
}
