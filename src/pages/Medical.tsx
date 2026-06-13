import { AppShell, Card, CardHeader } from "@/components/resq/AppShell";
import { hospitals } from "@/lib/resq-data";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function MedicalPage() {
  return (
    <AppShell title="Medical Support">
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Hospital Bed Availability" description="Partner facilities in affected regions" />
          <div className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hospitals.map((h) => ({ name: h.city, available: h.available, total: h.beds }))}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="total" fill="var(--muted)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="available" fill="var(--foreground)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Emergency Requests" description="Last 60 minutes" />
          <ul className="p-2 divide-y divide-border text-sm">
            {[
              { t: "Trauma transfer · 6 patients", at: "Apollo Greams Road", time: "4m" },
              { t: "Pediatric ICU · 2 beds", at: "King George Memorial", time: "11m" },
              { t: "Blood (O-) · 20 units", at: "Mercy General", time: "18m" },
              { t: "Dialysis support · 8 patients", at: "Hospital V. del Rocío", time: "27m" },
            ].map((r, i) => (
              <li key={i} className="p-3"><div className="font-medium">{r.t}</div><div className="text-xs text-muted-foreground flex justify-between"><span>{r.at}</span><span>{r.time} ago</span></div></li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Hospital Readiness" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="text-left font-medium px-5 py-3">Hospital</th><th className="text-left font-medium px-5 py-3">City</th><th className="text-right font-medium px-5 py-3">Total Beds</th><th className="text-right font-medium px-5 py-3">Available</th><th className="text-right font-medium px-5 py-3">ICU</th><th className="text-right font-medium px-5 py-3">Ambulances</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hospitals.map((h) => (
                <tr key={h.name} className="hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium">{h.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{h.city}</td>
                  <td className="px-5 py-3 text-right">{h.beds}</td>
                  <td className="px-5 py-3 text-right font-medium">{h.available}</td>
                  <td className="px-5 py-3 text-right">{h.icu}</td>
                  <td className="px-5 py-3 text-right">{h.ambulances}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
