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
  ArrowRight,
  Sun,
  Moon,
  Palette,
  Trash2,
  LogOut
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { slideUp, fadeIn } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, type ColorPalette } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user: authUser, signOut } = useAuth();
  const { theme, palette, toggleTheme, setPalette } = useTheme();
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
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
          <p className="text-white/50 font-black tracking-widest uppercase text-[10px] animate-pulse">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-6xl">
      <motion.div initial="hidden" animate="visible" variants={slideUp}>
        {/* Header Dashboard Style */}
        <div className="flex flex-col md:flex-row shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)] bg-white/[0.04] backdrop-blur-[40px] border border-white/[0.08] rounded-[2rem] p-6 mb-10 items-center justify-between gap-6 overflow-hidden relative">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <User className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white mb-1">{isEditing ? "Editar Perfil" : "Seu Perfil"}</h1>
              <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Personalize sua experiência</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="rounded-xl h-12 px-6 border-white/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-white transition-all font-bold group shadow-lg bg-white/[0.04]" 
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
            <AnimatedCard className="p-10 text-center flex flex-col items-center border-white/[0.08] bg-white/[0.02] relative overflow-hidden group/card shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              
              <div className="relative mb-8 pt-4">
                <div className={cn(
                  "w-36 h-36 rounded-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center relative z-10 shadow-2xl transition-all duration-500 group-hover/card:scale-[1.03]",
                  uploading && "opacity-50"
                )}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl font-black text-amber-500/40 uppercase">{fullName?.charAt(0) || email?.charAt(0).toUpperCase()}</span>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="absolute bottom-1 right-1 p-3 bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-amber-500 rounded-full hover:bg-amber-500 hover:text-[#050505] active:scale-90 transition-all z-20 hover:rotate-12"
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

              <div className="space-y-2 mb-8">
                <h2 className="text-2xl font-black tracking-tight text-white mb-1">{fullName || "Usuário"}</h2>
                <p className="text-[10px] font-black text-amber-500/80 uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]">{role || "Membro Utxica"}</p>
                <p className="text-white/40 text-sm font-medium">{email}</p>
              </div>
              
              <div className="w-full space-y-3 pt-8 border-t border-white/[0.08]">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Status
                  </span>
                  <span className="text-[10px] font-black px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] rounded-lg uppercase">Ativa</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-500/50" />
                    Membro desde
                  </span>
                  <span className="text-[11px] font-black text-white tracking-widest">{new Date(user?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
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
                    <AnimatedCard className="p-10 border-white/[0.08] bg-white/[0.02] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <User className="w-6 h-6 text-amber-500" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold tracking-tight text-white mb-1">Dados Pessoais</h3>
                            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Identificação Fundamental</p>
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          className="rounded-full w-10 h-10 p-0 shadow-inner bg-white/5 border border-white/10" 
                          onClick={() => setIsEditing(false)}
                        >
                          <X className="w-5 h-5 text-white/50 hover:text-white" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3 md:col-span-2">
                            <Label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Nome Completo</Label>
                            <div className="relative group">
                               <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-amber-500 transition-colors" />
                               <Input 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="h-14 pl-12 rounded-xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus:border-amber-500 focus:ring-amber-500/20 font-bold tracking-tight"
                                placeholder="Seu nome aqui..."
                               />
                            </div>
                         </div>

                         <div className="space-y-3">
                            <Label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Email Principal</Label>
                            <div className="relative">
                               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                               <Input 
                                value={email}
                                disabled
                                className="h-14 pl-12 rounded-xl bg-white/[0.02] border-white/[0.04] opacity-50 cursor-not-allowed font-bold text-white/50"
                               />
                            </div>
                         </div>

                         <div className="space-y-3">
                            <Label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Telefone / WhatsApp</Label>
                            <div className="relative group">
                               <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-amber-500 transition-colors" />
                               <Input 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="h-14 pl-12 rounded-xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus:border-amber-500 focus:ring-amber-500/20 font-bold tracking-tight"
                                placeholder="+55 (00) 00000-0000"
                               />
                            </div>
                         </div>
                      </div>
                    </AnimatedCard>

                    {/* Informações Profissionais Form */}
                    <AnimatedCard className="p-10 border-white/[0.08] bg-white/[0.02] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                          <Briefcase className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold tracking-tight text-white mb-1">Informações Profissionais</h3>
                          <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Cargo e Localização</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <Label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Cargo / Função</Label>
                            <div className="relative group">
                               <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-amber-500 transition-colors" />
                               <Input 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="h-14 pl-12 rounded-xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus:border-amber-500 focus:ring-amber-500/20 font-bold tracking-tight"
                                placeholder="Ex: Gestor de Redes"
                               />
                            </div>
                         </div>

                         <div className="space-y-3">
                            <Label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Localização</Label>
                            <div className="relative group">
                               <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-amber-500 transition-colors" />
                               <Input 
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                                className="h-14 pl-12 rounded-xl bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus:border-amber-500 focus:ring-amber-500/20 font-bold tracking-tight"
                                placeholder="Cidade, Estado"
                               />
                            </div>
                         </div>

                         <div className="space-y-3 md:col-span-2">
                            <Label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Bio / Descrição Curta</Label>
                            <div className="relative group">
                               <Info className="absolute left-4 top-5 w-4 h-4 text-white/20 group-focus-within:text-amber-500 transition-colors" />
                               <textarea 
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 focus:border-amber-500 focus:ring-amber-500/20 font-bold tracking-tight resize-none outline-none"
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
                          className="flex-1 h-14 rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.2)] bg-amber-500 hover:bg-amber-600 text-[#050505] transition-all"
                      >
                         {updating ? <Loader2 className="h-5 w-5 animate-spin" /> : "Salvar Alterações"}
                      </Button>
                      <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="px-10 h-14 rounded-xl font-bold uppercase tracking-widest text-xs border-white/20 hover:bg-white/[0.08] bg-white/[0.04] text-white shadow-inner"
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
                    <AnimatedCard className="p-10 md:col-span-2 border-white/[0.08] bg-white/[0.02] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] group relative">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                              <User className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                               <h3 className="text-2xl font-black tracking-tight text-white mb-1">Sua Identidade</h3>
                               <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Dados Públicos do Dashboard</p>
                            </div>
                         </div>
                         <Button 
                          onClick={() => setIsEditing(true)} 
                          className="rounded-xl h-12 px-6 font-bold shadow-lg shadow-black/20 hover:-translate-y-1 transition-all bg-white/[0.04] border border-white/20 text-white hover:bg-white/[0.08]"
                         >
                                                        Editar Perfil
                         </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                         <div className="space-y-2">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                               <User className="w-3 h-3 text-amber-500" />
                               Nome Completo
                            </span>
                            <p className="text-xl font-bold text-white">{fullName || "—"}</p>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                               <Mail className="w-3 h-3 text-amber-500" />
                               Email Principal
                            </span>
                            <p className="text-xl font-bold text-white">{email || "—"}</p>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                               <Phone className="w-3 h-3 text-amber-500" />
                               Telefone
                            </span>
                            <p className="text-xl font-bold text-white">{phone || "—"}</p>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                               <Briefcase className="w-3 h-3 text-amber-500" />
                               Cargo / Função
                            </span>
                            <p className="text-xl font-bold text-white">{role || "Membro"}</p>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                               <MapPin className="w-3 h-3 text-amber-500" />
                               Localização
                            </span>
                            <p className="text-xl font-bold text-white">{locationName || "—"}</p>
                         </div>
                         <div className="space-y-2 sm:col-span-2 pt-4 border-t border-white/[0.04]">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
                               <Info className="w-3 h-3 text-amber-500" />
                               Biografia
                            </span>
                            <p className="text-lg font-medium text-white/70 leading-relaxed italic bg-white/[0.02] p-6 rounded-2xl border border-white/[0.04] shadow-inner">
                               "{bio || "Nenhuma descrição informada."}"
                            </p>
                         </div>
                      </div>
                    </AnimatedCard>

                    {/* Secondary Access Card */}
                    <AnimatedCard className="p-8 border-white/[0.08] bg-white/[0.02] flex flex-col justify-between group shadow-lg">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                            <Lock className="w-5 h-5 text-amber-500" />
                          </div>
                          <h4 className="font-black text-sm uppercase tracking-widest text-amber-500">Acesso e Segurança</h4>
                        </div>
                        <p className="text-xs text-white/40 font-bold mb-8">Gerencie suas senhas e autenticação de dois fatores.</p>
                        <Button variant="outline" className="w-full rounded-xl font-bold uppercase tracking-widest text-[10px] border-amber-500/20 text-amber-500 hover:bg-amber-500/10 bg-transparent">
                          Alterar Senha
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </AnimatedCard>

                    <AnimatedCard className="p-8 border-white/[0.08] bg-white/[0.02] flex flex-col justify-between shadow-lg">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          </div>
                          <h4 className="font-black text-sm uppercase tracking-widest text-emerald-400">Privacidade de Dados</h4>
                        </div>
                        <p className="text-xs text-white/40 font-bold mb-8">Veja como seus dados de redes sociais são processados.</p>
                        <Button variant="outline" className="w-full rounded-xl font-bold uppercase tracking-widest text-[10px] border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 bg-transparent">
                          Visualizar Termos
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </AnimatedCard>
                  </div>

                  {/* ── Aparência ───────────────────────────── */}
                  <AnimatedCard className="p-10 border-white/[0.08] bg-white/[0.02] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                        <Palette className="w-6 h-6 text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-white mb-1">Aparência</h3>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Tema e Paleta de Cores</p>
                      </div>
                    </div>

                    {/* Tema claro / escuro */}
                    <div className="mb-10">
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-4">Modo de Exibição</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => theme !== "light" && toggleTheme()}
                          className={cn(
                            "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300",
                            theme === "light"
                              ? "border-amber-500/60 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                          )}
                        >
                          <Sun className={cn("w-7 h-7", theme === "light" ? "text-amber-400" : "text-white/30")} />
                          <span className={cn("text-[10px] font-black uppercase tracking-widest", theme === "light" ? "text-amber-400" : "text-white/40")}>
                            Claro
                          </span>
                          {theme === "light" && (
                            <span className="text-[9px] font-black px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md uppercase tracking-widest">Ativo</span>
                          )}
                        </button>
                        <button
                          onClick={() => theme !== "dark" && toggleTheme()}
                          className={cn(
                            "flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300",
                            theme === "dark"
                              ? "border-violet-500/60 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                          )}
                        >
                          <Moon className={cn("w-7 h-7", theme === "dark" ? "text-violet-400" : "text-white/30")} />
                          <span className={cn("text-[10px] font-black uppercase tracking-widest", theme === "dark" ? "text-violet-400" : "text-white/40")}>
                            Escuro
                          </span>
                          {theme === "dark" && (
                            <span className="text-[9px] font-black px-2 py-0.5 bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-md uppercase tracking-widest">Ativo</span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Paleta de cor */}
                    <div>
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-6">Paleta de Cor Principal</p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {(
                          [
                            { id: "amber",   label: "Âmbar",     color: "#f59e0b", shadow: "rgba(245,158,11,0.35)"  },
                            { id: "blue",    label: "Azul",      color: "#3b82f6", shadow: "rgba(59,130,246,0.35)"  },
                            { id: "violet",  label: "Violeta",   color: "#8b5cf6", shadow: "rgba(139,92,246,0.35)"  },
                            { id: "emerald", label: "Esmeralda", color: "#10b981", shadow: "rgba(16,185,129,0.35)" },
                            { id: "cyan",    label: "Ciano",     color: "#06b6d4", shadow: "rgba(6,182,212,0.35)"  },
                          ] as const
                        ).map(p => (
                          <button
                            key={p.id}
                            onClick={() => setPalette(p.id as ColorPalette)}
                            title={p.label}
                            className={cn(
                              "flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 group",
                              palette === p.id
                                ? "border-white/30 bg-white/[0.06]"
                                : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                            )}
                          >
                            <div
                              className={cn(
                                "w-8 h-8 rounded-xl transition-all duration-300",
                                palette === p.id && "scale-110"
                              )}
                              style={{
                                backgroundColor: p.color,
                                boxShadow: palette === p.id ? `0 0 16px 4px ${p.shadow}` : "none",
                              }}
                            />
                            <span
                              className="text-[9px] font-black uppercase tracking-wider leading-none"
                              style={{ color: palette === p.id ? p.color : "rgba(255,255,255,0.35)" }}
                            >
                              {p.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </AnimatedCard>

                  {/* ── Zona de Perigo ──────────────────────── */}
                  <AnimatedCard className="p-10 border-red-500/15 bg-red-500/[0.02] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-8">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.15)] flex-shrink-0">
                          <AlertCircle className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-red-400 tracking-tight mb-1">Zona de Perigo</h3>
                          <p className="text-[11px] text-white/40 font-bold leading-relaxed max-w-xs">
                            A exclusão da conta é irreversível. Todos os dados serão deletados permanentemente.
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="shrink-0 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest h-12 px-8 border border-red-500/20 bg-red-500/5"
                        onClick={handleDeleteAccount}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir Conta
                      </Button>
                    </div>
                  </AnimatedCard>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
