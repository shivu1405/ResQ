import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, PlayCircle, Activity, ShieldCheck, Radio,
  HeartPulse, Package, MessageSquare, MapPin,
} from "lucide-react";
import { incidents } from "@/lib/resq-data";
import { RiskBadge } from "@/components/resq/AppShell";



const features = [
  { icon: Activity, title: "Early Risk Detection", desc: "Satellite, sensor and field signals are continuously monitored to surface threats before they escalate." },
  { icon: ShieldCheck, title: "AI Disaster Prediction", desc: "Forecast models for floods, cyclones, wildfires and seismic activity with explicit confidence intervals." },
  { icon: Radio, title: "Rescue Coordination", desc: "A single operating picture for teams, assignments and field communications across agencies." },
  { icon: HeartPulse, title: "Medical Readiness", desc: "Live hospital capacity, bed availability and triage routing for mass-casualty events." },
  { icon: Package, title: "Resource Tracking", desc: "Real-time stock levels for food, water, medical supplies and shelter across regions." },
  { icon: MessageSquare, title: "Verified Communication", desc: "Structured public alerts and updates for officials, responders and affected citizens." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-emergency text-emergency-foreground">
              <span className="text-[11px] font-bold">R</span>
            </div>
            <span className="font-semibold tracking-tight">RESQ AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#platform" className="hover:text-foreground transition-colors">Platform</a>
            <a href="#operations" className="hover:text-foreground transition-colors">Operations</a>
            <a href="#trust" className="hover:text-foreground transition-colors">Trust</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/app" className="hidden sm:inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors">
              Watch Simulation
            </Link>
            <Link to="/app" className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-90 transition-opacity">
              Launch Command Center <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <BackgroundMap />
        <div className="relative mx-auto max-w-4xl px-6 pt-24 pb-24 lg:pt-32 lg:pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emergency" />
            Humanity First · AI-Assisted Crisis Response
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight"
          >
            RESQ AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 text-2xl sm:text-3xl font-medium tracking-tight text-foreground/90"
          >
            Humanity First.<br className="hidden sm:block" /> AI-Assisted Crisis Response.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 mx-auto max-w-xl text-base leading-relaxed text-muted-foreground"
          >
            Helping emergency teams predict, coordinate and respond faster during disasters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            <Link to="/app" className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity">
              Launch Command Center <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/app/prediction" className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
              <PlayCircle className="h-4 w-4" /> Watch Simulation
            </Link>
          </motion.div>

          <div className="mt-14 grid grid-cols-3 max-w-md mx-auto gap-6 text-sm">
            <Stat label="Agencies onboard" value="42" />
            <Stat label="Lives monitored" value="1.4M" />
            <Stat label="Uptime" value="99.97%" />
          </div>
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHeading
            eyebrow="Platform"
            title="A single operating picture for prediction, response and recovery."
            sub="Designed with frontline teams. Built for the people who run toward the crisis."
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
            {features.map((f) => (
              <div key={f.title} className="bg-card p-6 transition-colors hover:bg-muted/30">
                <div className="grid h-9 w-9 place-items-center rounded-md border border-border bg-background">
                  <f.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-sm font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operations preview */}
      <section id="operations" className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <SectionHeading eyebrow="Operations" title="Active incidents being coordinated right now." />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incidents.slice(0, 6).map((inc) => (
              <div key={inc.id} className="rounded-lg border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(17,17,17,0.18)]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">{inc.id}</div>
                    <h3 className="mt-1 text-base font-semibold tracking-tight">{inc.type} Alert</h3>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {inc.location} · {inc.region}
                    </div>
                  </div>
                  <RiskBadge level={inc.risk} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{inc.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-emergency">Trust</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            Built for governments. Trusted by responders.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every AI recommendation is reviewable, attributable and human-approved before action.
            Decisions stay with the people on the ground.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/app" className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity">
              Launch Command Center <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded bg-emergency text-emergency-foreground">
              <span className="text-[10px] font-bold">R</span>
            </div>
            <span>© {new Date().getFullYear()} RESQ AI · Humanity First</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Security</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-mono uppercase tracking-widest text-emergency">{eyebrow}</div>
      <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h2>
      {sub && <p className="mt-3 text-muted-foreground">{sub}</p>}
    </div>
  );
}

function BackgroundMap() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none opacity-[0.5] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)]"
    >
      <svg viewBox="0 0 1200 600" className="absolute inset-0 h-full w-full text-border" fill="currentColor">
        <g opacity="0.55">
          <path d="M80,260 Q180,180 300,210 T520,250 Q560,320 480,380 T300,420 Q180,430 110,380 T80,260Z" />
          <path d="M560,210 Q660,150 780,180 T980,230 Q1040,290 980,360 T820,400 Q700,410 620,360 T560,210Z" />
          <path d="M820,420 Q900,400 980,440 T1080,500 Q1040,540 950,530 T820,500 Q790,460 820,420Z" />
          <path d="M260,440 Q330,420 380,450 T420,510 Q380,540 320,530 T240,500 Q220,460 260,440Z" />
        </g>
      </svg>
      {incidents.map((inc) => (
        <span
          key={inc.id}
          className={`absolute -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full ${
            inc.risk === "Critical" ? "bg-emergency" : "bg-foreground/60"
          }`}
          style={{ left: `${inc.coords.x}%`, top: `${inc.coords.y}%` }}
        />
      ))}
    </div>
  );
}

export default Landing;
