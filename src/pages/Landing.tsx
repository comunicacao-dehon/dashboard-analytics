import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  BrainCircuit, 
  TrendingUp, 
  Share2, 
  ArrowRight,
  CheckCircle2,
  Users,
  Activity,
  ChevronRight
} from "lucide-react";

export default function Landing() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-foreground overflow-hidden relative selection:bg-primary/30">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-dark border-b border-white/5 transition-all">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Activity size={18} className="text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight">Analytics<span className="text-primary">.ai</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#beneficios" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#preview" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
            <a href="#depoimentos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Clientes</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer text-muted-foreground">Entrar</span>
            </Link>
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all rounded-full px-6">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-16 pb-24 flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-dark text-xs sm:text-sm text-primary mb-8 border-primary/20 shadow-lg"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            V2.0 Disponível Agora
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mb-6"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            Evolução da <span className="text-gradient-primary">Performance Digital</span> com Inteligência Artificial
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            Centralize os dados do seu Instagram, Facebook e YouTube. Tome decisões rápidas com insights gerados por IA e aumente seu engajamento real.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 items-center"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-14 text-base shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all">
                Começar Gratuitamente <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 h-14 text-base glass-dark border-white/10 hover:bg-white/5 transition-all">
              Ver Demonstração <ChevronRight className="ml-1 w-5 h-5 text-muted-foreground" />
            </Button>
          </motion.div>
        </section>

        {/* Dashboard Preview */}
        <section id="preview" className="container mx-auto px-4 py-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl md:rounded-3xl glass-dark border border-white/10 p-2 sm:p-4 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Dashboard Mockup Wrapper */}
            <div className="w-full aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/5 relative flex flex-col">
              {/* Fake Dashboard Header */}
              <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-black/40">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <div className="h-4 w-32 bg-white/5 rounded-full" />
                <div className="w-6 h-6 rounded-full bg-white/10" />
              </div>
              
              {/* Fake Dashboard Content */}
              <div className="flex-1 p-6 flex flex-col gap-6">
                <div className="h-8 w-48 bg-white/10 rounded-md" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-28 rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col justify-between">
                      <div className="h-4 w-20 bg-white/10 rounded-full" />
                      <div className="h-8 w-24 bg-primary/20 rounded-md" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 rounded-xl bg-white/5 border border-white/5 p-4">
                    <div className="h-4 w-32 bg-white/10 rounded-full mb-6" />
                    {/* Fake Chart */}
                    <div className="h-40 w-full flex items-end gap-2 px-2">
                       {[40, 70, 45, 90, 65, 80, 50, 100].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/40 rounded-t-sm transition-all" style={{ height: `${h}%` }} />
                       ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col gap-4">
                    <div className="h-4 w-24 bg-white/10 rounded-full" />
                    <div className="h-10 w-full bg-white/5 rounded-md" />
                    <div className="h-10 w-full bg-white/5 rounded-md" />
                    <div className="h-10 w-full bg-white/5 rounded-md" />
                  </div>
                </div>
              </div>

              {/* Overlay glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
            </div>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-64 h-64 bg-primary/30 blur-[100px] rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section id="beneficios" className="container mx-auto px-4 py-24 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Feito para <span className="text-primary">Creator Analytics</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Tudo que você precisa para entender sua audiência e crescer suas redes de forma estruturada e inteligente.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: BarChart3, title: "Analytics Inteligente", desc: "Métricas unificadas em dashboards rápidos e fáceis de entender." },
              { icon: BrainCircuit, title: "Insights com IA", desc: "A inteligência artificial analisa seus dados e sugere ações." },
              { icon: TrendingUp, title: "Crescimento Acelerado", desc: "Acompanhe e preveja tendências para crescer de forma constante." },
              { icon: Share2, title: "Integração Multicanal", desc: "Conecte Instagram, Facebook e YouTube com apenas um clique." }
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                variants={fadeIn}
                className="glass-dark border border-white/5 p-8 rounded-2xl hover:border-primary/30 transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Social Proof */}
        <section id="depoimentos" className="container mx-auto px-4 py-24 relative z-10 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Junte-se a <span className="text-primary">+10.000 users</span> que estão escalando.</h2>
              <ul className="space-y-4 mb-8">
                {[
                  "Relatórios automáticos toda semana",
                  "Agrupamento de métricas essenciais",
                  "Acesso a suporte especializado e IA"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary w-5 h-5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button variant="outline" className="glass-dark rounded-full px-6 h-12">
                  Criar minha conta gratuita
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-col gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="glass-dark border border-white/10 p-6 rounded-2xl hover:border-primary/30 transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.05)] group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-orange-600 p-0.5 group-hover:scale-110 transition-transform">
                      <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{i === 1 ? "João Silva" : "Maria Santos"}</h4>
                      <p className="text-xs text-primary/80">Especialista de Marketing</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 italic font-medium">"{i === 1 ? "O Analytics.ai mudou completamente como entregamos resultados. A análise por IA é impressionante e super precisa." : "Excelente plataforma. Centralizou todo nosso trabalho e agora não perdemos horas montando planilhas manuais."}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 glass-dark py-12 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="text-primary w-6 h-6" />
            <span className="font-bold text-lg">Analytics<span className="text-primary">.ai</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Termos</a>
            <a href="#" className="hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="hover:text-primary transition-colors">Contato</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Analytics.ai. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
