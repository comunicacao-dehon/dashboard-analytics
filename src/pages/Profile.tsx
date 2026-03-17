import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Edit3,
  X,
  CheckCircle2,
  ArrowRight
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
  const [isEditing, setIsEditing] = useState(false);
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
      setIsEditing(false);
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

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      
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
        {/* Header Dashboard Style */}
        <div className="flex flex-col md:flex-row shadow-sm bg-card/40 backdrop-blur-md border border-border/50 rounded-[2rem] p-6 mb-10 items-center justify-between gap-6 overflow-hidden relative">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{isEditing ? "Editar Perfil" : "Seu Perfil"}</h1>
              <p className="text-sm text-muted-foreground font-medium opacity-80">Personalize sua experiência no dashboard.</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="rounded-xl h-12 px-6 border-border/80 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all font-bold group" 
            onClick={async () => {
              await signOut();
              setLocation("/login");
            }}
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Encerrar Sessão
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <AnimatedCard className="p-10 text-center flex flex-col items-center border-primary/10 relative overflow-hidden group/card shadow-xl shadow-primary/5">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
              
              <div className="relative mb-8">
                <div className={cn(
                  "w-36 h-36 rounded-full overflow-hidden border-4 border-background bg-secondary flex items-center justify-center relative z-10 shadow-2xl transition-all duration-500 group-hover/card:scale-[1.03]",
                  uploading && "opacity-50"
                )}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl font-black text-primary/20">{fullName?.charAt(0) || email?.charAt(0).toUpperCase()}</span>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="absolute bottom-1 right-1 p-3 bg-background border border-border shadow-lg text-primary rounded-full hover:bg-primary hover:text-white active:scale-90 transition-all z-20 hover:rotate-12"
                  title="Alterar foto"
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
                <p className="text-xs font-black text-primary/60 uppercase tracking-[0.2em]">{role || "Membro Dehoniano"}</p>
                <p className="text-muted-foreground text-sm font-medium">{email}</p>
              </div>
              
              <div className="w-full space-y-3 pt-8 border-t border-border/40">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    Status
                  </span>
                  <span className="text-[10px] font-black px-3 py-1 bg-green-500/10 text-green-600 rounded-lg uppercase">Ativa</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-primary/50" />
                    Membro desde
                  </span>
                  <span className="text-[11px] font-black text-foreground">{new Date(user?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-6 border-red-500/10 bg-red-500/[0.02]">
               <div className="flex items-center gap-3 mb-4 text-red-500/70">
                  <AlertCircle className="w-4 h-4" />
                  <h3 className="font-bold text-[10px] uppercase tracking-[0.2em]">Zona de Perigo</h3>
               </div>
               <p className="text-[11px] text-muted-foreground mb-6 leading-relaxed">
                  A exclusão da conta é irreversível. Todos os seus dados serão deletados permanentemente.
               </p>
               <Button 
                variant="ghost" 
                className="w-full rounded-xl text-red-500/60 hover:bg-red-500 hover:text-white transition-all font-bold text-xs border border-red-500/10"
                onClick={handleDeleteAccount}
              >
                  Excluir Conta
               </Button>
            </AnimatedCard>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleUpdate} className="space-y-8">
                    {/* Dados Pessoais Form */}
                    <AnimatedCard className="p-10 border-primary/5 shadow-xl shadow-primary/5">
                      <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                            <User className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold tracking-tight">Dados Pessoais</h3>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Identificação Fundamental</p>
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          className="rounded-full w-10 h-10 p-0" 
                          onClick={() => setIsEditing(false)}
                        >
                          <X className="w-5 h-5 text-muted-foreground" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3 md:col-span-2">
                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nome Completo</Label>
                            <div className="relative group">
                               <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                               <Input 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                                placeholder="Seu nome aqui..."
                               />
                            </div>
                         </div>

                         <div className="space-y-3">
                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Principal</Label>
                            <div className="relative">
                               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/20" />
                               <Input 
                                value={email}
                                disabled
                                className="h-14 pl-12 rounded-2xl bg-muted/40 border-border/20 opacity-60 cursor-not-allowed font-medium text-muted-foreground"
                               />
                            </div>
                         </div>

                         <div className="space-y-3">
                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Telefone / WhatsApp</Label>
                            <div className="relative group">
                               <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
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

                    {/* Informações Profissionais Form */}
                    <AnimatedCard className="p-10 border-primary/5 shadow-xl shadow-primary/5">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold tracking-tight">Informações Profissionais</h3>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Cargo e Localização</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Cargo / Função</Label>
                            <div className="relative group">
                               <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                               <Input 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                                placeholder="Ex: Gestor de Redes"
                               />
                            </div>
                         </div>

                         <div className="space-y-3">
                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Localização</Label>
                            <div className="relative group">
                               <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                               <Input 
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                                className="h-14 pl-12 rounded-2xl bg-muted/20 border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                                placeholder="Cidade, Estado"
                               />
                            </div>
                         </div>

                         <div className="space-y-3 md:col-span-2">
                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Bio / Descrição Curta</Label>
                            <div className="relative group">
                               <Info className="absolute left-4 top-5 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                               <textarea 
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/20 border border-border/40 focus:bg-background focus:ring-4 focus:ring-primary/5 transition-all font-medium outline-none resize-none"
                                placeholder="Conte um pouco sobre sua atuação..."
                               />
                            </div>
                         </div>
                      </div>
                    </AnimatedCard>

                    <div className="flex gap-4">
                      <Button 
                          type="submit" 
                          disabled={updating}
                          className="flex-1 h-15 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-95 transition-all"
                      >
                         {updating ? <Loader2 className="h-5 w-5 animate-spin" /> : "Salvar Alterações"}
                      </Button>
                      <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="px-10 h-15 rounded-2xl font-bold border-border/60 hover:bg-muted"
                      >
                         Cancelar
                      </Button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="viewing"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Visual Display Card */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AnimatedCard className="p-10 md:col-span-2 border-primary/5 shadow-2xl shadow-primary/5 group relative">
                      <div className="flex items-center justify-between mb-12">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                              <User className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                               <h3 className="text-2xl font-black tracking-tight text-foreground">Sua Identidade</h3>
                               <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">Dados Públicos do Dashboard</p>
                            </div>
                         </div>
                         <Button 
                          onClick={() => setIsEditing(true)} 
                          className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/10 hover:-translate-y-1 transition-all"
                         >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Editar Perfil
                         </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                         <div className="space-y-2">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                               <User className="w-3 h-3" />
                               Nome Completo
                            </span>
                            <p className="text-xl font-bold text-foreground">{fullName || "—"}</p>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                               <Mail className="w-3 h-3" />
                               Email Principal
                            </span>
                            <p className="text-xl font-bold text-foreground">{email || "—"}</p>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                               <Phone className="w-3 h-3" />
                               Telefone
                            </span>
                            <p className="text-xl font-bold text-foreground">{phone || "—"}</p>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                               <Briefcase className="w-3 h-3" />
                               Cargo / Função
                            </span>
                            <p className="text-xl font-bold text-foreground">{role || "Membro"}</p>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                               <MapPin className="w-3 h-3" />
                               Localização
                            </span>
                            <p className="text-xl font-bold text-foreground">{locationName || "—"}</p>
                         </div>
                         <div className="space-y-2 sm:col-span-2">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                               <Info className="w-3 h-3" />
                               Biografia
                            </span>
                            <p className="text-lg font-medium text-muted-foreground leading-relaxed italic">
                              "{bio || "Nenhuma descrição informada."}"
                            </p>
                         </div>
                      </div>
                    </AnimatedCard>

                    {/* Secondary Access Card */}
                    <AnimatedCard className="p-8 border-amber-500/10 bg-amber-500/[0.02] flex flex-col justify-between group">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-amber-600" />
                          </div>
                          <h4 className="font-black text-sm uppercase tracking-widest text-amber-700">Acesso e Segurança</h4>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mb-8">Gerencie suas senhas e autenticação de dois fatores.</p>
                        <Button variant="outline" className="w-full rounded-xl font-bold border-amber-500/20 text-amber-700 hover:bg-amber-100/50">
                          Alterar Senha
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </AnimatedCard>

                    <AnimatedCard className="p-8 border-primary/10 bg-primary/[0.02] flex flex-col justify-between">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="font-black text-sm uppercase tracking-widest text-primary">Privacidade de Dados</h4>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mb-8">Veja como seus dados de redes sociais são processados.</p>
                        <Button variant="outline" className="w-full rounded-xl font-bold border-primary/20 text-primary hover:bg-primary/5">
                          Visualizar Termos
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </AnimatedCard>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
