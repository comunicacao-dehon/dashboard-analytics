import { AnimatedCard } from "@/components/AnimatedCard";
import { UsersRound, Eye, HeartHandshake, Image as ImageIcon, ArrowUpRight } from "lucide-react";
import type { InstagramMetrics } from "@/types/social";

export function FollowersTrendCards({ metrics }: { metrics?: InstagramMetrics | null }) {
  const followers = metrics?.followers || 0;
  const reach = metrics?.totalReach || 0;
  const impressions = metrics?.totalImpressions || 0;
  const totalPosts = metrics?.totalPosts || 0;

  const displayMetrics = [
    {
      label: "Seguidores Atuais",
      value: followers.toLocaleString('pt-BR'),
      trend: "-",
      isPositive: true,
      icon: UsersRound,
    },
    {
      label: "Alcance",
      value: reach.toLocaleString('pt-BR'),
      trend: "-",
      isPositive: true,
      icon: Eye,
    },
    {
      label: "Impressões",
      value: impressions.toLocaleString('pt-BR'),
      trend: "-",
      isPositive: true,
      icon: HeartHandshake,
    },
    {
      label: "Total de Posts",
      value: totalPosts.toLocaleString('pt-BR'),
      trend: "-",
      isPositive: true,
      icon: ImageIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {displayMetrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <AnimatedCard key={idx} delay={idx * 0.1} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span 
                className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full text-green-600 bg-green-50`}
              >
                <ArrowUpRight className="w-3 h-3 mr-1" />
                {metric.trend}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold tracking-tight mb-1">{metric.value}</h3>
              <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
            </div>
          </AnimatedCard>
        );
      })}
    </div>
  );
}
