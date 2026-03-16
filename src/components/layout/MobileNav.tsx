import { Link, useLocation } from "wouter";
import { LayoutDashboard, Instagram, Facebook, Youtube, BarChart2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { label: "Geral", href: "/", icon: LayoutDashboard },
  { label: "Instagram", href: "/instagram", icon: Instagram },
  { label: "Facebook", href: "/facebook", icon: Facebook },
  { label: "YouTube", href: "/youtube", icon: Youtube },
  { label: "Comparar", href: "/comparison", icon: BarChart2 },
  { label: "Relatórios", href: "/reports", icon: FileText },
];

export function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/40 px-2 py-2">
      <div className="flex items-center justify-around gap-1">
        {mobileItems.map((item) => {
          const isActive = item.href === "/" ? location === "/" : location.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-2xl cursor-pointer transition-all duration-300",
                  isActive 
                    ? "text-primary bg-primary/5 shadow-[inset_0_0_12px_rgba(var(--primary),0.05)]" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className={cn("w-5 h-5 transition-transform duration-300", isActive && "scale-110 drop-shadow-sm")} />
                <span className={cn("text-[10px] font-bold tracking-tight uppercase", isActive ? "opacity-100" : "opacity-60")}>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
