import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface FacebookAnalyticsDataPoint {
  date: string;
  value: number;
}

interface FacebookAnalyticsChartProps {
  data: FacebookAnalyticsDataPoint[];
  label: string;
  color?: string;
  positive?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-xl text-xs">
        <p className="text-muted-foreground mb-0.5">{label}</p>
        <p className="font-bold text-foreground">{payload[0].value.toLocaleString("pt-BR")}</p>
      </div>
    );
  }
  return null;
};

export function FacebookAnalyticsChart({
  data,
  label,
  color = "#1877f2",
  positive = true,
}: FacebookAnalyticsChartProps) {
  const lineColor = positive ? color : "#ef4444";

  return (
    <div className="h-[80px] w-full mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }}
            interval="preserveStartEnd"
            dy={4}
          />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            name={label}
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: lineColor }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
