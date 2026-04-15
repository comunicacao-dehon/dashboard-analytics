import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Download, UsersRound, Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { fadeIn, slideUp, staggerContainer } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { GenderChart } from "@/components/followers/GenderChart";
import { AgeDistributionChart } from "@/components/followers/AgeDistributionChart";
import { LocationsList, type LocationItem } from "@/components/followers/LocationsList";
import { FollowersTrendCards } from "@/components/followers/FollowersTrendCards";
import { FollowersTrendChart } from "@/components/followers/FollowersTrendChart";
import { FollowersDetailsPanel } from "@/components/followers/FollowersDetailsPanel";
import { useAuth } from "@/contexts/AuthContext";
import { useStableUserId } from "@/hooks/useStableUserId";
import { EmptyPlatformState } from "@/components/layout/EmptyPlatformState";
import { Instagram } from "lucide-react";
import { getConnectedAccounts, fetchInstagramMetrics } from "@/services/socialService";
import type { SocialAccount, InstagramMetrics } from "@/types/social";

// Helper function to format big numbers
const formatCompactValue = (num: number) => 
  new Intl.NumberFormat('pt-BR', { notation: "compact", maximumFractionDigits: 1 }).format(num);

export default function Followers() {
  const { user } = useAuth();
  const stableUserId = useStableUserId();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<InstagramMetrics | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFetchingMetrics, setIsFetchingMetrics] = useState(false);

  useEffect(() => {
    async function load() {
      if (!stableUserId) return;
      const result = await getConnectedAccounts(stableUserId);
      setAccounts(result);
      setLoading(false);

      const igAccount = result.find(a => a.platform === "instagram");
      const isConventinhoUser = user?.email?.toLowerCase() === 'comunicacao@conventinho.org.br';

      if (igAccount) {
        setIsFetchingMetrics(true);
        const igData = await fetchInstagramMetrics(igAccount);
        if (igData.success && igData.data) {
          setMetrics(igData.data);
        }
        setIsFetchingMetrics(false);
      } else if (isConventinhoUser) {
        // Mock posts from screenshots
        setPosts([
          { id: "p1", caption: "Com grande alegria, esperamos por vocês!", impressions: 4100, likes: 157, comments: 7, shares: 15, date: "2026-03-23" },
          { id: "p2", caption: "Missa com os Amigos do Coração Solenidade...", impressions: 3100, likes: 183, comments: 11, shares: 23, date: "2026-03-26" },
          { id: "p3", caption: "Aniver", impressions: 4300, likes: 211, comments: 47, shares: 5, date: "2026-03-23" },
          { id: "p4", caption: "Hoje celebramos a vida e a vocação do...", impressions: 3500, likes: 125, comments: 46, shares: 3, date: "2026-04-11" },
        ]);

        // Mock demographics and historical data
        setMetrics({
          followers: 5434,
          totalReach: 9800,
          totalImpressions: 53262,
          totalPosts: 145,
          engagementRate: 1.7,
          updatedAt: new Date().toISOString(),
          historicalData: [
            { date: "2026-03-16", followers: 5394, reach: 2000, impressions: 5000, engagement: 150 },
            { date: "2026-03-21", followers: 5410, reach: 6000, impressions: 12000, engagement: 400 },
            { date: "2026-03-26", followers: 5418, reach: 3500, impressions: 8000, engagement: 200 },
            { date: "2026-04-05", followers: 5422, reach: 4200, impressions: 9500, engagement: 300 },
            { date: "2026-04-10", followers: 5430, reach: 3800, impressions: 8500, engagement: 220 },
            { date: "2026-04-12", followers: 5434, reach: 4500, impressions: 10262, engagement: 428 },
          ],
          demographics: {
            gender: [
              { name: "Mulheres", value: 64.8 },
              { name: "Homens", value: 35.2 }
            ],
            age: [
              { name: "18-24", value: 12 },
              { name: "25-34", value: 34 },
              { name: "35-44", value: 31 },
              { name: "45-54", value: 14 },
              { name: "55-64", value: 6 },
              { name: "65+", value: 3 }
            ],
            cities: [
              { id: 1, name: "Taubaté, SP", percentage: 15.7 },
              { id: 2, name: "São Paulo, SP", percentage: 5.0 },
              { id: 3, name: "São José dos Campos, SP", percentage: 4.7 },
              { id: 4, name: "Tremembé, SP", percentage: 2.6 },
              { id: 5, name: "São Luís, MA", percentage: 2.4 },
              { id: 6, name: "Lavras, MG", percentage: 2.3 },
              { id: 7, name: "Varginha, MG", percentage: 1.7 },
              { id: 8, name: "Fortaleza, CE", percentage: 1.6 },
              { id: 9, name: "Rio de Janeiro, RJ", percentage: 1.5 },
              { id: 10, name: "Jaraguá do Sul, SC", percentage: 1.0 }
            ],
            countries: [
              { id: 1, name: "Brasil", percentage: 95.6 },
              { id: 2, name: "Estados Unidos", percentage: 0.4 },
              { id: 3, name: "Portugal", percentage: 0.2 },
              { id: 4, name: "Itália", percentage: 0.2 },
              { id: 5, name: "Venezuela", percentage: 0.2 },
              { id: 6, name: "Espanha", percentage: 0.1 },
              { id: 7, name: "Índia", percentage: 0.1 },
              { id: 8, name: "Colômbia", percentage: 0.1 },
              { id: 9, name: "Argentina", percentage: 0.1 },
              { id: 10, name: "Paraguai", percentage: 0.1 }
            ]
          }
        });
      }
    }
    load();
  }, [stableUserId, user]);

  const isConventinho = user?.email?.toLowerCase() === 'comunicacao@conventinho.org.br';
  const hasInstagram = accounts.some(a => a.platform === "instagram");

  if (loading) return null;

  if (!hasInstagram && !isConventinho) {
    return <EmptyPlatformState platform="Instagram" icon={<Instagram className="w-8 h-8 text-pink-500" />} description="Vincule sua conta do Instagram para ver análises de seguidores, demografia e tendências em tempo real." />;
  }


  const topCities: LocationItem[] = []; // Os dados virão de metrics.demographics

  const topCountries: LocationItem[] = []; // Os dados virão de metrics.demographics

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 pb-24">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 inset-x-0 h-[350px] bg-gradient-to-b from-primary/5 via-primary/5 to-transparent pointer-events-none -z-10" />

      <main className="container pt-6 md:pt-12 px-4 md:px-6">
        {/* Page Header - Hidden on mobile */}
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="mb-8 md:mb-10 hidden md:flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <motion.div variants={fadeIn} className="space-y-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 p-0.5 flex items-center justify-center shadow-lg shadow-pink-500/20">
                <UsersRound className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-foreground">Seguidores</h1>
            </div>
            <p className="text-muted-foreground font-medium text-lg max-w-xl">
              Análise demográfica, crescimento e comportamento do público no Instagram.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="flex gap-3">
            <Button variant="outline" className="h-12 rounded-xl bg-background/50 backdrop-blur-sm border-border hover:bg-muted font-bold tracking-tight">
              <Download className="mr-2 h-4 w-4" /> Exportar Dados
            </Button>
            <Button className="h-12 rounded-xl px-8 font-bold tracking-tight shadow-lg shadow-primary/20 bg-primary text-primary-foreground">
              Atualizar Insights
            </Button>
          </motion.div>
        </motion.div>

        {/* Tabs System */}
        <Tabs defaultValue="publico" className="w-full">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <TabsList className="mb-8 w-full sm:w-auto grid w-full sm:inline-flex grid-cols-3 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="publico" className="rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                Público
              </TabsTrigger>
              <TabsTrigger value="conteudo" className="rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                Conteúdo
              </TabsTrigger>
              <TabsTrigger value="tendencias" className="rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                Tendências
              </TabsTrigger>
              <TabsTrigger value="potencial" className="rounded-lg text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                Público potencial
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Tab 1: Público */}
          <TabsContent value="publico" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            {/* Global Overview Card */}
            <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-10">
              <AnimatedCard delay={0.1} className="p-8 md:p-12 relative overflow-hidden bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                {/* Soft backdrop logo */}
                <UsersRound className="absolute -right-10 -bottom-10 w-64 h-64 text-primary/5 pointer-events-none" />
                
                <div className="relative z-10 flex items-center gap-5 mb-2">
                  <div className="p-3.5 bg-primary/10 rounded-2xl">
                    <UsersRound className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-wider">Total de Seguidores</h3>
                    <div className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mt-1">
                      {metrics ? formatCompactValue(metrics.followers) : "..."}
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>

            {/* Demographics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <GenderChart 
                delay={0.2} 
                data={metrics?.demographics?.gender} 
              />
              <AgeDistributionChart 
                delay={0.3} 
                data={metrics?.demographics?.age} 
              />
            </div>

            {/* Geographics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LocationsList 
                delay={0.4} 
                title="Principais Cidades" 
                locations={metrics?.demographics?.cities || topCities} 
              />
              <LocationsList 
                delay={0.5} 
                title="Principais Países" 
                locations={metrics?.demographics?.countries || topCountries} 
              />
            </div>
          </TabsContent>

          {/* Tab: Conteúdo */}
          <TabsContent value="conteudo" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {posts.map((post, i) => (
                <AnimatedCard key={post.id} delay={i * 0.1} className="p-0 overflow-hidden group border-border/40">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-4">
                       <div className="flex items-center gap-4 text-white text-xs font-bold">
                          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-white" /> {post.likes}</span>
                          <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 fill-white" /> {post.comments}</span>
                       </div>
                    </div>
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-black text-4xl">
                      IG
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-xs font-medium line-clamp-2 text-foreground h-8 leading-relaxed">
                      {post.caption}
                    </p>
                    <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                       <div className="space-y-0.5">
                          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Alcance</p>
                          <p className="text-sm font-bold text-foreground">{post.impressions.toLocaleString()}</p>
                       </div>
                       <div className="text-right space-y-0.5">
                          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Cliques</p>
                          <p className="text-sm font-bold text-primary">{post.shares}</p>
                       </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </TabsContent>

          {/* Tab 2: Tendências */}
          <TabsContent value="tendencias" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-10">
              {/* Top Statistics Cards */}
              <FollowersTrendCards metrics={metrics} />

              {/* Layout for Chart & Details side-by-side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 relative">
                  <FollowersTrendChart delay={0.2} metrics={metrics} />
                </div>
                <div className="lg:col-span-1 border-l border-border/20 pl-0 lg:pl-2">
                  <FollowersDetailsPanel delay={0.3} metrics={metrics} />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Tab 3: Público potencial */}
          <TabsContent value="potencial" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <AnimatedCard className="p-8 col-span-1 md:col-span-2 flex flex-col justify-center bg-primary/5 border-primary/20">
                <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tamanho Estimado do Público</h3>
                <div className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                  164.1M <span className="text-xl text-muted-foreground font-medium">a</span> 193.1M
                </div>
                <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                  Este é o alcance potencial estimado com base nos interesses e comportamento dos seus seguidores atuais em todo o Brasil.
                </p>
              </AnimatedCard>

              <AnimatedCard delay={0.1} className="p-8 flex flex-col gap-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Interesses Principais</h4>
                  <div className="space-y-3">
                    {["Design e Criatividade", "Tecnologia", "Empreendedorismo", "Religião"].map((tag, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border border-border">
                        <span className="text-xs font-bold">{tag}</span>
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <LocationsList title="Principais Cidades (Potencial)" locations={[{id: 1, name: "São Paulo, SP", percentage: 7.9}, {id: 2, name: "Rio de Janeiro, RJ", percentage: 4.1}, {id: 3, name: "Salvador, BA", percentage: 1.4}]} />
               <LocationsList title="Principais Países (Potencial)" locations={[{id: 1, name: "Brasil", percentage: 100}]} />
            </div>
          </TabsContent>

        </Tabs>

      </main>
    </div>
  );
}
