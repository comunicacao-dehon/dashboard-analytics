import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { scaleIn } from "@/lib/animations";
import {
  FacebookAnalyticsChart,
  type FacebookAnalyticsDataPoint,
} from "./FacebookAnalyticsChart";

interface FacebookAnalyticsCardProps {
  title: string;
  value: string;
  trend: string;
  positive?: boolean;
  chartLabel: string;
  data: FacebookAnalyticsDataPoint[];
  delay?: number;
}

export function FacebookAnalyticsCard({
  title,
  value,
  trend,
  positive = true,
  chartLabel,
  data,
  delay = 0,
}: FacebookAnalyticsCardProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
            positive
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {positive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {trend}
        </span>
      </div>

      {/* Main Value */}
      <p className="text-3xl font-bold tracking-tight text-foreground mb-1">{value}</p>

      {/* Period */}
      <p className="text-[11px] text-muted-foreground/70">16 fev – 13 mar</p>

      {/* Chart */}
      <FacebookAnalyticsChart
        data={data}
        label={chartLabel}
        positive={positive}
      />
    </motion.div>
  );
}
