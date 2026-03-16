import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Loader2, ArrowRight, Instagram, Facebook, Youtube, User, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { slideUp, fadeIn } from "@/lib/animations";

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-sans text-foreground">
      {/* Brand Section (Column A) - Desktop Only */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-[#050505]">
        {/* Animated Ultra-Premium Background Mesh */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-15%] left-[-15%] w-[70%] h-[70%] bg-primary/25 blur-[140px] rounded-full animate-pulse opacity-60" />
          <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[70%] bg-blue-600/15 blur-[140px] rounded-full animate-pulse [animation-delay:3s] opacity-50" />
          <div className="absolute top-[20%] right-[5%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full [animation-delay:5s]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-16 justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-xl shadow-2xl relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-colors rounded-2xl" />
              <img src="/logo1.png" alt="Logo" className="w-8 h-8 object-contain relative z-10" />
            </div>
            <span className="text-white text-2xl font-black tracking-tighter uppercase italic">Painel <span className="text-primary/90">Analítico</span></span>
          </motion.div>

          <div className="max-w-xl">
            <motion.div initial="hidden" animate="visible" variants={slideUp}>
              <h1 className="text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-8">
                Domine sua presença <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-pink-500">Digital</span> com inteligência.
              </h1>
              <p className="text-gray-400 text-xl leading-relaxed mb-12 font-medium max-w-lg">
                Performance, engajamento e insights estratégicos para suas redes sociais em uma plataforma feita para quem busca o extraordinário.
              </p>

              <div className="flex flex-wrap gap-8 items-center border-t border-white/5 pt-12">
                {[
                  { icon: Instagram, label: "Instagram", color: "text-pink-500" },
                  { icon: Facebook, label: "Facebook", color: "text-blue-500" },
                  { icon: Youtube, label: "YouTube", color: "text-red-500" }
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 group cursor-default">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors shadow-inner">
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] group-hover:text-gray-300 transition-colors">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-between text-gray-500 text-[10px] font-bold uppercase tracking-widest opacity-60">
            <span>© 2026 Painel Analítico. Todos os direitos reservados.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            </div>
          </div>
        </div>
      </div>

      {/* Login Section (Column B) */}
      <div className="flex items-center justify-center p-8 md:p-16 lg:p-24 relative bg-[#FAFAFA] dark:bg-transparent">
        <div className="lg:hidden absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[100px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[460px] relative z-10"
        >
          {/* Logo - Mobile/Tablet only */}
          <div className="lg:hidden flex flex-col items-center mb-12">
             <div className="w-20 h-20 rounded-3xl bg-primary shadow-2xl shadow-primary/30 flex items-center justify-center mb-6">
                <img src="/logo1.png" alt="Logo" className="w-12 h-12 object-contain invert" />
             </div>
             <h2 className="text-3xl font-black tracking-tighter uppercase italic text-foreground">Painel <span className="text-primary">Analítico</span></h2>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-black tracking-tight mb-3">
              {isSignUp ? "Criar Conta" : "Bem-vindo"}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {isSignUp ? "Preencha seus dados e comece sua jornada estratégica." : "Entre para gerenciar seu império digital com dados reais."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {isSignUp && (
              <div className="grid grid-cols-1 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-black ml-1 text-gray-500 uppercase tracking-widest">Nome Completo</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="name"
                      placeholder="Seu Nome"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="pl-12 h-14 rounded-2xl bg-white dark:bg-muted/30 border-border/80 hover:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-black ml-1 text-gray-500 uppercase tracking-widest">Telefone</Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="pl-12 h-14 rounded-2xl bg-white dark:bg-muted/30 border-border/80 hover:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black ml-1 text-gray-500 uppercase tracking-widest">Email profissional</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <Input 
                  id="email"
                  type="email"
                  placeholder="voce@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-12 h-14 rounded-2xl bg-white dark:bg-muted/30 border-border/80 hover:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" title="password" className="text-xs font-black text-gray-500 uppercase tracking-widest">Sua Senha</Label>
                {!isSignUp && <a href="#" className="text-xs font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">Esqueceu?</a>}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-12 h-14 rounded-2xl bg-white dark:bg-muted/30 border-border/80 hover:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center space-x-2 ml-1 pb-2">
                <Checkbox id="remember" className="rounded-md border-border/80 data-[state=checked]:bg-primary" />
                <Label htmlFor="remember" className="text-sm font-medium text-muted-foreground cursor-pointer select-none">Mantenha-me conectado</Label>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-2xl text-lg font-black shadow-2xl shadow-primary/25 hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all bg-primary text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {isSignUp ? "Criar minha conta" : "Entrar no Painel"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center flex flex-col items-center gap-4">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors duration-300"
            >
              {isSignUp ? (
                <span>Já possui conta? <span className="text-primary underline underline-offset-4 font-black">Faça login agora</span></span>
              ) : (
                <span>Novo por aqui? <span className="text-primary underline underline-offset-4 font-black">Crie sua conta VIP</span></span>
              )}
            </button>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black opacity-30 mt-6 leading-relaxed">
              Leading Analysis for Digital Creators
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
