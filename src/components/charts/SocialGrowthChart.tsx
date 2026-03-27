import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AnimatedCard } from "@/components/AnimatedCard";

const data = [
  { month: "Out", instagram: 4800, facebook: 12000, youtube: 1100 },
  { month: "Nov", instagram: 5100, facebook: 13500, youtube: 1250 },
  { month: "Dez", instagram: 5200, facebook: 14800, youtube: 1320 },
  { month: "Jan", instagram: 5280, facebook: 15600, youtube: 1480 },
  { month: "Fev", instagram: 5395, facebook: 16400, youtube: 1650 },
  { month: "Mar", instagram: 5500, facebook: 17000, youtube: 1820 },
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

export function SocialGrowthChart() {
  return (
    <AnimatedCard className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Crescimento por Rede Social</h3>
        <p className="text-sm text-muted-foreground">Evolução de seguidores/inscritos nos últimos 6 meses</p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} dy={8} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(val) => <span className="text-xs text-muted-foreground capitalize">{val}</span>}
            />
            <Line type="monotone" dataKey="instagram" name="Instagram" stroke="#e1306c" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="facebook" name="Facebook" stroke="#1877f2" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="youtube" name="YouTube" stroke="#ff0000" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AnimatedCard>
  );
}
