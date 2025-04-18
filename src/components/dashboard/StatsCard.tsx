
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  change?: {
    value: string;
    positive: boolean;
  };
}

export function StatsCard({ icon: Icon, title, value, change }: StatsCardProps) {
  return (
    <Card className="bg-bg-white border-border shadow-light">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-text-secondary text-sm mb-1">{title}</p>
            <p className="text-2xl font-medium">{value}</p>
            {change && (
              <p className={cn(
                "text-xs mt-1 flex items-center",
                change.positive ? "text-success" : "text-error"
              )}>
                {change.positive ? "+" : "-"}{change.value}
              </p>
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
