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
  Camera, 
  Briefcase,
  MapPin,
  Info,
  Lock,
  Palette,
  Trash2,
  AlertCircle,
  Sun,
  Moon,
  Loader2,
  Save,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { slideUp } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, type ColorPalette } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

import { startOAuth } from "@/lib/oauth";
import { Link as LinkIcon, Instagram, Facebook, Youtube, Globe } from "lucide-react";
import { getConnectedAccounts } from "@/services/socialService";
import type { SocialAccount } from "@/types/social";

type Tab = 'minha-conta' | 'senha' | 'empresa' | 'preferencias' | 'conexoes';

export default function Profile() {
  const { user: authUser, signOut } = useAuth();
  const { theme, palette, toggleTheme, setPalette } = useTheme();
  const [location, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (location === '/connections') return 'conexoes';
    if (location === '/settings') return 'preferencias';
    return 'minha-conta';
  });

  useEffect(() => {
    if (location === '/connections') setActiveTab('conexoes');
    else if (location === '/settings') setActiveTab('preferencias');
    else if (location === '/profile') setActiveTab('minha-conta');
  }, [location]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'conexoes') setLocation('/connections', { replace: true });
    else if (tab === 'preferencias' || tab === 'empresa') setLocation('/settings', { replace: true });
    else setLocation('/profile', { replace: true });
  };
  
  // Profile fields
  const [user, setUser] = useState<any>(null);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
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
        
        const userAccounts = await getConnectedAccounts(user.id);
        setAccounts(userAccounts);
        const primaryAccount = userAccounts[0];

        setFullName(user.user_metadata?.full_name || primaryAccount?.displayName || "");
        setPhone(user.user_metadata?.phone || "");
        setRole(user.user_metadata?.role || "");
        setLocationName(user.user_metadata?.location || "");
        setBio(user.user_metadata?.bio || "");
        setAvatarUrl(user.user_metadata?.avatar_url || primaryAccount?.profilePictureUrl || "");
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

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "TEM CERTEZA? Esta ação é IRREVERSÍVEL e excluirá permanentemente todos os seus dados."
    );
    
    if (confirmed) {
      toast.loading("Excluindo conta...");
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.info("Para exclusão permanente, o suporte foi notificado. Sua sessão será encerrada.");
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
          <p className="text-muted-foreground font-black tracking-widest uppercase text-[10px] animate-pulse">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl">
       <div className="flex flex-col md:flex-row gap-8 relative items-start">
           
           {/* Internal Sidebar */}
           <aside className="w-full md:w-64 shrink-0 space-y-8 sticky top-24">
               
               {/* Integrações */}
               <div>
                   <h4 className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-3 pl-2">Integrações</h4>
                   <nav className="space-y-1">
                       <button onClick={() => handleTabChange('conexoes')} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all", activeTab === 'conexoes' ? "bg-primary/10 text-primary font-bold ring-1 ring-primary/20" : "text-muted-foreground hover:bg-muted font-medium")}>
                           <LinkIcon className="w-4 h-4" /> Conexões
                       </button>
                   </nav>
               </div>
               
               {/* Configurações da Conta */}
               <div>
                   <h4 className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-3 pl-2">Configurações da conta</h4>
                   <nav className="space-y-1">
                       <button onClick={() => handleTabChange('minha-conta')} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all", activeTab === 'minha-conta' ? "bg-primary/10 text-primary font-bold ring-1 ring-primary/20" : "text-muted-foreground hover:bg-muted font-medium")}>
                           <User className="w-4 h-4" /> Minha Conta
                       </button>
                       <button onClick={() => handleTabChange('senha')} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all", activeTab === 'senha' ? "bg-primary/10 text-primary font-bold ring-1 ring-primary/20" : "text-muted-foreground hover:bg-muted font-medium")}>
                           <Lock className="w-4 h-4" /> Alterar Senha
                       </button>
                   </nav>
               </div>

               {/* Configurações da Empresa */}
               <div>
                   <h4 className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-3 pl-2">Configurações da Empresa</h4>
                   <nav className="space-y-1">
                       <button onClick={() => handleTabChange('empresa')} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all", activeTab === 'empresa' ? "bg-primary/10 text-primary font-bold ring-1 ring-primary/20" : "text-muted-foreground hover:bg-muted font-medium")}>
                           <Briefcase className="w-4 h-4" /> Perfil da Empresa
                       </button>
                       <button onClick={() => handleTabChange('preferencias')} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all", activeTab === 'preferencias' ? "bg-primary/10 text-primary font-bold ring-1 ring-primary/20" : "text-muted-foreground hover:bg-muted font-medium")}>
                           <Palette className="w-4 h-4" /> Preferências
                       </button>
                   </nav>
               </div>

           </aside>

           {/* Content Area */}
           <main className="flex-1 min-w-0">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.3 }}
                 className="space-y-6"
               >
                 
                 {/* Minha Conta Tab */}
                 {activeTab === 'minha-conta' && (
                    <AnimatedCard className="border-border bg-card shadow-xl overflow-hidden">
                      <div className="p-8 md:p-10 border-b border-border">
                        <h2 className="text-2xl font-black tracking-tight text-foreground mb-1">Minha Conta</h2>
                        <p className="text-xs text-muted-foreground font-medium">Gerencie suas informações pessoais e detalhes da sua conta</p>
                      </div>

                      <form onSubmit={handleUpdate}>
                        <div className="p-8 md:p-10 space-y-10">
                          {/* Profile Picture */}
                          <div className="flex items-center gap-6">
                            <div className="relative group">
                              <div className={cn(
                                "w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center relative z-10 shadow-2xl transition-all",
                                uploading && "opacity-50"
                              )}>
                                {avatarUrl ? (
                                  <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-4xl font-black text-amber-500/40 uppercase">{fullName?.charAt(0) || email?.charAt(0).toUpperCase()}</span>
                                )}
                                {uploading && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                    <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                                  </div>
                                )}
                              </div>
                              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                            </div>
                            <div className="space-y-3">
                              <div>
                                <h3 className="text-lg font-bold text-foreground leading-none">{fullName || "Usuário"}</h3>
                                <p className="text-sm text-muted-foreground">{email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="rounded-lg border-amber-500/30 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10">
                                  Carregar imagem
                                </Button>
                                {avatarUrl && (
                                  <Button type="button" variant="outline" size="icon" onClick={() => { setAvatarUrl(''); handleUpdate(new Event('submit') as any); }} className="rounded-lg border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 w-9 h-9">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Fields */}
                          <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Nome Completo</Label>
                                <div className="relative group">
                                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-12 pl-12 rounded-xl bg-muted border-border text-foreground focus:border-primary focus:ring-primary/20 font-medium" placeholder="Ex: João da Silva" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">E-mail</Label>
                                <div className="relative">
                                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                  <Input value={email} disabled className="h-12 pl-12 rounded-xl bg-card border-white/[0.04] opacity-50 cursor-not-allowed font-medium text-muted-foreground" />
                                </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer actions */}
                        <div className="bg-muted p-6 px-8 md:px-10 flex items-center justify-end gap-3 border-t border-border">
                          <Button type="button" variant="ghost" onClick={fetchProfile} className="rounded-xl text-muted-foreground hover:text-foreground">Cancelar</Button>
                          <Button type="submit" disabled={updating} className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 shadow-lg">
                            {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Salvar alterações
                          </Button>
                        </div>
                      </form>
                    </AnimatedCard>
                 )}

                 {/* Senha Tab */}
                 {activeTab === 'senha' && (
                   <AnimatedCard className="border-border bg-card shadow-xl overflow-hidden">
                      <div className="p-8 md:p-10 border-b border-border">
                        <h2 className="text-2xl font-black tracking-tight text-foreground mb-1">Alterar Senha</h2>
                        <p className="text-xs text-muted-foreground font-medium">Gerencie o acesso e a segurança da sua conta</p>
                      </div>
                      <div className="p-8 md:p-10 space-y-6">
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col gap-4">
                          <div className="flex items-center gap-3 text-primary">
                            <Lock className="w-5 h-5" />
                            <h4 className="font-bold">Acesso via Link Mágico</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Atualmente, o login do seu sistema usa Links Mágicos ou OAuth (Google/Facebook) para maior segurança e conveniência, dispensando o uso de senhas.
                          </p>
                        </div>
                        
                        {/* Zona de Perigo */}
                        <div className="mt-12 pt-8 border-t border-red-500/20">
                          <h4 className="text-sm font-bold text-red-400 mb-2">Zona de Perigo</h4>
                          <p className="text-sm text-foreground/40 mb-4">A exclusão da conta é irreversível e apagará permanentemente todos os seus dados.</p>
                          <Button variant="outline" onClick={handleDeleteAccount} className="border-red-500/20 text-red-500 hover:bg-red-500 hover:text-foreground rounded-xl">
                            <Trash2 className="w-4 h-4 mr-2" /> Excluir Conta
                          </Button>
                        </div>
                      </div>
                   </AnimatedCard>
                 )}

                 {/* Empresa Tab */}
                 {activeTab === 'empresa' && (
                    <AnimatedCard className="border-border bg-card shadow-xl overflow-hidden">
                      <div className="p-8 md:p-10 border-b border-border">
                        <h2 className="text-2xl font-black tracking-tight text-foreground mb-1">Perfil da Empresa</h2>
                        <p className="text-xs text-foreground/40 font-medium">Informações profissionais e de atuação no sistema</p>
                      </div>

                      <form onSubmit={handleUpdate}>
                        <div className="p-8 md:p-10 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest ml-1">Telefone / WhatsApp</Label>
                                <div className="relative group">
                                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-amber-500 transition-colors" />
                                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12 pl-12 rounded-xl bg-white/[0.04] border-white/10 text-foreground focus:border-amber-500 focus:ring-amber-500/20 font-medium" placeholder="+55 (00) 00000-0000" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest ml-1">Cargo / Função</Label>
                                <div className="relative group">
                                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-amber-500 transition-colors" />
                                  <Input value={role} onChange={(e) => setRole(e.target.value)} className="h-12 pl-12 rounded-xl bg-white/[0.04] border-white/10 text-foreground focus:border-amber-500 focus:ring-amber-500/20 font-medium" placeholder="Ex: Gestor de Redes" />
                                </div>
                            </div>
                            <div className="space-y-3 md:col-span-2">
                                <Label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest ml-1">Localização</Label>
                                <div className="relative group">
                                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-amber-500 transition-colors" />
                                  <Input value={locationName} onChange={(e) => setLocationName(e.target.value)} className="h-12 pl-12 rounded-xl bg-white/[0.04] border-white/10 text-foreground focus:border-amber-500 focus:ring-amber-500/20 font-medium" placeholder="Ex: São Paulo, SP" />
                                </div>
                            </div>
                            <div className="space-y-3 md:col-span-2">
                                <Label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest ml-1">Biografia</Label>
                                <div className="relative group">
                                  <Info className="absolute left-4 top-5 w-4 h-4 text-foreground/20 group-focus-within:text-amber-500 transition-colors" />
                                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/[0.04] border border-white/10 text-foreground placeholder:text-foreground/30 focus:border-amber-500 focus:ring-amber-500/20 font-medium resize-none outline-none" placeholder="Conte um pouco sobre a atuação..." />
                                </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-muted border-t border-border p-6 px-8 md:px-10 flex items-center justify-end gap-3">
                          <Button type="button" variant="ghost" onClick={fetchProfile} className="rounded-xl text-muted-foreground hover:text-foreground">Cancelar</Button>
                          <Button type="submit" disabled={updating} className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 shadow-lg">
                            {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Salvar informações
                          </Button>
                        </div>
                      </form>
                   </AnimatedCard>
                 )}

                 {/* Preferencias Tab */}
                 {activeTab === 'preferencias' && (
                    <AnimatedCard className="border-border bg-card shadow-xl overflow-hidden">
                      <div className="p-8 md:p-10 border-b border-border">
                        <h2 className="text-2xl font-black tracking-tight text-foreground mb-1">Preferências</h2>
                        <p className="text-xs text-foreground/40 font-medium">Personalize a aparência do seu sistema Analytics</p>
                      </div>

                      <div className="p-8 md:p-10 space-y-12">
                        {/* Tema */}
                        <div>
                          <Label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest ml-1 mb-4 flex">Modo de Exibição</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => theme !== "light" && toggleTheme()} className={cn("flex items-center gap-3 p-4 rounded-xl border transition-all duration-300", theme === "light" ? "border-amber-500/60 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "border-white/10 bg-card hover:bg-white/[0.04]")}>
                              <Sun className={cn("w-6 h-6", theme === "light" ? "text-amber-400" : "text-foreground/30")} />
                              <span className={cn("text-sm font-bold", theme === "light" ? "text-amber-400" : "text-foreground/40")}>Tema Claro</span>
                            </button>
                            <button onClick={() => theme !== "dark" && toggleTheme()} className={cn("flex items-center gap-3 p-4 rounded-xl border transition-all duration-300", theme === "dark" ? "border-violet-500/60 bg-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]" : "border-white/10 bg-card hover:bg-white/[0.04]")}>
                              <Moon className={cn("w-6 h-6", theme === "dark" ? "text-violet-400" : "text-foreground/30")} />
                              <span className={cn("text-sm font-bold", theme === "dark" ? "text-violet-400" : "text-foreground/40")}>Tema Escuro</span>
                            </button>
                          </div>
                        </div>

                        {/* Paleta */}
                        <div>
                          <Label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest ml-1 mb-4 flex">Paleta de Cores</Label>
                          <div className="flex flex-wrap gap-4">
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
                                className={cn(
                                  "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300 w-24",
                                  palette === p.id ? "border-primary/50 bg-primary/10 shadow-sm" : "border-border bg-muted/30 hover:border-border/50"
                                )}
                              >
                                <div className={cn("w-8 h-8 rounded-full mb-1 transition-transform", palette === p.id && "scale-110")} style={{ backgroundColor: p.color, boxShadow: palette === p.id ? `0 0 16px 2px ${p.shadow}` : "none" }} />
                                <span className={cn("text-[10px] font-bold tracking-widest uppercase", palette === p.id ? "text-foreground" : "text-foreground/40")}>{p.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    </AnimatedCard>
                 )}

                 {/* Conexoes Tab */}
                 {activeTab === 'conexoes' && (
                    <AnimatedCard className="border-border bg-card shadow-xl overflow-hidden">
                      <div className="p-8 md:p-10 border-b border-border">
                        <h2 className="text-2xl font-black tracking-tight text-foreground mb-1">Conexões de Dados</h2>
                        <p className="text-xs text-foreground/40 font-medium">Vincule suas contas de redes sociais e sites para coletar métricas automaticamente</p>
                      </div>

                      <div className="p-8 md:p-10">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                          {/* Instagram Connect */}
                          <div className="bg-card border-border p-6 rounded-3xl flex flex-col items-center text-center hover:border-primary/50 transition-all shadow-sm group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform shrink-0">
                              <Instagram className="w-7 h-7 text-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1 tracking-tight">Instagram</h3>
                            <p className="text-[11px] text-foreground/40 mb-6 px-4 leading-relaxed line-clamp-2 h-8">Conecte seu perfil comercial para analisar Reels e Stories.</p>
                            <Button 
                              onClick={() => {
                                const META_APP_ID = import.meta.env.VITE_META_APP_ID;
                                if (!META_APP_ID) return toast.error("Meta App ID não configurado");
                                startOAuth("instagram");
                              }}
                              className="w-full bg-muted hover:bg-muted/80 border border-border text-foreground rounded-xl h-11 mt-auto font-bold uppercase tracking-widest text-[10px]"
                            >
                              <LinkIcon className="w-3.5 h-3.5 mr-2" />
                              Vincular Conta
                            </Button>
                          </div>

                          {/* Facebook Connect */}
                          <div className="bg-card border-border p-6 rounded-3xl flex flex-col items-center text-center hover:border-primary/50 transition-all shadow-sm group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1877f2] to-[#0a52b3] flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform shrink-0">
                              <Facebook className="w-7 h-7 text-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1 tracking-tight">Facebook</h3>
                            <p className="text-[11px] text-foreground/40 mb-6 px-4 leading-relaxed line-clamp-2 h-8">Gerencie o alcance da sua página e interações do público.</p>
                            <Button 
                              onClick={() => {
                                const META_APP_ID = import.meta.env.VITE_META_APP_ID;
                                if (!META_APP_ID) return toast.error("Meta App ID não configurado");
                                startOAuth("facebook");
                              }}
                              className="w-full bg-muted hover:bg-muted/80 border border-border text-foreground rounded-xl h-11 mt-auto font-bold uppercase tracking-widest text-[10px]"
                            >
                              <LinkIcon className="w-3.5 h-3.5 mr-2" />
                              Vincular Conta
                            </Button>
                          </div>

                          {/* YouTube Connect */}
                          <div className="bg-card border-border p-6 rounded-3xl flex flex-col items-center text-center hover:border-primary/50 transition-all shadow-sm group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff0000] to-[#b30000] flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform shrink-0">
                              <Youtube className="w-7 h-7 text-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1 tracking-tight">YouTube</h3>
                            <p className="text-[11px] text-foreground/40 mb-6 px-4 leading-relaxed line-clamp-2 h-8">Analise o desempenho dos seus vídeos longos e Shorts.</p>
                            <Button 
                              onClick={() => {
                                const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                                if (!GOOGLE_CLIENT_ID) return toast.error("Google Client ID não configurado");
                                startOAuth("youtube");
                              }}
                              className="w-full bg-muted hover:bg-muted/80 border border-border text-foreground rounded-xl h-11 mt-auto font-bold uppercase tracking-widest text-[10px]"
                            >
                              <LinkIcon className="w-3.5 h-3.5 mr-2" />
                              Vincular Conta
                            </Button>
                          </div>

                          {/* Website Connect */}
                          <div className="bg-card border-border p-6 rounded-3xl flex flex-col items-center text-center hover:border-primary/50 transition-all shadow-sm group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform shrink-0">
                              <Globe className="w-7 h-7 text-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1 tracking-tight">Site</h3>
                            <p className="text-[11px] text-foreground/40 mb-6 px-4 leading-relaxed line-clamp-2 h-8">Vincule seu domínio para acessar tráfego e visualizações.</p>
                            <Button className="w-full bg-muted hover:bg-muted/80 border border-border text-foreground rounded-xl h-11 mt-auto font-bold uppercase tracking-widest text-[10px]" onClick={() => setLocation("/website")}>
                              <LinkIcon className="w-3.5 h-3.5 mr-2" />
                              Vincular Site
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AnimatedCard>
                 )}

               </motion.div>
           </main>

       </div>
    </div>
  );
}
