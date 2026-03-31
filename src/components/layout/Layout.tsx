import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const urlParams = new URLSearchParams(window.location.search);
  const hideSidebar = urlParams.get('hide_sidebar') === 'true';

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-amber-500/30 overflow-hidden relative">
      {/* Background Decor matching Login */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-amber-500/20 blur-[150px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[150px]"
        />
      </div>

      {!hideSidebar && <Sidebar />}
      <div className={cn("flex-1 flex flex-col min-w-0 pb-20 md:pb-0 relative z-10 overflow-y-auto", hideSidebar && "pb-0")}>
        {children}
      </div>
      {!hideSidebar && <MobileNav />}
    </div>
  );
}
