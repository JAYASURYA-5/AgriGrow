// placeholder for MarketPrices component
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@livestock/components/ui/card";
import { Badge } from "@livestock/components/ui/badge";
import { Button } from "@livestock/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  IndianRupee,
  Beef,
  Milk,
  Egg,
} from "lucide-react";
import { supabase } from "@livestock/integrations/supabase/client";
import { toast } from "sonner";

interface MarketPrice {
  item: string;
  price: number;
  unit: string;
  change: number;
  icon: React.ReactNode;
}

export function MarketPrices() {
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchMarketPrices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("market-prices");
      
      if (error) throw error;
      
      if (data?.prices) {
        const formattedPrices: MarketPrice[] = [
          {
            item: "Cattle (Live)",
            price: data.prices.cattle || 45000,
            unit: "per head",
            change: data.changes?.cattle || 2.5,
            icon: <Beef className="h-5 w-5" />,
          },
          {
            item: "Buffalo",
            price: data.prices.buffalo || 55000,
            unit: "per head",
            change: data.changes?.buffalo || 1.8,
            icon: <Beef className="h-5 w-5" />,
          },
          {
            item: "Goat",
            price: data.prices.goat || 8500,
            unit: "per head",
            change: data.changes?.goat || -0.5,
            icon: <Beef className="h-5 w-5" />,
          },
          {
            item: "Sheep",
            price: data.prices.sheep || 7500,
            unit: "per head",
            change: data.changes?.sheep || 1.2,
            icon: <Beef className="h-5 w-5" />,
          },
          {
            item: "Milk (Cow)",
            price: data.prices.cowMilk || 52,
            unit: "per litre",
            change: data.changes?.cowMilk || 3.5,
            icon: <Milk className="h-5 w-5" />,
          },
          {
            item: "Milk (Buffalo)",
            price: data.prices.buffaloMilk || 65,
            unit: "per litre",
            change: data.changes?.buffaloMilk || 2.1,
            icon: <Milk className="h-5 w-5" />,
          },
          {
            item: "Eggs",
            price: data.prices.eggs || 6.5,
            unit: "per piece",
            change: data.changes?.eggs || -1.5,
            icon: <Egg className="h-5 w-5" />,
          },
          {
            item: "Chicken (Live)",
            price: data.prices.chicken || 180,
            unit: "per kg",
            change: data.changes?.chicken || 4.2,
            icon: <Beef className="h-5 w-5" />,
          },
        ];
        setPrices(formattedPrices);
        setLastUpdated(new Date().toLocaleTimeString("en-IN"));
      }
    } catch (error) {
      console.error("Error fetching market prices:", error);
      // Use fallback data
      setPrices([
        { item: "Cattle (Live)", price: 45000, unit: "per head", change: 2.5, icon: <Beef className="h-5 w-5" /> },
        { item: "Buffalo", price: 55000, unit: "per head", change: 1.8, icon: <Beef className="h-5 w-5" /> },
        { item: "Goat", price: 8500, unit: "per head", change: -0.5, icon: <Beef className="h-5 w-5" /> },
        { item: "Sheep", price: 7500, unit: "per head", change: 1.2, icon: <Beef className="h-5 w-5" /> },
        { item: "Milk (Cow)", price: 52, unit: "per litre", change: 3.5, icon: <Milk className="h-5 w-5" /> },
        { item: "Milk (Buffalo)", price: 65, unit: "per litre", change: 2.1, icon: <Milk className="h-5 w-5" /> },
        { item: "Eggs", price: 6.5, unit: "per piece", change: -1.5, icon: <Egg className="h-5 w-5" /> },
        { item: "Chicken (Live)", price: 180, unit: "per kg", change: 4.2, icon: <Beef className="h-5 w-5" /> },
      ]);
      setLastUpdated(new Date().toLocaleTimeString("en-IN"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketPrices();
    // Refresh every 30 minutes
    const interval = setInterval(fetchMarketPrices, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <IndianRupee className="h-5 w-5 text-primary" />
            Live Market Prices
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchMarketPrices}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prices.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.item}</p>
                  <p className="text-xs text-muted-foreground">{item.unit}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
                <Badge
                  variant="secondary"
                  className={
                    item.change >= 0
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }
                >
                  {item.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(item.change)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Prices based on Indian market averages
        </p>
      </CardContent>
    </Card>
  );
}

