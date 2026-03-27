import { motion } from "framer-motion";
import { BarChart2, Instagram, Facebook, Youtube } from "lucide-react";
import { staggerContainer, slideUp } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { EngagementComparisonChart } from "@/components/charts/EngagementComparisonChart";
import { SocialGrowthChart } from "@/components/charts/SocialGrowthChart";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const engagementRateData = [
  { subject: "Engajamento", instagram: 4.19, facebook: 7.0, youtube: 5.1 },
  { subject: "Alcance", instagram: 6.8, facebook: 5.2, youtube: 8.3 },
  { subject: "Crescimento", instagram: 3.5, facebook: 52.0, youtube: 6.2 },
  { subject: "Retenção", instagram: 7.2, facebook: 6.1, youtube: 6.4 },
  { subject: "Consistência", instagram: 8.0, facebook: 6.5, youtube: 5.8 },
];

const weeklyFrequencyData = [
  { week: "Sem 1", instagram: 4, facebook: 3, youtube: 1 },
  { week: "Sem 2", instagram: 5, facebook: 4, youtube: 2 },
  { week: "Sem 3", instagram: 3, facebook: 2, youtube: 1 },
  { week: "Sem 4", instagram: 6, facebook: 5, youtube: 2 },
];

const tooltipStyle = {
  contentStyle: {
    borderRadius: "12px",
    border: "1px solid var(--color-border)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    fontSize: "12px",
  },
};

const platformStats = [
  { name: "Instagram", icon: Instagram, color: "text-pink-500 bg-pink-50", seguidores: "5.395", engajamento: "4,19%", alcance: "24.679", melhorPost: "Reels" },
  { name: "Facebook", icon: Facebook, color: "text-blue-500 bg-blue-50", seguidores: "17 mil", engajamento: "1.079", alcance: "37.074", melhorPost: "Vídeo" },
  { name: "YouTube", icon: Youtube, color: "text-red-500 bg-red-50", seguidores: "1.820", engajamento: "5,10%", alcance: "36.800", melhorPost: "Ao Vivo" },
];
import { useAuth } from "@/contexts/AuthContext";
import { EmptyPlatformState } from "@/components/layout/EmptyPlatformState";

export default function Comparison() {
  const { user } = useAuth();
  const isConventinho = user?.email?.toLowerCase() === 'comunicacao@conventinho.com';

  if (!isConventinho) {
    return <EmptyPlatformState platform="Comparação de Plataformas" icon={<BarChart2 className="w-8 h-8 text-amber-500" />} description="Vincule pelo menos duas redes sociais para comparar o desempenho entre as plataformas." />;
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="absolute top-0 inset-x-0 h-[250px] bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none -z-10" />

      <main className="container py-10 max-w-7xl">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4 mb-10"
        >
          <motion.div variants={slideUp} className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <motion.h1 variants={slideUp} className="text-3xl font-bold tracking-tight">Comparação de Plataformas</motion.h1>
            <motion.p variants={slideUp} className="text-muted-foreground">Desempenho consolidado entre Instagram, Facebook e YouTube</motion.p>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {platformStats.map((p, i) => (
            <AnimatedCard key={p.name} delay={i * 0.1} className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.color}`}>
                  <p.icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">{p.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Seguidores</p>
                  <p className="font-bold">{p.seguidores}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Engajamento</p>
                  <p className="font-bold">{p.engajamento}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Alcance</p>
                  <p className="font-bold">{p.alcance}</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Melhor Formato</p>
                  <p className="font-bold">{p.melhorPost}</p>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SocialGrowthChart />
          <EngagementComparisonChart />
        </div>

        {/* Radar + Frequency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatedCard className="p-6">
            <h3 className="font-semibold mb-1">Análise de Desempenho (Radar)</h3>
            <p className="text-sm text-muted-foreground mb-5">Comparação multidimensional por plataforma</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={engagementRateData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                  <Tooltip {...tooltipStyle} />
                  <Legend iconSize={8} formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} />
                  <Radar name="Instagram" dataKey="instagram" stroke="#e1306c" fill="#e1306c" fillOpacity={0.15} />
                  <Radar name="Facebook" dataKey="facebook" stroke="#1877f2" fill="#1877f2" fillOpacity={0.15} />
                  <Radar name="YouTube" dataKey="youtube" stroke="#ff4444" fill="#ff4444" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>

          <AnimatedCard className="p-6" delay={0.1}>
            <h3 className="font-semibold mb-1">Frequência de Publicação</h3>
            <p className="text-sm text-muted-foreground mb-5">Posts/vídeos por semana por plataforma</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyFrequencyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
                  <Tooltip {...tooltipStyle} />
                  <Legend iconSize={8} formatter={(v) => <span className="text-xs text-muted-foreground capitalize">{v}</span>} />
                  <Bar dataKey="instagram" name="Instagram" fill="#e1306c" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="facebook" name="Facebook" fill="#1877f2" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="youtube" name="YouTube" fill="#ff4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AnimatedCard>
        </div>
      </main>
    </div>
  );
}
