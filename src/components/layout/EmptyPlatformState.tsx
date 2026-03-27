import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Activity, LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { SocialPlatform } from "@/types/social";

interface Props {
  platform: string;
  icon: React.ReactNode;
  description: string;
}

export function EmptyPlatformState({ platform, icon, description }: Props) {
  return (
    <div className="container py-20 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-20 h-20 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
      >
        {icon}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-black tracking-tight text-white mb-3"
      >
        {platform} não vinculado
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white/40 max-w-md mb-10"
      >
        {description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link href="/dashboard">
          <Button className="rounded-xl h-12 px-8 bg-amber-500 hover:bg-amber-600 text-[#050505] font-black uppercase tracking-widest text-xs">
            <LinkIcon className="w-4 h-4 mr-2" />
            Vincular Conta
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
