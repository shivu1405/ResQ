import { useEffect, useState } from "react";
import { incidents, hospitalsGeo, sheltersGeo, teamsGeo } from "@/lib/resq-data";
import "leaflet/dist/leaflet.css";

type Marker = {
  latlng: [number, number];
  kind: "incident" | "hospital" | "shelter" | "team";
  label: string;
  sub?: string;
  risk?: string;
};

function buildMarkers(): Marker[] {
  return [
    ...incidents.map<Marker>((i) => ({
      latlng: i.latlng,
      kind: "incident",
      label: `${i.type} · ${i.location}`,
      sub: `${i.region} · ${i.risk}`,
      risk: i.risk,
    })),
    ...hospitalsGeo.map<Marker>((h) => ({ latlng: h.latlng, kind: "hospital", label: h.name, sub: "Hospital" })),
    ...sheltersGeo.map<Marker>((s) => ({ latlng: s.latlng, kind: "shelter", label: s.name, sub: "Shelter" })),
    ...teamsGeo.map<Marker>((t) => ({ latlng: t.latlng, kind: "team", label: t.name, sub: `Team ${t.id}` })),
  ];
}

const kindStyle: Record<Marker["kind"], { bg: string; ring: string; glyph: string }> = {
  incident: { bg: "#DC2626", ring: "rgba(220,38,38,0.25)", glyph: "!" },
  hospital: { bg: "#111111", ring: "rgba(17,17,17,0.18)", glyph: "+" },
  shelter:  { bg: "#525252", ring: "rgba(82,82,82,0.18)", glyph: "■" },
  team:     { bg: "#0A0A0A", ring: "rgba(10,10,10,0.18)", glyph: "▲" },
};

export function LeafletMap({ height = 420 }: { height?: number }) {
  const [mounted, setMounted] = useState(false);
  const [mods, setMods] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([rl, L]) => {
      if (cancelled) return;
      setMods({ rl, L: L.default ?? L });
      setMounted(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!mounted || !mods) {
    return (
      <div
        className="w-full rounded-lg border border-border bg-surface-2 grid place-items-center text-xs text-muted-foreground"
        style={{ height }}
      >
        Loading map…
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, ZoomControl } = mods.rl;
  const L = mods.L;
  const markers = buildMarkers();

  const makeIcon = (m: Marker) => {
    const s = kindStyle[m.kind];
    const pulse =
      m.kind === "incident" && m.risk === "Critical"
        ? `<span style="position:absolute;inset:-6px;border-radius:9999px;border:2px solid ${s.bg};opacity:.55;animation:resq-pulse 2s ease-out infinite;"></span>`
        : "";
    const html = `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:${s.bg};color:#fff;box-shadow:0 0 0 4px ${s.ring},0 1px 2px rgba(0,0,0,.25);font:600 11px/1 ui-sans-serif,system-ui;">
        ${pulse}<span style="position:relative">${s.glyph}</span>
      </div>`;
    return L.divIcon({ html, className: "resq-pin", iconSize: [22, 22], iconAnchor: [11, 11] });
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border" style={{ height }}>
      <MapContainer
        center={[20, 30] as [number, number]}
        zoom={2}
        minZoom={2}
        worldCopyJump
        zoomControl={false}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", background: "var(--surface-2)" }}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={m.latlng} icon={makeIcon(m)}>
            <Popup>
              <div style={{ fontFamily: "Inter, system-ui", minWidth: 160 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{m.label}</div>
                {m.sub && <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{m.sub}</div>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
