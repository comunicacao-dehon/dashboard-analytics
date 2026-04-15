import { ContentPost, PostStatus } from "@/types/planning";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Instagram, Facebook, Youtube, Twitter, Linkedin, Clock, CheckCircle2, AlertCircle, FileEdit, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PostPipelineProps {
  posts: ContentPost[];
  onStatusChange?: (postId: string, newStatus: PostStatus) => void;
}

const COLUMNS: { id: PostStatus; label: string; icon: any; color: string }[] = [
  { id: "draft", label: "Rascunho", icon: FileEdit, color: "text-muted-foreground bg-muted" },
  { id: "review", label: "Em Revisão", icon: Eye, color: "text-amber-600 bg-amber-500/10" },
  { id: "approved", label: "Aprovado", icon: CheckCircle2, color: "text-green-600 bg-green-500/10" },
  { id: "scheduled", label: "Agendado", icon: Clock, color: "text-blue-600 bg-blue-500/10" },
];

export function PostPipeline({ posts, onStatusChange }: PostPipelineProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram": return <Instagram className="w-3.5 h-3.5" />;
      case "facebook": return <Facebook className="w-3.5 h-3.5" />;
      case "youtube": return <Youtube className="w-3.5 h-3.5" />;
      case "x": return <Twitter className="w-3.5 h-3.5" />;
      case "linkedin": return <Linkedin className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {COLUMNS.map((column) => {
        const columnPosts = posts.filter(p => p.status === column.id);
        const Icon = column.icon;

        return (
          <div key={column.id} className="flex flex-col h-full bg-muted/20 rounded-2xl p-4 border border-border/50">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-2">
                <div className={cn("p-2 rounded-xl", column.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold tracking-tight text-sm">{column.label}</h3>
              </div>
              <Badge variant="outline" className="rounded-full px-2 font-black text-[10px] bg-background border-border/50">
                {columnPosts.length}
              </Badge>
            </div>

            {/* Column Content */}
            <div className="flex-1 space-y-4 min-h-[500px]">
              {columnPosts.map((post) => (
                <AnimatedCard 
                  key={post.id} 
                  className="p-4 bg-white/60 backdrop-blur-sm border-border/40 hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                       <div className="p-1 px-2 rounded-lg bg-muted/50 border border-border/50 flex items-center gap-1.5">
                          <span className="text-muted-foreground">{getPlatformIcon(post.platform)}</span>
                          <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">{post.platform}</span>
                       </div>
                    </div>
                    <Badge className="h-5 text-[9px] font-black rounded-full bg-primary/10 text-primary border-none">
                       {post.media_urls.length > 1 ? "Carrossel" : "Post Único"}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-sm text-foreground line-clamp-1 mb-2">
                    {post.title}
                  </h4>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                    {post.content}
                  </p>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                     <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">
                          {post.scheduled_at ? format(new Date(post.scheduled_at), "dd MMM, HH:mm", { locale: ptBR }) : "--:--"}
                        </span>
                     </div>
                     <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center border border-background">
                        <span className="text-[8px] font-black">U</span>
                     </div>
                  </div>
                </AnimatedCard>
              ))}

              {columnPosts.length === 0 && (
                <div className="h-32 flex items-center justify-center border-2 border-dashed border-border/30 rounded-2xl opacity-40">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vazio</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
