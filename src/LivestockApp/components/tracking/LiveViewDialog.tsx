// placeholder for LiveViewDialog component
import { useState, useEffect } from "react";
import { MapPin, Circle, RefreshCw, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@livestock/components/ui/dialog";
import { Badge } from "@livestock/components/ui/badge";
import { Button } from "@livestock/components/ui/button";
import { cn } from "@livestock/lib/utils";

interface TrackedAnimal {
  id: string;
  name: string;
  type: string;
  location: string;
  lat: number;
  lng: number;
  status: "inside" | "alert";
  lastUpdate: string;
}

const mockLiveAnimals: TrackedAnimal[] = [
  { id: "1", name: "Bella", type: "cattle", location: "North Pasture", lat: 45.2, lng: -93.1, status: "inside", lastUpdate: "Just now" },
  { id: "2", name: "Max", type: "horse", location: "Stable A", lat: 45.21, lng: -93.12, status: "inside", lastUpdate: "2 min ago" },
  { id: "3", name: "Woolly", type: "sheep", location: "East Field", lat: 45.19, lng: -93.08, status: "alert", lastUpdate: "1 min ago" },
  { id: "4", name: "Ginger", type: "goat", location: "Hill Pasture", lat: 45.22, lng: -93.15, status: "inside", lastUpdate: "30 sec ago" },
  { id: "5", name: "Rosie", type: "pig", location: "South Barn", lat: 45.18, lng: -93.11, status: "inside", lastUpdate: "Just now" },
  { id: "6", name: "Clucky", type: "chicken", location: "Coop Area", lat: 45.205, lng: -93.09, status: "inside", lastUpdate: "5 min ago" },
];

interface LiveViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LiveViewDialog({ open, onOpenChange }: LiveViewDialogProps) {
  const [animals, setAnimals] = useState<TrackedAnimal[]>(mockLiveAnimals);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh with slight position changes
    setTimeout(() => {
      setAnimals(prev => prev.map(animal => ({
        ...animal,
        lastUpdate: "Just now",
        lat: animal.lat + (Math.random() - 0.5) * 0.001,
        lng: animal.lng + (Math.random() - 0.5) * 0.001,
      })));
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    if (open) {
      // Auto-refresh every 10 seconds when dialog is open
      const interval = setInterval(handleRefresh, 10000);
      return () => clearInterval(interval);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <div className="relative">
                <Circle className="h-3 w-3 fill-success text-success animate-pulse" />
              </div>
              Live Tracking View
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </DialogHeader>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Live Map */}
          <div className="lg:col-span-2">
            <div className="relative h-[400px] rounded-xl border bg-muted overflow-hidden">
              {/* Simulated map background */}
              <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-primary/5 to-accent/10" />
              
              {/* Grid overlay */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}
              />

              {/* Animal markers */}
              {animals.map((animal, index) => (
                <div
                  key={animal.id}
                  className={cn(
                    "absolute cursor-pointer transition-all duration-300",
                    selectedAnimal === animal.id && "z-10 scale-125"
                  )}
                  style={{
                    left: `${15 + (index % 3) * 30}%`,
                    top: `${20 + Math.floor(index / 3) * 35}%`,
                  }}
                  onClick={() => setSelectedAnimal(animal.id === selectedAnimal ? null : animal.id)}
                >
                  <div className={cn(
                    "relative flex items-center justify-center",
                    animal.status === "alert" && "animate-bounce"
                  )}>
                    <div className={cn(
                      "absolute h-8 w-8 rounded-full opacity-30 animate-ping",
                      animal.status === "alert" ? "bg-destructive" : "bg-primary"
                    )} />
                    <div className={cn(
                      "absolute h-6 w-6 rounded-full opacity-50",
                      animal.status === "alert" ? "bg-destructive" : "bg-primary"
                    )} />
                    <div className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-transform",
                      animal.status === "alert" 
                        ? "bg-destructive text-destructive-foreground" 
                        : "bg-primary text-primary-foreground"
                    )}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className={cn(
                      "absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity",
                      selectedAnimal && selectedAnimal !== animal.id ? "opacity-50" : "opacity-100"
                    )}>
                      <Badge 
                        variant="outline" 
                        className="bg-card shadow-md text-xs"
                      >
                        {animal.name}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}

              {/* Fullscreen hint */}
              <div className="absolute top-3 right-3">
                <Button size="icon" variant="secondary" className="shadow-md h-8 w-8">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Live indicator */}
              <div className="absolute top-3 left-3">
                <Badge className="bg-destructive/90 text-destructive-foreground animate-pulse">
                  <Circle className="h-2 w-2 fill-current mr-1" />
                  LIVE
                </Badge>
              </div>
            </div>
          </div>

          {/* Animal List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            <h4 className="text-sm font-medium text-muted-foreground">
              Tracked Animals ({animals.length})
            </h4>
            {animals.map((animal) => (
              <div
                key={animal.id}
                className={cn(
                  "rounded-lg border p-3 cursor-pointer transition-all",
                  selectedAnimal === animal.id 
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "hover:border-muted-foreground/50 hover:shadow-sm"
                )}
                onClick={() => setSelectedAnimal(animal.id === selectedAnimal ? null : animal.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "h-2 w-2 rounded-full",
                      animal.status === "alert" ? "bg-destructive animate-pulse" : "bg-success"
                    )} />
                    <span className="font-medium">{animal.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {animal.type}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      animal.status === "alert"
                        ? "border-destructive text-destructive"
                        : "border-success text-success"
                    )}
                  >
                    {animal.status === "alert" ? "Alert" : "Safe"}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{animal.location}</span>
                  <span>{animal.lastUpdate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

