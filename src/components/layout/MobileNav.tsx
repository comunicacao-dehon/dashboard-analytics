import { Link, useLocation } from "wouter";
import { LayoutDashboard, Instagram, Facebook, Youtube, BarChart2, FileText, LogOut, User, Activity, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const mobileItems = [
  { label: "Geral", href: "/dashboard", icon: LayoutDashboard },
  { label: "Métricas", href: "/metrics", icon: Activity },
  { label: "Equipe", href: "/teams", icon: Users },
  { label: "Instagram", href: "/instagram", icon: Instagram },
  { label: "Facebook", href: "/facebook", icon: Facebook },
  { label: "Sair", href: "#logout", icon: LogOut },
];

export function MobileNav() {
  const { signOut } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    await signOut();
    toast.success("Até logo!");
    setLocation("/login");
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar backdrop-blur-[30px] border-t border-sidebar-border shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] px-2 py-4 pb-6">
      <div className="flex items-center justify-around gap-1">
        {mobileItems.map((item) => {
          const isActive = item.href === "/dashboard" ? location === "/dashboard" : location.startsWith(item.href);
          
          if (item.href === "#logout") {
            return (
              <button 
                key={item.href}
                onClick={handleLogout}
                className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl cursor-pointer transition-all duration-300 text-sidebar-foreground/40 hover:text-red-400 hover:bg-red-500/10 active:scale-95"
              >
                <item.icon className="w-5 h-5 transition-transform duration-300" />
                <span className="text-[9px] font-black tracking-widest uppercase opacity-60">{item.label}</span>
              </button>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl cursor-pointer transition-all duration-300 relative",
                  isActive 
                    ? "text-amber-500" 
                    : "text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-all duration-300", isActive && "scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]")} />
                <span className={cn("text-[9px] font-black tracking-widest uppercase", isActive ? "opacity-100" : "opacity-60")}>{item.label}</span>
                {isActive && (
                   <div className="absolute inset-x-2 -bottom-2 h-1 bg-amber-500 rounded-t-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
