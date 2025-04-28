
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "normal"
}: {
  className?: string;
  size?: "small" | "normal" | "large";
}) {
  const sizeClasses = {
    small: "h-8",
    normal: "h-10",
    large: "h-14"
  };

  return (
    <div className={cn("flex items-center gap-2 transition-all duration-300", className)}>
      <img 
        src="/lovable-uploads/1ce04543-bc90-4942-acea-8c81bad6ae3f.png" 
        alt="PRESS AI"
        className={cn(
          sizeClasses[size],
          "w-auto object-contain transition-transform duration-300 hover:scale-105"
        )}
      />
    </div>
  );
}
