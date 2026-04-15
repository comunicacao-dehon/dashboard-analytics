import { AnimatedCard } from "@/components/AnimatedCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Activity } from "lucide-react";

export function AgeDistributionChart({ data: propData, delay = 0 }: { data?: any[], delay?: number }) {
  const defaultData = [
    { name: "18-24", value: 22 },
    { name: "25-34", value: 38 },
    { name: "35-44", value: 18 },
    { name: "45-54", value: 12 },
    { name: "55-64", value: 7 },
    { name: "65+", value: 3 },
  ];

  const chartData = propData && propData.length > 0 ? propData : defaultData;
  const maxAgeGroup = [...chartData].sort((a,b) => b.value - a.value)[0]?.name;

  return (
    <AnimatedCard delay={delay} className="p-6 md:p-8 flex flex-col h-full bg-white/40">
      <div className="flex items-center gap-2 mb-6 border-b border-border/40 pb-4">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold m-0">Faixa Etária</h3>
      </div>

      <div className="flex-1 min-h-[280px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" opacity={0.3} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-foreground)', fontSize: 13, fontWeight: 500 }}
              width={60}
            />
            <Tooltip 
              cursor={{ fill: 'var(--color-primary)', opacity: 0.05 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background/95 backdrop-blur-md border border-border/50 p-3 rounded-lg shadow-xl flex flex-col">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Faixa {payload[0].payload.name}</span>
                      <span className="text-lg font-bold text-foreground">{payload[0].value}% da audiência</span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[0, 6, 6, 0]} 
              barSize={28}
              animationBegin={delay * 1000 + 400}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.name === maxAgeGroup ? "var(--color-primary)" : "var(--color-primary-foreground)"} 
                  className={entry.name === maxAgeGroup ? "drop-shadow-sm" : "opacity-30"}
                />
              ))}
              <LabelList 
                dataKey="value" 
                position="right" 
                formatter={(val: number) => `${val}%`}
                style={{ fill: 'var(--color-muted-foreground)', fontSize: '13px', fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AnimatedCard>
  );
}
