import { AppShell, Card, CardHeader, RiskBadge } from "@/components/resq/AppShell";
import { EmptyState } from "@/components/resq/EmptyState";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Play, RotateCcw, Cpu, Activity, AlertTriangle, CheckCircle2, ShieldCheck,
  Zap, ArrowRight, Wrench, Sparkles, Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  seedIncidents, seedResources, demoScript, demoDurationSec,
  type ScenarioIncident, type ScenarioResource, type DemoEvent,
} from "@/lib/orchestration";



type IncidentState = ScenarioIncident & { state: "Pending" | "Visible" | "Assigned" | "Resolved"; assignedTo?: string };
type ResourceState = ScenarioResource & { assignedTo?: string };

interface Conflict { resourceId: string; contenders: string[]; ranking?: { id: string; title: string; score: number }[] }
interface Strategy {
  version: number;
  phases: { phase: number; resource: string; mission: string; etaMin: number }[];
  etaMin: number;
  riskReduction: number;
}
interface LogEntry { t: string; text: string; tag?: string; tone?: "info" | "warn" | "ok" | "ai" }
interface MissionReport {
  livesAssisted: number; incidentsResolved: number; resourcesUsed: number;
  responseTimeSavedMin: number; fatalitiesAvoided: number; riskReduction: number; confidence: number;
}

function fmtClock(secOffset: number) {
  // Start at 14:28:00 for narrative
  const base = 14 * 3600 + 28 * 60;
  const total = base + secOffset;
  const h = Math.floor(total / 3600) % 24;
  const m = Math.floor((total % 3600) / 60);
  const s = Math.floor(total % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function Orchestration() {
  const [incidents, setIncidents] = useState<IncidentState[]>(
    seedIncidents.map((i) => ({ ...i, state: "Pending" }))
  );
  const [resources, setResources] = useState<ResourceState[]>(seedResources);
  const [conflict, setConflict] = useState<Conflict | null>(null);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [report, setReport] = useState<MissionReport | null>(null);
  const [failure, setFailure] = useState<{ resourceId: string; reason: string } | null>(null);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
    setIncidents(seedIncidents.map((i) => ({ ...i, state: "Pending" })));
    setResources(seedResources.map((r) => ({ ...r })));
    setConflict(null);
    setStrategy(null);
    setLog([]);
    setReport(null);
    setFailure(null);
    setRunning(false);
    setElapsed(0);
  };

  useEffect(() => () => { reset(); }, []);

  const pushLog = (entry: Omit<LogEntry, "t">, atSec: number) =>
    setLog((l) => [...l, { t: fmtClock(atSec), ...entry }]);

  const apply = (e: DemoEvent, atSec: number) => {
    switch (e.kind) {
      case "log":
        pushLog({ text: e.text, tag: "Sentinel", tone: "ai" }, atSec); break;
      case "incident": {
        setIncidents((arr) => arr.map((i) => i.id === e.incidentId ? { ...i, state: "Visible" } : i));
        const inc = seedIncidents.find((i) => i.id === e.incidentId)!;
        pushLog({ text: `New incident detected — ${inc.title}`, tag: "Sentinel", tone: "warn" }, atSec);
        break;
      }
      case "conflict": {
        setConflict({ resourceId: e.resourceId, contenders: e.contenders });
        pushLog({ text: `Resource conflict — ${seedResources.find(r=>r.id===e.resourceId)?.name} contested by ${e.contenders.length} incidents`, tag: "Guardian", tone: "warn" }, atSec);
        break;
      }
      case "evaluate":
        setConflict((c) => c ? { ...c, ranking: e.ranking } : c);
        pushLog({ text: `Evaluating ${e.ranking.length} allocation options · survival-weighted scoring`, tag: "Guardian", tone: "ai" }, atSec);
        break;
      case "strategy":
        setStrategy({ version: e.version, phases: e.phases, etaMin: e.etaMin, riskReduction: e.riskReduction });
        pushLog({ text: `Strategy v${e.version} generated · ETA ${e.etaMin} min · risk −${e.riskReduction}%`, tag: "Guardian", tone: "ok" }, atSec);
        break;
      case "deploy": {
        setResources((rs) => rs.map((r) => r.id === e.resourceId ? { ...r, status: "Deployed", assignedTo: e.incidentId } : r));
        setIncidents((arr) => arr.map((i) => i.id === e.incidentId ? { ...i, state: "Assigned", assignedTo: e.resourceId } : i));
        const res = seedResources.find((r) => r.id === e.resourceId)!;
        const inc = seedIncidents.find((i) => i.id === e.incidentId)!;
        pushLog({ text: `${res.name} deployed → ${inc.title}`, tag: "Atlas", tone: "ok" }, atSec);
        break;
      }
      case "failure": {
        const res = seedResources.find((r) => r.id === e.resourceId)!;
        setResources((rs) => rs.map((r) => r.id === e.resourceId ? { ...r, status: "Failed" } : r));
        setFailure({ resourceId: e.resourceId, reason: e.reason });
        pushLog({ text: `FAILURE · ${res.name} — ${e.reason}`, tag: "Sentinel", tone: "warn" }, atSec);
        break;
      }
      case "replan":
        pushLog({ text: `Replanning initiated — ${e.reason}`, tag: "Guardian", tone: "ai" }, atSec);
        break;
      case "reassign": {
        const res = seedResources.find((r) => r.id === e.resourceId)!;
        const inc = seedIncidents.find((i) => i.id === e.incidentId)!;
        setResources((rs) => rs.map((r) => r.id === e.resourceId ? { ...r, status: "Deployed", assignedTo: e.incidentId } : r));
        setIncidents((arr) => arr.map((i) => i.id === e.incidentId ? { ...i, state: "Assigned", assignedTo: e.resourceId } : i));
        pushLog({ text: `${res.name} reassigned → ${inc.title}`, tag: "Atlas", tone: "ok" }, atSec);
        break;
      }
      case "complete": {
        const inc = seedIncidents.find((i) => i.id === e.incidentId)!;
        setIncidents((arr) => arr.map((i) => i.id === e.incidentId ? { ...i, state: "Resolved" } : i));
        setResources((rs) => rs.map((r) => r.assignedTo === e.incidentId ? { ...r, status: "Returning", assignedTo: undefined } : r));
        pushLog({ text: `${inc.title} resolved`, tag: "Medic", tone: "ok" }, atSec);
        break;
      }
      case "missionReport":
        setReport(e.report);
        pushLog({ text: `Mission impact report generated · ${e.report.fatalitiesAvoided} fatalities likely avoided`, tag: "Guardian", tone: "ok" }, atSec);
        break;
    }
  };

  const run = () => {
    reset();
    setRunning(true);
    const start = Date.now();
    tickRef.current = setInterval(() => {
      const sec = (Date.now() - start) / 1000;
      setElapsed(sec);
      if (sec >= demoDurationSec + 2) {
        if (tickRef.current) clearInterval(tickRef.current);
        setRunning(false);
      }
    }, 100);
    demoScript.forEach((step) => {
      const t = setTimeout(() => apply(step.e, step.at), step.at * 1000);
      timers.current.push(t);
    });
    const end = setTimeout(() => setRunning(false), (demoDurationSec + 1) * 1000);
    timers.current.push(end);
  };

  const progress = Math.min(100, (elapsed / demoDurationSec) * 100);

  return (
    <AppShell title="Autonomous Crisis Coordination">
      {/* Control bar */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-emergency text-emergency-foreground">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold tracking-tight">Hero Demo Mode</div>
              <div className="text-xs text-muted-foreground">
                Run the full autonomous workflow — conflict detection, strategy generation, failure recovery and mission report.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={run}
              disabled={running}
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              <Play className="h-4 w-4" /> Run Autonomous Crisis Demo
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
            <span>{running ? "Simulation running…" : elapsed > 0 ? "Simulation complete" : "Standby mode"}</span>
            <span className="font-mono">{Math.floor(elapsed)}s / {demoDurationSec}s</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-emergency transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </Card>

      {/* Live incident + resource status */}
      <div className="mt-4 grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Live Incidents" description="Detected by Sentinel · ranked by survival impact" />
          <ul className="divide-y divide-border">
            {incidents.filter(i => i.state !== "Pending").length === 0 && (
              <li><EmptyState title="Standby mode" description="Awaiting disaster telemetry. Run the demo to simulate incoming incidents." icon={<Activity className="h-4 w-4" />} /></li>
            )}
            <AnimatePresence>
              {incidents.filter(i => i.state !== "Pending").map((i) => (
                <motion.li
                  key={i.id}
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-4 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-muted-foreground">{i.id}</div>
                    <div className="text-sm font-medium">{i.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{i.short}</div>
                    {i.assignedTo && (
                      <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <ArrowRight className="h-3 w-3" /> {seedResources.find(r => r.id === i.assignedTo)?.name}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <RiskBadge level={i.severity} />
                    <span className={`text-[10px] uppercase tracking-wider ${
                      i.state === "Resolved" ? "text-success" : i.state === "Assigned" ? "text-foreground" : "text-emergency"
                    }`}>{i.state}</span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </Card>

        <Card>
          <CardHeader title="Resource Fleet" description="Allocation and operational status" />
          <ul className="divide-y divide-border">
            {resources.map((r) => (
              <li key={r.id} className="p-4 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.kind} · {r.capability.join(" · ")}</div>
                </div>
                <div className="flex items-center gap-2">
                  {r.assignedTo && (
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">
                      → {seedIncidents.find(i => i.id === r.assignedTo)?.title.split(" ")[0]}…
                    </span>
                  )}
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    r.status === "Failed" ? "bg-emergency text-emergency-foreground" :
                    r.status === "Deployed" ? "bg-emergency-soft text-emergency border border-emergency/20" :
                    r.status === "Returning" ? "bg-muted text-muted-foreground border border-border" :
                    "bg-muted text-foreground border border-border"
                  }`}>
                    {r.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Failure alert */}
      <AnimatePresence>
        {failure && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-4 rounded-lg border border-emergency/30 bg-emergency-soft p-4 flex items-start gap-3"
          >
            <Wrench className="h-5 w-5 text-emergency shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-emergency">Resource Failure Detected</div>
              <div className="text-sm text-foreground mt-0.5">
                {seedResources.find(r => r.id === failure.resourceId)?.name} — {failure.reason}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Autonomous replanning initiated · alternative resource being selected.</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conflict + Strategy + Explain */}
      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <ConflictPanel conflict={conflict} />
        <StrategyPanel strategy={strategy} />
        <ExplainPanel hasContext={!!conflict || !!strategy} />
      </div>

      {/* Replanning log + Mission report */}
      <div className="mt-4 grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Decision Log" description="Every AI-initiated action with timestamp and agent" />
          {log.length === 0 ? (
            <EmptyState title="No decisions yet" description="Decision log will populate as the AI orchestrates the response." icon={<Activity className="h-4 w-4" />} />
          ) : (
            <ol className="p-4 max-h-[420px] overflow-auto">
              {log.map((l, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                  className="relative pl-6 pb-4 last:pb-0"
                >
                  <span className={`absolute left-0 top-1.5 h-2 w-2 rounded-full ${
                    l.tone === "warn" ? "bg-emergency" : l.tone === "ok" ? "bg-foreground" : "bg-muted-foreground"
                  }`} />
                  {i < log.length - 1 && <span className="absolute left-[3px] top-3 bottom-0 w-px bg-border" />}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                    <Clock className="h-3 w-3" /> {l.t}
                    {l.tag && <span className="rounded border border-border bg-muted/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">{l.tag}</span>}
                  </div>
                  <div className="mt-0.5 text-sm">{l.text}</div>
                </motion.li>
              ))}
            </ol>
          )}
        </Card>

        <ImpactReportCard report={report} />
      </div>
    </AppShell>
  );
}

function ConflictPanel({ conflict }: { conflict: Conflict | null }) {
  if (!conflict) {
    return (
      <Card>
        <CardHeader title="Resource Conflict" description="Contention detection across active incidents" />
        <EmptyState title="No conflicts detected" description="Allocations are non-contested." icon={<ShieldCheck className="h-4 w-4" />} />
      </Card>
    );
  }
  const resource = seedResources.find(r => r.id === conflict.resourceId)!;
  const top = conflict.ranking?.[0];
  return (
    <Card>
      <CardHeader
        title="Resource Conflict Detected"
        description={`Contested resource · ${resource.name}`}
        action={<RiskBadge level="Critical" />}
      />
      <div className="p-5 space-y-4">
        <div className="grid gap-2">
          {conflict.contenders.map((cid, idx) => {
            const inc = seedIncidents.find(i => i.id === cid)!;
            const rank = conflict.ranking?.find(r => r.id === cid);
            const isTop = top?.id === cid;
            return (
              <div key={cid} className={`rounded-md border p-3 ${isTop ? "border-emergency/40 bg-emergency-soft" : "border-border bg-background"}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-muted-foreground">Option {String.fromCharCode(65 + idx)}</div>
                  {rank && (
                    <span className="text-[11px] text-muted-foreground">score <span className="font-medium text-foreground">{rank.score.toFixed(2)}</span></span>
                  )}
                </div>
                <div className="mt-0.5 text-sm font-medium">{inc.title}</div>
                <div className="text-xs text-muted-foreground">{inc.short} · window {inc.windowMin}m</div>
              </div>
            );
          })}
        </div>
        {top && (
          <div className="rounded-md border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-emergency">
              <Sparkles className="h-3.5 w-3.5" /> AI Recommendation
            </div>
            <div className="mt-1.5 text-sm font-semibold">Allocate {resource.name} → {top.title}</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium">91%</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Highest probability of fatality if delayed — survival-weighted scoring favors this allocation by a {(top.score / (conflict.ranking?.[1]?.score || 1)).toFixed(2)}× margin.
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function StrategyPanel({ strategy }: { strategy: Strategy | null }) {
  if (!strategy) {
    return (
      <Card>
        <CardHeader title="AI Crisis Strategy" description="Multi-step orchestrated action plan" />
        <EmptyState title="No active strategy" description="Strategy will be generated once incidents and resources are evaluated." icon={<Zap className="h-4 w-4" />} />
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader
        title={`AI Crisis Strategy · v${strategy.version}`}
        description={`ETA ${strategy.etaMin} min · projected risk reduction ${strategy.riskReduction}%`}
      />
      <ol className="p-5 space-y-3">
        {strategy.phases.map((p) => (
          <motion.li
            key={`${strategy.version}-${p.phase}`}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-start"
          >
            <div className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background text-xs font-semibold shrink-0">
              {p.phase}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{p.resource}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <ArrowRight className="h-3 w-3" /> {p.mission}
              </div>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">{p.etaMin}m</span>
          </motion.li>
        ))}
      </ol>
      <div className="border-t border-border p-4 grid grid-cols-2 gap-3 text-xs">
        <Metric label="Completion" value={`${strategy.etaMin} min`} />
        <Metric label="Risk reduction" value={`−${strategy.riskReduction}%`} />
      </div>
    </Card>
  );
}

function ExplainPanel({ hasContext }: { hasContext: boolean }) {
  const factors = [
    { label: "Threat to life", weight: 28 },
    { label: "Medical urgency", weight: 22 },
    { label: "Estimated survival impact", weight: 18 },
    { label: "Response window", weight: 14 },
    { label: "Resource availability", weight: 10 },
    { label: "Population affected", weight: 8 },
  ];
  return (
    <Card>
      <CardHeader title="Why this decision was made" description="Explainability · weighted priority factors" />
      {!hasContext ? (
        <EmptyState title="No active decision" description="Explanations appear once the AI evaluates allocations." icon={<ShieldCheck className="h-4 w-4" />} />
      ) : (
        <div className="p-5 space-y-3">
          <ul className="space-y-2.5">
            {factors.map((f) => (
              <li key={f.label}>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> {f.label}</span>
                  <span className="text-muted-foreground">{f.weight}%</span>
                </div>
                <div className="mt-1 h-1 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-foreground" style={{ width: `${f.weight * 3}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground leading-relaxed">
            The system weighs each incident by lives at stake, fatality probability if delayed, and time-window pressure.
            The Child Medical Evacuation scores highest because a 20-minute window combined with a 92% fatality probability
            outweighs larger but less time-critical incidents.
          </div>
        </div>
      )}
    </Card>
  );
}

function ImpactReportCard({ report }: { report: MissionReport | null }) {
  return (
    <Card>
      <CardHeader title="Mission Impact Report" description="Generated on strategy completion" />
      {!report ? (
        <EmptyState title="Awaiting mission completion" description="Impact metrics will appear once the strategy concludes." icon={<AlertTriangle className="h-4 w-4" />} />
      ) : (
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Lives assisted" value={report.livesAssisted.toLocaleString()} />
            <Metric label="Incidents resolved" value={`${report.incidentsResolved}`} />
            <Metric label="Resources used" value={`${report.resourcesUsed}`} />
            <Metric label="Response time saved" value={`${report.responseTimeSavedMin} min`} />
            <Metric label="Fatalities avoided" value={`${report.fatalitiesAvoided}`} accent />
            <Metric label="Risk reduction" value={`−${report.riskReduction}%`} />
          </div>
          <div className="rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">
            Confidence in outcome: <span className="font-medium text-foreground">{report.confidence}%</span> · all decisions human-reviewable in the decision log.
          </div>
        </div>
      )}
    </Card>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 text-lg font-semibold tracking-tight ${accent ? "text-emergency" : ""}`}>{value}</div>
    </div>
  );
}

export default Orchestration;
