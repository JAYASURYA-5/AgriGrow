// placeholder for AlertItem component
import { cn } from "@livestock/lib/utils";
import { LucideIcon, AlertCircle, Clock, Syringe, Utensils, ThermometerSun } from "lucide-react";

export interface Alert {
  id: string;
  type: "vaccination" | "feeding" | "health" | "environment" | "general";
  title: string;
  message: string;
  time: string;
  priority: "low" | "medium" | "high";
  read: boolean;
}

interface AlertItemProps {
  alert: Alert;
  onClick?: () => void;
}

const typeConfig: Record<Alert["type"], { icon: LucideIcon; color: string }> = {
  vaccination: { icon: Syringe, color: "text-primary bg-primary/10" },
  feeding: { icon: Utensils, color: "text-accent bg-accent/10" },
  health: { icon: AlertCircle, color: "text-destructive bg-destructive/10" },
  environment: { icon: ThermometerSun, color: "text-warning bg-warning/10" },
  general: { icon: Clock, color: "text-muted-foreground bg-muted" },
};

const priorityStyles = {
  low: "border-l-muted-foreground",
  medium: "border-l-warning",
  high: "border-l-destructive",
};

export function AlertItem({ alert, onClick }: AlertItemProps) {
  const config = typeConfig[alert.type];
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex cursor-pointer gap-3 rounded-lg border border-l-4 bg-card p-4 transition-all duration-200 hover:shadow-soft",
        priorityStyles[alert.priority],
        !alert.read && "bg-primary/5"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          config.color
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "font-medium",
              !alert.read && "text-foreground",
              alert.read && "text-muted-foreground"
            )}
          >
            {alert.title}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {alert.time}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {alert.message}
        </p>
      </div>

      {!alert.read && (
        <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </div>
  );
}

