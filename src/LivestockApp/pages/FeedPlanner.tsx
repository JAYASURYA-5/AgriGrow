// placeholder for FeedPlanner page
import { useState } from "react";
import { Layout } from "@livestock/components/layout/Layout";
import { Button } from "@livestock/components/ui/button";
import { Input } from "@livestock/components/ui/input";
import { Label } from "@livestock/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@livestock/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@livestock/components/ui/card";
import { Utensils, Calculator, IndianRupee, Leaf, Info } from "lucide-react";

interface FeedRecommendation {
  feed: string;
  quantity: string;
  frequency: string;
  costPerDay: number;
  notes: string[];
}

const feedDatabase: Record<string, Record<string, FeedRecommendation>> = {
  cattle: {
    young: {
      feed: "Calf Starter Mix + Green Fodder",
      quantity: "2-4 kg/day",
      frequency: "3 times daily",
      costPerDay: 150,
      notes: [
        "Ensure access to clean water",
        "Include mineral supplements",
        "Gradually increase green fodder",
      ],
    },
    adult: {
      feed: "Concentrate Mix + Dry/Green Fodder",
      quantity: "8-12 kg/day",
      frequency: "2-3 times daily",
      costPerDay: 350,
      notes: [
        "Balance roughage and concentrate ratio",
        "Add mineral mixture 50g/day",
        "Adjust based on milk production",
      ],
    },
    senior: {
      feed: "Easily Digestible Fodder + Supplements",
      quantity: "6-8 kg/day",
      frequency: "2-3 times daily",
      costPerDay: 280,
      notes: [
        "Softer feeds preferred",
        "Monitor weight regularly",
        "Include calcium supplements",
      ],
    },
  },
  goat: {
    young: {
      feed: "Kid Starter + Browse/Leaves",
      quantity: "0.5-1 kg/day",
      frequency: "3-4 times daily",
      costPerDay: 40,
      notes: [
        "Provide colostrum initially",
        "Introduce solid feed gradually",
        "Fresh leaves preferred",
      ],
    },
    adult: {
      feed: "Concentrate + Tree Leaves + Fodder",
      quantity: "2-3 kg/day",
      frequency: "2 times daily",
      costPerDay: 80,
      notes: [
        "Allow browsing time",
        "Include mineral licks",
        "Avoid toxic plants",
      ],
    },
    senior: {
      feed: "Soft Fodder + Supplements",
      quantity: "1.5-2 kg/day",
      frequency: "2 times daily",
      costPerDay: 65,
      notes: [
        "Easy to chew feeds",
        "Monitor teeth condition",
        "Extra vitamins needed",
      ],
    },
  },
  sheep: {
    young: {
      feed: "Lamb Starter + Pasture",
      quantity: "0.3-0.8 kg/day",
      frequency: "3 times daily",
      costPerDay: 35,
      notes: [
        "Creep feeding recommended",
        "Quality pasture access",
        "Clean water essential",
      ],
    },
    adult: {
      feed: "Pasture + Concentrate Mix",
      quantity: "2-3 kg/day",
      frequency: "2 times daily",
      costPerDay: 70,
      notes: [
        "Rotational grazing ideal",
        "Salt licks needed",
        "Deworm regularly",
      ],
    },
    senior: {
      feed: "Quality Hay + Supplements",
      quantity: "1.5-2 kg/day",
      frequency: "2 times daily",
      costPerDay: 55,
      notes: [
        "Dental checks important",
        "Softer feeds preferred",
        "Vitamin supplements",
      ],
    },
  },
  chicken: {
    young: {
      feed: "Chick Starter Mash",
      quantity: "20-50g/day",
      frequency: "Free access",
      costPerDay: 5,
      notes: [
        "High protein (20-22%)",
        "Keep feed dry",
        "Fresh water always",
      ],
    },
    adult: {
      feed: "Layer/Broiler Feed",
      quantity: "100-150g/day",
      frequency: "2 times daily",
      costPerDay: 12,
      notes: [
        "Calcium for layers",
        "Grit for digestion",
        "Avoid moldy feed",
      ],
    },
    senior: {
      feed: "Maintenance Feed",
      quantity: "80-120g/day",
      frequency: "2 times daily",
      costPerDay: 10,
      notes: [
        "Lower protein okay",
        "Oyster shell for calcium",
        "Monitor egg production",
      ],
    },
  },
  pig: {
    young: {
      feed: "Pig Starter Pellets",
      quantity: "0.5-1.5 kg/day",
      frequency: "3 times daily",
      costPerDay: 60,
      notes: [
        "High protein feed",
        "Creep feeding recommended",
        "Clean environment",
      ],
    },
    adult: {
      feed: "Grower/Finisher Feed",
      quantity: "2.5-4 kg/day",
      frequency: "2 times daily",
      costPerDay: 120,
      notes: [
        "Balanced protein/energy",
        "Avoid sudden changes",
        "Fresh water always",
      ],
    },
    senior: {
      feed: "Maintenance Ration",
      quantity: "2-3 kg/day",
      frequency: "2 times daily",
      costPerDay: 90,
      notes: [
        "Lower energy feed",
        "Monitor weight",
        "Quality over quantity",
      ],
    },
  },
  horse: {
    young: {
      feed: "Foal Feed + Quality Hay",
      quantity: "2-4 kg/day",
      frequency: "3 times daily",
      costPerDay: 200,
      notes: [
        "High quality protein",
        "Gradual weaning",
        "Pasture access",
      ],
    },
    adult: {
      feed: "Hay + Grain Mix + Pasture",
      quantity: "8-12 kg/day",
      frequency: "2-3 times daily",
      costPerDay: 400,
      notes: [
        "Roughage is key",
        "Work load adjusts feed",
        "Salt block access",
      ],
    },
    senior: {
      feed: "Senior Horse Feed + Soft Hay",
      quantity: "6-10 kg/day",
      frequency: "3 times daily",
      costPerDay: 350,
      notes: [
        "Easily digestible",
        "Dental care critical",
        "Extra supplements",
      ],
    },
  },
};

const seasonalTips: Record<string, string[]> = {
  summer: [
    "Increase water availability by 20-30%",
    "Provide shade and cooling systems",
    "Feed during cooler hours",
    "Include electrolytes in water",
  ],
  monsoon: [
    "Store feed in dry conditions",
    "Check for mold in fodder",
    "Deworm animals regularly",
    "Maintain drainage in sheds",
  ],
  winter: [
    "Increase energy-rich feeds",
    "Provide warm bedding",
    "Ensure lukewarm water",
    "Protect from cold winds",
  ],
};

export default function FeedPlanner() {
  const [animalType, setAnimalType] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [weight, setWeight] = useState("");
  const [count, setCount] = useState("1");
  const [recommendation, setRecommendation] = useState<FeedRecommendation | null>(null);
  const [currentSeason] = useState(() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return "summer";
    if (month >= 6 && month <= 9) return "monsoon";
    return "winter";
  });

  const calculateFeed = () => {
    if (!animalType || !ageGroup) return;
    const rec = feedDatabase[animalType]?.[ageGroup];
    if (rec) {
      setRecommendation(rec);
    }
  };

  const totalCost = recommendation
    ? recommendation.costPerDay * parseInt(count || "1") * 30
    : 0;

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-3">
            <span className="text-primary"><Utensils className="h-8 w-8" /></span>
            Feed Planner
          </h1>
          <p className="mt-1 text-muted-foreground text-sm font-medium">
            Optimize nutrition and manage feed costs
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculate Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Animal Type</Label>
                <Select value={animalType} onValueChange={setAnimalType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select animal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cattle">Cattle</SelectItem>
                    <SelectItem value="goat">Goat</SelectItem>
                    <SelectItem value="sheep">Sheep</SelectItem>
                    <SelectItem value="chicken">Chicken</SelectItem>
                    <SelectItem value="pig">Pig</SelectItem>
                    <SelectItem value="horse">Horse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Age Group</Label>
                <Select value={ageGroup} onValueChange={setAgeGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="young">Young (0-1 year)</SelectItem>
                    <SelectItem value="adult">Adult (1-7 years)</SelectItem>
                    <SelectItem value="senior">Senior (7+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Weight (kg) - Optional</Label>
                <Input
                  type="number"
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Number of Animals</Label>
                <Input
                  type="number"
                  min="1"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                />
              </div>

              <Button onClick={calculateFeed} className="w-full">
                Calculate Recommendation
              </Button>
            </CardContent>
          </Card>

          {/* Recommendation Output */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-success" />
                Feed Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recommendation ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                      <p className="text-sm text-muted-foreground">
                        Recommended Feed
                      </p>
                      <p className="text-lg font-semibold">
                        {recommendation.feed}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <p className="text-sm text-muted-foreground">
                        Daily Quantity (per animal)
                      </p>
                      <p className="text-lg font-semibold">
                        {recommendation.quantity}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <p className="text-sm text-muted-foreground">
                        Feeding Frequency
                      </p>
                      <p className="text-lg font-semibold">
                        {recommendation.frequency}
                      </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                      <p className="text-sm text-muted-foreground">
                        Daily Cost (per animal)
                      </p>
                      <p className="text-lg font-semibold flex items-center">
                        <IndianRupee className="h-4 w-4" />
                        {recommendation.costPerDay}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-success/10 p-4">
                    <p className="text-sm font-medium text-success mb-2 flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" />
                      Monthly Cost Estimation
                    </p>
                    <p className="text-2xl font-bold">
                      ₹{totalCost.toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      For {count} animal(s) × 30 days
                    </p>
                  </div>

                  <div className="rounded-lg border bg-accent/10 p-4">
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-accent" />
                      Feeding Tips
                    </p>
                    <ul className="space-y-1">
                      {recommendation.notes.map((note, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary">•</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Select animal type and age group to get feed recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seasonal Tips */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="capitalize">
                {currentSeason} Season Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {seasonalTips[currentSeason].map((tip, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border bg-card p-4 flex items-start gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-primary font-semibold">
                        {idx + 1}
                      </span>
                    </div>
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

