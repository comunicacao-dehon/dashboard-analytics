import { AnimatedCard } from "@/components/AnimatedCard";
import { Info, UserPlus, Eye, Users } from "lucide-react";
import type { InstagramMetrics } from "@/types/social";

export function FollowersDetailsPanel({ delay = 0, metrics }: { delay?: number; metrics?: InstagramMetrics | null }) {
  const followers = metrics?.followers || 0;
  const reach = metrics?.totalReach || 0;
  
  let netFollowers = 0;
  if (metrics?.historicalData && metrics.historicalData.length > 0) {
    const firstDay = metrics.historicalData[0].followers;
    const lastDay = metrics.historicalData[metrics.historicalData.length - 1].followers;
    if (firstDay && lastDay) {
      netFollowers = lastDay - firstDay;
    }
  }

  return (
    <AnimatedCard delay={delay} className="p-6 md:p-8 flex flex-col h-full bg-gradient-to-br from-white/60 to-white/20 border-border/60">
      <div className="flex items-center gap-2 mb-8 border-b border-border/40 pb-4">
        <Info className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-semibold m-0">Detalhamento</h3>
      </div>

      <div className="text-sm font-medium text-muted-foreground mb-6 bg-muted/30 p-3 rounded-lg text-center">
        Período analisado: <strong className="text-foreground">Últimos 28 dias</strong>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        {/* Reach */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <Eye className="w-4 h-4 text-blue-500" />
            </div>
            <span className="font-medium text-foreground">Alcance Total</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg text-foreground">{reach.toLocaleString('pt-BR')}</div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-px w-full bg-border/40" />

        {/* Net Followers */}
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
              <UserPlus className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-medium text-foreground">Ganho de Seguidores</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg text-foreground">{netFollowers > 0 ? `+${netFollowers}` : netFollowers}</div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-px w-full bg-border/40" />

        {/* Total Box */}
        <div className="mt-auto pt-4">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Total de seguidores</span>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-primary">
              {followers.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>

      </div>
    </AnimatedCard>
  );
}
