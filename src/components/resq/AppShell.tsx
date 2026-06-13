import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard, AlertTriangle, Brain, Radio, HeartPulse,
  Package, MessageSquare, Bell, Search, Sun, Moon, Download, Menu, X, Shield, Cpu,
} from "lucide-react";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/orchestration", label: "Autonomous Ops", icon: Cpu },
  { to: "/app/incidents", label: "Incidents", icon: AlertTriangle },
  { to: "/app/prediction", label: "Prediction", icon: Brain },
  { to: "/app/rescue", label: "Rescue Ops", icon: Radio },
  { to: "/app/medical", label: "Medical", icon: HeartPulse },
  { to: "/app/resources", label: "Resources", icon: Package },
  { to: "/app/agents", label: "AI Agents", icon: Shield },
  { to: "/app/assistant", label: "Assistant", icon: MessageSquare },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  const pathname = useLocation().pathname;
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-emergency text-emergency-foreground">
              <span className="font-bold text-xs tracking-tight">R</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">RESQ AI</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Command</div>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-3 space-y-0.5">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
          <div className="rounded-md border border-sidebar-border bg-card p-3 text-xs">
            <div className="flex items-center gap-2 text-emergency">
              <span className="h-2 w-2 rounded-full bg-emergency pulse-ring inline-block" />
              <span className="font-medium">System Operational</span>
            </div>
            <p className="mt-1 text-muted-foreground">All 4 agents online · 12 incidents tracked</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 backdrop-blur px-4 sm:px-6">
          <button onClick={() => setOpen(true)} className="lg:hidden text-muted-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground w-72">
            <Search className="h-4 w-4" />
            <input
              placeholder="Search incidents, regions, teams…"
              className="bg-transparent outline-none flex-1 placeholder:text-muted-foreground"
            />
            <kbd className="hidden lg:inline rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘K</kbd>
          </div>
          <button className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted">
            <Download className="h-4 w-4" /> Export
          </button>
          <button onClick={() => setDark((d) => !d)} className="rounded-md border border-border p-2 hover:bg-muted" aria-label="Toggle theme">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button className="relative rounded-md border border-border p-2 hover:bg-muted" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emergency" />
          </button>
          <div className="h-8 w-8 rounded-full bg-foreground text-background grid place-items-center text-xs font-semibold">AK</div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-border bg-card ${className}`}>{children}</div>
  );
}

export function CardHeader({
  title, description, action,
}: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border p-5">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function RiskBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    Critical: "bg-emergency text-emergency-foreground",
    High: "bg-emergency-soft text-emergency border border-emergency/20",
    Moderate: "bg-muted text-foreground border border-border",
    Low: "bg-muted text-muted-foreground border border-border",
    Active: "bg-emergency-soft text-emergency border border-emergency/20",
    Monitoring: "bg-muted text-foreground border border-border",
    Contained: "bg-muted text-muted-foreground border border-border",
    Recovery: "bg-muted text-muted-foreground border border-border",
    Operational: "bg-muted text-success border border-border",
    Degraded: "bg-emergency-soft text-emergency border border-emergency/20",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${map[level] ?? "bg-muted"}`}>
      {level}
    </span>
  );
}
