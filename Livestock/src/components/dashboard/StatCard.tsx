// placeholder for StatCard component
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "success" | "warning" | "accent";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  const variantStyles = {
    default: "bg-card",
    success: "bg-success/10 border-success/20",
    warning: "bg-warning/10 border-warning/20",
    accent: "bg-accent/10 border-accent/20",
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    accent: "bg-accent/20 text-accent",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border p-6 shadow-card transition-all duration-300 hover:shadow-hover",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-display text-3xl font-bold tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                trend.positive ? "text-success" : "text-destructive"
              )}
            >
              <span>{trend.positive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground">vs last week</span>
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110",
            iconStyles[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
