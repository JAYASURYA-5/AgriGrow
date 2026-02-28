// placeholder for Alerts page
import { useState } from "react";
import { Layout } from "@livestock/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@livestock/components/ui/card";
import { Button } from "@livestock/components/ui/button";
import { Badge } from "@livestock/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@livestock/components/ui/tabs";
import {
  Bell,
  AlertTriangle,
  Syringe,
  HeartPulse,
  Utensils,
  Thermometer,
  CheckCircle,
  Clock,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";

interface Alert {
  id: string;
  type: "vaccination" | "health" | "feeding" | "environment" | "general";
  title: string;
  message: string;
  time: string;
  priority: "low" | "medium" | "high";
  read: boolean;
  animalName?: string;
}

const initialAlerts: Alert[] = [
  {
    id: "1",
    type: "vaccination",
    title: "Vaccination Due Tomorrow",
    message: "Bella (Cattle) needs her annual Brucellosis vaccination.",
    time: "2 hours ago",
    priority: "high",
    read: false,
    animalName: "Bella",
  },
  {
    id: "2",
    type: "health",
    title: "Health Alert - Critical",
    message: "Clucky is showing signs of respiratory distress. Immediate attention required.",
    time: "4 hours ago",
    priority: "high",
    read: false,
    animalName: "Clucky",
  },
  {
    id: "3",
    type: "feeding",
    title: "Feed Stock Running Low",
    message: "Grain supplies are at 15%. Consider restocking within 3 days.",
    time: "6 hours ago",
    priority: "medium",
    read: false,
  },
  {
    id: "4",
    type: "environment",
    title: "Temperature Warning",
    message: "Main Barn temperature is 32°C, above recommended range for cattle.",
    time: "8 hours ago",
    priority: "medium",
    read: true,
  },
  {
    id: "5",
    type: "vaccination",
    title: "Vaccination Schedule",
    message: "5 goats due for deworming next week. Schedule appointment.",
    time: "1 day ago",
    priority: "medium",
    read: true,
  },
  {
    id: "6",
    type: "general",
    title: "Weekly Report Ready",
    message: "Your weekly productivity report is ready for review.",
    time: "1 day ago",
    priority: "low",
    read: true,
  },
  {
    id: "7",
    type: "health",
    title: "Health Check Reminder",
    message: "Woolly (Sheep) is due for routine health check.",
    time: "2 days ago",
    priority: "low",
    read: true,
    animalName: "Woolly",
  },
  {
    id: "8",
    type: "feeding",
    title: "Feed Schedule Updated",
    message: "Summer feeding schedule is now active for all animals.",
    time: "3 days ago",
    priority: "low",
    read: true,
  },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filter, setFilter] = useState("all");

  const getIcon = (type: string) => {
    switch (type) {
      case "vaccination":
        return <Syringe className="h-5 w-5 text-accent" />;
      case "health":
        return <HeartPulse className="h-5 w-5 text-destructive" />;
      case "feeding":
        return <Utensils className="h-5 w-5 text-warning" />;
      case "environment":
        return <Thermometer className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert))
    );
    toast.success("Marked as read");
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })));
    toast.success("All alerts marked as read");
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    toast.success("Alert deleted");
  };

  const clearAllRead = () => {
    setAlerts((prev) => prev.filter((alert) => !alert.read));
    toast.success("Cleared all read alerts");
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    if (filter === "unread") return !alert.read;
    return alert.type === filter;
  });

  const unreadCount = alerts.filter((a) => !a.read).length;
  const highPriorityCount = alerts.filter((a) => a.priority === "high" && !a.read).length;

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-3">
              <span className="text-primary"><Bell className="h-8 w-8" /></span>
              Alerts & Notifications
              {unreadCount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {unreadCount} unread
                </Badge>
              )}
            </h1>
            <p className="mt-1 text-muted-foreground text-sm font-medium">
              Stay updated on critical farm events and reminders
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" onClick={clearAllRead}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Read
            </Button>
          </div>
        </div>

        {/* Priority Summary */}
        {highPriorityCount > 0 && (
          <Card className="mb-6 border-destructive bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">
                    {highPriorityCount} High Priority Alert{highPriorityCount > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Immediate attention required
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="vaccination">Vaccination</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="feeding">Feeding</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            <div className="space-y-4">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className={`transition-all ${!alert.read ? "border-l-4 border-l-primary bg-primary/5" : ""
                      }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                          {getIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold">{alert.title}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {alert.message}
                              </p>
                              {alert.animalName && (
                                <Badge variant="outline" className="mt-2">
                                  {alert.animalName}
                                </Badge>
                              )}
                            </div>
                            <Badge className={getPriorityColor(alert.priority)}>
                              {alert.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {alert.time}
                            </div>
                            <div className="flex gap-2">
                              {!alert.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(alert.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Mark Read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteAlert(alert.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No alerts found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

