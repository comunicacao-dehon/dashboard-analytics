import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { MobileHeader } from "./MobileHeader";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const urlParams = new URLSearchParams(window.location.search);
  const hideSidebar = urlParams.get('hide_sidebar') === 'true';

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50 dark:bg-[#020617]">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-red-500/10 blur-[120px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]"
        />
      </div>

      {!hideSidebar && <Sidebar />}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 pb-20 md:pb-0 relative z-10 md:p-3 md:pl-0", 
        hideSidebar && "pb-0 p-0"
      )}>
        {!hideSidebar && <MobileHeader />}
        
        <main className={cn(
          "flex-1 bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-2xl relative",
          !hideSidebar && "rounded-t-3xl md:rounded-[2rem] h-full"
        )}>
          {children}
        </main>
      </div>
      {!hideSidebar && <MobileNav />}
    </div>
  );
}
