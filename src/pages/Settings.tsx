import { motion } from "framer-motion";
import { Settings as SettingsIcon, Instagram, Facebook, Youtube, CheckCircle2, Link2, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { staggerContainer, slideUp } from "@/lib/animations";
import { AnimatedCard } from "@/components/AnimatedCard";

const platforms = [
  {
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    borderConnected: "border-pink-200",
    api: "Meta Graph API",
    status: "connected",
    account: "@amigosdocoracao_conventinho",
  },
  {
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderConnected: "border-blue-200",
    api: "Meta Graph API",
    status: "disconnected",
    account: null,
  },
  {
    name: "YouTube",
    icon: Youtube,
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderConnected: "border-red-200",
    api: "YouTube Data API v3",
    status: "disconnected",
    account: null,
  },
];

const preferences = [
  { icon: Bell, label: "Notificações de Relatório", desc: "Receber alertas quando um relatório semanal estiver pronto", enabled: true },
  { icon: Shield, label: "Modo Seguro de Dados", desc: "Não armazenar dados sensíveis de conta nas configurações", enabled: true },
  { icon: Palette, label: "Tema Escuro", desc: "Ativar modo escuro automático baseado no sistema operacional", enabled: false },
];

export default function Settings() {
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
          <motion.div variants={slideUp} className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-muted-foreground" />
          </motion.div>
          <div>
            <motion.h1 variants={slideUp} className="text-3xl font-bold tracking-tight">Configurações</motion.h1>
            <motion.p variants={slideUp} className="text-muted-foreground">Gerencie conexões de contas e preferências da plataforma</motion.p>
          </div>
        </motion.div>

        {/* Account Connections */}
        <AnimatedCard className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border/50">
            <Link2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Conexões de Conta</h3>
          </div>
          <div className="space-y-4">
            {platforms.map((p, i) => (
              <motion.div
                key={p.name}
                variants={slideUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: i * 0.08 }}
                className={`flex items-center justify-between p-4 rounded-xl border ${p.status === "connected" ? p.borderConnected + " bg-green-50/30" : "border-border/50"}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.bgColor}`}>
                    <p.icon className={`w-5 h-5 ${p.color}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.api}</p>
                    {p.account && (
                      <p className={`text-xs font-medium mt-0.5 ${p.color}`}>{p.account}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {p.status === "connected" ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Conectado
                    </span>
                  ) : (
                    <Button size="sm" className="rounded-full px-5 text-xs">
                      Conectar {p.name}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 p-3 bg-muted/40 rounded-xl">
            🔒 Suas credenciais são criptografadas e nunca são armazenadas em texto puro. A integração utiliza OAuth 2.0 com as APIs oficiais das plataformas.
          </p>
        </AnimatedCard>

        {/* Preferences */}
        <AnimatedCard delay={0.15} className="p-6">
          <h3 className="text-lg font-semibold mb-5 pb-4 border-b border-border/50">Preferências</h3>
          <div className="space-y-4">
            {preferences.map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                    <pref.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                </div>
                <div className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ${pref.enabled ? "bg-primary" : "bg-muted"}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${pref.enabled ? "left-6" : "left-1"}`} />
                </div>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </main>
    </div>
  );
}
