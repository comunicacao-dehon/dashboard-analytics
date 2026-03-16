import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, TrendingDown, Instagram, Facebook, Youtube, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { staggerContainer, slideUp } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";

const insightGroups = [
  {
    category: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-100",
    insights: [
      { type: "positive", title: "Crescimento semanal de 12%", desc: "Reels com conteúdo vocacional estão gerando alto alcance orgânico. Continue priorizando o formato." },
      { type: "positive", title: "Taxa de engajamento acima da média", desc: "4,19% supera a média do nicho religioso (2.8%). Boa relação com a audiência." },
      { type: "warning", title: "Baixa conversão em seguidores", desc: "Alto alcance mas apenas 3 novos seguidores no período. Adicione CTAs claros nos Reels." },
    ],
  },
  {
    category: "Facebook",
    icon: Facebook,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
    insights: [
      { type: "positive", title: "Marca de 17 mil seguidores atingida", desc: "A página do Facebook continua crescendo organicamente com base sólida de seguidores." },
      { type: "positive", title: "Crescimento de 52% em visualizações", desc: "As 37.074 visualizações no período mostram um aumento massivo no alcance do conteúdo." },
      { type: "positive", title: "Engajamento cresceu 7%", desc: "Com 1.079 interações, a taxa de engajamento mantém tendência de alta positiva." },
    ],
  },
  {
    category: "YouTube",
    icon: Youtube,
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-100",
    insights: [
      { type: "positive", title: "Crescimento de 22% em visualizações", desc: "Transmissões ao vivo são o principal driver de crescimento no canal." },
      { type: "positive", title: "Retenção de 64% é excelente", desc: "Acima de 60% é considerado ótimo pelo YouTube. O conteúdo mantém a atenção do público." },
      { type: "warning", title: "Apenas 1-2 vídeos por semana", desc: "Canais que publicam 3+ vídeos por semana crescem 40% mais rápido em média." },
    ],
  },
];

const recommendations = [
  { icon: Zap, title: "Prioridade #1: Aumentar publicação no YouTube", desc: "Subir de 1-2 para 3 vídeos/semana pode dobrar o crescimento de inscritos em 60 dias." },
  { icon: CheckCircle2, title: "Prioridade #2: CTAs no Instagram", desc: "Adicionar 'Salve e compartilhe' ao final de cada Reel pode aumentar a conversão em 40%." },
  { icon: AlertTriangle, title: "Prioridade #3: Investimento no Facebook Ads", desc: "Com R$ 100/mês em impulsionamentos, o alcance do Facebook pode crescer 3x." },
];

const typeConfig = {
  positive: { icon: TrendingUp, color: "text-green-600 bg-green-50" },
  negative: { icon: TrendingDown, color: "text-red-500 bg-red-50" },
  warning: { icon: AlertTriangle, color: "text-amber-500 bg-amber-50" },
};

export default function Insights() {
  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="absolute top-0 inset-x-0 h-[250px] bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent pointer-events-none -z-10" />

      <main className="container py-10 max-w-6xl">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4 mb-10"
        >
          <motion.div variants={slideUp} className="w-12 h-12 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
          </motion.div>
          <div>
            <motion.h1 variants={slideUp} className="text-3xl font-bold tracking-tight">Insights Automáticos</motion.h1>
            <motion.p variants={slideUp} className="text-muted-foreground">Análises e recomendações geradas automaticamente com base nos seus dados</motion.p>
          </div>
        </motion.div>

        {/* Platform Insights */}
        <div className="space-y-8 mb-10">
          {insightGroups.map((group, gi) => (
            <AnimatedCard key={group.category} delay={gi * 0.1} className="p-6">
              <div className={`flex items-center gap-3 mb-5 pb-4 border-b border-border/50`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${group.bgColor}`}>
                  <group.icon className={`w-5 h-5 ${group.color}`} />
                </div>
                <h3 className="text-lg font-semibold">{group.category}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {group.insights.map((insight, ii) => {
                  const config = typeConfig[insight.type as keyof typeof typeConfig];
                  return (
                    <motion.div
                      key={ii}
                      variants={slideUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: gi * 0.1 + ii * 0.05 }}
                      className="p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-3 ${config.color}`}>
                        <config.icon className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-sm font-semibold mb-1.5">{insight.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{insight.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Actionable Recommendations */}
        <AnimatedCard delay={0.3} className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Recomendações de Ação</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="p-4 rounded-xl border border-primary/10 bg-primary/5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <rec.icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-semibold mb-1.5">{rec.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{rec.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </main>
    </div>
  );
}
