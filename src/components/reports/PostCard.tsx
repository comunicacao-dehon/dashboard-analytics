import { AnimatedCard } from "@/components/AnimatedCard";
import { Users, MousePointerClick, TrendingUp } from "lucide-react";

interface PostCardProps {
  previewText: string;
  reach: string;
  interactions: string;
  followersGained: string;
  delay?: number;
  rank?: number;
  isTop?: boolean;
}

export function PostCard({
  previewText,
  reach,
  interactions,
  followersGained,
  delay = 0,
  rank,
  isTop = true,
}: PostCardProps) {
  return (
    <AnimatedCard delay={delay} className="p-5 flex flex-col h-full gap-4">
      <div className="flex gap-4 items-start">
        {rank !== undefined && (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 ${
              isTop ? "bg-primary/10 text-primary" : "bg-red-50 text-red-600"
            }`}
          >
            #{rank}
          </div>
        )}
        <p className="text-sm font-medium leading-relaxed line-clamp-2 text-foreground flex-1 mt-1">
          "{previewText}"
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-border/50">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
            <Users className="w-3 h-3" /> Alcance
          </span>
          <span className="font-semibold text-sm">{reach}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
            <MousePointerClick className="w-3 h-3" /> Interações
          </span>
          <span className="font-semibold text-sm">{interactions}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3" /> Seguidores
          </span>
          <span className="font-semibold text-sm text-green-600">+{followersGained}</span>
        </div>
      </div>
    </AnimatedCard>
  );
}
