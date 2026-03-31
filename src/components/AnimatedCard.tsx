import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  className?: string;
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedCard({ className, children, delay = 0, ...props }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      className={cn(
        "rounded-[2rem] bg-white/[0.04] backdrop-blur-[30px] border border-white/[0.08] text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]",
        "hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.6)] hover:bg-white/[0.06] transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
