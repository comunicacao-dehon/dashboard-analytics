import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { slideUp, fadeIn } from "@/lib/animations";

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
    if (otp.length !== 6) return;

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
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-foreground">Verificado!</h2>
          <p className="text-muted-foreground">Sua conta foi ativada. Redirecionando...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] dark:bg-[#0A0A0B] p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-md relative z-10"
      >
        <button 
          onClick={() => setLocation("/login")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar para o login
        </button>

        <div className="bg-white dark:bg-card border border-border/50 shadow-2xl rounded-[2.5rem] p-10 md:p-12">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
            <Mail className="w-7 h-7 text-primary" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight mb-3 text-foreground">Verifique seu e-mail</h1>
          <p className="text-muted-foreground leading-relaxed mb-10">
            Enviamos um código de 6 dígitos para o e-mail <span className="text-foreground font-bold">{email}</span>. Insira-o abaixo para ativar sua conta.
          </p>

          <form onSubmit={handleVerify} className="space-y-10">
            <div className="flex justify-center">
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={setOtp}
                onComplete={() => handleVerify()}
                autoFocus
              >
                <InputOTPGroup className="gap-2 sm:gap-4">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot 
                      key={i} 
                      index={i} 
                      className="w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold bg-muted/30 border-border/60 rounded-xl focus:ring-4 focus:ring-primary/10"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-2xl transition-all duration-300 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Código"
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
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
                className="text-primary font-bold hover:underline underline-offset-4"
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
