import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-['Outfit'] selection:bg-amber-500/30 overflow-hidden relative">
      {/* Background Decor matching Login */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-amber-500/20 blur-[150px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[150px]"
        />
      </div>

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0 relative z-10 overflow-y-auto">
        {children}
      </div>
      <MobileNav />
    </div>
  );
}
