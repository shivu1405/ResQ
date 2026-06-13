import { Link } from "react-router-dom";
import { AppShell, Card, CardHeader, RiskBadge } from "@/components/resq/AppShell";
import { Sparkline } from "@/components/resq/Sparkline";
import { LeafletMap } from "@/components/resq/LeafletMap";
import {
  kpis, riskTrend, resourceAllocation, emergencyRequests,
  incidents, featuredCrisis, incidentTimeline, liveFeed,
} from "@/lib/resq-data";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import {
  MapPin, AlertTriangle, ArrowRight, ArrowUpRight, ArrowDownRight,
  Satellite, HeartPulse, Package, Siren, CloudSun, RadioTower, Clock,
} from "lucide-react";
import { motion } from "framer-motion";



const agentIcon: Record<string, typeof Satellite> = {
  satellite: Satellite, medical: HeartPulse, package: Package,
  alert: Siren, weather: CloudSun, radio: RadioTower,
};

function Dashboard() {
  return (
    <AppShell title="Command Dashboard">
      <FeaturedCrisis />

      {/* KPI strip */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k) => {
          const up = k.direction === "up";
          const TrendIcon = up ? ArrowUpRight : ArrowDownRight;
          return (
            <div
              key={k.label}
              className="rounded-lg border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_22px_-12px_rgba(17,17,17,0.18)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.label}</span>
                {k.tone === "emergency" && <span className="h-1.5 w-1.5 rounded-full bg-emergency" />}
              </div>
              <div className="mt-2 flex items-end justify-between gap-2">
                <div className="text-2xl font-semibold tracking-tight">{k.value}</div>
                <Sparkline
                  data={k.spark}
                  width={64}
                  height={22}
                  color={k.tone === "emergency" ? "var(--emergency)" : "var(--muted-foreground)"}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className={`inline-flex items-center gap-0.5 ${k.tone === "emergency" ? "text-emergency" : up ? "text-foreground" : "text-muted-foreground"}`}>
                  <TrendIcon className="h-3 w-3" /> {k.trend}
                </span>
                <span className="text-muted-foreground">{k.updated}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Risk Trend Analysis" description="Aggregated risk index vs. projected impact (last 24h)" />
          <div className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrend}>
                <defs>
                  <linearGradient id="rsk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--emergency)" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="var(--emergency)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="risk" stroke="var(--emergency)" strokeWidth={2} fill="url(#rsk)" />
                <Line type="monotone" dataKey="impact" stroke="var(--foreground)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Resource Allocation" description="Deployment vs. available capacity" />
          <div className="p-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceAllocation} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={60} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="var(--foreground)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Map + side rail */}
      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Global Incident Map"
            description="Incidents, hospitals, shelters and rescue teams · OpenStreetMap"
            action={
              <div className="hidden sm:flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                <Dot c="bg-emergency" l="Incident" />
                <Dot c="bg-foreground" l="Hospital" />
                <Dot c="bg-muted-foreground" l="Shelter" />
                <Dot c="bg-black" l="Team" />
              </div>
            }
          />
          <div className="p-4">
            <LeafletMap height={460} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Active Incidents" description="Sorted by severity" />
          <ul className="divide-y divide-border max-h-[500px] overflow-auto">
            {incidents.map((inc) => (
              <li key={inc.id} className="p-4 hover:bg-muted/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-muted-foreground">{inc.id}</div>
                    <div className="text-sm font-medium truncate">{inc.type} · {inc.location}</div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {inc.region}
                    </div>
                  </div>
                  <RiskBadge level={inc.risk} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Timeline + Live Feed + Requests */}
      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader title="Incident Timeline" description="AI-assisted decision log · Cyclone INC-2039" />
          <ol className="p-5 space-y-4">
            {incidentTimeline.map((t, i) => (
              <li key={i} className="relative pl-6">
                <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-emergency" />
                {i < incidentTimeline.length - 1 && (
                  <span className="absolute left-[3px] top-3 bottom-[-12px] w-px bg-border" />
                )}
                <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" /> {t.t}
                  <span className="ml-auto rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">{t.tag}</span>
                </div>
                <p className="mt-1 text-sm">{t.text}</p>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <CardHeader title="Live Activity Feed" description="Verified updates from agents" />
          <ul className="divide-y divide-border">
            {liveFeed.map((f, i) => {
              const Icon = agentIcon[f.icon] ?? Satellite;
              return (
                <li key={i} className="flex gap-3 p-4 hover:bg-muted/30 transition-colors">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-background">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium truncate">{f.agent}</div>
                      <RiskBadge level={f.severity} />
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground leading-snug">{f.action}</p>
                    <div className="mt-1 text-[11px] font-mono text-muted-foreground">{f.t}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Emergency Requests" description="Rescue, medical and supply (24h)" />
          <div className="p-4 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emergencyRequests}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="rescue" stackId="a" fill="var(--emergency)" />
                <Bar dataKey="medical" stackId="a" fill="var(--foreground)" />
                <Bar dataKey="supply" stackId="a" fill="var(--muted-foreground)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function FeaturedCrisis() {
  const c = featuredCrisis;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="grid lg:grid-cols-[1.4fr_1fr]">
        <div className="p-6 lg:p-7 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emergency-soft px-2.5 py-1 text-[11px] font-medium text-emergency border border-emergency/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emergency pulse-ring inline-block" />
              Active Crisis Overview
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">{c.id}</span>
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-emergency" /> {c.title}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl leading-relaxed">
            <span className="font-medium text-foreground">Recommended action: </span>
            {c.recommendation}
          </p>

          <ul className="mt-4 space-y-1.5 text-sm">
            {c.signals.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-emergency shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/app/incidents"
              className="inline-flex items-center gap-1.5 rounded-md bg-emergency px-4 py-2 text-sm font-medium text-emergency-foreground hover:opacity-90 transition-opacity"
            >
              View Incident <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/app/prediction"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Generate Response Plan
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-border border-t lg:border-t-0">
          <CrisisStat label="Severity" value={c.severity} accent />
          <CrisisStat label="Population at risk" value={c.populationAtRisk} />
          <CrisisStat label="Predicted landfall" value={c.predictedLandfall} divider />
          <CrisisStat label="AI confidence" value={`${c.aiConfidence}%`} divider />
        </div>
      </div>
    </motion.div>
  );
}

function CrisisStat({ label, value, accent, divider }: { label: string; value: string; accent?: boolean; divider?: boolean }) {
  return (
    <div className={`p-5 ${divider ? "border-t border-border" : ""}`}>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 text-2xl font-semibold tracking-tight ${accent ? "text-emergency" : ""}`}>{value}</div>
    </div>
  );
}

function Dot({ c, l }: { c: string; l: string }) {
  return <div className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${c}`} />{l}</div>;
}

export default Dashboard;
