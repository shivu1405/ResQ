import { AppShell, Card, CardHeader } from "@/components/resq/AppShell";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sparkles } from "lucide-react";

const horizons = {
  "24h": Array.from({ length: 24 }).map((_, i) => ({ t: `${i}:00`, risk: 40 + Math.sin(i / 3) * 18 + i * 0.6, ci: 8 })),
  "48h": Array.from({ length: 24 }).map((_, i) => ({ t: `${i * 2}h`, risk: 48 + Math.sin(i / 4) * 22 + i * 0.4, ci: 12 })),
  "72h": Array.from({ length: 24 }).map((_, i) => ({ t: `${i * 3}h`, risk: 55 + Math.sin(i / 5) * 24 + i * 0.3, ci: 16 })),
};



function Prediction() {
  const [tab, setTab] = useState<"24h" | "48h" | "72h">("48h");
  return (
    <AppShell title="Prediction Center">
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Cyclone Landfall Forecast — Andhra Coast"
            description="Composite risk index with confidence interval"
            action={
              <div className="flex rounded-md border border-border p-0.5 text-xs">
                {(["24h", "48h", "72h"] as const).map((h) => (
                  <button key={h} onClick={() => setTab(h)}
                    className={`px-3 py-1 rounded ${tab === h ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                    {h}
                  </button>
                ))}
              </div>
            }
          />
          <div className="p-4 h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={horizons[tab]}>
                <defs>
                  <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--emergency)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--emergency)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="risk" stroke="var(--emergency)" strokeWidth={2} fill="url(#fc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Confidence Score</div>
            <div className="mt-2 flex items-end gap-2">
              <div className="text-4xl font-semibold">94<span className="text-lg text-muted-foreground">%</span></div>
              <div className="text-xs text-success mb-1.5">High</div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Based on 14 input signals across 3 ensemble models.</p>
          </Card>
          <Card className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Predicted Impact</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between"><span>Population affected</span><span className="font-medium">~412k</span></li>
              <li className="flex justify-between"><span>Likely displaced</span><span className="font-medium">~96k</span></li>
              <li className="flex justify-between"><span>Hospitals on alert</span><span className="font-medium">18</span></li>
              <li className="flex justify-between"><span>ETA landfall</span><span className="font-medium">14:20 IST</span></li>
            </ul>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader title="AI Recommendations" description="Reviewed by Prediction & Operations agents" />
        <ul className="p-2 divide-y divide-border">
          {[
            { p: "Critical", t: "Trigger Stage-3 evacuation for coastal sectors 1–4 within 60 minutes." },
            { p: "High", t: "Pre-position 14 medical convoys and reserve 240 ICU beds across Vizag hospitals." },
            { p: "High", t: "Reroute drinking water reserves from 2 inland districts to Chennai relief camps." },
            { p: "Moderate", t: "Issue verified public alert via SMS, radio and partner broadcasters." },
          ].map((r, i) => (
            <li key={i} className="flex items-start gap-3 p-4">
              <Sparkles className="h-4 w-4 mt-0.5 text-emergency shrink-0" />
              <div className="flex-1">
                <p className="text-sm">{r.t}</p>
                <div className="mt-1 text-[11px] text-muted-foreground">Priority · <span className={r.p === "Critical" ? "text-emergency font-medium" : ""}>{r.p}</span></div>
              </div>
              <button className="text-xs rounded-md border border-border bg-background px-2.5 py-1 hover:bg-muted">Review</button>
            </li>
          ))}
        </ul>
      </Card>
    </AppShell>
  );
}

export default Prediction;
