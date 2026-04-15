import { Link, useLocation } from "wouter";
import { LayoutDashboard, Instagram, Facebook, Youtube, BarChart2, FileText, LogOut, User, Activity, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const mobileItems = [
  { label: "Geral", href: "/dashboard", icon: LayoutDashboard },
  { label: "Métricas", href: "/metrics", icon: Activity },
  { label: "Planejar", href: "/planning", icon: FileText },
  { label: "Perfis", href: "/connections", icon: Users },
];

export function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-2 h-20">
      <div className="flex items-center justify-around h-full max-w-sm mx-auto">
        {mobileItems.map((item) => {
          const isActive = item.href === "/dashboard" ? location === "/dashboard" || location === "/" : location.startsWith(item.href);
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 min-w-[64px] transition-all duration-300 relative",
                  isActive 
                    ? "text-primary scale-110" 
                    : "text-muted-foreground/60 hover:text-foreground"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive && "bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                )}>
                  <item.icon className={cn("w-5 h-5 transition-all duration-300", isActive && "drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]")} />
                </div>
                <span className={cn(
                  "text-[9px] font-bold tracking-tight transition-all",
                  isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                )}>
                  {item.label}
                </span>
                {isActive && (
                   <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-1 h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" 
                   />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
