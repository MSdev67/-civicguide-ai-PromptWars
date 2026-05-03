import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
}

export function Skeleton({ className, variant = "rect" }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={cn(
        "shimmer",
        variant === "circle" ? "rounded-full" : "rounded-lg",
        className
      )}
    />
  );
}
