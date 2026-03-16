import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AnimatedCard } from "@/components/AnimatedCard";

const data = [
  { metric: "Seguidores", instagram: 5377, facebook: 17000, youtube: 1650 },
  { metric: "Engajamento", instagram: 419, facebook: 1079, youtube: 190 },
  { metric: "Alcance (k)", instagram: 245, facebook: 37, youtube: 95 },
  { metric: "Posts", instagram: 18, facebook: 12, youtube: 8 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
            {p.name}: <span className="font-bold ml-1">{p.value.toLocaleString("pt-BR")}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function EngagementComparisonChart() {
  return (
    <AnimatedCard className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Comparação por Plataforma</h3>
        <p className="text-sm text-muted-foreground">Métricas-chave comparadas entre as redes sociais</p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
            <XAxis dataKey="metric" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(val) => <span className="text-xs text-muted-foreground capitalize">{val}</span>}
            />
            <Bar dataKey="instagram" name="Instagram" fill="#e1306c" radius={[4, 4, 0, 0]} />
            <Bar dataKey="facebook" name="Facebook" fill="#1877f2" radius={[4, 4, 0, 0]} />
            <Bar dataKey="youtube" name="YouTube" fill="#ff4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnimatedCard>
  );
}
