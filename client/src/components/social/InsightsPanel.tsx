import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertCircle, Instagram, Facebook, Youtube } from "lucide-react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { staggerContainer, slideUp } from "@/lib/animations";

const insights = [
  {
    platform: "Instagram",
    icon: Instagram,
    color: "text-pink-500 bg-pink-50",
    title: "Instagram cresceu 12% esta semana",
    desc: "A publicação de Reels resultou em 685% mais alcance que posts estáticos.",
    type: "positive",
  },
  {
    platform: "Facebook",
    icon: Facebook,
    color: "text-blue-500 bg-blue-50",
    title: "Facebook teve queda no alcance orgânico",
    desc: "Queda de 8% no alcance orgânico. Recomenda-se impulsionar publicações estratégicas.",
    type: "negative",
  },
  {
    platform: "YouTube",
    icon: Youtube,
    color: "text-red-500 bg-red-50",
    title: "YouTube com crescimento em visualizações",
    desc: "Aumento de 22% nas visualizações em relação ao mês anterior.",
    type: "positive",
  },
  {
    platform: "Geral",
    icon: TrendingUp,
    color: "text-primary bg-primary/10",
    title: "Engajamento geral aumentou 18%",
    desc: "Todas as plataformas combinadas mostram crescimento consistente de audiência.",
    type: "positive",
  },
];

export function InsightsPanel() {
  return (
    <AnimatedCard className="p-6">
      <div className="flex items-center gap-2 mb-5">
        <AlertCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Insights Automáticos</h3>
      </div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {insights.map((insight, idx) => (
          <motion.div
            key={idx}
            variants={slideUp}
            className="flex items-start gap-3 p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${insight.color}`}>
              <insight.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold truncate">{insight.title}</p>
                {insight.type === "positive" ? (
                  <TrendingUp className="w-3.5 h-3.5 text-green-500 shrink-0" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-red-500 shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{insight.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </AnimatedCard>
  );
}
