import { AnimatedCard } from "@/components/AnimatedCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Dez '25", reach: 8000, followers: 0 },
  { name: "Jan '26", reach: 12000, followers: 1 },
  { name: "Fev '26", reach: 24679, followers: 3 },
  { name: "Mar '26", reach: 28000, followers: 5 },
];

export function EngagementChart() {
  return (
    <AnimatedCard className="p-6 md:p-8 col-span-1 lg:col-span-2">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-1">Alcance vs Novos Seguidores</h3>
        <p className="text-sm text-muted-foreground">Evolução do crescimento da conta ao longo do trimestre</p>
      </div>
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} 
            />
            <Tooltip
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="reach"
              name="Alcance"
              stroke="var(--color-primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorReach)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </AnimatedCard>
  );
}
