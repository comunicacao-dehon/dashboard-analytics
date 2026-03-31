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
        "rounded-[2rem] border shadow-[0_8px_32px_0_rgba(80,60,30,0.12)] transition-all duration-300",
        "bg-white/[0.68] backdrop-blur-[18px] saturate-150 border-white/70",
        "hover:bg-white/[0.78] hover:shadow-[0_16px_40px_0_rgba(80,60,30,0.16)] hover:border-white/85",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
