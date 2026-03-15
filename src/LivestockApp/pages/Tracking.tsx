// placeholder for Tracking page
import { useState } from "react";
import { MapPin, AlertTriangle, Navigation, Circle } from "lucide-react";
import { Layout } from "@livestock/components/layout/Layout";
import { StatCard } from "@livestock/components/dashboard/StatCard";
import { Badge } from "@livestock/components/ui/badge";
import { Button } from "@livestock/components/ui/button";
import { cn } from "@livestock/lib/utils";
import { LiveViewDialog } from "@livestock/components/tracking/LiveViewDialog";

const trackedAnimals = [
  { id: "1", name: "Bella", type: "cattle", location: "North Pasture", lat: 45.2, lng: -93.1, status: "inside" },
  { id: "2", name: "Max", type: "horse", location: "Stable A", lat: 45.21, lng: -93.12, status: "inside" },
  { id: "3", name: "Woolly", type: "sheep", location: "East Field", lat: 45.19, lng: -93.08, status: "alert" },
  { id: "4", name: "Ginger", type: "goat", location: "Hill Pasture", lat: 45.22, lng: -93.15, status: "inside" },
];

const geofences = [
  { id: "1", name: "North Pasture", color: "bg-success", animals: 42 },
  { id: "2", name: "East Field", color: "bg-primary", animals: 28 },
  { id: "3", name: "Stable Area", color: "bg-accent", animals: 15 },
  { id: "4", name: "Hill Pasture", color: "bg-warning", animals: 22 },
];

export default function Tracking() {
  const [isLiveViewOpen, setIsLiveViewOpen] = useState(false);

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-3">
              <span className="text-primary"><Navigation className="h-8 w-8" /></span>
              Animal Tracking
            </h1>
            <p className="mt-1 text-muted-foreground text-sm font-medium">
              Monitor animal locations and geo-fence alerts
            </p>
          </div>
          <Button variant="hero" onClick={() => setIsLiveViewOpen(true)}>
            <Navigation className="h-5 w-5" />
            Live View
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tracked Animals"
            value={107}
            icon={MapPin}
          />
          <StatCard
            title="Active GPS Tags"
            value={103}
            subtitle="96% online"
            icon={Navigation}
            variant="success"
          />
          <StatCard
            title="Geo-fence Alerts"
            value={2}
            subtitle="Today"
            icon={AlertTriangle}
            variant="warning"
          />
          <StatCard
            title="Outside Boundary"
            value={1}
            icon={AlertTriangle}
            variant="accent"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-card shadow-card overflow-hidden">
              <div className="relative h-[500px] bg-muted">
                {/* Simulated map background */}
                <div className="absolute inset-0 bg-gradient-to-br from-success/10 via-primary/5 to-accent/10" />

                {/* Grid overlay for map effect */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                      linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                  }}
                />

                {/* Animal markers */}
                {trackedAnimals.map((animal, index) => (
                  <div
                    key={animal.id}
                    className="absolute animate-pulse-slow"
                    style={{
                      left: `${20 + index * 20}%`,
                      top: `${30 + (index % 2) * 30}%`,
                    }}
                  >
                    <div className={cn(
                      "relative flex items-center justify-center",
                      animal.status === "alert" && "animate-bounce"
                    )}>
                      <div className={cn(
                        "absolute h-8 w-8 rounded-full opacity-30",
                        animal.status === "alert" ? "bg-destructive" : "bg-primary"
                      )} />
                      <div className={cn(
                        "relative flex h-10 w-10 items-center justify-center rounded-full shadow-lg",
                        animal.status === "alert"
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-primary text-primary-foreground"
                      )}>
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
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

                {/* Map controls */}
                <div className="absolute right-4 top-4 flex flex-col gap-2">
                  <Button size="icon" variant="secondary" className="shadow-md">
                    <span className="text-lg font-bold">+</span>
                  </Button>
                  <Button size="icon" variant="secondary" className="shadow-md">
                    <span className="text-lg font-bold">−</span>
                  </Button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 rounded-lg bg-card/95 p-4 shadow-lg backdrop-blur-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Geo-fence Zones
                  </p>
                  <div className="space-y-2">
                    {geofences.map((zone) => (
                      <div key={zone.id} className="flex items-center gap-2 text-sm">
                        <div className={cn("h-3 w-3 rounded-full", zone.color)} />
                        <span>{zone.name}</span>
                        <span className="text-muted-foreground">({zone.animals})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Alerts */}
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Active Alerts
              </h3>
              <div className="space-y-3">
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Woolly - Outside Boundary</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Detected 50m outside East Field geo-fence
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    2 minutes ago
                  </p>
                </div>
              </div>
            </div>

            {/* Tracked Animals List */}
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold mb-4">
                Recently Active
              </h3>
              <div className="space-y-3">
                {trackedAnimals.map((animal) => (
                  <div
                    key={animal.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-all hover:shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        animal.status === "alert"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-success/10 text-success"
                      )}>
                        <Circle className="h-3 w-3 fill-current" />
                      </div>
                      <div>
                        <p className="font-medium">{animal.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {animal.location}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        animal.status === "alert"
                          ? "border-destructive text-destructive"
                          : "border-success text-success"
                      )}
                    >
                      {animal.status === "alert" ? "Alert" : "Safe"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <LiveViewDialog
          open={isLiveViewOpen}
          onOpenChange={setIsLiveViewOpen}
        />
      </div>
    </Layout>
  );
}

