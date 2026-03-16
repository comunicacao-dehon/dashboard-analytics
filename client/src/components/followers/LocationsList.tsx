import { AnimatedCard } from "@/components/AnimatedCard";
import { MapPin } from "lucide-react";

export interface LocationItem {
  id: number;
  name: string;
  percentage?: number;
}

interface LocationsListProps {
  title: string;
  locations: LocationItem[];
  delay?: number;
}

export function LocationsList({ title, locations, delay = 0 }: LocationsListProps) {
  // Find highest percentage to scale bars relatively, assume max is 100 if missing
  const maxPercent = locations[0]?.percentage || 100;

  return (
    <AnimatedCard delay={delay} className="p-6 md:p-8 flex flex-col h-full bg-white/40">
      <div className="flex items-center gap-2 mb-6 border-b border-border/40 pb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold m-0">{title}</h3>
      </div>

      <div className="flex flex-col gap-4">
        {locations.map((loc, idx) => (
          <div key={loc.id} className="group relative flex items-center justify-between">
            <div className="flex items-center gap-3 z-10 w-full">
              <span className="text-sm font-bold text-muted-foreground w-5 text-right">{idx + 1}.</span>
              <span className="font-medium text-foreground truncate">{loc.name}</span>
              
              {loc.percentage !== undefined && (
                <span className="text-sm font-semibold ml-auto">{loc.percentage}%</span>
              )}
            </div>

            {/* Background progress bar if percentage is provided */}
            {loc.percentage !== undefined && (
              <div 
                className="absolute inset-y-0 left-8 bg-primary/5 rounded-md -z-0 transition-all group-hover:bg-primary/10"
                style={{ width: `calc(${(loc.percentage / maxPercent) * 100}% - 2rem)` }}
              />
            )}
          </div>
        ))}
      </div>
    </AnimatedCard>
  );
}
