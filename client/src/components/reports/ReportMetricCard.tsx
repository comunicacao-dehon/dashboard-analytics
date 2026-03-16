import { AnimatedCard } from "@/components/AnimatedCard";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";

interface ReportMetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  delay?: number;
}

export function ReportMetricCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp = true,
  delay = 0,
}: ReportMetricCardProps) {
  return (
    <AnimatedCard delay={delay} className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {trend && (
          <span
            className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
              trendUp
                ? "text-green-600 bg-green-50"
                : "text-red-600 bg-red-50"
            }`}
          >
            {trendUp ? (
              <ArrowUpRight className="w-3 h-3 mr-1" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-1" />
            )}
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold tracking-tight mb-1">{value}</h3>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
    </AnimatedCard>
  );
}
