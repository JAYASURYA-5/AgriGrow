// placeholder for Animals page
import { useState } from "react";
import { Plus, Search, Filter, Grid, List, PawPrint } from "lucide-react";
import { Layout } from "@livestock/components/layout/Layout";
import { AnimalCard } from "@livestock/components/dashboard/AnimalCard";
import { Button } from "@livestock/components/ui/button";
import { Input } from "@livestock/components/ui/input";
import { Badge } from "@livestock/components/ui/badge";
import { mockAnimals } from "@livestock/data/mockData";
import { cn } from "@livestock/lib/utils";
import { AddAnimalDialog } from "@livestock/components/animals/AddAnimalDialog";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Cattle", value: "cattle" },
  { label: "Sheep", value: "sheep" },
  { label: "Goats", value: "goat" },
  { label: "Pigs", value: "pig" },
  { label: "Chickens", value: "chicken" },
  { label: "Horses", value: "horse" },
];

const statusFilters = [
  { label: "All Status", value: "all" },
  { label: "Healthy", value: "healthy" },
  { label: "Attention", value: "attention" },
  { label: "Critical", value: "critical" },
];

export default function Animals() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredAnimals = mockAnimals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(search.toLowerCase()) ||
      animal.breed.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || animal.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || animal.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground flex items-center gap-3">
              <span className="text-primary"><PawPrint className="h-8 w-8" /></span>
              Animals
            </h1>
            <p className="mt-1 text-muted-foreground text-sm font-medium">
              Manage and monitor all your livestock
            </p>
          </div>
          <Button variant="hero" size="lg" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-5 w-5" />
            Add Animal
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          {/* Search and View Toggle */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search animals by name or breed..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <Badge
                key={option.value}
                variant={typeFilter === option.value ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-3 py-1.5 text-sm transition-all hover:scale-105",
                  typeFilter === option.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-primary/10"
                )}
                onClick={() => setTypeFilter(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((option) => (
              <Badge
                key={option.value}
                variant="outline"
                className={cn(
                  "cursor-pointer px-3 py-1.5 text-sm transition-all",
                  statusFilter === option.value &&
                  option.value === "healthy" &&
                  "border-success bg-success/10 text-success",
                  statusFilter === option.value &&
                  option.value === "attention" &&
                  "border-warning bg-warning/10 text-warning",
                  statusFilter === option.value &&
                  option.value === "critical" &&
                  "border-destructive bg-destructive/10 text-destructive",
                  statusFilter === option.value &&
                  option.value === "all" &&
                  "bg-primary text-primary-foreground"
                )}
                onClick={() => setStatusFilter(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {filteredAnimals.length} of {mockAnimals.length} animals
        </p>

        {/* Animals Grid */}
        <div
          className={cn(
            "grid gap-4",
            viewMode === "grid"
              ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          )}
        >
          {filteredAnimals.map((animal, index) => (
            <div
              key={animal.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <AnimalCard animal={animal} />
            </div>
          ))}
        </div>

        {filteredAnimals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold">
              No animals found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        <AddAnimalDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
    </Layout>
  );
}

