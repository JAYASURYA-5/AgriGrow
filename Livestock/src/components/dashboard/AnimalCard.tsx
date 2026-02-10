// placeholder for AnimalCard component
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export interface Animal {
  id: string;
  name: string;
  type: "cattle" | "sheep" | "goat" | "pig" | "chicken" | "horse";
  breed: string;
  age: string;
  weight: string;
  status: "healthy" | "attention" | "critical";
  location: string;
  image: string;
  lastCheckup: string;
}

interface AnimalCardProps {
  animal: Animal;
  onClick?: () => void;
}

const statusConfig = {
  healthy: {
    label: "Healthy",
    className: "bg-success/10 text-success border-success/20",
  },
  attention: {
    label: "Needs Attention",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  critical: {
    label: "Critical",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const animalEmoji = {
  cattle: "🐄",
  sheep: "🐑",
  goat: "🐐",
  pig: "🐷",
  chicken: "🐔",
  horse: "🐴",
};

export function AnimalCard({ animal, onClick }: AnimalCardProps) {
  const status = statusConfig[animal.status];

  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-hover"
      )}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-muted">
        <img
          src={animal.image}
          alt={animal.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute right-3 top-3">
          <Badge className={cn("border", status.className)}>
            {status.label}
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center gap-2 text-white">
            <span className="text-2xl">{animalEmoji[animal.type]}</span>
            <div>
              <p className="font-semibold">{animal.name}</p>
              <p className="text-xs opacity-80">{animal.breed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Age</p>
            <p className="font-medium">{animal.age}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Weight</p>
            <p className="font-medium">{animal.weight}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{animal.location}</span>
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          Last checkup: {animal.lastCheckup}
        </p>
      </div>
    </div>
  );
}
