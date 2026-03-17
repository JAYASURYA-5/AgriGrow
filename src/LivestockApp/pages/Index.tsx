// placeholder for Index page
import { Layout } from "@livestock/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@livestock/components/ui/card";
import { Button } from "@livestock/components/ui/button";
import { Badge } from "@livestock/components/ui/badge";
import { QuickActions } from "@livestock/components/dashboard/QuickActions";
import { StatCard } from "@livestock/components/dashboard/StatCard";
import { MarketPrices } from "@livestock/components/dashboard/MarketPrices";
import { AnimalCard } from "@livestock/components/dashboard/AnimalCard";
import { 
  AlertCircle, 
  TrendingUp, 
  PawPrint, 
  Heart, 
  Thermometer,
  Droplets,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Animal {
  id: string;
  name: string;
  type: "cattle" | "sheep" | "goat" | "pig" | "chicken" | "horse";
  breed: string;
  status: "healthy" | "attention" | "critical";
  weight?: number;
  lastCheckup?: string;
  age?: string;
  location?: string;
  image?: string;
}

const mockAnimals: Animal[] = [
  {
    id: "1",
    name: "Bessie",
    type: "cattle",
    breed: "Holstein",
    status: "healthy",
    weight: 650,
    lastCheckup: "Today",
    age: "3 years",
    location: "Barn A",
    image: "https://via.placeholder.com/400x300?text=Bessie",
  },
  {
    id: "2",
    name: "Daisy",
    type: "cattle",
    breed: "Jersey",
    status: "attention",
    weight: 480,
    lastCheckup: "3 days ago",
    age: "2 years",
    location: "Barn B",
    image: "https://via.placeholder.com/400x300?text=Daisy",
  },
  {
    id: "3",
    name: "Baa-baa",
    type: "sheep",
    breed: "Merino",
    status: "healthy",
    weight: 85,
    lastCheckup: "5 days ago",
    age: "1.5 years",
    location: "Pasture A",
    image: "https://via.placeholder.com/400x300?text=Baa-baa",
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [alerts, setAlerts] = useState(0);

  useEffect(() => {
    // Calculate alerts
    const criticalAlerts = animals.filter(a => a.status === 'critical').length;
    const attentionAlerts = animals.filter(a => a.status === 'attention').length;
    setAlerts(criticalAlerts + attentionAlerts);
  }, [animals]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back to your livestock management system</p>
          </div>
          <Button onClick={() => navigate('/animals')} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Animal
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total Animals"
            value={animals.length.toString()}
            icon={PawPrint}
            variant="default"
            subtitle="+2 this month"
          />
          <StatCard
            title="Healthy"
            value={(animals.filter(a => a.status === 'healthy').length).toString()}
            icon={Heart}
            variant="success"
            subtitle="82% of total"
          />
          <StatCard
            title="Alerts"
            value={alerts.toString()}
            icon={AlertCircle}
            variant="warning"
            subtitle="Needs attention"
          />
          <StatCard
            title="Avg Temperature"
            value="23°C"
            icon={Thermometer}
            variant="accent"
            subtitle="Normal range"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Market Prices */}
        <MarketPrices />

        {/* Recent Animals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Animals</CardTitle>
            <Button variant="ghost" onClick={() => navigate('/animals')}>View All</Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {animals.slice(0, 3).map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts Section */}
        {alerts > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {animals
                  .filter(a => a.status === 'critical' || a.status === 'attention')
                  .map(animal => (
                    <div key={animal.id} className="flex items-center justify-between p-2 rounded-lg bg-background">
                      <div>
                        <p className="font-medium">{animal.name}</p>
                        <p className="text-sm text-muted-foreground">{animal.type} - {animal.breed}</p>
                      </div>
                      <Badge variant={animal.status === 'critical' ? 'destructive' : 'secondary'}>
                        {animal.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
