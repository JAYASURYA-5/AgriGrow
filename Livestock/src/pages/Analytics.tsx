// placeholder for Analytics page
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Download,
  Calendar,
  Droplets,
  Egg,
  PawPrint,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const milkProductionData = [
  { month: "Jan", yield: 420, target: 400 },
  { month: "Feb", yield: 450, target: 420 },
  { month: "Mar", yield: 480, target: 450 },
  { month: "Apr", yield: 510, target: 480 },
  { month: "May", yield: 495, target: 500 },
  { month: "Jun", yield: 520, target: 510 },
];

const eggProductionData = [
  { week: "Week 1", eggs: 180 },
  { week: "Week 2", eggs: 195 },
  { week: "Week 3", eggs: 210 },
  { week: "Week 4", eggs: 234 },
];

const animalDistribution = [
  { name: "Cattle", value: 45, color: "hsl(var(--primary))" },
  { name: "Goats", value: 35, color: "hsl(var(--accent))" },
  { name: "Sheep", value: 28, color: "hsl(var(--success))" },
  { name: "Chickens", value: 30, color: "hsl(var(--warning))" },
  { name: "Pigs", value: 12, color: "hsl(var(--muted-foreground))" },
  { name: "Horses", value: 6, color: "hsl(var(--destructive))" },
];

const healthTrendData = [
  { month: "Jan", healthy: 145, attention: 8, critical: 3 },
  { month: "Feb", healthy: 148, attention: 6, critical: 2 },
  { month: "Mar", healthy: 150, attention: 5, critical: 1 },
  { month: "Apr", healthy: 152, attention: 4, critical: 0 },
  { month: "May", healthy: 149, attention: 5, critical: 2 },
  { month: "Jun", healthy: 148, attention: 6, critical: 2 },
];

const feedCostData = [
  { month: "Jan", cost: 45000, feed: 1200 },
  { month: "Feb", cost: 48000, feed: 1300 },
  { month: "Mar", cost: 52000, feed: 1400 },
  { month: "Apr", cost: 49000, feed: 1350 },
  { month: "May", cost: 51000, feed: 1380 },
  { month: "Jun", cost: 53000, feed: 1420 },
];

const stats = [
  {
    title: "Total Milk Yield",
    value: "2,875 L",
    change: 8.5,
    positive: true,
    icon: Droplets,
    subtitle: "This month",
  },
  {
    title: "Eggs Collected",
    value: "819",
    change: 12.3,
    positive: true,
    icon: Egg,
    subtitle: "This month",
  },
  {
    title: "Feed Efficiency",
    value: "92%",
    change: 3.2,
    positive: true,
    icon: TrendingUp,
    subtitle: "Feed to output ratio",
  },
  {
    title: "Health Score",
    value: "94.8%",
    change: 1.5,
    positive: true,
    icon: PawPrint,
    subtitle: "Healthy animals",
  },
];

export default function Analytics() {
  return (
    <Layout>
      <div className="p-6 lg:p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Comprehensive insights into farm productivity and performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Last 6 Months
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <stat.icon className="h-5 w-5 text-primary" />
                    <Badge
                      variant="secondary"
                      className={
                        stat.positive
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {stat.positive ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {stat.change}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Milk Production Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                Milk Production Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={milkProductionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="yield"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    name="Actual Yield (L)"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    stroke="hsl(var(--muted-foreground))"
                    fill="hsl(var(--muted) / 0.2)"
                    name="Target (L)"
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Egg Production Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Egg className="h-5 w-5 text-accent" />
                Weekly Egg Production
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eggProductionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="eggs"
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                    name="Eggs"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Animal Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Animal Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={animalDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {animalDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Health Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Health Status Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="healthy"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    name="Healthy"
                  />
                  <Line
                    type="monotone"
                    dataKey="attention"
                    stroke="hsl(var(--warning))"
                    strokeWidth={2}
                    name="Needs Attention"
                  />
                  <Line
                    type="monotone"
                    dataKey="critical"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    name="Critical"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Feed Cost Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Feed Cost vs Consumption Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={feedCostData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === "cost" ? `₹${value.toLocaleString()}` : `${value} kg`,
                      name === "cost" ? "Cost" : "Feed Consumed",
                    ]}
                  />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="cost"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name="Cost (₹)"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="feed"
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                    name="Feed (kg)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
