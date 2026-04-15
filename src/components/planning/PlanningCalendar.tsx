import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MoreHorizontal, Instagram, Facebook, Youtube, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/AnimatedCard";
import { cn } from "@/lib/utils";
import { ContentPost } from "@/types/planning";

interface PlanningCalendarProps {
  posts: ContentPost[];
  onMovePost?: (postId: string, newDate: Date) => void;
}

export function PlanningCalendar({ posts, onMovePost }: PlanningCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram": return <Instagram className="w-3 h-3" />;
      case "facebook": return <Facebook className="w-3 h-3" />;
      case "youtube": return <Youtube className="w-3 h-3" />;
      case "x": return <Twitter className="w-3 h-3" />;
      case "linkedin": return <Linkedin className="w-3 h-3" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500/10 text-green-600 border-green-200";
      case "scheduled": return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "failed": return "bg-red-500/10 text-red-600 border-red-200";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <AnimatedCard className="overflow-hidden border-none shadow-2xl shadow-primary/5 bg-white/40 backdrop-blur-md">
      {/* Calendar Header */}
      <div className="p-6 border-b border-border/40 flex items-center justify-between bg-white/20">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground capitalize">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
            {posts.length} Posts planejados este mês
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="rounded-xl h-10 w-10">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="rounded-xl h-10 w-10">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 border-b border-border/40 bg-muted/30">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
          <div key={day} className="py-3 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 auto-rows-[140px]">
        {calendarDays.map((day, idx) => {
          const dayPosts = posts.filter(post => 
            post.scheduled_at && isSameDay(new Date(post.scheduled_at), day)
          );

          return (
            <div 
              key={day.toString()} 
              className={cn(
                "border-r border-b border-border/40 p-2 relative group hover:bg-primary/5 transition-colors",
                !isSameMonth(day, monthStart) && "bg-muted/10 opacity-40",
                isSameDay(day, new Date()) && "bg-primary/5"
              )}
            >
              {/* Day Number */}
              <div className={cn(
                "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-lg mb-2",
                isSameDay(day, new Date()) ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "text-muted-foreground"
              )}>
                {format(day, "d")}
              </div>

              {/* Day Posts */}
              <div className="space-y-1 overflow-y-auto max-h-[85px] scrollbar-hide">
                {dayPosts.map((post) => (
                  <div 
                    key={post.id}
                    className={cn(
                      "group/post px-2 py-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-sm",
                      getStatusColor(post.status)
                    )}
                  >
                    <span className="opacity-70">{getPlatformIcon(post.platform)}</span>
                    <span className="truncate flex-1">{post.title}</span>
                  </div>
                ))}
              </div>

              {/* Hover Add Button */}
              <button className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                <Plus className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </AnimatedCard>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
    </svg>
  );
}
