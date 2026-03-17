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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] font-sans text-foreground overflow-hidden relative selection:bg-primary/30">
      {/* Dynamic Background Elements - Organic Blobs & Spheres */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Large Blue Blob */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [-100, 50, -100],
            y: [-50, 100, -50]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]"
        />
        
        {/* Large Purple Blob */}
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
            x: [100, -50, 100],
            y: [50, -100, 50]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[140px]"
        />

        {/* Golden Spheres (Reference Inspired) */}
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] right-[10%] w-32 h-32 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600 shadow-[0_0_100px_rgba(251,191,36,0.2)]"
        />
        
        <motion.div 
          animate={{ 
            y: [0, 40, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[15%] left-[5%] w-20 h-20 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 shadow-[0_0_80px_rgba(251,191,36,0.15)] opacity-80"
        />

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* Main Glassmorphism Container */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={isSignUp ? "signup" : "login"}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[460px] mx-4"
        >
          <div className="p-8 md:p-12 rounded-[3rem] bg-white/[0.04] backdrop-blur-[40px] border border-white/[0.08] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col items-center">
            
            {/* Branding / Logo */}
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-4 shadow-inner backdrop-blur-md relative group">
                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                <img src="/logo1.png" alt="Logo" className="w-8 h-8 object-contain relative z-10 brightness-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />
              </div>
              <h1 className="text-white text-3xl font-bold tracking-tight mb-1">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase max-w-[280px] leading-relaxed">
                Dados que inspiram estratégias reais
              </p>
            </div>

            <form onSubmit={handleAuth} className="w-full space-y-6">
              {isSignUp && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="name"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="h-14 pl-12 rounded-2xl bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/20 focus:bg-white/[0.08] focus:border-primary/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Phone Number</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="phone"
                        placeholder="+55 (00) 00000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="h-14 pl-12 rounded-2xl bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/20 focus:bg-white/[0.08] focus:border-primary/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/20 focus:bg-white/[0.08] focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" title="password" className="text-xs font-bold text-white/50 uppercase tracking-widest">Secret Password</Label>
                  {!isSignUp && (
                    <a href="#" className="text-[10px] font-bold text-amber-500/80 hover:text-amber-400 transition-colors uppercase tracking-wider">
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/20 focus:bg-white/[0.08] focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-[#050505] font-heavy text-lg shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] border-none mt-4 group"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-black italic uppercase tracking-wider">{isSignUp ? "Create My Account" : "Unlock Portal"}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-10 text-center">
              <button 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[10px] font-black text-white/30 hover:text-white transition-colors uppercase tracking-[0.3em] group"
              >
                {isSignUp ? (
                  <>Already a member? <span className="text-amber-500 group-hover:underline underline-offset-4 decoration-2">Sign In</span></>
                ) : (
                  <>New to the platform? <span className="text-amber-500 group-hover:underline underline-offset-4 decoration-2">Get Started</span></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Decorative leaf/organic pattern from reference */}
      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] pointer-events-none mix-blend-overlay" />
    </div>
  );
}
