// placeholder for Health page
import { useState } from "react";
import {
  HeartPulse,
  Syringe,
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AddHealthRecordDialog } from "@/components/health/AddHealthRecordDialog";

const healthRecords = [
  {
    id: "1",
    animal: "Bella",
    type: "cattle",
    date: "Jan 24, 2026",
    procedure: "Annual Vaccination",
    status: "completed",
    vet: "Dr. Smith",
    notes: "Brucellosis vaccine administered. No adverse reactions.",
  },
  {
    id: "2",
    animal: "Clucky",
    type: "chicken",
    date: "Jan 26, 2026",
    procedure: "Health Check",
    status: "scheduled",
    vet: "Dr. Johnson",
    notes: "Respiratory symptoms observed. Requires examination.",
  },
  {
    id: "3",
    animal: "Max",
    type: "horse",
    date: "Jan 20, 2026",
    procedure: "Dental Check",
    status: "completed",
    vet: "Dr. Smith",
    notes: "Minor teeth floating performed. Good overall dental health.",
  },
  {
    id: "4",
    animal: "Woolly",
    type: "sheep",
    date: "Jan 28, 2026",
    procedure: "Deworming",
    status: "scheduled",
    vet: "Dr. Brown",
    notes: "Scheduled deworming treatment.",
  },
];

const upcomingVaccinations = [
  { animal: "Bella", vaccine: "FMD Booster", dueDate: "Feb 2, 2026", daysLeft: 7 },
  { animal: "Max", vaccine: "Tetanus", dueDate: "Feb 5, 2026", daysLeft: 10 },
  { animal: "Rosie", vaccine: "Erysipelas", dueDate: "Feb 8, 2026", daysLeft: 13 },
  { animal: "Ginger", vaccine: "CDT", dueDate: "Feb 12, 2026", daysLeft: 17 },
];

export default function Health() {
  const [activeTab, setActiveTab] = useState<"records" | "vaccinations">(
    "records"
  );
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Health Monitoring</h1>
            <p className="text-muted-foreground">
              Track health records and vaccination schedules
            </p>
          </div>
          <Button variant="hero" onClick={() => setIsAddRecordOpen(true)}>
            <FileText className="h-5 w-5" />
            Add Record
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Health Checks"
            value={24}
            subtitle="This month"
            icon={HeartPulse}
            variant="success"
          />
          <StatCard
            title="Vaccinations Due"
            value={12}
            subtitle="Next 30 days"
            icon={Syringe}
            variant="warning"
          />
          <StatCard
            title="Active Treatments"
            value={3}
            icon={AlertCircle}
            variant="accent"
          />
          <StatCard
            title="Health Score"
            value="94%"
            icon={TrendingUp}
            trend={{ value: 2.5, positive: true }}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("records")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              activeTab === "records"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Health Records
          </button>
          <button
            onClick={() => setActiveTab("vaccinations")}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all",
              activeTab === "vaccinations"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Vaccination Schedule
          </button>
        </div>

        {/* Content */}
        {activeTab === "records" && (
          <div className="space-y-4">
            {healthRecords.map((record, index) => (
              <div
                key={record.id}
                className="animate-fade-in rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <HeartPulse className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{record.animal}</h3>
                        <Badge variant="outline" className="text-xs">
                          {record.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {record.procedure}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {record.notes}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right">
                      <p className="font-medium">{record.date}</p>
                      <p className="text-muted-foreground">{record.vet}</p>
                    </div>
                    <Badge
                      className={cn(
                        record.status === "completed"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-warning/10 text-warning border-warning/20"
                      )}
                    >
                      {record.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "vaccinations" && (
          <div className="rounded-xl border bg-card shadow-card">
            <div className="p-6">
              <h3 className="font-display text-lg font-semibold mb-4">
                Upcoming Vaccinations
              </h3>
              <div className="space-y-4">
                {upcomingVaccinations.map((vax, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                        <Syringe className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{vax.animal}</p>
                        <p className="text-sm text-muted-foreground">
                          {vax.vaccine}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{vax.dueDate}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "mt-1",
                          vax.daysLeft <= 7
                            ? "border-warning text-warning"
                            : "border-muted-foreground"
                        )}
                      >
                        {vax.daysLeft} days left
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <AddHealthRecordDialog
          open={isAddRecordOpen}
          onOpenChange={setIsAddRecordOpen}
        />
      </div>
    </Layout>
  );
}
