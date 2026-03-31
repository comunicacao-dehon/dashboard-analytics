import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Instagram, Facebook, Youtube, CheckCircle2, Link2, Bell, Shield, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { staggerContainer, slideUp } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";
import { useTheme } from "@/contexts/ThemeContext";

const platforms = [
  {
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderConnected: "border-pink-500/30",
    api: "Meta Graph API",
    status: "connected",
    account: "@amigosdocoracao_conventinho",
  },
  {
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderConnected: "border-blue-500/30",
    api: "Meta Graph API",
    status: "disconnected",
    account: null,
  },
  {
    name: "YouTube",
    icon: Youtube,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderConnected: "border-red-500/30",
    api: "YouTube Data API v3",
    status: "disconnected",
    account: null,
  },
];

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [safeDataEnabled, setSafeDataEnabled] = useState(true);

  const preferences = [
    {
      icon: Bell,
      label: "Notificações de Relatório",
      desc: "Receber alertas quando um relatório semanal estiver pronto",
      enabled: notificationsEnabled,
      onToggle: () => setNotificationsEnabled(v => !v),
    },
    {
      icon: Shield,
      label: "Modo Seguro de Dados",
      desc: "Não armazenar dados sensíveis de conta nas configurações",
      enabled: safeDataEnabled,
      onToggle: () => setSafeDataEnabled(v => !v),
    },
    {
      icon: Moon,
      label: "Tema Escuro",
      desc: "Alternar entre modo claro e escuro da plataforma",
      enabled: theme === "dark",
      onToggle: toggleTheme,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="absolute top-0 inset-x-0 h-[250px] bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none -z-10" />

      <main className="container py-10 max-w-4xl">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4 mb-10"
        >
          <motion.div variants={slideUp} className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-white/50" />
          </motion.div>
          <div>
            <motion.h1 variants={slideUp} className="text-3xl font-bold tracking-tight text-white">Configurações</motion.h1>
            <motion.p variants={slideUp} className="text-white/40 text-sm font-medium">Gerencie conexões de contas e preferências da plataforma</motion.p>
          </div>
        </motion.div>

        {/* Account Connections */}
        <AnimatedCard className="p-8 mb-6 border-border bg-card">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/[0.06]">
            <Link2 className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-white tracking-tight">Conexões de Conta</h3>
          </div>
          <div className="space-y-3">
            {platforms.map((p, i) => (
              <motion.div
                key={p.name}
                variants={slideUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.08 }}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  p.status === "connected"
                    ? p.borderConnected + " bg-emerald-500/[0.03]"
                    : "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.bgColor}`}>
                    <p.icon className={`w-5 h-5 ${p.color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{p.name}</p>
                    <p className="text-[11px] text-white/40 font-medium">{p.api}</p>
                    {p.account && (
                      <p className={`text-[11px] font-bold mt-0.5 ${p.color}`}>{p.account}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.status === "connected" ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Conectado
                    </span>
                  ) : (
                    <Button size="sm" className="rounded-xl px-5 text-[10px] font-black uppercase tracking-widest h-9">
                      Conectar {p.name}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-[11px] text-white/30 font-bold mt-5 p-4 bg-card border border-white/[0.05] rounded-xl leading-relaxed">
            🔒 Suas credenciais são criptografadas e nunca armazenadas em texto puro. A integração utiliza OAuth 2.0 com as APIs oficiais das plataformas.
          </p>
        </AnimatedCard>

        {/* Preferences */}
        <AnimatedCard delay={0.15} className="p-8 border-border bg-card">
          <h3 className="text-base font-bold text-white tracking-tight mb-6 pb-5 border-b border-white/[0.06]">Preferências</h3>
          <div className="space-y-3">
            {preferences.map((pref, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    <pref.icon className="w-4 h-4 text-white/40" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{pref.label}</p>
                    <p className="text-[11px] text-white/40 font-medium">{pref.desc}</p>
                  </div>
                </div>
                {/* Functional toggle */}
                <button
                  onClick={pref.onToggle}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                    pref.enabled ? "bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb,245,158,11),0.4)]" : "bg-white/10"
                  }`}
                  aria-label={`Toggle ${pref.label}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${
                      pref.enabled ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </main>
    </div>
  );
}
