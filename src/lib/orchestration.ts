export type Severity = "Critical" | "High" | "Moderate" | "Low";

export interface ScenarioIncident {
  id: string;
  title: string;
  short: string;
  lives: number;
  fatalityProbIfDelayed: number; // 0..1
  urgency: number; // 0..100
  windowMin: number;
  risk: number; // 0..100
  requires: string[]; // resource ids it can use
  severity: Severity;
}

export interface ScenarioResource {
  id: string;
  name: string;
  kind: "Boat" | "Ambulance" | "Helicopter" | "Truck";
  status: "Available" | "Deployed" | "Failed" | "Returning";
  capability: string[]; // tags
  speedKmh: number;
}

export const seedIncidents: ScenarioIncident[] = [
  {
    id: "INC-A",
    title: "Child Medical Evacuation",
    short: "1 child · severe respiratory distress",
    lives: 1,
    fatalityProbIfDelayed: 0.92,
    urgency: 96,
    windowMin: 20,
    risk: 96,
    requires: ["boat-alpha", "heli-bravo", "amb-charlie"],
    severity: "Critical",
  },
  {
    id: "INC-B",
    title: "Family Trapped on Rooftop",
    short: "4 people · flood waters rising",
    lives: 4,
    fatalityProbIfDelayed: 0.58,
    urgency: 88,
    windowMin: 45,
    risk: 88,
    requires: ["boat-alpha", "heli-bravo"],
    severity: "High",
  },
  {
    id: "INC-C",
    title: "Shelter Running Out of Supplies",
    short: "200 affected · 6h reserve remaining",
    lives: 200,
    fatalityProbIfDelayed: 0.06,
    urgency: 62,
    windowMin: 240,
    risk: 74,
    requires: ["truck-echo", "boat-alpha"],
    severity: "Moderate",
  },
];

export const seedResources: ScenarioResource[] = [
  { id: "boat-alpha",  name: "Rescue Boat Alpha",   kind: "Boat",       status: "Available", capability: ["water", "rescue"],            speedKmh: 35 },
  { id: "amb-charlie", name: "Ambulance Charlie",   kind: "Ambulance",  status: "Available", capability: ["medical", "road"],            speedKmh: 70 },
  { id: "heli-bravo",  name: "Helicopter Bravo",    kind: "Helicopter", status: "Available", capability: ["air", "rescue", "medical"],   speedKmh: 220 },
  { id: "truck-echo",  name: "Supply Truck Echo",   kind: "Truck",      status: "Available", capability: ["supply", "road"],             speedKmh: 60 },
];

// Decision scoring: weighted survival impact.
// score = lives * fatalityProbIfDelayed * (urgency/100) * (1 + window penalty)
export function survivalScore(i: ScenarioIncident): number {
  const windowPenalty = Math.max(0, (30 - i.windowMin) / 30); // <30min boost
  return i.lives * i.fatalityProbIfDelayed * (i.urgency / 100) * (1 + windowPenalty);
}

export function rankAllocations(incidents: ScenarioIncident[]) {
  return incidents
    .map((i) => ({ id: i.id, title: i.title, score: survivalScore(i) }))
    .sort((a, b) => b.score - a.score);
}

// ---- Demo timeline ----
export type DemoEvent =
  | { kind: "incident"; incidentId: string }
  | { kind: "conflict"; resourceId: string; contenders: string[] }
  | { kind: "evaluate"; ranking: { id: string; title: string; score: number }[] }
  | { kind: "strategy"; version: number; phases: { phase: number; resource: string; mission: string; etaMin: number }[]; etaMin: number; riskReduction: number }
  | { kind: "deploy"; resourceId: string; incidentId: string }
  | { kind: "failure"; resourceId: string; reason: string }
  | { kind: "replan"; reason: string }
  | { kind: "reassign"; resourceId: string; incidentId: string }
  | { kind: "complete"; incidentId: string }
  | { kind: "missionReport"; report: { livesAssisted: number; incidentsResolved: number; resourcesUsed: number; responseTimeSavedMin: number; fatalitiesAvoided: number; riskReduction: number; confidence: number } }
  | { kind: "log"; text: string };

export interface DemoStep { at: number; e: DemoEvent }

// Times in seconds for ~70s autonomous demo
export const demoScript: DemoStep[] = [
  { at: 1,  e: { kind: "log", text: "Sentinel Agent listening on global signal feeds…" } },
  { at: 2,  e: { kind: "incident", incidentId: "INC-A" } },
  { at: 5,  e: { kind: "incident", incidentId: "INC-B" } },
  { at: 8,  e: { kind: "incident", incidentId: "INC-C" } },
  { at: 11, e: { kind: "conflict", resourceId: "boat-alpha", contenders: ["INC-A", "INC-B", "INC-C"] } },
  { at: 14, e: { kind: "evaluate", ranking: rankAllocations(seedIncidents) } },
  { at: 18, e: { kind: "strategy", version: 1, etaMin: 42, riskReduction: 72, phases: [
      { phase: 1, resource: "Helicopter Bravo", mission: "Child Medical Evacuation",  etaMin: 8 },
      { phase: 2, resource: "Boat Alpha",       mission: "Family Rooftop Rescue",     etaMin: 18 },
      { phase: 3, resource: "Supply Truck Echo",mission: "Shelter Replenishment",     etaMin: 16 },
  ]}},
  { at: 21, e: { kind: "deploy", resourceId: "heli-bravo", incidentId: "INC-A" } },
  { at: 23, e: { kind: "deploy", resourceId: "boat-alpha", incidentId: "INC-B" } },
  { at: 25, e: { kind: "deploy", resourceId: "truck-echo", incidentId: "INC-C" } },
  { at: 30, e: { kind: "log", text: "Helicopter Bravo airborne · ETA 6 min to patient" } },
  { at: 34, e: { kind: "failure", resourceId: "boat-alpha", reason: "Engine failure — debris intake in flooded channel" } },
  { at: 36, e: { kind: "replan", reason: "Boat Alpha out of service mid-mission" } },
  { at: 40, e: { kind: "reassign", resourceId: "amb-charlie", incidentId: "INC-B" } },
  { at: 42, e: { kind: "strategy", version: 2, etaMin: 38, riskReduction: 68, phases: [
      { phase: 1, resource: "Helicopter Bravo",  mission: "Child Medical Evacuation (in progress)", etaMin: 2 },
      { phase: 2, resource: "Ambulance Charlie", mission: "Family Rooftop — high-ground extraction", etaMin: 20 },
      { phase: 3, resource: "Supply Truck Echo", mission: "Shelter Replenishment (uninterrupted)",   etaMin: 16 },
  ]}},
  { at: 48, e: { kind: "complete", incidentId: "INC-A" } },
  { at: 56, e: { kind: "complete", incidentId: "INC-B" } },
  { at: 64, e: { kind: "complete", incidentId: "INC-C" } },
  { at: 67, e: { kind: "missionReport", report: {
      livesAssisted: 205, incidentsResolved: 3, resourcesUsed: 3,
      responseTimeSavedMin: 24, fatalitiesAvoided: 3, riskReduction: 68, confidence: 91,
  }}},
];

export const demoDurationSec = 70;
