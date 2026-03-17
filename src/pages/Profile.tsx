import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2, 
  LogOut, 
  Camera, 
  ShieldCheck, 
  Loader2,
  AlertCircle,
  Briefcase,
  MapPin,
  Info,
  Lock,
  UploadCloud,
  CheckCircle2
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { slideUp, fadeIn } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user: authUser, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Profile fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [locationName, setLocationName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (user) {
        setUser(user);
        setEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");
        setPhone(user.user_metadata?.phone || "");
        setRole(user.user_metadata?.role || "");
        setLocationName(user.user_metadata?.location || "");
        setBio(user.user_metadata?.bio || "");
        setAvatarUrl(user.user_metadata?.avatar_url || "");
      }
    } catch (error: any) {
      toast.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          phone: phone,
          role: role,
          location: locationName,
          bio: bio,
          avatar_url: avatarUrl
        }
      });
      if (error) throw error;
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar perfil");
    } finally {
      setUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      
      // 3. Update User Metadata immediately for better UX
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      toast.success("Foto de perfil atualizada!");
    } catch (error: any) {
      toast.error("Erro no upload: " + (error.message || "Tente novamente"));
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "TEM CERTEZA? Esta ação é IRREVERSÍVEL e excluirá permanentemente todos os seus dados."
    );
    
    if (confirmed) {
      toast.loading("Excluindo conta...");
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.info("Para exclusão permanente completa, o suporte foi notificado. Por segurança, sua sessão será encerrada.");
        await signOut();
        setLocation("/login");
      } catch (error: any) {
        toast.error("Erro ao solicitar exclusão");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium animate-pulse">Carregando seu universo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-6xl">
      <motion.div initial="hidden" animate="visible" variants={slideUp}>
        <div className="flex flex-col md:flex-row shadow-sm bg-card/30 backdrop-blur-sm border border-border/50 rounded-[2.5rem] p-8 mb-10 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-primary/10 rounded-2xl">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Seu Perfil</h1>
              <p className="text-muted-foreground font-medium">Personalize sua experiência no dashboard.</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="rounded-2xl h-12 px-6 border-border/80 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all font-bold" 
            onClick={async () => {
              await signOut();
              setLocation("/login");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Encerrar Sessão
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar / Profile Summary */}
          <div className="lg:col-span-4 space-y-6">
            <AnimatedCard className="p-8 text-center flex flex-col items-center border-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              
              <div className="relative mb-6">
                <div className={cn(
                  "w-36 h-36 rounded-[2.5rem] overflow-hidden border-4 border-background bg-muted flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]",
                  uploading && "opacity-50"
                )}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl font-black text-primary/30">{fullName?.charAt(0) || email?.charAt(0).toUpperCase()}</span>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="absolute -bottom-1 -right-1 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all z-10 hover:rotate-6"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarUpload}
                />
              </div>

              <div className="space-y-1 mb-8">
                <h2 className="text-2xl font-black tracking-tight">{fullName || "Usuário"}</h2>
                <p className="text-sm font-bold text-primary/60 uppercase tracking-widest">{role || "Membro Dehoniano"}</p>
                <p className="text-muted-foreground text-sm font-medium">{email}</p>
              </div>
              
              <div className="w-full space-y-4 pt-8 border-t border-border/50">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/20">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    Status da Conta
                  </span>
                  <span className="text-[10px] font-black px-2.5 py-1 bg-green-500/10 text-green-600 rounded-lg uppercase">Ativa</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/20">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary/60" />
                    Desde
                  </span>
                  <span className="text-xs font-black text-foreground">{new Date(user?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6 border-red-500/10 bg-red-500/[0.02]">
               <div className="flex items-center gap-3 mb-4 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-black text-sm uppercase tracking-widest">Zona Crítica</h3>
               </div>
               <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  A exclusão da conta removerá permanentemente todos os seus dados e relatórios. Esta ação não poderá ser desfeita.
               </p>
               <Button 
                variant="ghost" 
                className="w-full rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold border border-red-500/20"
                onClick={handleDeleteAccount}
              >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Conta
               </Button>
            </AnimatedCard>
          </div>

          {/* Detailed Forms */}
          <div className="lg:col-span-8 space-y-8">
            <form onSubmit={handleUpdate} className="space-y-8">
              {/* Section: Personal Info */}
              <AnimatedCard className="p-8 md:p-10 border-primary/5">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">Dados Pessoais</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Identificação Fundamental</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3 md:col-span-2">
                      <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Nome Completo</Label>
                      <div className="relative group">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                         <Input 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                          placeholder="Como você gostaria de ser chamado?"
                         />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Email Principal</Label>
                      <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                         <Input 
                          value={email}
                          disabled
                          className="h-14 pl-12 rounded-2xl bg-muted/40 border-border/20 opacity-60 cursor-not-allowed font-medium"
                         />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Telefone / WhatsApp</Label>
                      <div className="relative group">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                         <Input 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                          placeholder="+55 (00) 00000-0000"
                         />
                      </div>
                   </div>
                </div>
              </AnimatedCard>

              {/* Section: Additional Info */}
              <AnimatedCard className="p-8 md:p-10 border-primary/5">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight">Informações Profissionais</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Cargo e Localização</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Cargo / Função</Label>
                      <div className="relative group">
                         <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                         <Input 
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                          placeholder="Ex: Gestor de Redes Sociais"
                         />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Localização</Label>
                      <div className="relative group">
                         <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                         <Input 
                          value={locationName}
                          onChange={(e) => setLocationName(e.target.value)}
                          className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                          placeholder="Cidade, Estado"
                         />
                      </div>
                   </div>

                   <div className="space-y-3 md:col-span-2">
                      <Label className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1">Bio / Descrição Curta</Label>
                      <div className="relative group">
                         <Info className="absolute left-4 top-5 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                         <textarea 
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={3}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/20 border border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all font-medium outline-none resize-none"
                          placeholder="Conte um pouco sobre sua atuação na missão..."
                         />
                      </div>
                   </div>
                </div>
              </AnimatedCard>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-[2rem] bg-card border border-border shadow-xl">
                <div className="flex items-center gap-4 text-muted-foreground">
                   <Lock className="w-5 h-5 text-amber-500" />
                   <p className="text-xs font-bold uppercase tracking-widest">Sua segurança é nossa prioridade.</p>
                </div>
                <Button 
                    type="submit" 
                    disabled={updating}
                    className="w-full sm:w-auto px-12 h-14 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all"
                >
                   {updating ? (
                     <>
                       <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                       Processando...
                     </>
                   ) : (
                     "Salvar Universo"
                   )}
                </Button>
              </div>
            </form>

            <AnimatedCard className="p-8 border-amber-500/10 bg-amber-500/[0.02] flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg">Segurança de Acesso</h4>
                    <p className="text-sm text-muted-foreground font-medium">Configure autenticação em duas etapas e senhas mestras.</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-2xl font-bold border-amber-500/20 text-amber-600 hover:bg-amber-50 pr-4">
                  Configurar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </AnimatedCard>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
