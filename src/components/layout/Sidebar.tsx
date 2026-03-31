import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Instagram,
  Facebook,
  Youtube,
  BarChart2,
  Lightbulb,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Users,
  Activity,
  Link2,
  Globe
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useBranding } from "@/hooks/useBranding";

// ── Analytics section
const analyticsItems = [
  { label: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { label: "Métricas", href: "/metrics", icon: Activity },
  { label: "Instagram", href: "/instagram", icon: Instagram },
  { label: "Facebook", href: "/facebook", icon: Facebook },
  { label: "YouTube", href: "/youtube", icon: Youtube },
  { label: "Site", href: "/website", icon: Globe },
  { label: "Comparação", href: "/comparison", icon: BarChart2 },
  { label: "Insights", href: "/insights", icon: Lightbulb },
  { label: "Relatórios", href: "/reports", icon: FileText },
  { label: "Equipe", href: "/teams", icon: Users },
];

// ── Account section (available for ALL users)
const accountItems = [
  { label: "Perfil", href: "/profile", icon: User },
  { label: "Conexões", href: "/connections", icon: Link2 },
  { label: "Configurações", href: "/settings", icon: Settings },
];

const platformStyle: Record<string, { bg: string; glow: string; text: string }> = {
  "/instagram": {
    bg: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
    glow: "shadow-[0_0_12px_rgba(225,48,108,0.35)]",
    text: "text-white",
  },
  "/facebook": {
    bg: "bg-gradient-to-br from-[#1877f2] to-[#0a52b3]",
    glow: "shadow-[0_0_12px_rgba(24,119,242,0.35)]",
    text: "text-white",
  },
  "/youtube": {
    bg: "bg-gradient-to-br from-[#ff0000] to-[#b30000]",
    glow: "shadow-[0_0_12px_rgba(255,0,0,0.3)]",
    text: "text-white",
  },
  "/website": {
    bg: "bg-gradient-to-br from-[#059669] to-[#047857]",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.3)]",
    text: "text-white",
  },
};

function NavItem({ item, location, collapsed }: { item: typeof analyticsItems[0]; location: string; collapsed: boolean }) {
  const isActive = item.href === "/" ? location === "/" : location.startsWith(item.href);
  const style = platformStyle[item.href];

  return (
    <Link key={item.href} href={item.href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 group relative",
          isActive
            ? "bg-amber-500/10 text-amber-500 shadow-[0_4px_20px_-5px_rgba(245,158,11,0.3)] ring-1 ring-amber-500/20"
            : "hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground"
        )}
      >
        {style && !isActive ? (
          <div className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300",
            style.bg, style.text,
            "group-hover:ring-2 group-hover:ring-white/20 group-hover:scale-110"
          )}>
            <item.icon className="w-3.5 h-3.5" />
          </div>
        ) : (
          <item.icon
            className={cn(
              "w-5 h-5 shrink-0 transition-colors drop-shadow-sm",
              isActive ? "text-amber-500" : "group-hover:text-amber-500/70"
            )}
          />
        )}
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-medium whitespace-nowrap overflow-hidden"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="absolute left-full ml-2 pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
            <div className="bg-popover border border-border text-sm text-popover-foreground px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap">
              {item.label}
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  );
}

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const branding = useBranding();
  
  const urlParams = new URLSearchParams(window.location.search);
  const hideSidebar = urlParams.get('hide_sidebar') === 'true';

  if (hideSidebar) return null;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative hidden md:flex flex-col h-screen sticky top-0 bg-sidebar backdrop-blur-[30px] border-r border-sidebar-border shadow-[20px_0_40px_-20px_rgba(0,0,0,0.1)] shrink-0 z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <motion.div
          animate={{ rotate: collapsed ? 0 : 0 }}
          className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        >
          <img src={branding.sidebarLogo} alt="Logo" loading="lazy" className="w-5 h-5 object-contain" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="font-semibold text-base tracking-tight whitespace-nowrap overflow-hidden"
            >
              {branding.name}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Analytics Nav */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
        {analyticsItems.map((item) => (
          <NavItem key={item.href} item={item} location={location} collapsed={collapsed} />
        ))}

        {/* Separator */}
        <div className="my-3 mx-3 border-t border-sidebar-border/30" />

        {/* Section header */}
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[9px] font-black text-sidebar-foreground/30 uppercase tracking-[0.2em] px-3 mb-1"
            >
              Conta
            </motion.p>
          )}
        </AnimatePresence>

        {/* Account Nav */}
        {accountItems.map((item) => (
          <NavItem key={item.href} item={item} location={location} collapsed={collapsed} />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-4">
        <button
          onClick={async () => {
            await signOut();
            toast.success("Até logo!");
            setLocation("/login");
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 group text-muted-foreground hover:bg-red-500/10 hover:text-red-400 active:scale-95",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sair</span>}
          {collapsed && (
            <div className="absolute left-full ml-2 pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
              <div className="bg-rose-500 text-white text-sm px-3 py-1.5 rounded-xl shadow-xl shadow-rose-500/20">
                Sair
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center m-3 p-2 rounded-xl hover:bg-sidebar-accent transition-colors text-sidebar-foreground/40 hover:text-sidebar-foreground border-t border-sidebar-border"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
