import { AppShell, Card, CardHeader, RiskBadge } from "@/components/resq/AppShell";
import { incidents } from "@/lib/resq-data";
import { MapPin, Filter } from "lucide-react";

export default function IncidentsPage() {
  return (
    <AppShell title="Active Incidents">
      <Card>
        <CardHeader title="All Incidents" description={`${incidents.length} tracked across 6 regions`}
          action={<button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted"><Filter className="h-3.5 w-3.5" /> Filter</button>} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-5 py-3">ID</th>
                <th className="text-left font-medium px-5 py-3">Type</th>
                <th className="text-left font-medium px-5 py-3">Location</th>
                <th className="text-left font-medium px-5 py-3">Risk</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
                <th className="text-right font-medium px-5 py-3">Population</th>
                <th className="text-right font-medium px-5 py-3">Started</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {incidents.map((i) => (
                <tr key={i.id} className="hover:bg-muted/30">
                  <td className="px-5 py-3 font-mono text-xs">{i.id}</td>
                  <td className="px-5 py-3 font-medium">{i.type}</td>
                  <td className="px-5 py-3"><div className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{i.location}, {i.region}</div></td>
                  <td className="px-5 py-3"><RiskBadge level={i.risk} /></td>
                  <td className="px-5 py-3"><RiskBadge level={i.status} /></td>
                  <td className="px-5 py-3 text-right">{i.population.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-muted-foreground">{i.startedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
