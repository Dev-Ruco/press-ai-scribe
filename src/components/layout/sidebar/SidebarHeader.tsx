
import { Logo } from "@/components/common/Logo";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed?: boolean;
}

export function SidebarHeader({ collapsed = false }: SidebarHeaderProps) {
  return (
    <div className="p-4 flex items-center justify-center">
      <Logo size={collapsed ? "small" : "normal"} className="text-black" />
    </div>
  );
}
