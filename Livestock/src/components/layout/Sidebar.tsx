// placeholder for Sidebar component
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PawPrint,
  HeartPulse,
  MapPin,
  Utensils,
  Stethoscope,
  Thermometer,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: PawPrint, label: "Animals", path: "/animals" },
  { icon: HeartPulse, label: "Health", path: "/health" },
  { icon: MapPin, label: "Tracking", path: "/tracking" },
  { icon: Utensils, label: "Feed Planner", path: "/feed" },
  { icon: Stethoscope, label: "Disease Detection", path: "/disease" },
  { icon: Thermometer, label: "Environment", path: "/environment" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
              <Leaf className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h1 className="font-display text-lg font-bold text-sidebar-foreground">
                  FARMER
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  Livestock Manager
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200",
                    !isActive && "group-hover:scale-110"
                  )}
                />
                {!collapsed && (
                  <span className="animate-fade-in truncate">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Settings & Collapse */}
        <div className="border-t border-sidebar-border p-4">
          <NavLink
            to="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground",
              location.pathname === "/settings" &&
                "bg-sidebar-accent text-sidebar-foreground"
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Settings</span>}
          </NavLink>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="mt-2 w-full justify-center text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
