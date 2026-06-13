import { AppShell, Card } from "@/components/resq/AppShell";
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";

interface Msg { role: "user" | "assistant"; text: string }

const suggestions = [
  "Analyze flood risk in Chennai",
  "Generate evacuation plan",
  "Recommend resource allocation",
  "Summarize active incidents",
  "Predict cyclone impact",
];

const canned: Record<string, string> = {
  "Analyze flood risk in Chennai":
    "Current flood risk in Chennai is HIGH (composite index 72/100). Drivers: 184 mm rainfall in the last 12h, two reservoirs at 96% capacity, and tide surge expected at 17:40 IST. Recommend pre-positioning rescue boats in sectors 4–7 and opening 3 additional relief camps in Velachery and Mylapore.",
  "Generate evacuation plan":
    "Suggested evacuation plan for coastal Andhra (Stage-3):\n1. Activate sirens in zones A1–A4 within 30 min.\n2. Move ~96,000 residents to 14 designated shelters via 6 primary routes.\n3. Reserve 240 ICU beds across 18 partner hospitals.\n4. Deploy 12 ambulances and 4 mobile clinics along corridor.\nEstimated completion: 6h with current resource availability.",
  "Recommend resource allocation":
    "Resource reallocation suggestion: transfer 30% of drinking water reserves from Coimbatore to Chennai (Sector 7 shortfall). Redirect 4 generators from Vizag depot to Krishna delta relief camps. Medical kits: stock at 41% — recommend immediate replenishment via NGO partners (3 sources matched).",
  "Summarize active incidents":
    "12 active incidents tracked. Highest severity: Cyclone in Bay of Bengal (CRITICAL, 412k at risk). High-severity: Chennai flood, Seville heatwave, N. California wildfire. Aggregate population at risk: 1.4M. 8 resource requests flagged critical.",
  "Predict cyclone impact":
    "Cyclone Cat-3 expected to make landfall at 14:20 IST near Machilipatnam. Projected impact: 412k affected, 96k displaced, sustained winds 165 km/h. Confidence: 94%. Hospitals on alert: 18. Recommend Stage-3 evacuation within 60 min.",
};



function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "I'm RESQ AI. I assist operators with risk analysis, evacuation planning, and resource recommendations. Every output should be reviewed by a human before action." },
  ]);
  const [input, setInput] = useState("");

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      const reply = canned[q] ?? "Acknowledged. Synthesizing context from live agents — please verify any output before issuing field orders. (Demo response.)";
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    }, 500);
  }

  return (
    <AppShell title="RESQ AI Assistant">
      <Card className="flex flex-col h-[calc(100vh-9rem)]">
        <div className="border-b border-border px-5 py-3 flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-emergency text-emergency-foreground"><Sparkles className="h-3.5 w-3.5" /></div>
          <div>
            <div className="text-sm font-semibold">Operations Analyst</div>
            <div className="text-[11px] text-muted-foreground">Human-in-the-loop · All outputs require review</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm whitespace-pre-line ${
                m.role === "user"
                  ? "bg-foreground text-background"
                  : "border border-border bg-card"
              }`}>{m.text}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-3">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="text-xs rounded-full border border-border bg-background px-3 py-1 text-muted-foreground hover:text-foreground hover:bg-muted">
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
            <input
              value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about incidents, risk, or coordination…"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
            />
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-md bg-foreground text-background px-4 py-2 text-sm hover:opacity-90">
              <Send className="h-4 w-4" /> Send
            </button>
          </form>
        </div>
      </Card>
    </AppShell>
  );
}

export default Assistant;
