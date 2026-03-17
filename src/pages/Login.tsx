import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, Loader2, ArrowRight, User, Phone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { fadeIn } from "@/lib/animations";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#121212] font-sans text-foreground overflow-hidden relative">
      {/* Background Decorative Elements - Spheres */}
      <motion.div 
        animate={{ 
          y: [0, -40, 0],
          x: [0, 20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[15%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] shadow-[0_0_80px_rgba(255,215,0,0.3)] z-0"
      />
      
      <motion.div 
        animate={{ 
          y: [0, 50, 0],
          x: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[10%] left-[10%] w-24 h-24 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-[#FFD700] to-[#CCAC00] shadow-[0_0_60px_rgba(255,215,0,0.2)] z-0"
      />

      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[150%] h-[150%] pointer-events-none z-0 overflow-hidden"
      >
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_0%,transparent_70%)]" />
      </motion.div>

      {/* Main Glass Card */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative z-10 w-full max-w-[440px] px-6 py-10 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-[30px] border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center mx-4"
      >
        {/* Header section inspired by the reference image */}
        <div className="flex flex-col items-center mb-8 gap-2">
           <img src="/logo1.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
           <h1 className="text-white text-2xl font-bold tracking-tight text-center">
              Painel Analítico <br />
              <span className="text-xs uppercase tracking-[0.4em] text-white/40 font-medium">Glassmorphism Dashboard</span>
           </h1>
        </div>

        <div className="w-full">
           <div className="mb-6 flex justify-between items-end">
              <h2 className="text-[#FFA500] text-xl font-bold tracking-wide italic">
                {isSignUp ? "Register" : "Login"}
              </h2>
              {/* Optional smaller branding */}
           </div>

           <form onSubmit={handleAuth} className="space-y-5">
             {isSignUp && (
               <div className="space-y-4">
                 <div className="space-y-1.5">
                   <Input 
                     id="name"
                     placeholder="your name here"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     required
                     className="h-12 rounded-xl bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:bg-white/15 focus:border-white/20 transition-all text-sm"
                   />
                 </div>
                 <div className="space-y-1.5">
                   <Input 
                     id="phone"
                     placeholder="your phone here"
                     value={phone}
                     onChange={(e) => setPhone(e.target.value)}
                     required
                     className="h-12 rounded-xl bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:bg-white/15 focus:border-white/20 transition-all text-sm"
                   />
                 </div>
               </div>
             )}

             <div className="space-y-1.5">
               <Input 
                 id="email"
                 type="email"
                 placeholder="your mail here"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 className="h-12 rounded-xl bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:bg-white/15 focus:border-white/20 transition-all text-sm"
               />
             </div>

             <div className="space-y-1.5">
               <Input 
                 id="password"
                 type="password"
                 placeholder="your password here"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 className="h-12 rounded-xl bg-white/10 border-white/10 text-white placeholder:text-white/30 focus:bg-white/15 focus:border-white/20 transition-all text-sm"
               />
               {!isSignUp && (
                 <div className="flex justify-end">
                    <a href="#" className="text-[10px] font-medium text-[#FFA500]/70 hover:text-[#FFA500] transition-colors">forgot your password</a>
                 </div>
               )}
             </div>

             <Button 
               type="submit" 
               disabled={loading}
               className="w-full mt-2 h-12 rounded-xl bg-[#D4AF37]/90 hover:bg-[#D4AF37] text-[#121212] font-heavy text-base shadow-xl shadow-black/20 hover:scale-[1.02] transition-all active:scale-[0.98] border-none"
             >
               {loading ? (
                 <Loader2 className="h-5 w-5 animate-spin mx-auto" />
               ) : (
                 <span className="font-bold">{isSignUp ? "Sign Up" : "Login"}</span>
               )}
             </Button>
           </form>

           <div className="mt-8 text-center">
             <button 
               onClick={() => setIsSignUp(!isSignUp)}
               className="text-[11px] font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest"
             >
               {isSignUp ? (
                 <span>Already have an account? <span className="text-[#FFA500]">Login here</span></span>
               ) : (
                 <span>Don't have an account? <span className="text-[#FFA500]">Create one</span></span>
               )}
             </button>
           </div>
        </div>
      </motion.div>
      
      {/* Decorative Noise or leaf pattern if needed, but let's keep it clean like the spheres */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/leaf.png')] pointer-events-none" />
    </div>
  );
}
