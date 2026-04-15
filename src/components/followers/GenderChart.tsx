import { AnimatedCard } from "@/components/AnimatedCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Users } from "lucide-react";

export function GenderChart({ data: propData, delay = 0 }: { data?: any[], delay?: number }) {
  // Dados de fallback se não houver dados reais
  const defaultData = [
    { name: "Mulheres", value: 76.6, color: "var(--color-primary)" },
    { name: "Homens", value: 23.4, color: "var(--color-primary-foreground)" },
  ];

  const chartData = propData && propData.length > 0 ? propData.map((d, i) => ({
    ...d,
    color: i === 0 ? "var(--color-primary)" : "var(--color-primary-foreground)"
  })) : defaultData;

  const femininePercentage = chartData.find(d => d.name === "Mulheres")?.value || 0;

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
              data={chartData}
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
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className={index === 1 ? "opacity-30" : "drop-shadow-sm"} 
                />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-sm font-medium text-foreground/80 ml-1 hover:text-primary transition-colors">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text overlay - Perfectly Centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-black tracking-tight text-foreground drop-shadow-sm leading-none">
            {femininePercentage}<span className="text-2xl opacity-60">%</span>
          </span>
          <span className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-2">Audiência Feminina</span>
        </div>
      </div>
    </AnimatedCard>
  );
}
