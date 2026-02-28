// placeholder for Environment page
import { useState, useEffect } from "react";
import { Layout } from "@livestock/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@livestock/components/ui/card";
import { Badge } from "@livestock/components/ui/badge";
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Cloud,
  CloudRain,
  AlertTriangle,
  CheckCircle,
  Info,
  MapPin,
} from "lucide-react";

interface EnvironmentData {
  location: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  lastUpdated: string;
}

interface SafeRange {
  min: number;
  max: number;
  unit: string;
}

const safeRanges: Record<string, { temperature: SafeRange; humidity: SafeRange }> = {
  cattle: {
    temperature: { min: 5, max: 25, unit: "°C" },
    humidity: { min: 40, max: 80, unit: "%" },
  },
  goat: {
    temperature: { min: 10, max: 30, unit: "°C" },
    humidity: { min: 50, max: 70, unit: "%" },
  },
  sheep: {
    temperature: { min: 5, max: 25, unit: "°C" },
    humidity: { min: 50, max: 70, unit: "%" },
  },
  chicken: {
    temperature: { min: 18, max: 28, unit: "°C" },
    humidity: { min: 50, max: 75, unit: "%" },
  },
  pig: {
    temperature: { min: 15, max: 25, unit: "°C" },
    humidity: { min: 50, max: 70, unit: "%" },
  },
  horse: {
    temperature: { min: 5, max: 25, unit: "°C" },
    humidity: { min: 45, max: 75, unit: "%" },
  },
};

const careTips: Record<string, string[]> = {
  hot: [
    "Provide ample shade and shelter from direct sunlight",
    "Increase water availability by 30-50%",
    "Install fans or misting systems in shelters",
    "Avoid heavy work during peak heat hours",
    "Consider feeding during cooler morning/evening hours",
  ],
  cold: [
    "Ensure adequate bedding for insulation",
    "Block drafts while maintaining ventilation",
    "Provide warm water to encourage drinking",
    "Increase feed ration for extra energy",
    "Check for signs of hypothermia regularly",
  ],
  humid: [
    "Improve ventilation in animal shelters",
    "Keep bedding dry and change frequently",
    "Watch for respiratory infections",
    "Reduce overcrowding in shelters",
    "Consider using dehumidifiers if possible",
  ],
  normal: [
    "Maintain regular feeding schedule",
    "Ensure clean water is always available",
    "Continue routine health monitoring",
    "Keep shelters clean and well-ventilated",
    "Allow adequate outdoor time for exercise",
  ],
};

const mockLocations: EnvironmentData[] = [
  {
    location: "Main Barn",
    temperature: 28,
    humidity: 65,
    windSpeed: 8,
    condition: "sunny",
    lastUpdated: "5 min ago",
  },
  {
    location: "North Pasture",
    temperature: 32,
    humidity: 55,
    windSpeed: 12,
    condition: "cloudy",
    lastUpdated: "10 min ago",
  },
  {
    location: "Poultry House",
    temperature: 26,
    humidity: 70,
    windSpeed: 3,
    condition: "sunny",
    lastUpdated: "2 min ago",
  },
  {
    location: "Stable A",
    temperature: 24,
    humidity: 60,
    windSpeed: 5,
    condition: "cloudy",
    lastUpdated: "8 min ago",
  },
];

export default function Environment() {
  const [locations, setLocations] = useState<EnvironmentData[]>(mockLocations);
  const [selectedLocation, setSelectedLocation] = useState<EnvironmentData>(
    mockLocations[0]
  );

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLocations((prev) =>
        prev.map((loc) => ({
          ...loc,
          temperature: loc.temperature + (Math.random() - 0.5) * 2,
          humidity: Math.min(100, Math.max(0, loc.humidity + (Math.random() - 0.5) * 5)),
          lastUpdated: "Just now",
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-warning" />;
      case "cloudy":
        return <Cloud className="h-6 w-6 text-muted-foreground" />;
      case "rainy":
        return <CloudRain className="h-6 w-6 text-primary" />;
      default:
        return <Sun className="h-6 w-6" />;
    }
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp > 30) return { status: "high", label: "High", color: "bg-destructive" };
    if (temp < 10) return { status: "low", label: "Low", color: "bg-primary" };
    return { status: "normal", label: "Normal", color: "bg-success" };
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity > 80) return { status: "high", label: "High", color: "bg-warning" };
    if (humidity < 40) return { status: "low", label: "Low", color: "bg-warning" };
    return { status: "normal", label: "Normal", color: "bg-success" };
  };

  const getCurrentTips = () => {
    const temp = selectedLocation.temperature;
    const humidity = selectedLocation.humidity;

    if (temp > 30) return careTips.hot;
    if (temp < 10) return careTips.cold;
    if (humidity > 80) return careTips.humid;
    return careTips.normal;
  };

  const tempStatus = getTemperatureStatus(selectedLocation.temperature);
  const humidityStatus = getHumidityStatus(selectedLocation.humidity);

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
            <Thermometer className="h-8 w-8 text-primary" />
            Environment Monitoring
          </h1>
          <p className="mt-1 text-muted-foreground">
            Monitor farm environment conditions for optimal animal welfare
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Location Cards */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Farm Locations</h2>
            {locations.map((loc, idx) => (
              <Card
                key={idx}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedLocation.location === loc.location
                    ? "ring-2 ring-primary"
                    : ""
                  }`}
                onClick={() => setSelectedLocation(loc)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{loc.location}</p>
                        <p className="text-xs text-muted-foreground">
                          Updated {loc.lastUpdated}
                        </p>
                      </div>
                    </div>
                    {getConditionIcon(loc.condition)}
                  </div>
                  <div className="mt-3 flex gap-4">
                    <div className="flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium">
                        {loc.temperature.toFixed(1)}°C
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        {loc.humidity.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedLocation.location}</span>
                  {getConditionIcon(selectedLocation.condition)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5">
                    <Thermometer className="h-10 w-10 mx-auto mb-2 text-destructive" />
                    <p className="text-4xl font-bold">
                      {selectedLocation.temperature.toFixed(1)}°C
                    </p>
                    <Badge className={`mt-2 ${tempStatus.color}`}>
                      {tempStatus.label}
                    </Badge>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                    <Droplets className="h-10 w-10 mx-auto mb-2 text-primary" />
                    <p className="text-4xl font-bold">
                      {selectedLocation.humidity.toFixed(0)}%
                    </p>
                    <Badge className={`mt-2 ${humidityStatus.color}`}>
                      {humidityStatus.label}
                    </Badge>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30">
                    <Wind className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-4xl font-bold">
                      {selectedLocation.windSpeed} km/h
                    </p>
                    <Badge className="mt-2 bg-muted text-muted-foreground">
                      Wind Speed
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            {(tempStatus.status !== "normal" || humidityStatus.status !== "normal") && (
              <Card className="border-warning bg-warning/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-warning shrink-0" />
                    <div>
                      <p className="font-semibold">Environment Alert</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {tempStatus.status === "high" && "Temperature is above safe range. Take cooling measures."}
                        {tempStatus.status === "low" && "Temperature is below safe range. Provide warmth."}
                        {humidityStatus.status === "high" && " Humidity is high. Improve ventilation."}
                        {humidityStatus.status === "low" && " Humidity is low. Consider misting."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Safe Ranges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Safe Ranges by Animal Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(safeRanges).map(([animal, ranges]) => (
                    <div key={animal} className="rounded-lg border p-4">
                      <p className="font-medium capitalize mb-2">{animal}</p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>🌡️ Temp: {ranges.temperature.min}-{ranges.temperature.max}°C</p>
                        <p>💧 Humidity: {ranges.humidity.min}-{ranges.humidity.max}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Care Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Weather-Based Care Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {getCurrentTips().map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-xs font-semibold text-primary">
                          {idx + 1}
                        </span>
                      </div>
                      <p className="text-sm">{tip}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

