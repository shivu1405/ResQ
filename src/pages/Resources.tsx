import { AppShell, Card, CardHeader } from "@/components/resq/AppShell";
import { resources } from "@/lib/resq-data";

export default function ResourcesPage() {
  return (
    <AppShell title="Resource Management">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((r) => {
          const low = r.stock < 50;
          return (
            <Card key={r.name} className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{r.name}</div>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${low ? "border-emergency/30 text-emergency bg-emergency-soft" : "border-border text-muted-foreground"}`}>
                  {low ? "Low" : "Stable"}
                </span>
              </div>
              <div className="mt-3 text-3xl font-semibold">{r.stock}<span className="text-base text-muted-foreground">/{r.capacity}</span></div>
              <div className="text-xs text-muted-foreground">{r.unit}</div>
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full ${low ? "bg-emergency" : "bg-foreground"}`} style={{ width: `${r.stock}%` }} />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader title="Open Resource Requests" description="From regional command posts" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left font-medium px-5 py-3">Request</th><th className="text-left font-medium px-5 py-3">Region</th><th className="text-left font-medium px-5 py-3">Priority</th><th className="text-right font-medium px-5 py-3">Qty</th><th className="text-right font-medium px-5 py-3">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { r: "Drinking Water", reg: "Chennai – Sector 7", p: "Critical", q: "20,000 L" },
                { r: "Tarpaulin Sheets", reg: "Andhra Coast", p: "High", q: "1,200 units" },
                { r: "Baby Formula", reg: "Uttarakhand", p: "High", q: "300 units" },
                { r: "Generators", reg: "Seville", p: "Moderate", q: "8 units" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium">{row.r}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.reg}</td>
                  <td className="px-5 py-3"><span className={`text-[11px] rounded-full px-2 py-0.5 ${row.p === "Critical" ? "bg-emergency text-emergency-foreground" : row.p === "High" ? "bg-emergency-soft text-emergency border border-emergency/20" : "bg-muted border border-border"}`}>{row.p}</span></td>
                  <td className="px-5 py-3 text-right">{row.q}</td>
                  <td className="px-5 py-3 text-right"><button className="text-xs rounded-md bg-foreground text-background px-3 py-1">Fulfill</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
