export type RiskLevel = "Critical" | "High" | "Moderate" | "Low";
export type IncidentStatus = "Active" | "Monitoring" | "Contained" | "Recovery";

export interface Incident {
  id: string;
  type: "Flood" | "Cyclone" | "Earthquake" | "Wildfire" | "Landslide" | "Heatwave";
  location: string;
  region: string;
  risk: RiskLevel;
  status: IncidentStatus;
  population: number;
  startedAt: string;
  coords: { x: number; y: number };
  latlng: [number, number];
  summary: string;
}

export const incidents: Incident[] = [
  { id: "INC-2041", type: "Flood", location: "Chennai", region: "Tamil Nadu, India", risk: "High", status: "Active", population: 184000, startedAt: "2h ago", coords: { x: 73, y: 58 }, latlng: [13.0827, 80.2707], summary: "Rapid water rise in low-lying districts. Two relief camps activated." },
  { id: "INC-2039", type: "Cyclone", location: "Bay of Bengal", region: "Andhra Coast", risk: "Critical", status: "Active", population: 412000, startedAt: "5h ago", coords: { x: 75, y: 52 }, latlng: [16.5062, 82.118], summary: "Cat-3 system tracking inland. Evacuation underway in coastal zones." },
  { id: "INC-2037", type: "Wildfire", location: "Northern California", region: "USA", risk: "High", status: "Monitoring", population: 56000, startedAt: "1d ago", coords: { x: 14, y: 40 }, latlng: [38.5816, -121.4944], summary: "Wind shift increases spread risk toward residential corridor." },
  { id: "INC-2034", type: "Earthquake", location: "Izmir", region: "Türkiye", risk: "Moderate", status: "Recovery", population: 92000, startedAt: "3d ago", coords: { x: 55, y: 42 }, latlng: [38.4192, 27.1287], summary: "Aftershocks subsiding. Damage assessment in 12 districts ongoing." },
  { id: "INC-2030", type: "Landslide", location: "Uttarakhand", region: "Himalayan Range", risk: "Moderate", status: "Monitoring", population: 8200, startedAt: "12h ago", coords: { x: 70, y: 44 }, latlng: [30.0668, 79.0193], summary: "Highway blocked. Two villages isolated; air-lift on standby." },
  { id: "INC-2028", type: "Heatwave", location: "Seville", region: "Spain", risk: "High", status: "Active", population: 680000, startedAt: "4h ago", coords: { x: 47, y: 46 }, latlng: [37.3891, -5.9845], summary: "Temperatures exceeding 46°C. Cooling centers deployed citywide." },
];

export const kpis = [
  { label: "Active Incidents", value: "12", trend: "+3", direction: "up" as const, updated: "2 min ago", spark: [4, 5, 6, 7, 8, 9, 10, 12], tone: "emergency" as const },
  { label: "Population At Risk", value: "1.4M", trend: "+12%", direction: "up" as const, updated: "2 min ago", spark: [0.8, 0.9, 1.0, 1.1, 1.2, 1.25, 1.35, 1.4], tone: "default" as const },
  { label: "Rescue Teams Deployed", value: "184", trend: "+8", direction: "up" as const, updated: "4 min ago", spark: [140, 148, 152, 160, 168, 174, 180, 184], tone: "default" as const },
  { label: "Hospitals Available", value: "2,418", trend: "−6", direction: "down" as const, updated: "6 min ago", spark: [2440, 2438, 2432, 2428, 2425, 2422, 2420, 2418], tone: "default" as const },
  { label: "Open Resource Requests", value: "47", trend: "+9", direction: "up" as const, updated: "1 min ago", spark: [22, 26, 30, 34, 38, 41, 44, 47], tone: "warning" as const },
  { label: "Emergency Alerts (24h)", value: "126", trend: "+18%", direction: "up" as const, updated: "30 sec ago", spark: [60, 70, 82, 90, 102, 110, 118, 126], tone: "emergency" as const },
];

export const featuredCrisis = {
  id: "INC-2039",
  title: "Cyclone Alert — Bay of Bengal",
  severity: "Critical" as const,
  populationAtRisk: "1.4 Million",
  predictedLandfall: "14 hours",
  aiConfidence: 92,
  recommendation:
    "Begin evacuation of vulnerable coastal zones across Krishna and Godavari deltas within the next 4 hours.",
  signals: [
    "Wind speeds rising at 18 km/h per hour",
    "Storm surge projected at 3.4 m",
    "Two reservoirs above 95% capacity downstream",
  ],
};

export const incidentTimeline = [
  { t: "12:04 PM", text: "Cyclone warning issued", tag: "Sentinel" },
  { t: "12:18 PM", text: "Prediction confidence increased to 91%", tag: "Forecast" },
  { t: "12:42 PM", text: "Evacuation recommendation generated", tag: "Guardian" },
  { t: "1:05 PM", text: "Medical teams alerted across 18 hospitals", tag: "Medic" },
  { t: "1:22 PM", text: "Resource deployment approved by Operations Lead", tag: "Atlas" },
  { t: "1:48 PM", text: "Beacon broadcast scheduled — coastal sectors A1–A4", tag: "Beacon" },
];

export const liveFeed = [
  { t: "2 min ago", agent: "Sentinel Agent", icon: "satellite", action: "Detected rapid cyclone intensification near 16.5°N", severity: "Critical" as const },
  { t: "6 min ago", agent: "Medic Agent", icon: "medical", action: "Reserved 240 ICU beds across 18 partner hospitals", severity: "High" as const },
  { t: "11 min ago", agent: "Atlas Agent", icon: "package", action: "Rerouted drinking water reserves to Chennai Sector 7", severity: "High" as const },
  { t: "18 min ago", agent: "Guardian Agent", icon: "alert", action: "Dispatched 4 ambulances to Triana relief camp", severity: "Moderate" as const },
  { t: "26 min ago", agent: "Forecast Agent", icon: "weather", action: "Updated cyclone landfall ETA to 14:20 IST", severity: "Moderate" as const },
  { t: "34 min ago", agent: "Beacon Agent", icon: "radio", action: "Verified public alert sent to 412,000 subscribers", severity: "Low" as const },
];

export const hospitalsGeo: { name: string; latlng: [number, number] }[] = [
  { name: "Apollo Greams Road", latlng: [13.0617, 80.2469] },
  { name: "King George Memorial", latlng: [17.7156, 83.3045] },
  { name: "Mercy General", latlng: [38.5577, -121.4561] },
  { name: "Hospital Virgen del Rocío", latlng: [37.3601, -5.9819] },
];

export const sheltersGeo: { name: string; latlng: [number, number] }[] = [
  { name: "Velachery Relief Camp", latlng: [12.9784, 80.2207] },
  { name: "Machilipatnam Shelter", latlng: [16.1875, 81.1389] },
  { name: "Sacramento Aid Center", latlng: [38.5816, -121.49] },
  { name: "Triana Cooling Center", latlng: [37.3819, -6.0042] },
];

export const teamsGeo: { id: string; name: string; latlng: [number, number] }[] = [
  { id: "RT-014", name: "Alpha Response", latlng: [13.0524, 80.25] },
  { id: "RT-009", name: "Coastal Rescue 2", latlng: [16.3, 81.65] },
  { id: "RT-007", name: "Fire & Rescue 3", latlng: [38.65, -121.4] },
  { id: "RT-018", name: "Medical Convoy 1", latlng: [37.39, -5.99] },
];

export const riskTrend = [
  { t: "00:00", risk: 32, impact: 18 },
  { t: "03:00", risk: 38, impact: 22 },
  { t: "06:00", risk: 41, impact: 29 },
  { t: "09:00", risk: 55, impact: 36 },
  { t: "12:00", risk: 64, impact: 44 },
  { t: "15:00", risk: 72, impact: 51 },
  { t: "18:00", risk: 68, impact: 49 },
  { t: "21:00", risk: 74, impact: 58 },
];

export const populationForecast = [
  { day: "Mon", affected: 220, displaced: 80 },
  { day: "Tue", affected: 340, displaced: 120 },
  { day: "Wed", affected: 520, displaced: 210 },
  { day: "Thu", affected: 680, displaced: 280 },
  { day: "Fri", affected: 760, displaced: 340 },
  { day: "Sat", affected: 820, displaced: 360 },
  { day: "Sun", affected: 740, displaced: 310 },
];

export const resourceAllocation = [
  { name: "Food", value: 78 },
  { name: "Water", value: 64 },
  { name: "Medical", value: 52 },
  { name: "Shelter", value: 71 },
];

export const emergencyRequests = [
  { hour: "12a", rescue: 8, medical: 12, supply: 6 },
  { hour: "4a", rescue: 14, medical: 10, supply: 8 },
  { hour: "8a", rescue: 22, medical: 18, supply: 14 },
  { hour: "12p", rescue: 34, medical: 26, supply: 22 },
  { hour: "4p", rescue: 41, medical: 32, supply: 28 },
  { hour: "8p", rescue: 36, medical: 28, supply: 24 },
];

export const agents = [
  { id: "sentinel", name: "Sentinel Agent", role: "Threat Detection", task: "Monitoring satellite and seismic feeds across 14 regions", status: "Operational", confidence: 94, updated: "12 sec ago", health: 99 },
  { id: "medic",    name: "Medic Agent",    role: "Medical Coordination", task: "Reserving 240 ICU beds across 18 partner hospitals", status: "Operational", confidence: 91, updated: "34 sec ago", health: 97 },
  { id: "atlas",    name: "Atlas Agent",    role: "Resource Distribution", task: "Rebalancing drinking water reserves between 3 districts", status: "Degraded", confidence: 76, updated: "1 min ago", health: 82 },
  { id: "guardian", name: "Guardian Agent", role: "Emergency Operations", task: "Routing 6 rescue units to Chennai sectors 4–7", status: "Operational", confidence: 88, updated: "48 sec ago", health: 96 },
  { id: "forecast", name: "Forecast Agent", role: "Weather Intelligence", task: "Modeling cyclone landfall window for Andhra coast", status: "Operational", confidence: 93, updated: "20 sec ago", health: 98 },
  { id: "beacon",   name: "Beacon Agent",   role: "Communications", task: "Verifying public alert delivery to 412k subscribers", status: "Operational", confidence: 90, updated: "1 min ago", health: 95 },
] as const;

export const rescueTeams = [
  { id: "RT-014", name: "Alpha Response", region: "Chennai – North", status: "On-mission", members: 24, eta: "8m" },
  { id: "RT-009", name: "Coastal Rescue 2", region: "Andhra Coast", status: "Deployed", members: 32, eta: "—" },
  { id: "RT-021", name: "Mountain Unit 5", region: "Uttarakhand", status: "Standby", members: 18, eta: "Ready" },
  { id: "RT-007", name: "Fire & Rescue 3", region: "N. California", status: "On-mission", members: 28, eta: "14m" },
  { id: "RT-018", name: "Medical Convoy 1", region: "Seville", status: "Deployed", members: 16, eta: "—" },
];

export const hospitals = [
  { name: "Apollo Greams Road", city: "Chennai", beds: 412, available: 96, icu: 18, ambulances: 12 },
  { name: "King George Memorial", city: "Vizag", beds: 680, available: 142, icu: 26, ambulances: 18 },
  { name: "Mercy General", city: "Sacramento", beds: 540, available: 88, icu: 14, ambulances: 9 },
  { name: "Hospital Virgen del Rocío", city: "Seville", beds: 1320, available: 310, icu: 42, ambulances: 22 },
];

export const resources = [
  { name: "Food Rations", stock: 68, capacity: 100, unit: "k meals" },
  { name: "Drinking Water", stock: 54, capacity: 100, unit: "k L" },
  { name: "Medical Kits", stock: 41, capacity: 100, unit: "units" },
  { name: "Shelter Capacity", stock: 72, capacity: 100, unit: "% used" },
];

export const activity = [
  { t: "Now", text: "Prediction Agent updated cyclone landfall ETA to 14:20 IST." },
  { t: "2m", text: "Rescue team RT-014 reached evacuation point in Chennai." },
  { t: "6m", text: "Apollo Greams Road reserved 60 additional ICU beds." },
  { t: "11m", text: "Resource Agent flagged drinking water shortfall in Sector 7." },
  { t: "18m", text: "Operations Agent dispatched 4 ambulances to relief camp." },
  { t: "26m", text: "Heatwave alert escalated to High in Seville metropolitan area." },
];
