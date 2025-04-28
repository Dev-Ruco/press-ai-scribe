
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";

export function Logo({
  className,
  size = "normal"
}: {
  className?: string;
  size?: "small" | "normal" | "large";
}) {
  const sizeClasses = {
    small: "h-6",
    normal: "h-8",
    large: "h-10"
  };

  return (
    <div className={cn("flex items-center gap-2 transition-all duration-300", className)}>
      <img 
        src="/lovable-uploads/fcaefddb-58c6-4858-be28-f816d438a65b.png" 
        alt="PRESS AI"
        className={cn(
          sizeClasses[size],
          "w-auto object-contain transition-transform duration-300 hover:scale-105"
        )}
      />
    </div>
  );
}
