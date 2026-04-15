import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Search, User, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileNavDrawer } from "./MobileNavDrawer";
import { useAuth } from "@/contexts/AuthContext";
import { useBranding } from "@/hooks/useBranding";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";

export function MobileHeader() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();
  const branding = useBranding();
  const { profile } = useProfile();

  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Map route to Title
  const getPageTitle = (path: string) => {
    if (path === "/" || path === "/dashboard") return "Geral";
    if (path.startsWith("/instagram")) return "Instagram";
    if (path.startsWith("/facebook")) return "Facebook";
    if (path.startsWith("/youtube")) return "YouTube";
    if (path.startsWith("/metrics")) return "Métricas";
    if (path.startsWith("/teams")) return "Equipe";
    if (path.startsWith("/reports")) return "Relatórios";
    if (path.startsWith("/profile")) return "Perfil";
    if (path.startsWith("/settings")) return "Ajustes";
    return branding.name;
  };

  const pageTitle = getPageTitle(location);

  return (
    <>
      <header className={cn(
        "md:hidden sticky top-0 left-0 right-0 z-40 h-16 transition-all duration-300 px-4 flex items-center justify-between",
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm" : "bg-transparent"
      )}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="w-10 h-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center active:scale-90 transition-transform"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-tighter uppercase text-foreground">{pageTitle}</h1>
            <div className="h-0.5 w-4 bg-primary rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-90 transition-all">
            <Search className="w-5 h-5" />
          </button>
          
          <Link href="/profile">
            <button className="w-9 h-9 rounded-full border border-border overflow-hidden hover:border-primary active:scale-95 transition-all shadow-sm">
              <img 
                src={profile?.avatarUrl || user?.user_metadata?.avatar_url || "logo.png"} 
                alt="Perfil" 
                className="w-full h-full object-cover"
              />
            </button>
          </Link>
        </div>
      </header>

      <MobileNavDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </>
  );
}
