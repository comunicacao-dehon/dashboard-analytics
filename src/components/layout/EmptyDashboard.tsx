import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Instagram, Facebook, Youtube, PlusCircle, Activity, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyDashboard() {
  return (
    <div className="min-h-screen bg-transparent selection:bg-amber-500/20 font-['Outfit'] pb-20">
      {/* Background Glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-50 pointer-events-none -z-10 blur-3xl" />

      <main className="container pt-12 md:pt-24 flex flex-col items-center justify-center min-h-[80vh] text-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative"
        >
          <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
          <Activity className="w-8 h-8 text-amber-500 relative z-10" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
        >
          Bem-vindo à Utxica
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-white/50 max-w-xl mx-auto mb-12"
        >
          Seu painel analítico está vazio. Conecte suas redes sociais para começar a monitorar seu engajamento e obter relatórios com Inteligência Artificial.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          {/* Instagram Connect */}
          <div className="glass-dark border border-white/10 p-8 rounded-3xl flex flex-col items-center text-center hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] transition-all group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Instagram className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instagram</h3>
            <p className="text-sm text-white/40 mb-8">Conecte seu perfil comercial para analisar Reels, Stories e posts.</p>
            <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl h-12">
              <LinkIcon className="w-4 h-4 mr-2" />
              Vincular Conta
            </Button>
          </div>

          {/* Facebook Connect */}
          <div className="glass-dark border border-white/10 p-8 rounded-3xl flex flex-col items-center text-center hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1877f2] to-[#0a52b3] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Facebook className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Facebook</h3>
            <p className="text-sm text-white/40 mb-8">Gerencie o alcance da sua página e interações do público.</p>
            <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl h-12">
              <LinkIcon className="w-4 h-4 mr-2" />
              Vincular Conta
            </Button>
          </div>

          {/* YouTube Connect */}
          <div className="glass-dark border border-white/10 p-8 rounded-3xl flex flex-col items-center text-center hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] transition-all group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff0000] to-[#b30000] flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
              <Youtube className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">YouTube</h3>
            <p className="text-sm text-white/40 mb-8">Analise o desempenho dos seus vídeos longos e Shorts.</p>
            <Button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl h-12">
              <LinkIcon className="w-4 h-4 mr-2" />
              Vincular Conta
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/30"
        >
          <Activity className="w-4 h-4" />
          Nenhuma fonte de dados conectada
        </motion.div>
      </main>
    </div>
  );
}
