
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface QuickAccessCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  className?: string;
}

export function QuickAccessCard({ icon: Icon, title, description, href, className }: QuickAccessCardProps) {
  return (
    <a href={href}>
      <Card className={cn(
        "bg-bg-white border-border shadow-light hover:shadow-medium transition-default h-full",
        className
      )}>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Icon size={24} />
          </div>
          <h3 className="font-medium mb-2">{title}</h3>
          <p className="text-text-secondary text-sm">{description}</p>
        </CardContent>
      </Card>
    </a>
  );
}
