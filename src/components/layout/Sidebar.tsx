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
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const navItems = [
  { label: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { label: "Instagram", href: "/instagram", icon: Instagram },
  { label: "Facebook", href: "/facebook", icon: Facebook },
  { label: "YouTube", href: "/youtube", icon: Youtube },
  { label: "Comparação", href: "/comparison", icon: BarChart2 },
  { label: "Insights", href: "/insights", icon: Lightbulb },
  { label: "Relatórios", href: "/reports", icon: FileText },
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
};

export function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="relative hidden md:flex flex-col h-screen sticky top-0 glass border-r border-border/40 shrink-0 z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border/40 shrink-0">
        <motion.div
          animate={{ rotate: collapsed ? 0 : 0 }}
          className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0"
        >
          <img
            src="/logo.png.png"
            alt="Logo"
            loading="lazy"
            className="w-5 h-5 object-contain"
          />
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
              Painel Analítico
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? location === "/"
              : location.startsWith(item.href);
          const isSocial = !!platformStyle[item.href];

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {(() => {
                  const style = platformStyle[item.href];
                  if (style && !isActive) {
                    return (
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300",
                        style.bg, style.text,
                        "group-hover:ring-2 group-hover:ring-white/20 group-hover:scale-110"
                      )}>
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                    );
                  }
                  return (
                    <item.icon
                      className={cn(
                        "w-5 h-5 shrink-0 transition-colors",
                        isActive ? "text-primary-foreground" : "group-hover:text-foreground"
                      )}
                    />
                  );
                })()}
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
                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div className="bg-popover border border-border text-sm text-foreground px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                      {item.label}
                    </div>
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-2 pb-4">
        <button
          onClick={async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              toast.error("Erro ao sair");
            } else {
              toast.success("Até logo!");
            }
          }}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group text-muted-foreground hover:bg-red-50 hover:text-red-500",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sair</span>}
          {collapsed && (
            <div className="absolute left-full ml-2 pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              <div className="bg-red-500 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg">
                Sair
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-center m-3 p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground border-t border-border/40"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </motion.aside>
  );
}
