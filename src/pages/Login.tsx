import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Loader2, ArrowRight, Instagram, Facebook, Youtube } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { slideUp, fadeIn } from "@/lib/animations";

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Simulando delay para UI premium
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      toast.success("Login realizado com sucesso!");
      setLocation("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-sans">
      {/* Brand Section (Column A) - Desktop Only */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-[#0A0A0B]">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
          <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-pink-500/10 blur-[100px] rounded-full [animation-delay:4s]" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-12 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
              <img src="/logo.png.png" alt="Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">Painel Analítico</span>
          </div>

          <div className="max-w-md">
            <motion.div initial="hidden" animate="visible" variants={slideUp}>
              <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
                Domine sua presença <span className="text-gradient-primary">Digital</span> em um só lugar.
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Análise de dados avançada para Instagram, Facebook e YouTube com o design mais premium do mercado.
              </p>

              <div className="grid grid-cols-3 gap-6 opacity-60">
                <div className="flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                    <Instagram className="w-4 h-4 text-pink-500" />
                  </div>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Instagram</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Facebook className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Facebook</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30">
                    <Youtube className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">YouTube</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="text-gray-500 text-xs flex items-center gap-4">
            <span>© 2026 Painel Analítico. Todos os direitos reservados.</span>
          </div>
        </div>
      </div>

      {/* Login Section (Column B) */}
      <div className="flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Mobile Background Glows */}
        <div className="lg:hidden absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-primary/10 blur-[80px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px] relative z-10"
        >
          {/* Logo - Mobile/Tablet only */}
          <div className="lg:hidden flex flex-col items-center mb-10">
             <div className="w-16 h-16 rounded-2xl bg-primary shadow-lg shadow-primary/20 flex items-center justify-center mb-4">
                <img src="/logo.png.png" alt="Logo" className="w-10 h-10 object-contain invert grayscale brightness-200" />
             </div>
             <h2 className="text-2xl font-bold tracking-tight">Painel Analítico</h2>
             <p className="text-muted-foreground text-sm">Bem-vindo de volta!</p>
          </div>

          <div className="mb-8 hidden lg:block">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Login</h2>
            <p className="text-muted-foreground">Acesse seu painel analítico hoje.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold ml-1">Email</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground transition-colors group-focus-within:text-primary">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="exemplo@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-11 h-12 rounded-xl bg-muted/30 border-border/60 hover:border-primary/40 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" title="password" className="text-sm font-semibold">Senha</Label>
                  <a href="#" className="text-xs font-bold text-primary hover:underline underline-offset-4">Esqueci minha senha</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground transition-colors group-focus-within:text-primary">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-11 h-12 rounded-xl bg-muted/30 border-border/60 hover:border-primary/40 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-1">
              <Checkbox id="remember" className="rounded-md border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
              <Label htmlFor="remember" className="text-sm font-medium text-muted-foreground cursor-pointer select-none">Lembrar de mim</Label>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground italic">
            "Dados transformados em inteligência estratégica."
          </p>
        </motion.div>
      </div>
    </div>
  );
}
