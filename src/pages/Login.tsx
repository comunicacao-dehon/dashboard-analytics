import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, User, Phone, Mail, Lock, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
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

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 20000)
    );

    try {
      if (isSignUp) {
        const signUpPromise = supabase.auth.signUp({
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

        const { error }: any = await Promise.race([signUpPromise, timeoutPromise]);
        
        if (error) throw error;

        toast.success("Verifique seu e-mail para o código de 6 dígitos!");
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
      if (error.message === "timeout") {
        toast.error("O servidor está demorando para responder. Isso geralmente acontece ao tentar enviar o e-mail de confirmação. Verifique as configurações de SMTP no painel do Supabase.", {
          duration: 8000
        });
      } else {
        const errorMessage = error?.message || "Erro desconhecido. Verifique seus dados e conexão.";
        toast.error(errorMessage);
        console.error("Auth error:", error);
      }
    } finally {
      setLoading(false);
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
          <div className="p-8 md:p-12 rounded-[2.5rem] bg-white/[0.04] backdrop-blur-[30px] border border-white/[0.08] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7)] flex flex-col items-center overflow-hidden">
            
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

            <form onSubmit={handleAuth} className="w-full space-y-5">
              {isSignUp && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5 pb-2"
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
                    <Label htmlFor="phone" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Telefone / WhatsApp</Label>
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
                <Label htmlFor="email" className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">E-mail Principal</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-amber-500 transition-colors" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl bg-white/[0.03] border-white/10 text-white placeholder:text-white/20 focus:bg-white/[0.06] focus:border-amber-500/40 transition-all outline-none border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" title="password" className="text-[10px] font-black text-white/40 uppercase tracking-widest">Sua Senha</Label>
                  {!isSignUp && (
                    <button type="button" className="text-[10px] font-black text-amber-500/60 hover:text-amber-400 transition-colors uppercase tracking-widest decoration-dotted underline-offset-4 hover:underline">
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
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#050505]" />
                    {isSignUp && <span className="text-xs animate-pulse text-[#050505]">Enviando código...</span>}
                  </div>
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

      {/* Alerta de confirmação de e-mail */}
      {isSignUp && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 max-w-[400px] text-center"
        >
          <div className="flex items-center gap-2 text-amber-500 mb-2 justify-center">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Confirmação Ativa</span>
          </div>
          <p className="text-[10px] text-white/50 leading-relaxed uppercase tracking-tighter">
            Verifique sempre a sua caixa de entrada ou spam pelo código de segurança de 6 dígitos.
          </p>
        </motion.div>
      )}

      <div className="mb-8 mt-10 opacity-40 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-white">Painel Analítico · Conventinho SCJ</p>
      </div>
    </div>
  );
}
