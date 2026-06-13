import { AppShell, Card, RiskBadge } from "@/components/resq/AppShell";
import { agents } from "@/lib/resq-data";
import { Satellite, HeartPulse, Package, Siren, CloudSun, RadioTower } from "lucide-react";
import { motion } from "framer-motion";

const icons: Record<string, typeof Satellite> = {
  sentinel: Satellite,
  medic: HeartPulse,
  atlas: Package,
  guardian: Siren,
  forecast: CloudSun,
  beacon: RadioTower,
};



function AgentsPage() {
  return (
    <AppShell title="AI Agents">
      <div className="max-w-2xl">
        <div className="text-[11px] font-mono uppercase tracking-widest text-emergency">Human-in-the-loop</div>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">Six specialized agents supporting your operators.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Each agent surfaces its current task, confidence and health so every recommendation can be verified before action.
        </p>
      </div>

      <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((a, i) => {
          const Icon = icons[a.id] ?? Satellite;
          const degraded = a.status !== "Operational";
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-12px_rgba(17,17,17,0.18)]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-md border border-border bg-background">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold tracking-tight">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.role}</div>
                    </div>
                  </div>
                  <RiskBadge level={a.status} />
                </div>

                <div className="mt-5 rounded-md border border-border bg-muted/30 p-3 text-sm">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Current task</div>
                  <div className="mt-1 leading-snug">{a.task}</div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <Stat label="Confidence" value={`${a.confidence}%`} />
                  <Stat label="Health" value={`${a.health}%`} />
                  <Stat label="Updated" value={a.updated} />
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span>Confidence</span>
                    <span>{a.confidence}%</span>
                  </div>
                  <div className="mt-1.5 h-1 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full ${degraded ? "bg-emergency" : "bg-foreground"}`}
                      style={{ width: `${a.confidence}%` }}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}

export default AgentsPage;
