import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, LayoutDashboard, BarChart3, Plus, Filter, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { useAuth } from "@/contexts/AuthContext";
import { planningService } from "@/services/planningService";
import { ContentPost } from "@/types/planning";

import { PlanningCalendar } from "@/components/planning/PlanningCalendar";
import { PostPipeline } from "@/components/planning/PostPipeline";
import { ProgressionPanel } from "@/components/planning/ProgressionPanel";

export default function Planning() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [allPosts, currentStats] = await Promise.all([
          planningService.getPosts(user.id),
          planningService.getPlanningStats(user.id)
        ]);
        setPosts(allPosts);
        setStats(currentStats);
      } catch (err) {
        console.error("Failed to load planning data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="absolute top-0 inset-x-0 h-[350px] bg-gradient-to-b from-primary/5 via-primary/5 to-transparent pointer-events-none -z-10" />

      <main className="container pt-6 md:pt-12 px-4 md:px-6">
        {/* Header */}
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <motion.div variants={fadeIn} className="space-y-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <CalendarIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-foreground">Planejamento</h1>
            </div>
            <p className="text-muted-foreground font-medium text-lg max-w-xl">
              Gerencie sua estratégia de conteúdo, aprove postagens e agende publicações.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="flex gap-3">
            <Button variant="outline" className="h-12 rounded-xl bg-background/50 backdrop-blur-sm border-border font-bold">
              <Filter className="mr-2 h-4 w-4" /> Filtros
            </Button>
            <Button className="h-12 rounded-xl px-8 font-bold shadow-lg shadow-primary/20 bg-primary text-primary-foreground">
              <Plus className="mr-2 h-5 w-5" /> Novo Post
            </Button>
          </motion.div>
        </motion.div>

        {/* Search & Stats Summary Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="h-12 pl-10 rounded-xl bg-background/50" placeholder="Pesquisar posts planejados..." />
           </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="mb-8 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="calendar" className="rounded-lg px-6 font-bold">
              <CalendarIcon className="w-4 h-4 mr-2" /> Calendário
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="rounded-lg px-6 font-bold">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Pipeline
            </TabsTrigger>
            <TabsTrigger value="progress" className="rounded-lg px-6 font-bold">
              <BarChart3 className="w-4 h-4 mr-2" /> Progresso
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="focus-visible:outline-none">
            <PlanningCalendar posts={posts} />
          </TabsContent>

          <TabsContent value="pipeline" className="focus-visible:outline-none">
            <PostPipeline posts={posts} />
          </TabsContent>

          <TabsContent value="progress" className="focus-visible:outline-none">
            <ProgressionPanel stats={stats} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
