import { AnimatedCard } from "@/components/AnimatedCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

import type { InstagramMetrics } from "@/types/social";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-xl flex flex-col gap-1">
        <span className="text-sm font-semibold text-muted-foreground uppercase">{label}</span>
        <span className="text-xl font-bold text-foreground">
          {payload[0].value.toLocaleString('pt-BR')} <span className="text-sm font-medium text-muted-foreground">seguidores</span>
        </span>
      </div>
    );
  }
  return null;
};

export function FollowersTrendChart({ delay = 0, metrics }: { delay?: number; metrics?: InstagramMetrics | null }) {
  const formatChartDate = (isoStr: string) => {
    const d = new Date(isoStr + 'T00:00:00');
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const data = metrics?.historicalData ? metrics.historicalData.map(d => ({
    date: formatChartDate(d.date),
    followers: d.followers
  })) : [];

  const dataPoints = data.map(d => d.followers);
  const minDomain = dataPoints.length > 0 ? Math.max(0, Math.min(...dataPoints) - 10) : 0;

  return (
    <AnimatedCard delay={delay} className="p-6 md:p-8 flex flex-col h-full bg-white/40">
      <div className="flex items-center justify-between mb-8 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold m-0">Evolução de Seguidores</h3>
        </div>
        <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          Últimos 28 dias
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px] mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Defs for subtle drop shadow on the line if desired, but mostly we rely on the line itself */}
            <defs>
              <filter id="shadow" height="200%">
                <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="var(--color-primary)" floodOpacity="0.3" />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.4} />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              domain={[minDomain, 'auto']}
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line 
              type="monotone" 
              dataKey="followers" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "var(--color-background)" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-primary)" }}
              filter="url(#shadow)"
              animationBegin={delay * 1000 + 400}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AnimatedCard>
  );
}
