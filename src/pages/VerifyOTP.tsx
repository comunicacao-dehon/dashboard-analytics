import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { fadeIn } from "@/lib/animations";

export default function VerifyOTP() {
  const [location, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [verified, setVerified] = useState(false);
  
  // Get email from query params
  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      setLocation("/login");
    }
  }, [email, setLocation]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.length !== 8) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (error) throw error;

      setVerified(true);
      toast.success("E-mail verificado com sucesso!");
      
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Código inválido ou expirado");
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-white">Verificado!</h2>
          <p className="text-white/60">Sua conta foi ativada. Redirecionando...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden font-['Outfit']">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-xl relative z-10"
      >
        <button 
          onClick={() => setLocation("/login")}
          className="flex items-center gap-2 text-sm font-medium text-white/40 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar para o login
        </button>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-10 md:p-14">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mb-8">
            <Mail className="w-7 h-7 text-amber-500" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">Verifique seu e-mail</h1>
          <p className="text-white/40 leading-relaxed mb-10">
            Enviamos um código de <span className="text-amber-500 font-bold">8 dígitos</span> para o e-mail <span className="text-white font-bold">{email}</span>. Insira-o abaixo para ativar sua conta.
          </p>

          <form onSubmit={handleVerify} className="space-y-10">
            <div className="flex justify-center overflow-x-auto pb-4">
              <InputOTP 
                maxLength={8} 
                value={otp} 
                onChange={setOtp}
                onComplete={() => handleVerify()}
                autoFocus
              >
                <InputOTPGroup className="gap-2 sm:gap-3">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <InputOTPSlot 
                      key={i} 
                      index={i} 
                      className="w-10 h-14 sm:w-12 sm:h-16 text-2xl font-black bg-white/[0.04] border-white/[0.1] text-white rounded-xl focus:ring-4 focus:ring-amber-500/10 transition-all"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
                type="submit"
                disabled={loading || otp.length !== 8}
                className="w-full h-15 rounded-2xl bg-amber-500 hover:bg-amber-600 text-[#050505] text-lg font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Ativar Conta"
              )}
            </Button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-white/5">
            <p className="text-sm text-white/30 uppercase tracking-[0.2em] font-bold">
              Não recebeu o código?{" "}
              <button 
                onClick={async () => {
                   toast.info("Reenviando código...");
                   const { error } = await supabase.auth.resend({
                      type: 'signup',
                      email: email,
                   });
                   if (error) toast.error(error.message);
                   else toast.success("Código enviado novamente!");
                }}
                className="text-amber-500 hover:text-amber-400 transition-colors"
              >
                Reenviar
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
