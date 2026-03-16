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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-sans text-foreground overflow-hidden">
      {/* Brand Section (Column A) - Minimalist & Sophisticated */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-[#0A0A0B]">
        {/* Subtle dynamic background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full [animation-delay:4s]" />
          {/* Noise effect */}
          <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-16 justify-between">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-[0_8px_16px_rgba(0,0,0,0.3)]">
              <img src="/logo1.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">Painel <span className="text-white/40 font-medium">Analítico</span></span>
          </motion.div>

          <div className="max-w-lg">
            <motion.div initial="hidden" animate="visible" variants={slideUp}>
              <h1 className="text-5xl font-bold text-white leading-[1.15] tracking-tight mb-6">
                Dados que inspiram <br />
                <span className="text-primary italic">estratégias reais.</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-sm">
                Acesse insights profundos e transforme a maneira como você gerencia sua presença digital.
              </p>

              {/* Refined social icons */}
              <div className="flex items-center gap-6 pt-8 border-t border-white/5">
                {[
                  { icon: Instagram, color: "text-pink-500", label: "Instagram" },
                  { icon: Facebook, color: "text-blue-500", label: "Facebook" },
                  { icon: Youtube, color: "text-red-500", label: "YouTube" }
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 group cursor-default">
                    <s.icon className={`w-5 h-5 ${s.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{s.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="text-gray-500 text-xs font-medium tracking-wide">
            <span>© 2026 Painel Analítico. Sofisticação em análise de dados.</span>
          </div>
        </div>
      </div>

      {/* Login Section (Column B) */}
      <div className="flex items-center justify-center p-8 md:p-16 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Logo Mobile */}
          <div className="lg:hidden flex flex-col items-center mb-12">
             <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <img src="/logo1.png" alt="Logo" className="w-8 h-8 object-contain" />
             </div>
             <h2 className="text-2xl font-bold tracking-tight">Painel Analítico</h2>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              {isSignUp ? "Criar conta" : "Bem-vindo de volta"}
            </h2>
            <p className="text-muted-foreground">
              {isSignUp ? "Preencha os campos abaixo para começar." : "Acesse seu painel estratégico agora."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {isSignUp && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold ml-1">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="name"
                      placeholder="Ex: João Silva"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="pl-11 h-12 rounded-xl bg-muted/20 border-border/50 focus:bg-background transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold ml-1">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="phone"
                      placeholder="(00) 00000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="pl-11 h-12 rounded-xl bg-muted/20 border-border/50 focus:bg-background transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold ml-1">Email</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="nome@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-11 h-12 rounded-xl bg-muted/20 border-border/50 focus:bg-background transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" title="password" className="text-sm font-semibold">Senha</Label>
                {!isSignUp && <a href="#" className="text-xs font-bold text-primary hover:underline">Esqueceu a senha?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-11 h-12 rounded-xl bg-muted/20 border-border/50 focus:bg-background transition-all"
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center space-x-2 ml-1">
                <Checkbox id="remember" className="rounded-md border-border/50" />
                <Label htmlFor="remember" className="text-sm font-medium text-muted-foreground cursor-pointer select-none">Lembrar de mim</Label>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? "Criando conta..." : "Entrando..."}
                </>
              ) : (
                <>
                  {isSignUp ? "Cadastrar agora" : "Acessar dashboard"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {isSignUp ? (
                <span>Já tem conta? <span className="text-primary font-bold">Faça login</span></span>
              ) : (
                <span>Ainda não tem conta? <span className="text-primary font-bold">Crie uma agora</span></span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
