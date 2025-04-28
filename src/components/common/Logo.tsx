
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "normal"
}: {
  className?: string;
  size?: "small" | "normal" | "large";
}) {
  const sizeClasses = {
    small: "text-lg",
    normal: "text-xl",
    large: "text-2xl"
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="font-playfair font-bold tracking-tight text-black flex items-center">
        <span className={cn(sizeClasses[size], "bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600")}>
          PRESS AI
        </span>
      </div>
    </div>
  );
}
