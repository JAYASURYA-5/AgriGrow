// placeholder for QuickActions component
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Stethoscope, 
  Syringe, 
  Camera,
  FileText,
  MapPin 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actions = [
  { icon: PlusCircle, label: "Add Animal", color: "text-primary", path: "/animals" },
  { icon: Stethoscope, label: "Health Check", color: "text-success", path: "/health" },
  { icon: Syringe, label: "Log Vaccination", color: "text-accent", path: "/health" },
  { icon: Camera, label: "Disease Scan", color: "text-warning", path: "/disease" },
  { icon: MapPin, label: "Track Location", color: "text-primary", path: "/tracking" },
  { icon: FileText, label: "Generate Report", color: "text-muted-foreground", path: "/analytics" },
];

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const navigate = useNavigate();

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto flex-col gap-2 py-4 hover:shadow-soft"
            onClick={() => navigate(action.path)}
          >
            <action.icon className={cn("h-5 w-5", action.color)} />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
