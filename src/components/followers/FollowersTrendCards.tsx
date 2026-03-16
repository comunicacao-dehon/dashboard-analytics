import { AnimatedCard } from "@/components/AnimatedCard";
import { UsersRound, Eye, HeartHandshake, MessageSquare, ArrowUpRight, ArrowDownRight } from "lucide-react";

const metrics = [
  {
    label: "Seguidores",
    value: "17.656",
    trend: "+2,4%",
    isPositive: true,
    icon: UsersRound,
  },
  {
    label: "Visualizadores que retornam",
    value: "8.432",
    trend: "+5,1%",
    isPositive: true,
    icon: Eye,
  },
  {
    label: "Seguidores engajados",
    value: "3.241",
    trend: "-1,2%",
    isPositive: false,
    icon: HeartHandshake,
  },
  {
    label: "Contatos de mensagem",
    value: "1.024",
    trend: "+12,8%",
    isPositive: true,
    icon: MessageSquare,
  },
];

export function FollowersTrendCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <AnimatedCard key={idx} delay={idx * 0.1} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span 
                className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                  metric.isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                }`}
              >
                {metric.isPositive ? (
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                )}
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
