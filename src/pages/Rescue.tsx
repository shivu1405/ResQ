import { AppShell, Card, CardHeader, RiskBadge } from "@/components/resq/AppShell";
import { rescueTeams } from "@/lib/resq-data";

const timeline = [
  { t: "14:08", e: "Alpha Response reached Sector 4 — beginning house-to-house assessment." },
  { t: "13:52", e: "Coastal Rescue 2 evacuated 320 residents from Krishna delta zone." },
  { t: "13:30", e: "Medical Convoy 1 dispatched 4 ambulances to Triana relief camp." },
  { t: "12:55", e: "Fire & Rescue 3 contained northern flank of the Sacramento wildfire." },
  { t: "12:20", e: "Mountain Unit 5 placed on standby for potential air-lift in Uttarakhand." },
];

export default function RescuePage() {
  return (
    <AppShell title="Rescue Operations">
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Active Teams" description={`${rescueTeams.length} teams · 4 regions`} />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="text-left font-medium px-5 py-3">Team</th><th className="text-left font-medium px-5 py-3">Region</th><th className="text-left font-medium px-5 py-3">Status</th><th className="text-right font-medium px-5 py-3">Members</th><th className="text-right font-medium px-5 py-3">ETA</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rescueTeams.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/30">
                    <td className="px-5 py-3"><div className="font-mono text-xs text-muted-foreground">{t.id}</div><div className="font-medium">{t.name}</div></td>
                    <td className="px-5 py-3 text-muted-foreground">{t.region}</td>
                    <td className="px-5 py-3"><RiskBadge level={t.status === "On-mission" ? "Active" : t.status === "Deployed" ? "High" : "Moderate"} /></td>
                    <td className="px-5 py-3 text-right">{t.members}</td>
                    <td className="px-5 py-3 text-right font-medium">{t.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title="Resource Needs" description="Flagged by team leads" />
          <ul className="p-2 divide-y divide-border text-sm">
            {[
              { team: "Alpha Response", need: "12 inflatable boats" },
              { team: "Coastal Rescue 2", need: "Generators (4) + fuel" },
              { team: "Medical Convoy 1", need: "IV fluids · 200 units" },
              { team: "Fire & Rescue 3", need: "Breathing apparatus (8)" },
            ].map((r, i) => (
              <li key={i} className="p-3 flex justify-between gap-3">
                <div><div className="font-medium">{r.team}</div><div className="text-xs text-muted-foreground">{r.need}</div></div>
                <button className="text-xs rounded-md bg-foreground text-background px-2.5 py-1">Assign</button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Rescue Timeline" description="Last 2 hours" />
        <ol className="p-4 space-y-3">
          {timeline.map((e, i) => (
            <li key={i} className="flex gap-4">
              <div className="text-xs font-mono text-muted-foreground w-12 pt-0.5">{e.t}</div>
              <div className="flex-1 border-l border-border pl-4 relative">
                <span className="absolute -left-1 top-1 h-2 w-2 rounded-full bg-emergency" />
                <p className="text-sm">{e.e}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </AppShell>
  );
}
