import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PawPrint,
  HeartPulse,
  AlertTriangle,
  Syringe,
  Droplets,
  Egg,
  Plus,
  Beef,
  Milk
} from "lucide-react";
import { Layout } from "@livestock/components/layout/Layout";
import { StatCard } from "@livestock/components/dashboard/StatCard";
import { AnimalCard } from "@livestock/components/dashboard/AnimalCard";
import { AlertItem } from "@livestock/components/dashboard/AlertItem";
import { QuickActions } from "@livestock/components/dashboard/QuickActions";
import { ProductivityChart } from "@livestock/components/dashboard/ProductivityChart";
import { MarketPrices } from "@livestock/components/dashboard/MarketPrices";
import { AddProductionDialog } from "@livestock/components/dashboard/AddProductionDialog";
import { mockAnimals, mockAlerts, farmStats } from "@livestock/data/mockData";
import { Button } from "@livestock/components/ui/button";
import { supabase } from "@livestock/integrations/supabase/client";

interface ProductionData {
  category: string;
  quantity: number;
  unit: string;
  animal_type: string;
}

const Index = () => {
    // Back to Home quick actions
    const handleBackToHome = () => {
      navigate('/');
      // Optionally, you can scroll to the quick actions area after navigation
      setTimeout(() => {
        const quickActions = document.querySelector('[data-quick-actions]');
        if (quickActions) quickActions.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    };
  const navigate = useNavigate();
  const [isProductionDialogOpen, setIsProductionDialogOpen] = useState(false);
  const [todayProduction, setTodayProduction] = useState<ProductionData[]>([]);

  const fetchTodayProduction = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from("daily_production")
      .select("category, quantity, unit, animal_type")
      .eq("date", today);

    if (data) {
      setTodayProduction(data);
    }
  };

  useEffect(() => {
    fetchTodayProduction();
  }, []);

  const getTotalByCategory = (category: string) => {
    return todayProduction
      .filter(p => p.category === category)
      .reduce((sum, p) => sum + Number(p.quantity), 0);
  };

  const milkTotal = getTotalByCategory("milk");
  const eggsTotal = getTotalByCategory("eggs");

  return (
    <Layout>
      {/* Back Button */}
      <div className="mb-4 flex items-center">
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          aria-label="Back to Home"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Back</span>
        </button>
      </div>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight">
            Good morning, Farmer! 🌾
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here's what's happening on your farm today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <StatCard
            title="Total Animals"
            value={farmStats.totalAnimals}
            icon={PawPrint}
            trend={{ value: 3.2, positive: true }}
            className="bg-card border-border/50"
          />
          <StatCard
            title="Healthy"
            value={farmStats.healthyAnimals}
            icon={HeartPulse}
            variant="success"
            className="bg-[#e8f5e9] border-transparent"
          />
          <StatCard
            title="Needs Attention"
            value={farmStats.needsAttention}
            icon={AlertTriangle}
            variant="warning"
            className="bg-[#fff8e1] border-transparent"
          />
          <StatCard
            title="Critical"
            value={farmStats.critical}
            icon={AlertTriangle}
            variant="accent"
            className="bg-[#fff3e0] border-transparent"
          />
          <StatCard
            title="Vaccines Due"
            value={farmStats.vaccinesDue}
            icon={Syringe}
            subtitle="Next 7 days"
            className="bg-card border-border/50"
          />
          <StatCard
            title="Milk Today"
            value={`${farmStats.avgMilkYield}L`}
            icon={Droplets}
            trend={{ value: 8.5, positive: true }}
            className="bg-card border-border/50"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Animals & Chart */}
          <div className="space-y-6 lg:col-span-2">
            {/* Recent Animals */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold">
                    Your Animals
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Quick overview of your livestock
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate("/Livestock/animals")}>
                  View All
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {mockAnimals.slice(0, 6).map((animal, index) => (
                  <div
                    key={animal.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <AnimalCard animal={animal} />
                  </div>
                ))}
              </div>
            </div>

            {/* Productivity Chart */}
            <ProductivityChart />
          </div>

          {/* Right Column - Alerts & Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <QuickActions />

            {/* Market Prices */}
            <MarketPrices />

            {/* Recent Alerts */}
            <div className="rounded-xl border bg-card p-6 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold">
                  Recent Alerts
                </h3>
                <Button variant="ghost" size="sm" className="text-primary" onClick={() => navigate("/Livestock/alerts")}>
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {mockAlerts.slice(0, 3).map((alert, index) => (
                  <div
                    key={alert.id}
                    className="animate-slide-in-right"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <AlertItem alert={alert} />
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Production */}
            <div className="rounded-xl border bg-gradient-card p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold">
                  Today's Production
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsProductionDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Droplets className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Milk Collected</p>
                      <p className="text-sm text-muted-foreground">
                        Today's total
                      </p>
                    </div>
                  </div>
                  <p className="text-xl font-bold">
                    {milkTotal > 0 ? `${milkTotal}L` : `${farmStats.avgMilkYield}L`}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Egg className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Eggs Collected</p>
                      <p className="text-sm text-muted-foreground">
                        Today's total
                      </p>
                    </div>
                  </div>
                  <p className="text-xl font-bold">
                    {eggsTotal > 0 ? eggsTotal : farmStats.eggsToday}
                  </p>
                </div>

                {/* Show other production entries */}
                {todayProduction
                  .filter(p => !["milk", "eggs"].includes(p.category))
                  .map((prod, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                          <Beef className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">{prod.category}</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {prod.animal_type}
                          </p>
                        </div>
                      </div>
                      <p className="text-xl font-bold">
                        {prod.quantity}{prod.unit}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <AddProductionDialog
          open={isProductionDialogOpen}
          onOpenChange={setIsProductionDialogOpen}
          onProductionAdded={fetchTodayProduction}
        />
      </div>
    </Layout>
  );
};

export default Index;
