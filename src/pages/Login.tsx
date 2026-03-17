import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
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
            },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        
        if (error) throw error;

        toast.success("Verifique seu e-mail para o código de 8 dígitos!");
        setLocation(`/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast.success("Bem-vindo de volta!");
        setLocation("/dashboard");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Erro desconhecido. Verifique seus dados.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Erro ao conectar com Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] font-['Outfit'] text-foreground overflow-x-hidden relative selection:bg-amber-500/30">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-amber-500/10 blur-[150px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[150px]"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={isSignUp ? "signup" : "login"}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.02, y: -10 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-[500px] mx-4 py-8"
        >
          <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/[0.04] backdrop-blur-[30px] border border-white/[0.08] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col items-center">
            
            {/* Branding */}
            <div className="flex flex-col items-center mb-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mb-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-all" />
                <img src="/logo1.png" alt="Logo" className="w-9 h-9 object-contain relative z-10 brightness-110" />
              </div>
              
              <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-3">
                Painel Analytics Dehon
              </h1>
              
              <p className="text-amber-200/60 text-base italic font-['Crimson_Text'] tracking-wide">
                “Tudo por Ele, tudo com Ele, tudo n’Ele.”
              </p>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
              className="w-full h-14 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white font-bold flex items-center justify-center gap-3 transition-all mb-8 shadow-sm group active:scale-95"
            >
              {googleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Continuar com Google</span>
                </>
              )}
            </Button>

            <div className="flex items-center w-full gap-4 mb-8">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-[10px] text-white/20 font-black uppercase tracking-widest leading-none">Ou utilize seu e-mail</span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            <form onSubmit={handleAuth} className="w-full space-y-5">
              {isSignUp && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Nome Completo</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-amber-500 transition-colors" />
                      <Input 
                        id="name"
                        placeholder="Ex: Frater Utxica"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={isSignUp}
                        className="h-14 pl-12 rounded-2xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:bg-white/[0.06] focus:border-amber-500/40 transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Telefone</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-amber-500 transition-colors" />
                      <Input 
                        id="phone"
                        placeholder="+55 (00) 00000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required={isSignUp}
                        className="h-14 pl-12 rounded-2xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:bg-white/[0.06] focus:border-amber-500/40 transition-all outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Seu E-mail</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-amber-500 transition-colors" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:bg-white/[0.06] focus:border-amber-500/40 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sua Senha</Label>
                  {!isSignUp && (
                    <button type="button" className="text-[10px] font-black text-amber-500/60 hover:text-amber-400 transition-colors uppercase tracking-widest">
                      Esqueceu?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-amber-500 transition-colors" />
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 pl-12 pr-12 rounded-2xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:bg-white/[0.06] focus:border-amber-500/40 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-white/20 hover:text-amber-500 transition-colors z-10"
                    title={showPassword ? "Ocultar senha" : "Ver senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-15 rounded-2xl bg-amber-500 hover:bg-amber-600 text-[#050505] font-black text-lg shadow-xl shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 mt-4 group"
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                ) : (
                  <div className="flex items-center justify-center gap-2 uppercase tracking-widest">
                    <span>{isSignUp ? "Criar Conta" : "Entrar No Painel"}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-10 text-center w-full">
              <button 
                type="button"
                onClick={() => {
                   setIsSignUp(!isSignUp);
                   setShowPassword(false);
                }}
                className="text-[11px] font-black text-white/30 hover:text-white transition-colors uppercase tracking-[0.2em] py-4"
              >
                {isSignUp ? (
                  <>Já é um membro? <span className="text-amber-500">Faça login</span></>
                ) : (
                  <>Ainda não tem acesso? <span className="text-amber-500">Crie sua conta</span></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mb-8 opacity-40 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white">Painel Analítico · Conventinho SCJ</p>
      </div>
    </div>
  );
}
