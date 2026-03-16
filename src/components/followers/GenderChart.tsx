import { AnimatedCard } from "@/components/AnimatedCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Users } from "lucide-react";

const data = [
  { name: "Mulheres", value: 76.6, color: "var(--color-primary)" },
  { name: "Homens", value: 23.4, color: "var(--color-primary-foreground)" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/95 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-xl flex items-center gap-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{data.name}</span>
          <span className="text-xl font-bold text-foreground">{payload[0].value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export function GenderChart({ delay = 0 }: { delay?: number }) {
  return (
    <AnimatedCard delay={delay} className="p-6 md:p-8 flex flex-col h-full bg-white/40">
      <div className="flex items-center gap-2 mb-6 border-b border-border/40 pb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold m-0">Distribuição por Gênero</h3>
      </div>
      
      <div className="flex-1 min-h-[280px] relative mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={8}
              animationBegin={delay * 1000 + 400}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className={index === 1 ? "opacity-30" : "drop-shadow-sm"} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-sm font-medium text-foreground ml-1">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
          <span className="text-4xl font-extrabold tracking-tight text-foreground drop-shadow-sm">76.6<span className="text-2xl">%</span></span>
          <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Mulheres</span>
        </div>
      </div>
    </AnimatedCard>
  );
}
