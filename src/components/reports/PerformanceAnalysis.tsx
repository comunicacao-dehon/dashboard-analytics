import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Heart, Repeat2, Bookmark, MessageCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell,
  PieChart, Pie, ScatterChart, Scatter, ZAxis, LabelList,
} from "recharts";
import { AnimatedCard } from "@/components/AnimatedCard";
import { staggerContainer, slideUp } from "@/lib/animations";

// ─── Data ──────────────────────────────────────────────────────────────────────

const reachByTypeData = [
  { type: "Reel", alcance: 6377, interacoes: 561 },
  { type: "Carrossel", alcance: 974, interacoes: 123 },
  { type: "Imagem", alcance: 690, interacoes: 49 },
];

const engagementByPostData = [
  { post: "Votos Perpétuos", taxa: 17.52, tipo: "Reel" },
  { post: "Ordenação Diaconal", taxa: 10.27, tipo: "Reel" },
  { post: "30 Anos Vida Religiosa", taxa: 4.26, tipo: "Carrossel" },
  { post: "Convite Diácono Ti.", taxa: 2.33, tipo: "Reel" },
  { post: "Aniversário Fr. Ar.", taxa: 1.56, tipo: "Imagem" },
  { post: "Missa Amigos do Co.", taxa: 1.53, tipo: "Carrossel" },
  { post: "Aniversário Fr. Jo.", taxa: 1.19, tipo: "Imagem" },
  { post: "Nascimento Pe. Deh.", taxa: 1.12, tipo: "Imagem" },
  { post: "Convite Missa", taxa: 0.67, tipo: "Imagem" },
  { post: "Dia Internacional", taxa: 0.24, tipo: "Imagem" },
].reverse(); // horizontal bar chart looks better bottom-to-top

const interactionDistribution = [
  { name: "Curtidas", value: 88.4, color: "#e1306c" },
  { name: "Compartilhamentos", value: 5.9, color: "#f97316" },
  { name: "Comentários", value: 4.7, color: "#3b82f6" },
  { name: "Salvamentos", value: 0.9, color: "#a855f7" },
];

const scatterData = [
  { post: "Votos Perpétuos", alcance: 9974, interacoes: 996, visualizacoes: 12400, tipo: "Reel" },
  { post: "Ordenação Diaconal", alcance: 8200, interacoes: 560, visualizacoes: 9800, tipo: "Reel" },
  { post: "30 Anos Vida Relig.", alcance: 5100, interacoes: 262, visualizacoes: 6200, tipo: "Carrossel" },
  { post: "Aniversário Fr. Ar.", alcance: 2800, interacoes: 98, visualizacoes: 3400, tipo: "Imagem" },
  { post: "Missa Amigos do Co.", alcance: 2400, interacoes: 85, visualizacoes: 3100, tipo: "Carrossel" },
  { post: "Convite Diácono Ti.", alcance: 3200, interacoes: 120, visualizacoes: 3900, tipo: "Reel" },
];

// ─── Color mapping ─────────────────────────────────────────────────────────────
const typeColors: Record<string, string> = {
  Reel: "#e1306c",
  Carrossel: "#f97316",
  Imagem: "#3b82f6",
};

// ─── Shared tooltip style ──────────────────────────────────────────────────────
const tooltipStyle = {
  contentStyle: {
    borderRadius: "12px",
    border: "1px solid var(--color-border)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    fontSize: "12px",
    backgroundColor: "white",
  },
};

// ─── Custom Tooltips ───────────────────────────────────────────────────────────
const EngagementTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-xs">
        <p className="font-semibold mb-1">{d.post}</p>
        <p>Taxa: <span className="font-bold">{d.taxa}%</span></p>
        <p>Tipo: <span className="font-bold" style={{ color: typeColors[d.tipo] }}>{d.tipo}</span></p>
      </div>
    );
  }
  return null;
};

const ScatterTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-xs">
        <p className="font-semibold mb-1">{d.post}</p>
        <p>Alcance: <span className="font-bold">{d.alcance.toLocaleString("pt-BR")}</span></p>
        <p>Interações: <span className="font-bold">{d.interacoes.toLocaleString("pt-BR")}</span></p>
        <p>Visualizações: <span className="font-bold">{d.visualizacoes.toLocaleString("pt-BR")}</span></p>
      </div>
    );
  }
  return null;
};

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.03) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

// ─── Summary Stats ─────────────────────────────────────────────────────────────
const summaryStats = [
  { label: "Alcance Médio (Reels)", value: "6.377", icon: TrendingUp, color: "text-pink-500 bg-pink-50" },
  { label: "Taxa de Engajamento", value: "17,52%", icon: BarChart3, color: "text-primary bg-primary/10", sub: "melhor post" },
  { label: "Curtidas (total)", value: "88,4%", icon: Heart, color: "text-red-500 bg-red-50", sub: "das interações" },
  { label: "Posts Analisados", value: "10", icon: Repeat2, color: "text-orange-500 bg-orange-50" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function PerformanceAnalysis() {
  return (
    <div>
      {/* Page Title */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <motion.h2 variants={slideUp} className="text-2xl font-bold tracking-tight mb-1">
          Análise de Desempenho
        </motion.h2>
        <motion.p variants={slideUp} className="text-muted-foreground text-sm">
          @amigosdocoracao_conventinho · 10 posts analisados · dados do período recente
        </motion.p>
      </motion.div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryStats.map((s, i) => (
          <AnimatedCard key={s.label} delay={i * 0.08} className="p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            {s.sub && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{s.sub}</p>}
          </AnimatedCard>
        ))}
      </div>

      {/* Row 1: Alcance por Tipo + Engajamento por Post */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Chart 1 — Alcance e Interações por Tipo de Conteúdo */}
        <AnimatedCard className="p-6" delay={0.1}>
          <h3 className="font-semibold mb-1">Alcance e Interações por Tipo de Conteúdo</h3>
          <p className="text-xs text-muted-foreground mb-5">Média por formato de publicação</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reachByTypeData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip {...tooltipStyle} />
                <Legend
                  iconType="circle" iconSize={8}
                  formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>}
                />
                <Bar dataKey="alcance" name="Alcance Médio" fill="#e1306c" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="alcance" position="top" style={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                </Bar>
                <Bar dataKey="interacoes" name="Interações Médias" fill="#f97316" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="interacoes" position="top" style={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>

        {/* Chart 2 — Taxa de Engajamento por Post */}
        <AnimatedCard className="p-6" delay={0.15}>
          <h3 className="font-semibold mb-1">Taxa de Engajamento por Post (%)</h3>
          <p className="text-xs text-muted-foreground mb-5">Classificados do menor para o maior engajamento</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={engagementByPostData}
                layout="vertical"
                margin={{ top: 0, right: 40, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" opacity={0.5} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} unit="%" />
                <YAxis
                  type="category" dataKey="post" axisLine={false} tickLine={false}
                  tick={{ fontSize: 9.5, fill: "var(--color-muted-foreground)" }} width={130}
                />
                <Tooltip content={<EngagementTooltip />} />
                <Bar dataKey="taxa" name="Tab. Engajamento" radius={[0, 6, 6, 0]}>
                  {engagementByPostData.map((entry, i) => (
                    <Cell key={i} fill={typeColors[entry.tipo]} />
                  ))}
                  <LabelList dataKey="taxa" position="right" style={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} formatter={(v: number) => `${v}%`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {Object.entries(typeColors).map(([tipo, cor]) => (
              <span key={tipo} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: cor }} />
                {tipo}
              </span>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Row 2: Pie Chart + Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 3 — Distribuição de Interações */}
        <AnimatedCard className="p-6" delay={0.2}>
          <h3 className="font-semibold mb-1">Distribuição Total de Interações</h3>
          <p className="text-xs text-muted-foreground mb-5">10 posts analisados</p>
          <div className="flex items-center gap-4">
            <div className="h-[220px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={interactionDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    labelLine={false}
                    label={<PieLabel />}
                    animationBegin={200}
                    animationDuration={800}
                  >
                    {interactionDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) => [`${v}%`, ""]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--color-border)",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-col gap-3 shrink-0">
              {interactionDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: item.color }} />
                  <div>
                    <p className="text-xs font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedCard>

        {/* Chart 4 — Scatter: Alcance vs Interações */}
        <AnimatedCard className="p-6" delay={0.25}>
          <h3 className="font-semibold mb-1">Alcance vs. Interações</h3>
          <p className="text-xs text-muted-foreground mb-5">Tamanho do ponto = visualizações · seguidores: 5.395</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} />
                <XAxis
                  dataKey="alcance" name="Alcance" type="number"
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                  label={{ value: "Alcance", position: "insideBottom", offset: -2, fontSize: 10, fill: "var(--color-muted-foreground)" }}
                />
                <YAxis
                  dataKey="interacoes" name="Interações" type="number"
                  axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                  label={{ value: "Interações", angle: -90, position: "insideLeft", offset: 12, fontSize: 10, fill: "var(--color-muted-foreground)" }}
                />
                <ZAxis dataKey="visualizacoes" range={[60, 400]} name="Visualizações" />
                <Tooltip content={<ScatterTooltip />} />
                {/* Group by type */}
                {Object.entries(typeColors).map(([tipo, cor]) => (
                  <Scatter
                    key={tipo}
                    name={tipo}
                    data={scatterData.filter((d) => d.tipo === tipo)}
                    fill={cor}
                    fillOpacity={0.8}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            {Object.entries(typeColors).map(([tipo, cor]) => (
              <span key={tipo} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: cor }} />
                {tipo}
              </span>
            ))}
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
}
