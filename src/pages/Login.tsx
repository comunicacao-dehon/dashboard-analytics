import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, User, Phone, Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
            }
          }
        });
        if (error) throw error;
        toast.success("Código enviado! Verifique seu e-mail.");
        setLocation(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        await new Promise(resolve => setTimeout(resolve, 800));
        toast.success("Bem-vindo de volta!");
        setLocation("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro na autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] font-sans text-foreground overflow-hidden relative selection:bg-amber-500/30">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft Organic Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [-50, 50, -50],
            y: [-20, 40, -20]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px]"
        />
        
        <motion.div 
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.05, 0.1, 0.05],
            x: [30, -30, 30],
            y: [20, -20, 20]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[130px]"
        />

        {/* Golden Spheres Inspired by Dehon Branding */}
        <motion.div 
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[12%] w-32 h-32 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-[0_0_80px_rgba(212,175,55,0.15)] opacity-80"
        />
        
        <motion.div 
          animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-[18%] left-[8%] w-24 h-24 md:w-44 md:h-44 rounded-full bg-gradient-to-tr from-amber-500/80 to-amber-700/80 shadow-[0_0_60px_rgba(212,175,55,0.1)] opacity-60"
        />

        {/* Subtle Texture Noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay" />
      </div>

      {/* Main Glassmorphism Container */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={isSignUp ? "signup" : "login"}
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-[480px] mx-4"
        >
          <div className="p-10 md:p-14 rounded-[2.5rem] bg-white/[0.06] backdrop-blur-[25px] border border-white/[0.12] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] flex flex-col items-center">
            
            {/* Branding Header */}
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-6 shadow-inner backdrop-blur-md relative group">
                <div className="absolute inset-0 bg-amber-500/10 blur-xl opacity-50 rounded-2xl" />
                <img src="/logo1.png" alt="Logo" className="w-9 h-9 object-contain relative z-10 brightness-110 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" />
              </div>
              
              <h1 className="text-white text-3xl font-medium tracking-tight mb-4">
                Painel Analytics Dehon
              </h1>
              
              <div className="relative">
                <p className="text-amber-200/80 text-lg italic font-serif leading-relaxed px-4 tracking-wide">
                  “Tudo por Ele, tudo com Ele, <br className="hidden sm:block" /> tudo n’Ele.”
                </p>
                <span className="block text-[10px] uppercase tracking-[0.3em] font-medium text-white/30 mt-3">— Pe. Leão Dehon</span>
              </div>
            </div>

            <form onSubmit={handleAuth} className="w-full space-y-6">
              {isSignUp && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-2">Nome Completo</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-amber-500 transition-colors" />
                      <Input 
                        id="name"
                        placeholder="Seu nome aqui"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="h-14 pl-12 rounded-2xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/20 focus:bg-white/[0.07] focus:border-amber-500/40 focus:ring-4 focus:ring-amber-500/5 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-2">Telefone</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-amber-500 transition-colors" />
                      <Input 
                        id="phone"
                        placeholder="(00) 00000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="h-14 pl-12 rounded-2xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/20 focus:bg-white/[0.07] focus:border-amber-500/40 focus:ring-4 focus:ring-amber-500/5 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-2">Seu Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-amber-500 transition-colors" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/20 focus:bg-white/[0.07] focus:border-amber-500/40 focus:ring-4 focus:ring-amber-500/5 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <Label htmlFor="password" title="password" className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Sua Senha</Label>
                  {!isSignUp && (
                    <a href="#" className="text-[10px] font-bold text-amber-500/60 hover:text-amber-400 transition-colors uppercase tracking-widest decoration-dotted underline-offset-4 hover:underline">
                      Esqueceu?
                    </a>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-amber-500 transition-colors" />
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl bg-white/[0.04] border-white/[0.1] text-white placeholder:text-white/20 focus:bg-white/[0.07] focus:border-amber-500/40 focus:ring-4 focus:ring-amber-500/5 transition-all"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-15 rounded-2xl bg-[#D4AF37] hover:bg-[#C5A028] text-[#050505] font-bold text-lg shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] border-none mt-4 group"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#050505]" />
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="uppercase tracking-[0.2em] font-black">{isSignUp ? "Criar Conta" : "Entrar"}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-12 text-center pt-8 border-t border-white/5 w-full">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[11px] font-bold text-white/30 hover:text-white transition-colors uppercase tracking-[0.25em] group"
              >
                {isSignUp ? (
                  <>Já possui acesso? <span className="text-amber-500/80 group-hover:text-amber-400 transition-colors font-black">Entrar aqui</span></>
                ) : (
                  <>Ainda não tem conta? <span className="text-amber-500/80 group-hover:text-amber-400 transition-colors font-black">Criar conta</span></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer Quote */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-10 md:mt-14 relative z-10 text-center"
      >
        <p className="text-white/60 text-xs italic tracking-widest font-serif">
          “A nossa vocação é o amor.”
        </p>
        <span className="block text-[8px] uppercase tracking-[0.4em] text-white/40 mt-2">— Pe. Leão Dehon</span>
      </motion.div>

      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] pointer-events-none mix-blend-overlay" />
    </div>
  );
}
