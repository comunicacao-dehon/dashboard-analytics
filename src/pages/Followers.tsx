import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Download, UsersRound } from "lucide-react";
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
import { EmptyPlatformState } from "@/components/layout/EmptyPlatformState";
import { Instagram } from "lucide-react";

export default function Followers() {
  const { user } = useAuth();
  const isConventinho = user?.email?.toLowerCase() === 'comunicacao@conventinho.com';

  if (!isConventinho) {
    return <EmptyPlatformState platform="Instagram" icon={<Instagram className="w-8 h-8 text-pink-500" />} description="Vincule sua conta do Instagram para ver análises de seguidores, demografia e tendências em tempo real." />;
  }

  const topCities: LocationItem[] = [
    { id: 1, name: "Taubaté, SP", percentage: 18.5 },
    { id: 2, name: "São Paulo, SP", percentage: 15.2 },
    { id: 3, name: "São José dos Campos, SP", percentage: 9.8 },
    { id: 4, name: "Rio de Janeiro, RJ", percentage: 7.1 },
    { id: 5, name: "São Luís, MA", percentage: 5.4 },
    { id: 6, name: "Fortaleza, CE", percentage: 4.2 },
    { id: 7, name: "Lavras, MG", percentage: 3.5 },
    { id: 8, name: "Curitiba, PR", percentage: 2.8 },
    { id: 9, name: "Varginha, MG", percentage: 2.1 },
    { id: 10, name: "Belo Horizonte, MG", percentage: 1.9 },
  ];

  const topCountries: LocationItem[] = [
    { id: 1, name: "Brazil", percentage: 98.1 },
    { id: 2, name: "Portugal", percentage: 0.8 },
    { id: 3, name: "Angola", percentage: 0.4 },
    { id: 4, name: "United States", percentage: 0.2 },
    { id: 5, name: "Mozambique", percentage: 0.1 },
    { id: 6, name: "Germany", percentage: 0.1 },
    { id: 7, name: "Canada", percentage: 0.1 },
    { id: 8, name: "Italy", percentage: 0.1 },
    { id: 9, name: "Paraguay", percentage: 0.05 },
    { id: 10, name: "United Kingdom", percentage: 0.05 },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 pb-24">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 inset-x-0 h-[350px] bg-gradient-to-b from-primary/5 via-primary/5 to-transparent pointer-events-none -z-10" />

      <main className="container pt-12">
        {/* Page Header */}
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <motion.h1 variants={slideUp} className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
              Análise de Seguidores
            </motion.h1>
            <motion.p variants={slideUp} className="text-lg text-muted-foreground">
              Demografia do público e estatísticas de seguidores
            </motion.p>
          </div>
          <motion.div variants={fadeIn}>
            <Button variant="outline" className="rounded-full shadow-sm bg-white/50">
              <Download className="w-4 h-4 mr-2" />
              Exportar
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
                    <div className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mt-1">5.395</div>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>

            {/* Demographics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <GenderChart delay={0.2} />
              <AgeDistributionChart delay={0.3} />
            </div>

            {/* Geographics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <LocationsList delay={0.4} title="Principais Cidades" locations={topCities} />
              <LocationsList delay={0.5} title="Principais Países" locations={topCountries} />
            </div>
          </TabsContent>

          {/* Tab 2: Tendências */}
          <TabsContent value="tendencias" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-10">
              {/* Top Statistics Cards */}
              <FollowersTrendCards />

              {/* Layout for Chart & Details side-by-side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 relative">
                  <FollowersTrendChart delay={0.2} />
                </div>
                <div className="lg:col-span-1 border-l border-border/20 pl-0 lg:pl-2">
                  <FollowersDetailsPanel delay={0.3} />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Tab 3: Público potencial */}
          <TabsContent value="potencial" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
            <AnimatedCard className="p-12 flex flex-col items-center justify-center text-center min-h-[400px] bg-muted/20 border-border/40">
              <UsersRound className="w-12 h-12 text-primary/20 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Análise de Potencial</h3>
              <p className="text-muted-foreground max-w-md">Descubra novos nichos semelhantes à sua audiência atual que você ainda não alcançou.</p>
            </AnimatedCard>
          </TabsContent>

        </Tabs>

      </main>
    </div>
  );
}
