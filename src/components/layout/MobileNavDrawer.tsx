import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Instagram, 
  Facebook, 
  Youtube, 
  BarChart2, 
  Lightbulb, 
  FileText, 
  Settings, 
  LogOut, 
  User, 
  Users, 
  Activity, 
  Link2,
  Globe,
  ChevronRight
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useBranding } from "@/hooks/useBranding";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navItems = [
  { label: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { label: "Métricas", href: "/metrics", icon: Activity },
  { label: "Planejamento", href: "/planning", icon: FileText },
  { label: "Instagram", href: "/instagram", icon: Instagram },
  { label: "Facebook", href: "/facebook", icon: Facebook },
  { label: "YouTube", href: "/youtube", icon: Youtube },
  { label: "Site", href: "/website", icon: Globe },
  { label: "Comparação", href: "/comparison", icon: BarChart2 },
  { label: "Insights", href: "/insights", icon: Lightbulb },
  { label: "Relatórios", href: "/reports", icon: FileText },
  { label: "Equipe", href: "/teams", icon: Users },
];

const accountItems = [
  { label: "Perfil", href: "/profile", icon: User },
  { label: "Conexões", href: "/connections", icon: Link2 },
  { label: "Configurações", href: "/settings", icon: Settings },
];

export function MobileNavDrawer({ open, onOpenChange }: MobileNavDrawerProps) {
  const [location, setLocation] = useLocation();
  const { signOut } = useAuth();
  const branding = useBranding();

  const handleLogout = async () => {
    await signOut();
    toast.success("Até logo!");
    setLocation("/login");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0 border-r border-sidebar-border bg-sidebar overflow-y-auto">
        <SheetHeader className="p-6 border-b border-sidebar-border flex-row items-center gap-3 space-y-0 text-left">
          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <img src={branding.sidebarLogo} alt="Logo" className="w-5 h-5 object-contain" />
          </div>
          <SheetTitle className="text-lg font-bold tracking-tight">{branding.name}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-80px)]">
          <nav className="flex-1 p-3 space-y-1">
            <p className="px-3 py-2 text-[10px] font-black text-sidebar-foreground/30 uppercase tracking-[0.2em]">Navegação</p>
            {navItems.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link href={item.href}>
                  <div className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]",
                    location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href))
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
                  )}>
                    <div className="flex items-center gap-3 font-medium text-sm">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                    <ChevronRight className={cn("w-3.5 h-3.5 opacity-40", location === item.href && "opacity-80")} />
                  </div>
                </Link>
              </SheetClose>
            ))}

            <div className="my-4 border-t border-sidebar-border/30" />
            
            <p className="px-3 py-2 text-[10px] font-black text-sidebar-foreground/30 uppercase tracking-[0.2em]">Conta</p>
            {accountItems.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link href={item.href}>
                  <div className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98]",
                    location === item.href
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
                  )}>
                    <div className="flex items-center gap-3 font-medium text-sm">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                    <ChevronRight className={cn("w-3.5 h-3.5 opacity-40", location === item.href && "opacity-80")} />
                  </div>
                </Link>
              </SheetClose>
            ))}
          </nav>

          <div className="p-4 border-t border-sidebar-border/30">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-semibold text-sm active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              Sair da conta
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
