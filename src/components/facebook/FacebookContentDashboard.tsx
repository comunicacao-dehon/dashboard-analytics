import { useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const contentData = [
  { date: "16 mar", views: 300, interactions: 20 },
  { date: "21 mar", views: 4500, interactions: 180 },
  { date: "26 mar", views: 1200, interactions: 45 },
  { date: "31 mar", views: 800, interactions: 30 },
  { date: "05 abr", views: 8900, interactions: 420 },
  { date: "10 abr", views: 3400, interactions: 110 },
  { date: "12 abr", views: 1100, interactions: 65 },
];

interface KPIProps {
  label: string;
  value: string;
  trend: string;
  positive?: boolean;
  active?: boolean;
}

function KPI({ label, value, trend, positive = true, active = false }: KPIProps) {
  return (
    <div className={`p-4 rounded-xl transition-all border ${active ? 'bg-blue-50/50 border-blue-200' : 'bg-transparent border-transparent'}`}>
      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
        {label} <span className="opacity-40">ⓘ</span>
      </p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
        <span className={`text-[10px] font-bold flex items-center gap-0.5 ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {positive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          {trend}
        </span>
      </div>
    </div>
  );
}

export function FacebookContentDashboard() {
  const [activeTab, setActiveTab] = useState("tudo");

  return (
    <AnimatedCard className="p-0 border-border/40 mb-8">
      <div className="px-6 py-4 border-b border-border/40 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
          <h3 className="font-bold text-lg tracking-tight">Visão geral do conteúdo</h3>
        </div>
        <select className="bg-muted text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-border outline-none">
          <option>Detalhamento: Orgânico/anúncios</option>
        </select>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-muted/50 p-1 rounded-xl w-fit">
            <TabsTrigger value="tudo" className="text-xs font-bold px-6">Tudo</TabsTrigger>
            <TabsTrigger value="posts" className="text-xs font-bold px-6">Posts</TabsTrigger>
            <TabsTrigger value="stories" className="text-xs font-bold px-6">Stories</TabsTrigger>
            <TabsTrigger value="reels" className="text-xs font-bold px-6">Reels</TabsTrigger>
            <TabsTrigger value="live" className="text-xs font-bold px-6">Ao vivo</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-10 overflow-x-auto">
          <KPI label="Visualizações" value="46,7 mil" trend="25,9%" active={true} />
          <KPI label="Visualizações 3s" value="1,4 mil" trend="1,8%" positive={false} />
          <KPI label="Visualizações 1m" value="262" trend="7,4%" />
          <KPI label="Interações" value="2,2 mil" trend="59%" />
          <div className="flex items-center justify-center">
             <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
             </button>
          </div>
        </div>

        <div className="h-[300px] w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={contentData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.4} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                tickFormatter={(val) => val >= 1000 ? `${val/1000} mil` : val}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
              <Line 
                type="monotone" 
                dataKey="views" 
                name="Visualizações" 
                stroke="#1877f2" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "#1877f2" }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="interactions" 
                name="Interações" 
                stroke="#10b981" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-border/40">
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Total</p>
              <div className="flex items-center gap-2">
                 <span className="text-xl font-bold">46.672</span>
                 <span className="text-xs font-bold text-emerald-500">↑ 25,9%</span>
              </div>
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">De orgânica</p>
              <div className="flex items-center gap-2">
                 <span className="text-xl font-bold">46.672</span>
                 <span className="text-xs font-bold text-emerald-500">↑ 25,9%</span>
              </div>
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Visualizadores</p>
              <div className="flex items-center gap-2">
                 <span className="text-xl font-bold">19.201</span>
                 <span className="text-xs font-bold text-emerald-500">↑ 170%</span>
              </div>
           </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
