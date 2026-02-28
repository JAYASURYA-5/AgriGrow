// placeholder for ProductivityChart component
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", milk: 420, eggs: 180 },
  { name: "Tue", milk: 380, eggs: 210 },
  { name: "Wed", milk: 450, eggs: 195 },
  { name: "Thu", milk: 410, eggs: 220 },
  { name: "Fri", milk: 480, eggs: 205 },
  { name: "Sat", milk: 520, eggs: 240 },
  { name: "Sun", milk: 490, eggs: 225 },
];

export function ProductivityChart() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="mb-6">
        <h3 className="font-display text-xl font-semibold">Weekly Productivity</h3>
        <p className="text-sm text-muted-foreground">
          Milk yield and egg production trends
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="milkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(150, 45%, 25%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(150, 45%, 25%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="eggsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(35, 85%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(35, 85%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(45, 20%, 88%)" />
            <XAxis
              dataKey="name"
              stroke="hsl(150, 10%, 45%)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(150, 10%, 45%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(45, 40%, 99%)",
                border: "1px solid hsl(45, 20%, 88%)",
                borderRadius: "8px",
                boxShadow: "0 4px 20px -4px rgba(0,0,0,0.08)",
              }}
            />
            <Area
              type="monotone"
              dataKey="milk"
              stroke="hsl(150, 45%, 25%)"
              strokeWidth={2}
              fill="url(#milkGradient)"
              name="Milk (L)"
            />
            <Area
              type="monotone"
              dataKey="eggs"
              stroke="hsl(35, 85%, 55%)"
              strokeWidth={2}
              fill="url(#eggsGradient)"
              name="Eggs"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Milk (Liters)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Eggs</span>
        </div>
      </div>
    </div>
  );
}
